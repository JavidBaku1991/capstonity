Rails.application.config.after_initialize do
  ActionView::Base.send(:include, StripeJsHelper)
end

module StripeJsHelper
  def stripe_js_tag
    javascript_tag do
      "window.stripePublishableKey = '#{Rails.configuration.stripe[:publishable_key]}';".html_safe
    end
  end
end 