class DeviseController < ApplicationController
  include Devise::Controllers::Helpers
  include Devise::Controllers::ScopedViews

  def self.inherited(base)
    super
    base.helper_method :resource, :resource_name, :resource_class, :devise_mapping
  end

  protected

  def resource_class
    User
  end

  def resource_name
    :user
  end

  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end

  # Add any shared Devise controller functionality here
end 