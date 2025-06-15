"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          setCartItems(Array.isArray(parsedCart) ? parsedCart : [])
        }
      } catch (error) {
        console.error("Error loading cart:", error)
        setCartItems([])
      }
    }

    loadCart()
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    } catch (error) {
      console.error("Error saving cart:", error)
    }
  }, [cartItems])

  const addToCart = async (product, size = "M", quantity = 1) => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex((item) => item.id === product.id && item.selectedSize === size)

        if (existingItemIndex >= 0) {
          const updatedItems = [...prevItems]
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity,
          }
          return updatedItems
        }

        const newItem = {
          ...product,
          selectedSize: size,
          quantity,
          cartId: `${product.id}-${size}-${Date.now()}`,
          addedAt: new Date().toISOString(),
        }

        return [...prevItems, newItem]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = (cartId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cartId !== cartId))
  }

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartId)
      return
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => (item.cartId === cartId ? { ...item, quantity: newQuantity } : item)),
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + Number(item.price) * item.quantity
    }, 0)
  }

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getCartSummary = () => {
    const subtotal = getCartTotal()
    const shipping = subtotal > 30000 ? 0 : 2000
    const tax = Math.round(subtotal * 0.12)
    const total = subtotal + shipping + tax

    return {
      subtotal,
      shipping,
      tax,
      total,
      itemCount: getCartItemsCount(),
    }
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getCartSummary,
    isLoading,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
