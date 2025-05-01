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
    @user = User.find(params[:id])
    @products = @user.products.map do |product|
      product.as_json.merge(
        image_url: product.image.attached? ? url_for(product.image) : nil
      )
    end
    render json: @products
  end
end 