# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include ActionController::MimeResponds
  include ActionController::ImplicitRender
  include ActionController::Helpers
  include ActionController::Cookies
  include ActionController::RequestForgeryProtection

  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  # allow_browser versions: :modern
  config.load_defaults 6.1

  protect_from_forgery with: :null_session, if: -> { request.format.json? }
  respond_to :json, :html

  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_format

  protected

  def set_format
    request.format = :json if request.format == '*/*'
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:email, :password, :name])
    devise_parameter_sanitizer.permit(:sign_in, keys: [:email, :password])
  end

  def after_sign_in_path_for(resource)
    if request.format.json?
      nil
    else
      super
    end
  end

  def after_sign_out_path_for(resource)
    if request.format.json?
      nil
    else
      super
    end
  end
end
