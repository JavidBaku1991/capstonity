import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Welcome to Artisani
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-xl text-blue-100">
              Discover amazing products at great prices. Shop with confidence and enjoy a seamless shopping experience.
            </p>
            <div className="mt-10">
              <Link
                to="/products"
                className="inline-block bg-white py-3 px-8 border border-transparent rounded-md text-base font-medium text-blue-600 hover:bg-blue-50"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {/* Product Card 1 */}
          <div className="group">
            <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
              <img
                src="/images/1.png"
                alt="Product 1"
                className="w-full h-full object-center object-cover group-hover:opacity-75"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300?text=Product+1"
                }}
              />
            </div>
            <h3 className="mt-4 text-sm text-gray-700">Premium Leather Wallet</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">$99.99</p>
            <p className="mt-2 text-sm text-gray-500">Handcrafted from genuine leather, this wallet combines style and durability. Perfect for everyday use.</p>
          </div>

          {/* Product Card 2 */}
          <div className="group">
            <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
              <img
                src="/images/1.png"
                alt="Product 2"
                className="w-full h-full object-center object-cover group-hover:opacity-75"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300?text=Product+2"
                }}
              />
            </div>
            <h3 className="mt-4 text-sm text-gray-700">Artisan Ceramic Mug</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">$149.99</p>
            <p className="mt-2 text-sm text-gray-500">Beautifully crafted ceramic mug with unique hand-painted designs. Microwave and dishwasher safe.</p>
          </div>

          {/* Product Card 3 */}
          <div className="group">
            <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
              <img
                src="/images/1.png"
                alt="Product 3"
                className="w-full h-full object-center object-cover group-hover:opacity-75"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300?text=Product+3"
                }}
              />
            </div>
            <h3 className="mt-4 text-sm text-gray-700">Handwoven Scarf</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">$199.99</p>
            <p className="mt-2 text-sm text-gray-500">Luxurious handwoven scarf made from premium materials. Perfect for adding elegance to any outfit.</p>
          </div>

          {/* Product Card 4 */}
          <div className="group">
            <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
              <img
                src="/images/1.png"
                alt="Product 4"
                className="w-full h-full object-center object-cover group-hover:opacity-75"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300?text=Product+4"
                }}
              />
            </div>
            <h3 className="mt-4 text-sm text-gray-700">Wooden Jewelry Box</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">$249.99</p>
            <p className="mt-2 text-sm text-gray-500">Exquisite hand-carved wooden jewelry box with multiple compartments. A perfect gift for jewelry lovers.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 