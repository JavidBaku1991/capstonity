import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const Profile = () => {
  const { user } = useAuth()
  const [userProducts, setUserProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)

  console.log('PROFILE - Component rendering')
  console.log('PROFILE - Current user:', user)

  useEffect(() => {
    console.log('PROFILE - useEffect triggered')
    if (user && user.id) {
      console.log('PROFILE - Fetching products for user:', user.id)
      const url = `/users/${user.id}/products`
      console.log('PROFILE - Fetch URL:', url)
      
      fetch(url)
        .then(response => {
          console.log('PROFILE - Response status:', response.status)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.json()
        })
        .then(data => {
          console.log('PROFILE - Products data:', data)
          setUserProducts(data)
          setLoading(false)
          setError(null)
        })
        .catch(error => {
          console.error('PROFILE - Error fetching user products:', error)
          setError('Failed to load products. Please try again later.')
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [user])

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        setUserProducts(userProducts.filter(product => product.id !== productId))
        setShowDeleteModal(false)
        setProductToDelete(null)
      } else {
        throw new Error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      setError('Failed to delete product. Please try again later.')
    }
  }

  const openDeleteModal = (product) => {
    setProductToDelete(product)
    setShowDeleteModal(true)
  }

  if (!user) {
    console.log('PROFILE - No user, showing login prompt')
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Please log in to view your profile</h2>
          <Link
            to="/login"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    console.log('PROFILE - Loading state')
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  console.log('PROFILE - Rendering profile content')
  console.log('PROFILE - Number of products:', userProducts.length)
  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.name}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">My Products</h3>
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {userProducts.map((product) => {
            console.log('PROFILE - Rendering product:', product)
            return (
              <div key={product.id} className="group relative">
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
                <button
                  onClick={() => openDeleteModal(product)}
                  className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete Product
                </button>
              </div>
            )
          })}
        </div>
        {userProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">You haven't added any products yet.</p>
            <Link
              to="/products/new"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Your First Product
            </Link>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Product</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setProductToDelete(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(productToDelete.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile 