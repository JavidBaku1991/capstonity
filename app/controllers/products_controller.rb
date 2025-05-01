class ProductsController < ApplicationController
  before_action :authenticate_user!, only: [:create]

  def index
    @products = Product.includes(:user).all.map do |product|
      product.as_json.merge(
        image_url: product.image.attached? ? url_for(product.image) : nil,
        user_name: product.user.name
      )
    end
    render json: @products
  end

  def show
    @product = Product.includes(:user).find(params[:id])
    render json: @product.as_json.merge(
      image_url: @product.image.attached? ? url_for(@product.image) : nil,
      user_name: @product.user.name
    )
  end

  def create
    Rails.logger.info "Creating product for user: #{current_user.id}"
    Rails.logger.info "Product params: #{product_params.inspect}"
    
    @product = current_user.products.new(product_params)
    
    if @product.save
      Rails.logger.info "Product created successfully: #{@product.inspect}"
      render json: @product.as_json.merge(
        image_url: @product.image.attached? ? url_for(@product.image) : nil,
        user_name: current_user.name
      ), status: :created
    else
      Rails.logger.error "Product creation failed: #{@product.errors.full_messages}"
      render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def product_params
    params.require(:product).permit(:name, :description, :price, :stock, :image)
  end
end
