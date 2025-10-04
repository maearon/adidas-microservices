class Api::Admin::ProductsController < ActionController::API
  before_action :set_product, only: [:update, :reorder_images]

  # POST /api/admin/products
  def create
    @product = Product.new(product_params.except(:image, :hover_image))
    attach_product_images(@product, params[:product])

    if @product.save
      attach_variant_nested_images(@product, params[:product][:variants_attributes])
      render 'api/admin/products/show', status: :created
    else
      render_error(@product, 'Failed to create product')
    end
  end

  # PATCH/PUT /api/admin/products/:id
  def update
    @product.assign_attributes(product_params.except(:image, :hover_image))
    attach_product_images(@product, params[:product])

    if @product.save
      attach_variant_nested_images(@product, params[:product][:variants_attributes])
      render 'api/admin/products/show'
    else
      render_error(@product, 'Failed to update product')
    end
  end

  # PATCH /api/admin/products/:id/reorder_images
  def reorder_images
    variant_id = params[:variant_id]
    image_order = params[:image_order] # Array of image IDs in new order
    
    if variant_id.present? && image_order.present?
      variant = @product.variants.find_by(id: variant_id)
      if variant
        reorder_variant_images(variant, image_order)
        render json: { success: true, message: 'Images reordered successfully' }
      else
        render json: { success: false, message: 'Variant not found' }, status: :not_found
      end
    else
      render json: { success: false, message: 'Missing variant_id or image_order' }, status: :bad_request
    end
  end

  private

  # 🧩 Tìm product theo variant_code (FE gửi ID là variant_code)
  def set_product
    @variant = Variant.find_by!(variant_code: params[:id])
    @product = @variant.product
  rescue ActiveRecord::RecordNotFound
    render json: { success: false, message: 'Product not found' }, status: :not_found
  end

  # 💡 Strong params khớp seed FE
  def product_params
    params.require(:product).permit(
      :name,
      :description_h5,
      :description_p,
      :care,
      :specifications,
      :brand,
      :sport,
      :gender,
      :product_type,
      :franchise,
      :status,
      :image,
      :hover_image,
      variants_attributes: [
        :id,
        :variant_code,
        :color,
        :price,
        :compare_at_price,
        :stock,
        :avatar,
        :hover,
        images: [],
        variant_sizes_attributes: [
          :id,
          :size_id,
          :stock
        ]
      ]
    )
  end

  # 📷 Gắn ảnh chính product
  def attach_product_images(product, payload)
    return unless payload

    image = payload["image"] || payload[:image]
    hover_image  = payload["hover_image"] || payload[:hover_image]
    if image.present?
      product.image.purge if product.image.attached?
      product.image.attach(image)
    end

    if hover_image.present?
      product.hover_image.purge if product.hover_image.attached?
      product.hover_image.attach(hover_image)
    end
  end

  # 📦 Gắn ảnh cho từng variant con (fix lỗi symbol vs integer)
  def attach_variant_nested_images(product, variants_attrs)
    return unless variants_attrs.present?

    # ⚠ FE gửi dạng hash {"0" => {...}, "1" => {...}}
    variants_attrs.values.each do |variant_attrs|
      variant_id = variant_attrs["id"] || variant_attrs[:id]
      next unless variant_id.present?

      variant = product.variants.find_by(id: variant_id)
      next unless variant

      attach_single_variant_images(variant, variant_attrs)
    end
  end

  # 🧠 Gắn avatar, hover, và images[] cho từng variant
  def attach_single_variant_images(variant, attrs)
    avatar = attrs["avatar"] || attrs[:avatar]
    hover  = attrs["hover"] || attrs[:hover]
    images = attrs["images"] || attrs[:images]

    if avatar.present?
      variant.avatar.purge if variant.avatar.attached?
      variant.avatar.attach(avatar)
    end

    if hover.present?
      variant.hover.purge if variant.hover.attached?
      variant.hover.attach(hover)
    end

    if images.present?
      # images là hash {"0" => file1, "1" => file2, ...}
      variant.images.purge if variant.images.attached?
      images.values.each do |img|
        variant.images.attach(img)
      end
    end
  end

  # 🔄 Sắp xếp lại thứ tự ảnh của variant
  def reorder_variant_images(variant, image_order)
    return unless image_order.is_a?(Array) && image_order.any?
    
    # Lấy tất cả ảnh hiện tại của variant
    current_images = variant.images.attached? ? variant.images.to_a : []
    return if current_images.empty?
    
    # Tạo mapping từ image_order đến image thực tế
    reordered_images = []
    
    image_order.each do |image_id|
      # Tìm ảnh theo ID hoặc position
      image = current_images.find { |img| img.id.to_s == image_id.to_s }
      if image
        reordered_images << image
      else
        # Fallback: sử dụng index nếu không tìm thấy ID
        index = image_id.to_i
        reordered_images << current_images[index] if current_images[index]
      end
    end
    
    # Chỉ reorder nếu có ảnh và số lượng khớp
    if reordered_images.any? && reordered_images.length == current_images.length
      # Lưu blob data trước khi purge
      image_blobs = reordered_images.map(&:blob)
      
      # Detach tất cả ảnh cũ
      variant.images.purge if variant.images.attached?
      
      # Attach lại theo thứ tự mới
      image_blobs.each do |blob|
        variant.images.attach(blob)
      end
      
      Rails.logger.info "Reordered #{reordered_images.length} images for variant #{variant.id}"
    else
      Rails.logger.warn "Failed to reorder images: expected #{current_images.length}, got #{reordered_images.length}"
    end
  end

  # ⚠️ Render lỗi chuẩn REST
  def render_error(resource, message)
    render json: {
      success: false,
      message: message,
      errors: resource.errors.full_messages
    }, status: :unprocessable_entity
  end
end
