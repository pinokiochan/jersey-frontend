"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem("user")
        const token = localStorage.getItem("authToken")

        if (savedUser && token) {
          const parsedUser = JSON.parse(savedUser)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("authToken")
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser = {
        id: Date.now(),
        email,
        name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
        avatar: `https://ui-avatars.com/api/?name=${email.split("@")[0]}&background=dc2626&color=fff`,
        joinDate: new Date().toISOString(),
        preferences: {
          notifications: true,
          newsletter: true,
          sms: false,
        },
        orders: [
          {
            id: "ORD-001",
            date: "2024-01-15",
            status: "Доставлен",
            total: 25000,
            items: [{ name: "Manchester United Retro", size: "L", quantity: 1, price: 25000 }],
          },
          {
            id: "ORD-002",
            date: "2024-01-10",
            status: "В пути",
            total: 45000,
            items: [
              { name: "Arsenal Vintage", size: "M", quantity: 1, price: 22000 },
              { name: "Liverpool Classic", size: "L", quantity: 1, price: 23000 },
            ],
          },
        ],
      }

      const token = "mock-jwt-token-" + Date.now()

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      localStorage.setItem("authToken", token)

      return { success: true, user: mockUser }
    } catch (error) {
      const errorMessage = "Неверный email или пароль"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser = {
        id: Date.now(),
        email: userData.email,
        name: userData.name,
        avatar: `https://ui-avatars.com/api/?name=${userData.name}&background=dc2626&color=fff`,
        joinDate: new Date().toISOString(),
        preferences: {
          notifications: true,
          newsletter: true,
          sms: false,
        },
        orders: [],
      }

      const token = "mock-jwt-token-" + Date.now()

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      localStorage.setItem("authToken", token)

      return { success: true, user: mockUser }
    } catch (error) {
      const errorMessage = "Ошибка при регистрации"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setError(null)
    localStorage.removeItem("user")
    localStorage.removeItem("authToken")
    localStorage.removeItem("cart")
  }

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  const clearError = () => setError(null)

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    error,
    clearError,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
