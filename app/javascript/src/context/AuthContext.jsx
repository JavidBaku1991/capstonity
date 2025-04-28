import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    try {
      console.log('AUTH - Checking authentication status...')
      const response = await fetch('/users/current', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content
        }
      })
      console.log('AUTH - Auth check response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('AUTH - Auth check response data:', data)
        if (data.user) {
          console.log('AUTH - Setting user data from current:', data.user)
          const userData = {
            email: data.user.email,
            name: data.user.name
          }
          setUser(userData)
          console.log('AUTH - User state updated:', userData)
        } else {
          console.log('AUTH - No valid user data found in response')
          setUser(null)
        }
      } else {
        console.log('AUTH - No active session found')
        setUser(null)
      }
    } catch (error) {
      console.error('AUTH - Auth check failed:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Check auth immediately
    checkAuth()

    // Set up visibility change listener to check auth when page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('AUTH - Page became visible, checking auth status')
        checkAuth()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [checkAuth])

  const login = useCallback(async (userData) => {
    console.log('AUTH - Login function received:', userData)
    try {
      // Ensure userData is properly structured
      const userToSet = {
        email: userData.email,
        name: userData.name
      }
      console.log('AUTH - Setting user to:', userToSet)
      setUser(userToSet)
      console.log('AUTH - User state updated after login:', userToSet)
    } catch (error) {
      console.error('AUTH - Error during login:', error)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      console.log('AUTH - Attempting logout...')
      const response = await fetch('/users/sign_out', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content
        }
      })
      console.log('AUTH - Logout response status:', response.status)
      setUser(null)
      console.log('AUTH - User state cleared after logout')
    } catch (error) {
      console.error('AUTH - Logout failed:', error)
    }
  }, [])

  // Add effect to log user state changes
  useEffect(() => {
    console.log('AUTH - User state changed:', user)
  }, [user])

  const value = {
    user,
    loading,
    login,
    logout
  }

  console.log('AUTH - Current context value:', {
    user: value.user,
    loading: value.loading,
    hasLogin: !!value.login,
    hasLogout: !!value.logout
  })

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 