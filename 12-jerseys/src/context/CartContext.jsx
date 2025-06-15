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

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          if (Array.isArray(parsedCart)) {
            console.log("Loaded cart from localStorage:", parsedCart)
            setCartItems(parsedCart)
          } else {
            console.warn("Invalid cart data in localStorage, resetting")
            setCartItems([])
            localStorage.removeItem("cart")
          }
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
        setCartItems([])
        localStorage.removeItem("cart")
      }
    }

    loadCart()
  }, [])

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    try {
      console.log("Saving cart to localStorage:", cartItems)
      localStorage.setItem("cart", JSON.stringify(cartItems))
    } catch (error) {
      console.error("Error saving cart to localStorage:", error)
    }
  }, [cartItems])

  const addToCart = async (product, size = "M", quantity = 1) => {
    console.log("Adding to cart:", { product, size, quantity })
    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      setCartItems((prevItems) => {
        console.log("Previous cart items:", prevItems)

        // Check if item with same product and size already exists
        const existingItemIndex = prevItems.findIndex((item) => item.id === product.id && item.selectedSize === size)

        let updatedItems
        if (existingItemIndex >= 0) {
          // Update existing item quantity
          updatedItems = [...prevItems]
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity,
          }
          console.log("Updated existing item:", updatedItems[existingItemIndex])
        } else {
          // Add new item
          const newItem = {
            id: product.id,
            name: product.name,
            team: product.team,
            color: product.color,
            price: product.price,
            image: product.image || product.imageUrl,
            description: product.description,
            selectedSize: size,
            quantity,
            cartId: `${product.id}-${size}-${Date.now()}`,
            addedAt: new Date().toISOString(),
          }

          updatedItems = [...prevItems, newItem]
          console.log("Added new item:", newItem)
        }

        console.log("Updated cart items:", updatedItems)
        return updatedItems
      })

      return { success: true }
    } catch (error) {
      console.error("Error adding to cart:", error)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = (cartId) => {
    console.log("Removing from cart:", cartId)
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.cartId !== cartId)
      console.log("Cart after removal:", updatedItems)
      return updatedItems
    })
  }

  const updateQuantity = (cartId, newQuantity) => {
    console.log("Updating quantity:", { cartId, newQuantity })

    if (newQuantity <= 0) {
      removeFromCart(cartId)
      return
    }

    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => (item.cartId === cartId ? { ...item, quantity: newQuantity } : item))
      console.log("Cart after quantity update:", updatedItems)
      return updatedItems
    })
  }

  const clearCart = () => {
    console.log("Clearing cart")
    setCartItems([])
    localStorage.removeItem("cart")
  }

  const getCartTotal = () => {
    const total = cartItems.reduce((total, item) => {
      return total + (Number(item.price) || 0) * (item.quantity || 0)
    }, 0)
    console.log("Cart total:", total)
    return total
  }

  const getCartItemsCount = () => {
    const count = cartItems.reduce((total, item) => total + (item.quantity || 0), 0)
    console.log("Cart items count:", count)
    return count
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
