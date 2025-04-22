import React from 'react'
import ProductCard from '../components/ProductCard'

const Profile = () => {
  // TODO: Fetch user data and products from API
  const user = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user'
  }

  const userProducts = [
    {
      id: 1,
      title: "User's Product 1",
      description: "Description for user's product 1",
      price: 99.99,
      image: "/images/product1.jpg"
    },
    {
      id: 2,
      title: "User's Product 2",
      description: "Description for user's product 2",
      price: 149.99,
      image: "/images/product2.jpg"
    }
  ]

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">ID</h2>
            <p className="text-lg">{user.id}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Name</h2>
            <p className="text-lg">{user.name}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Email</h2>
            <p className="text-lg">{user.email}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Role</h2>
            <p className="text-lg capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">My Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Profile 