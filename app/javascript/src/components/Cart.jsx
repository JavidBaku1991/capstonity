import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Cart = () => {
  const [cart, setCart] = useState({ line_items: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('Cart component mounted, fetching cart data...');
    fetch('/api/v1/carts/current', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('Cart response status:', response.status);
        console.log('Cart response headers:', response.headers);
        return response.json();
      })
      .then(data => {
        console.log('Cart data received:', data);
        if (data && data.line_items) {
          setCart(data);
        } else {
          console.error('Invalid cart data received:', data);
          setCart({ line_items: [] });
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching cart:', error);
        setLoading(false);
      });
  }, []);

  const handleRemoveItem = (lineItemId) => {
    console.log('Removing item:', lineItemId);
    fetch(`/api/v1/cart_items/${lineItemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
      .then(response => {
        console.log('Remove item response status:', response.status);
        if (response.ok) {
          setCart(prevCart => ({
            ...prevCart,
            line_items: prevCart.line_items.filter(item => item.id !== lineItemId)
          }))
        }
      })
      .catch(error => console.error('Error removing item:', error))
  }

  const handleUpdateQuantity = (lineItemId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity from going below 1

    fetch(`/api/v1/cart_items/${lineItemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ cart_item: { quantity: newQuantity } })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Failed to update quantity');
      })
      .then(updatedItem => {
        setCart(prevCart => ({
          ...prevCart,
          line_items: prevCart.line_items.map(item =>
            item.id === lineItemId ? { ...item, quantity: newQuantity } : item
          )
        }));
      })
      .catch(error => console.error('Error updating quantity:', error));
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  console.log('Rendering cart with data:', cart);

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Shopping Cart</h1>
      
      {cart.line_items.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">Your cart is empty</h2>
          <p className="mt-4 text-gray-500">Looks like you haven't added any items to your cart yet.</p>
          <Link
            to="/products"
            className="mt-6 inline-block bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          <div className="flow-root">
            <ul className="-my-6 divide-y divide-gray-200">
              {cart.line_items.map((item) => (
                <li key={item.id} className="py-6 flex">
                  <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                    <img
                      src={item.product.image_url || "/images/1.png"}
                      alt={item.product.name}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>

                  <div className="ml-4 flex-1 flex flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.product.name}</h3>
                        <p className="ml-4">${item.product.price}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{item.product.description}</p>
                    </div>
                    <div className="flex-1 flex items-end justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-md border border-gray-300 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="text-gray-500">Qty {item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-md border border-gray-300 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="font-medium text-red-600 hover:text-red-500"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>${cart.total_price}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
            <div className="mt-6">
              <Link
                to="/checkout"
                className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Checkout
              </Link>
            </div>
            <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
              <p>
                or{' '}
                <Link to="/products" className="text-blue-600 font-medium hover:text-blue-500">
                  Continue Shopping<span aria-hidden="true"> &rarr;</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart 