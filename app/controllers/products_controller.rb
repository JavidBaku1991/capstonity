class ProductsController < ApplicationController
  def index
    @products = Product.all.map do |product|
      product.as_json.merge(
        image_url: product.image.attached? ? url_for(product.image) : nil
      )
    end
    render json: @products
  end

  def show
    @product = Product.find(params[:id])
    render json: @product.as_json.merge(
      image_url: @product.image.attached? ? url_for(@product.image) : nil
    )
  end

  def create
    @product = Product.new(product_params)
    
    if @product.save
      render json: @product.as_json.merge(
        image_url: @product.image.attached? ? url_for(@product.image) : nil
      ), status: :created
    else
      render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def product_params
    params.require(:product).permit(:name, :description, :price, :stock, :image)
  end
end
