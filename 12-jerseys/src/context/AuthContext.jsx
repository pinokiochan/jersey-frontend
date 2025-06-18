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
        firstName: "",
        lastName: "",
        phone: "",
        avatar: `https://ui-avatars.com/api/?name=${email.split("@")[0]}&background=dc2626&color=fff`,
        joinDate: new Date().toISOString(),
        addresses: [], // Empty addresses array
        preferences: {
          notifications: true,
          newsletter: true,
          sms: false,
        },
        orders: [], // Start with empty orders array
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
        firstName: "",
        lastName: "",
        phone: "",
        avatar: `https://ui-avatars.com/api/?name=${userData.name}&background=dc2626&color=fff`,
        joinDate: new Date().toISOString(),
        addresses: [], // Empty addresses array
        preferences: {
          notifications: true,
          newsletter: true,
          sms: false,
        },
        orders: [], // Start with empty orders array
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

  // Add order to user's order history
  const addOrder = (orderData) => {
    if (!user) return

    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      status: "Обрабатывается",
      total: orderData.total,
      items: orderData.items.map((item) => ({
        name: item.name,
        team: item.team,
        size: item.selectedSize,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      customerInfo: orderData.customerInfo || {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      },
      deliveryAddress: orderData.deliveryAddress || "Не указан",
      paymentMethod: orderData.paymentMethod || "Наличными при получении",
      deliveryNotes: orderData.deliveryNotes || "",
      promoCode: orderData.promoCode || "",
    }

    const updatedUser = {
      ...user,
      orders: [newOrder, ...(user.orders || [])],
    }

    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))

    return newOrder
  }

  // Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    if (!user || !user.orders) return

    const updatedOrders = user.orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))

    const updatedUser = {
      ...user,
      orders: updatedOrders,
    }

    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  // Delete address
  const deleteAddress = (addressId) => {
    if (!user || !user.addresses) return

    const updatedAddresses = user.addresses.filter((addr) => addr.id !== addressId)

    const updatedUser = {
      ...user,
      addresses: updatedAddresses,
    }

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
    addOrder,
    updateOrderStatus,
    deleteAddress,
    loading,
    error,
    clearError,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
