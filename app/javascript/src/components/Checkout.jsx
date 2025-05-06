import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Initialize Stripe with the key from Rails
const getStripePromise = () => {
  const key = window.stripePublishableKey;
  console.log('Initializing Stripe with key:', key ? 'present' : 'missing');
  
  if (!key) {
    console.error('Stripe publishable key is missing! Please check your environment variables.');
    return null;
  }
  
  try {
    return loadStripe(key);
  } catch (error) {
    console.error('Error initializing Stripe:', error);
    return null;
  }
};

// Wait for the key to be available
const stripePromise = new Promise((resolve) => {
  if (window.stripePublishableKey) {
    resolve(getStripePromise());
  } else {
    const checkKey = setInterval(() => {
      if (window.stripePublishableKey) {
        clearInterval(checkKey);
        resolve(getStripePromise());
      }
    }, 100);
  }
});

const CheckoutForm = ({ cart, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: ''
  });

  const safeCredentials = (options = {}) => {
    return {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      }
    };
  };

  const handleErrors = (response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  };

  const initiateStripeCheckout = async (booking_id) => {
    try {
      const response = await fetch(
        `/api/charges?booking_id=${booking_id}&cancel_url=${window.location.pathname}`,
        safeCredentials({
          method: 'POST',
        })
      );
      
      const data = await handleErrors(response);
      const stripe = await loadStripe(window.stripePublishableKey);
      
      const result = await stripe.redirectToCheckout({
        sessionId: data.charge.checkout_session_id,
      });

      if (result.error) {
        setError(result.error.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while processing your payment.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      // Ensure amount is a valid integer in cents
      const amount = Math.round(cart.total_price * 100);
      console.log('Creating payment intent with amount:', amount);

      // First create a payment intent
      const paymentIntentResponse = await fetch('/api/v1/create_payment_intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'usd'
        })
      });

      const responseData = await paymentIntentResponse.json();
      
      if (!paymentIntentResponse.ok) {
        throw new Error(responseData.error || 'Failed to create payment intent');
      }

      console.log('Payment intent created:', responseData);

      // Create a booking or order ID
      const bookingResponse = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: amount,
          currency: 'usd',
          customer_info: formData,
          line_items: cart.line_items,
          payment_intent_id: responseData.clientSecret
        }),
      });

      if (!bookingResponse.ok) {
        const bookingError = await bookingResponse.json();
        throw new Error(bookingError.error || 'Failed to create booking');
      }

      const bookingData = await bookingResponse.json();
      console.log('Booking created:', bookingData);
      
      // Use the existing initiateStripeCheckout method
      await initiateStripeCheckout(bookingData.id);

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'An error occurred while processing your payment.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            required
            value={formData.address}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              required
              value={formData.city}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              id="state"
              name="state"
              required
              value={formData.state}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
              ZIP Code
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              required
              value={formData.zipCode}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <select
              id="country"
              name="country"
              required
              value={formData.country}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
        <div className="p-4 border border-gray-300 rounded-md bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                  ':-webkit-autofill': {
                    color: '#424770',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
              hidePostalCode: true, // Since we're collecting it separately
              disabled: false,
            }}
            className="w-full"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          We accept Visa, Mastercard, American Express, and Discover
        </p>
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-3 px-4 rounded-md text-white font-medium ${
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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <div className="border-t border-gray-200 pt-4">
              {cart.line_items.map((item) => (
                <div key={item.id} className="flex items-center py-4">
                  <div className="flex-shrink-0 w-16 h-16">
                    <img
                      src={item.product.image_url || "/images/1.png"}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{item.product.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="text-base font-medium text-gray-900">Subtotal</span>
                  <span className="text-base font-medium text-gray-900">
                    ${cart.total_price}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500">Shipping</span>
                  <span className="text-sm text-gray-500">Calculated at next step</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500">Tax</span>
                  <span className="text-sm text-gray-500">Calculated at next step</span>
                </div>
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
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>
            <Elements stripe={stripePromise}>
              <CheckoutForm cart={cart} onSuccess={() => setSuccess(true)} />
            </Elements>
            <div className="mt-6 text-sm text-gray-500">
              <p className="mb-2">We accept the following payment methods:</p>
              <div className="flex space-x-2">
                <img src="/images/visa.png" alt="Visa" className="h-8" />
                <img src="/images/mastercard.png" alt="Mastercard" className="h-8" />
                <img src="/images/amex.png" alt="American Express" className="h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 