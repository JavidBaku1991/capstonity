# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :authenticate_user!

  def current
    if current_user
      render json: { 
        user: {
          id: current_user.id,
          email: current_user.email,
          name: current_user.name
        }
      }
    else
      render json: { user: nil }, status: :unauthorized
    end
  end

  def products
    Rails.logger.info "Fetching products for user: #{params[:id]}"
    @user = User.find(params[:id])
    Rails.logger.info "Found user: #{@user.inspect}"
    
    @products = @user.products.map do |product|
      Rails.logger.info "Processing product: #{product.inspect}"
      product.as_json.merge(
        image_url: product.image.attached? ? url_for(product.image) : nil,
        user_name: @user.name
      )
    end
    Rails.logger.info "Returning products: #{@products.inspect}"
    render json: @products
  end
end 