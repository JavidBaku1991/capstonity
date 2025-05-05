import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Initialize Stripe with the key from Rails
const stripePromise = loadStripe(window.stripePublishableKey);

const CheckoutForm = ({ cart, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    try {
      // Create payment intent on the server
      const response = await fetch('/api/v1/create_payment_intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: cart.total_price * 100, // Convert to cents
          currency: 'usd',
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm the payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Clear the cart and redirect to success page
        await fetch('/api/v1/carts/current', {
          method: 'DELETE',
          credentials: 'include',
        });
        onSuccess();
      }
    } catch (err) {
      setError('An error occurred while processing your payment.');
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Card Details
        </label>
        <div className="p-3 border border-gray-300 rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          !stripe || processing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {processing ? 'Processing...' : `Pay $${cart.total_price}`}
      </button>
    </form>
  );
};

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/v1/carts/current', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        setCart(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching cart:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
        <p className="text-gray-600 mb-8">Thank you for your purchase.</p>
        <a
          href="/products"
          className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
        >
          Continue Shopping
        </a>
      </div>
    );
  }

  if (!cart || cart.line_items.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
        <a
          href="/products"
          className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
        >
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>
        
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
          <div className="border-t border-gray-200 pt-4">
            {cart.line_items.map((item) => (
              <div key={item.id} className="flex justify-between py-2">
                <span className="text-gray-600">
                  {item.product.name} x {item.quantity}
                </span>
                <span className="text-gray-900">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between">
                <span className="text-lg font-medium text-gray-900">Total</span>
                <span className="text-lg font-medium text-gray-900">
                  ${cart.total_price}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm cart={cart} onSuccess={() => setSuccess(true)} />
        </Elements>
      </div>
    </div>
  );
};

export default Checkout; 