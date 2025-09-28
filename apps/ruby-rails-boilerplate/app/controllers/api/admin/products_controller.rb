class Api::Admin::ProductsController < ActionController::API
  before_action :set_product, only: [:update]

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
    # update product fields
    @product.assign_attributes(product_params.except(:image, :hover_image))
    attach_product_images(@product, params[:product])

    if @product.save
      attach_variant_nested_images(@product, params[:product][:variants_attributes])
      render 'api/admin/products/show'
    else
      render_error(@product, 'Failed to update product')
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

  # 📷 Helper attach ảnh chính của product
  def attach_product_images(product, payload)
    return unless payload

    if payload[:image].present?
      product.image.attach(payload[:image])
    end

    if payload[:hover_image].present?
      product.hover_image.attach(payload[:hover_image])
    end
  end

  # 📦 Helper gắn ảnh cho các variant con
  def attach_variant_nested_images(product, variants_attrs)
    return unless variants_attrs

    variants_attrs.each do |variant_attrs|
      next unless variant_attrs[:id]

      variant = product.variants.find_by(id: variant_attrs[:id])
      next unless variant

      attach_single_variant_images(variant, variant_attrs)
    end
  end

  # 🧠 Gắn avatar, hover, và images[] cho từng variant
  def attach_single_variant_images(variant, attrs)
    if attrs[:avatar].present?
      variant.avatar.purge if variant.avatar.attached?
      variant.avatar.attach(attrs[:avatar])
    end

    if attrs[:hover].present?
      variant.hover.purge if variant.hover.attached?
      variant.hover.attach(attrs[:hover])
    end

    if attrs[:images].present?
      variant.images.purge if variant.images.attached?
      attrs[:images].each do |img|
        variant.images.attach(img)
      end
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
