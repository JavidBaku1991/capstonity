module Api
  module V1
    class PaymentsController < ApplicationController
      skip_before_action :verify_authenticity_token

      def create_payment_intent
        begin
          # Create a PaymentIntent with the order amount and currency
          payment_intent = Stripe::PaymentIntent.create(
            amount: params[:amount],
            currency: params[:currency],
            automatic_payment_methods: {
              enabled: true,
            },
          )

          render json: {
            clientSecret: payment_intent.client_secret
          }
        rescue Stripe::StripeError => e
          render json: { error: e.message }, status: :unprocessable_entity
        end
      end
    end
  end
end 