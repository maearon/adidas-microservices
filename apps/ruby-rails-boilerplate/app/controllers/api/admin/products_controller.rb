class Api::Admin::ProductsController < ActionController::API
  before_action :set_product, only: [:show, :update, :destroy, :toggle_status, :duplicate]
  
  def index
    @products = Product.includes(:variants, :category, :model, :collaboration).all
    
    # Search
    if params[:q].present?
      search_term = "%#{params[:q]}%"
      @products = @products.where(
        "name ILIKE ? OR brand ILIKE ? OR category ILIKE ? OR model_number ILIKE ?",
        search_term, search_term, search_term, search_term
      )
    end
    
    # Filters
    @products = @products.where(status: params[:status]) if params[:status].present?
    @products = @products.where(category: params[:category]) if params[:category].present?
    @products = @products.where(brand: params[:brand]) if params[:brand].present?
    @products = @products.where(gender: params[:gender]) if params[:gender].present?
    @products = @products.where(sport: params[:sport]) if params[:sport].present?
    
    # Sorting
    case params[:sort]
    when 'name_asc'
      @products = @products.order(:name)
    when 'name_desc'
      @products = @products.order(name: :desc)
    when 'created_desc'
      @products = @products.order(created_at: :desc)
    else
      @products = @products.order(created_at: :desc)
    end
    
    # Pagination
    page = params[:page]&.to_i || 1
    per_page = params[:per_page]&.to_i || 20
    
    @products = @products.page(page).per(per_page)
    
    render 'api/admin/products/index'
  end
  
  def show
    render 'api/admin/products/show'
  end
  
  def create
    @product = Product.new(product_params)
    
    if @product.save
      render 'api/admin/products/show', status: :created
    else
      render json: {
        success: false,
        errors: @product.errors.full_messages,
        message: 'Failed to create product'
      }, status: :unprocessable_entity
    end
  end
  
  def update
    if @product.update(product_params)
      render 'api/admin/products/show'
    else
      render json: {
        success: false,
        errors: @product.errors.full_messages,
        message: 'Failed to update product'
      }, status: :unprocessable_entity
    end
  end
  
  def destroy
    if @product.destroy
      render json: {
        success: true,
        message: 'Product deleted successfully'
      }
    else
      render json: {
        success: false,
        errors: @product.errors.full_messages,
        message: 'Failed to delete product'
      }, status: :unprocessable_entity
    end
  end
  
  def bulk_destroy
    product_ids = params[:ids]
    
    if product_ids.present?
      deleted_count = Product.where(id: product_ids).destroy_all.count
      render json: {
        success: true,
        message: "#{deleted_count} products deleted successfully"
      }
    else
      render json: {
        success: false,
        message: 'No product IDs provided'
      }, status: :bad_request
    end
  end
  
  def toggle_status
    new_status = @product.status == 'active' ? 'inactive' : 'active'
    
    if @product.update(status: new_status)
      render 'api/admin/products/show'
    else
      render json: {
        success: false,
        errors: @product.errors.full_messages
      }, status: :unprocessable_entity
    end
  end
  
  def duplicate
    new_product = @product.dup
    new_product.name = "#{@product.name} (Copy)"
    new_product.model_number = "#{@product.model_number}-copy-#{Time.current.to_i}"
    new_product.slug = "#{@product.slug}-copy-#{Time.current.to_i}"
    new_product.status = 'inactive'
    
    if new_product.save
      # Duplicate variants
      @product.variants.each do |variant|
        new_variant = variant.dup
        new_variant.product = new_product
        new_variant.variant_code = "#{variant.variant_code}-copy" if variant.variant_code.present?
        new_variant.save
        
        # Copy images
        if variant.avatar.attached?
          new_variant.avatar.attach(variant.avatar.blob)
        end
        if variant.hover.attached?
          new_variant.hover.attach(variant.hover.blob)
        end
        if variant.images.attached?
          variant.images.each do |image|
            new_variant.images.attach(image.blob)
          end
        end
      end
      
      @product = new_product
      render 'api/admin/products/show'
    else
      render json: {
        success: false,
        errors: new_product.errors.full_messages
      }, status: :unprocessable_entity
    end
  end
  
  private
  
  def set_product
    variant = Variant.find_by!(variant_code: params[:id])
    @product = variant.product
  rescue ActiveRecord::RecordNotFound
    render json: { success: false, message: 'Product not found' }, status: :not_found
  end

  def set_product
    variant = Variant.find_by!(variant_code: params[:id])
    @product = variant.product
  end

  # ⚡ Strong params: nhận product + variants nested
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
      ]
    )
  end
  
  # def product_params
  #   params.require(:product).permit(
  #     :name, :model_number, :description_h5, :description_p, :brand, :category,
  #     :sport, :gender, :franchise, :product_type, :status, :slug, :activity,
  #     :material, :collection, :care, :specifications, :is_featured, :badge,
  #     :image, :hover_image,
  #     variants_attributes: [
  #       :id, :variant_code, :color, :price, :compare_at_price, :stock, :sku,
  #       :avatar, :hover, :_destroy, 
  #       images: [],
  #       sizes_attributes: [:id, :size_id, :stock, :_destroy]
  #     ]
  #   )
  # end
end
