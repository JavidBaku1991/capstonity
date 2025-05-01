import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        console.log('Checking authentication status...')
        const response = await fetch('/users/current', {
          credentials: 'include'
        })
        console.log('Auth check response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Auth check response data:', data)
          if (data.user) {
            setUser(data.user)
          }
        } else {
          console.log('No active session found')
          setUser(null)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = (userData) => {
    console.log('Setting user data:', userData)
    setUser(userData)
  }

  const logout = async () => {
    try {
      console.log('Attempting logout...')
      const response = await fetch('/users/sign_out', {
        method: 'DELETE',
        credentials: 'include'
      })
      if (response.ok) {
        setUser(null)
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const value = {
    user,
    loading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
} 