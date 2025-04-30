import React, { useEffect, memo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Layout = memo(({ children }) => {
  console.log('LAYOUT - Component rendering')
  const { user, loading, logout } = useAuth()
  
  useEffect(() => {
    console.log('LAYOUT - useEffect triggered')
    console.log('LAYOUT - Current user:', user)
    console.log('LAYOUT - Current loading state:', loading)
  }, [user, loading])
  
  const renderAuthButtons = () => {
    console.log('LAYOUT - Rendering auth buttons')
    console.log('LAYOUT - Current user in renderAuthButtons:', user)
    console.log('LAYOUT - Current loading state in renderAuthButtons:', loading)
    
    if (loading) {
      console.log('LAYOUT - Still loading, showing nothing')
      return null
    }
    
    if (user) {
      console.log('LAYOUT - User is logged in, showing user controls')
      return (
        <>
          <Link
            to="/products/new"
            className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
          >
            Add Product
          </Link>
          <span className="text-gray-700">Welcome, {user.name || user.email}</span>
          <button
            onClick={logout}
            className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
          >
            Logout
          </button>
        </>
      )
    }
    
    console.log('LAYOUT - No user, showing login/signup buttons')
    return (
      <>
        <Link
          to="/login"
          className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
        >
          Sign Up
        </Link>
      </>
    )
  }
  
  console.log('LAYOUT - About to render main component')
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-blue-600">
                  Artisani
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Products
                </Link>
                <Link
                  to="/cart"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Cart
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {renderAuthButtons()}
              {user && (
                <Link
                  to="/profile"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {!loading && children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-white text-sm font-semibold tracking-wider uppercase">About</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/about" className="text-base text-gray-300 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-base text-gray-300 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-sm font-semibold tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/faq" className="text-base text-gray-300 hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/shipping" className="text-base text-gray-300 hover:text-white">
                    Shipping
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-sm font-semibold tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/privacy" className="text-base text-gray-300 hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-base text-gray-300 hover:text-white">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-sm font-semibold tracking-wider uppercase">Social</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; 2024 Artisani. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
})

Layout.displayName = 'Layout'

export default Layout 