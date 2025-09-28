# app/controllers/api/admin/products_controller.rb
class Api::Admin::ProductsController < Api::ApiController
  before_action :set_product, only: [:show, :update, :destroy]

  # GET /api/admin/products/:id
  def show
    product_json = @product.as_json(
      include: {
        variants: {
          include: :sizes,
          methods: [:avatar_url, :hover_url, :images_urls]
        }
      }
    )

    extra_data = {
      image_url: (@product.image.attached? ? url_for(@product.image) : nil),
      hover_image_url: (@product.hover_image.attached? ? url_for(@product.hover_image) : nil)
    }.compact

    render json: product_json.merge(extra_data)
  end

  # POST /api/admin/products
  def create
    @product = Product.new(product_params)

    if @product.save
      render json: { id: @product.id, slug: @product.slug }, status: :created
    else
      render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/admin/products/:id
  # app/controllers/api/admin/products_controller.rb
  def update
    if @product.update(product_params)
      # xử lý attachments cho product
      if params[:product].present?
        if @product.id.present?
          if params[:product][:image].present?
            @product.image.purge
            @product.image.attach(params[:product][:image])
          end
          if params[:product][:hover_image].present?
            @product.hover_image.purge
            @product.hover_image.attach(params[:product][:hover_image])
          end
        end
      end

      # xử lý attachments cho variants
      if params[:product][:variants_attributes].present?
        params[:product][:variants_attributes].each do |_, variant_params|
          if variant_params[:id].present?
            variant = @product.variants.find(variant_params[:id])

            # attach avatar nếu có
            if variant_params[:avatar].present?
              variant.avatar.purge
              variant.avatar.attach(variant_params[:avatar])
            end

            # attach hover nếu có
            if variant_params[:hover].present?
              variant.hover.purge
              variant.hover.attach(variant_params[:hover])
            end

            # attach nhiều images (chống duplicate bằng checksum)
            if variant_params[:images].present?
              variant_params[:images].each do |new_file|
                new_checksum = Digest::MD5.base64digest(new_file.read)
                new_file.rewind

                exists = variant.images.any? { |img| img.blob.checksum == new_checksum }
                variant.images.attach(new_file) unless exists
              end
            end
          end
        end
      end

      render json: { success: true, product: @product }, status: :ok
    else
      render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/admin/products/:id
  def destroy
    @product.destroy
    head :no_content
  end

  private

  def set_product
    variant = Variant.find_by!(variant_code: params[:id])
    @product = variant.product
  end

  # ⚡ Strong params: nhận product + variants nested
  def product_params
    params.require(:product).permit(
      :name, 
      # :slug, 
      :description_h5, 
      :description_p, 
      :care, 
      :specifications,
      :brand, 
      # :category, 
      :sport, 
      :gender, 
      :product_type, 
      # :activity, 
      # :material,
      # :collection, 
      :franchise, 
      :status, 
      # :badge, 
      # :is_featured,
      :image, 
      :hover_image,
      variants_attributes: [
        :id, 
        :variant_code, 
        :color, 
        :price, 
        :compare_at_price, 
        :stock, 
        # :sku,
        :avatar, 
        :hover, 
        # :_destroy,
        images: [],
        # sizes_attributes: [:id, :size_id, :_destroy]
      ]
    )
  end
end
