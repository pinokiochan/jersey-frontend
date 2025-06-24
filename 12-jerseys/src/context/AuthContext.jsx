"use client"

import { createContext, useContext, useState, useEffect } from "react"
import dataService from "../services/dataService"

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

  // Helper function to save user data
  const saveUserData = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("authToken", `mock-jwt-token-${Date.now()}`)
  }

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user")
      const token = localStorage.getItem("authToken")
      if (savedUser && token) {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        // Update last login time
        if (userData.id) {
          dataService.updateUserLogin(userData.id)
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error)
      localStorage.removeItem("user")
      localStorage.removeItem("authToken")
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user exists in dataService
      const users = dataService.getUsers()
      let existingUser = users.find((u) => u.email === email)

      if (!existingUser) {
        // Create new user if doesn't exist
        const name = email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1)
        existingUser = dataService.registerUser({
          name,
          email,
          phone: "",
          isAdmin: email.includes("admin"),
        })
      } else {
        // Update last login
        dataService.updateUserLogin(existingUser.id)
        // Refresh user data
        existingUser = dataService.getUser(existingUser.id)
      }

      saveUserData(existingUser)
      return { success: true, user: existingUser }
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

      // Register user through dataService
      const newUser = dataService.registerUser({
        ...userData,
        isAdmin: userData.email.includes("admin"),
      })

      saveUserData(newUser)
      return { success: true, user: newUser }
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

  const updateUser = (updates) => {
    if (!user) return

    // Update in dataService
    const updatedUser = dataService.updateUser(user.id, updates)
    if (updatedUser) {
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const addOrder = (orderData) => {
    if (!user) return null

    // Add order through dataService
    const newOrder = dataService.addOrderFromCheckout(
      {
        ...orderData,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone,
        customerInfo: {
          firstName: user.firstName || user.name.split(" ")[0],
          lastName: user.lastName || user.name.split(" ")[1] || "",
          email: user.email,
          phone: user.phone,
        },
      },
      user.id,
    )

    // Update user data with new order - refresh from dataService
    const updatedUser = dataService.getUser(user.id)
    if (updatedUser) {
      // Add the new order to user's orders array
      const userOrders = dataService.getOrders().filter((order) => order.userId === user.id)
      updatedUser.orders = userOrders

      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }

    return newOrder
  }

  const updateOrderStatus = (orderId, newStatus) => {
    dataService.updateOrder(orderId, { status: newStatus })

    // Refresh user data to get updated orders
    if (user) {
      const updatedUser = dataService.getUser(user.id)
      if (updatedUser) {
        const userOrders = dataService.getOrders().filter((order) => order.userId === user.id)
        updatedUser.orders = userOrders

        setUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }
    }
  }

  const deleteAddress = (addressId) => {
    if (!user?.addresses) return

    const updatedAddresses = user.addresses.filter((addr) => addr.id !== addressId)
    updateUser({ addresses: updatedAddresses })
  }

  // Get user orders from dataService
  const getUserOrders = () => {
    if (!user) return []
    return dataService.getOrders().filter((order) => order.userId === user.id)
  }

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    addOrder,
    updateOrderStatus,
    deleteAddress,
    getUserOrders,
    loading,
    error,
    clearError: () => setError(null),
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
