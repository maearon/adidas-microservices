# app/controllers/api/admin/products_controller.rb
class Api::Admin::ProductsController < ApplicationController
  before_action :set_product, only: [:show, :update, :destroy]

  # GET /api/admin/products/:id
  def show
    render json: @product.as_json(include: {
      variants: {
        include: :sizes,
        methods: [:avatar_url, :hover_url, :images_urls]
      }
    }).merge(
      image_url: url_for(@product.image) if @product.image.attached?,
      hover_image_url: url_for(@product.hover_image) if @product.hover_image.attached?
    )
  end

  # POST /api/admin/products
  def create
    @product = Product.new(product_params)
    binding.b

    if @product.save
      render json: { id: @product.id, slug: @product.slug }, status: :created
    else
      render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/admin/products/:id
  def update
    if @product.update(product_params)
      binding.b
      render json: { message: "Product updated successfully" }, status: :ok
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
    @product = Product.find(variant_code: params[:id])
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
      :category, 
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
