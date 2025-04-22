class CartsController < ApplicationController
  before_action :set_cart, only: [:show, :destroy]

  def show
    @line_items = @cart.line_items.includes(:product)
    render json: {
      id: @cart.id,
      line_items: @line_items.map { |item| 
        {
          id: item.id,
          quantity: item.quantity,
          product: {
            id: item.product.id,
            name: item.product.name,
            description: item.product.description,
            price: item.product.price,
            image_url: item.product.image_url
          }
        }
      },
      total_price: @cart.total_price
    }
  end

  def destroy
    @cart.destroy
    session[:cart_id] = nil
    render json: { message: 'Cart emptied successfully' }
  end

  private

  def set_cart
    @cart = Cart.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    @cart = Cart.create
    session[:cart_id] = @cart.id
  end
end 