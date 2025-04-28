import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const getCsrfToken = () => {
    const token = document.querySelector('meta[name="csrf-token"]')?.content
    console.log('LOGIN - CSRF token from meta:', token)
    return token
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setError('')

    const userData = {
      user: {
        email: email.trim(),
        password: password
      }
    }

    console.log('LOGIN - Sending login request with data:', userData)

    try {
      const csrfToken = getCsrfToken()
      console.log('LOGIN - Using CSRF token:', csrfToken)

      const response = await fetch('/users/sign_in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify(userData)
      })

      console.log('LOGIN - Response status:', response.status)
      const data = await response.json()
      console.log('LOGIN - Full response data:', data)

      if (response.ok) {
        console.log('LOGIN - Login successful, user data:', data.data.attributes)
        
        // Update CSRF token if provided in response
        if (data.csrf_token) {
          const meta = document.querySelector('meta[name="csrf-token"]')
          if (meta) {
            meta.content = data.csrf_token
            console.log('LOGIN - Updated CSRF token in meta tag')
          }
        }
        
        // Ensure we're passing the correct user data structure
        const userDataToSet = {
          email: data.data.attributes.email,
          name: data.data.attributes.name
        }
        console.log('LOGIN - Passing to login function:', userDataToSet)
        login(userDataToSet)
        console.log('LOGIN - Navigation to home page')
        navigate('/')
      } else {
        console.error('LOGIN - Login failed:', data)
        setError(data.error || data.status?.message || 'Login failed')
      }
    } catch (err) {
      console.error('LOGIN - Login error:', err)
      setError('An error occurred during login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleSubmit}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login 