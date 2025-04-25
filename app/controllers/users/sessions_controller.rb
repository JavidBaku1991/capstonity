# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  skip_before_action :require_no_authentication, only: [:new]
  respond_to :json

  def create
    Rails.logger.info "Attempting to authenticate user with email: #{params[:user][:email]}"
    self.resource = warden.authenticate!(auth_options)
    sign_in(resource_name, resource)
    yield resource if block_given?
    
    render json: {
      status: { code: 200, message: 'Logged in successfully.' },
      data: {
        type: 'users',
        id: resource.id,
        attributes: {
          email: resource.email,
          name: resource.name || resource.email.split('@').first
        }
      }
    }
  rescue StandardError => e
    Rails.logger.error "Authentication failed: #{e.message}"
    render json: {
      status: { code: 401, message: 'Invalid Email or password.' },
      error: 'Invalid Email or password.'
    }, status: :unauthorized
  end

  private

  def respond_to_on_destroy
    if current_user
      render json: {
        status: { code: 200, message: 'Logged out successfully.' }
      }
    else
      render json: {
        status: { code: 401, message: "Couldn't find an active session." }
      }, status: :unauthorized
    end
  end

  def auth_options
    { scope: resource_name, recall: "#{controller_path}#new" }
  end

  def require_no_authentication
    return if request.format.json?
    super
  end

  def is_navigational_format?
    request.format.html?
  end
end 