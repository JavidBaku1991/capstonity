# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :authenticate_user!

  def current
    render json: {
      data: {
        type: 'users',
        id: current_user.id,
        attributes: {
          email: current_user.email,
          name: current_user.name
        }
      }
    }
  end
end 