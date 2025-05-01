import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { user } = useAuth()
  const [recentProducts, setRecentProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/products.json')
      .then(response => response.json())
      .then(data => {
        // Sort products by created_at in descending order and take the first 4
        const sortedProducts = data.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        ).slice(0, 4)
        setRecentProducts(sortedProducts)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching recent products:', error)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative min-h-[500px] flex items-center"
        style={{
          backgroundImage: 'url(/images/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-white text-center w-full px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Our Store</h1>
          <p className="text-xl md:text-2xl mb-8">Discover amazing products at great prices</p>
          <Link 
            to="/products" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Recent Products */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Recent Products</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {recentProducts.map((product) => (
              <div key={product.id} className="group">
                <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                  <img
                    src={product.image_url || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="w-full h-full object-center object-cover group-hover:opacity-75"
                  />
                </div>
                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
                <p className="mt-2 text-sm text-gray-500">{product.description}</p>
                <p className="mt-2 text-sm text-gray-600">Posted by: {product.user_name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home 