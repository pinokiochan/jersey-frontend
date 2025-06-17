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

      return new Promise((resolve) => {
        setCartItems((prevItems) => {
          console.log("Previous cart items:", prevItems)

          // Check if item with same product and size already exists
          const existingItemIndex = prevItems.findIndex((item) => item.id === product.id && item.selectedSize === size)

          let updatedItems
          let resultMessage = ""

          if (existingItemIndex >= 0) {
            // Update existing item quantity with stock validation
            const existingItem = prevItems[existingItemIndex]
            const newQuantity = existingItem.quantity + quantity

            // Check if new quantity exceeds stock
            if (newQuantity > product.stock) {
              const availableToAdd = product.stock - existingItem.quantity
              if (availableToAdd <= 0) {
                resolve({
                  success: false,
                  error: `Товар уже в корзине в максимальном количестве (${product.stock} шт.)`,
                  maxReached: true,
                })
                return prevItems
              } else {
                // Add only available quantity
                updatedItems = [...prevItems]
                updatedItems[existingItemIndex] = {
                  ...updatedItems[existingItemIndex],
                  quantity: product.stock,
                }
                resultMessage = `Добавлено ${availableToAdd} шт. (максимум достигнут)`
                console.log("Updated existing item to max stock:", updatedItems[existingItemIndex])
              }
            } else {
              // Normal quantity update
              updatedItems = [...prevItems]
              updatedItems[existingItemIndex] = {
                ...updatedItems[existingItemIndex],
                quantity: newQuantity,
              }
              resultMessage = `Количество обновлено: ${newQuantity} шт.`
              console.log("Updated existing item:", updatedItems[existingItemIndex])
            }
          } else {
            // Add new item with stock validation
            if (quantity > product.stock) {
              resolve({
                success: false,
                error: `В наличии только ${product.stock} шт.`,
                stockLimit: true,
              })
              return prevItems
            }

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
              stock: product.stock, // Store stock info for validation
              cartId: `${product.id}-${size}-${Date.now()}`,
              addedAt: new Date().toISOString(),
            }

            updatedItems = [...prevItems, newItem]
            resultMessage = `Товар добавлен в корзину (${quantity} шт.)`
            console.log("Added new item:", newItem)
          }

          console.log("Updated cart items:", updatedItems)

          resolve({
            success: true,
            message: resultMessage,
            item: updatedItems[existingItemIndex >= 0 ? existingItemIndex : updatedItems.length - 1],
          })

          return updatedItems
        })
      })
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
      return { success: true, message: "Товар удален из корзины" }
    }

    return new Promise((resolve) => {
      setCartItems((prevItems) => {
        const updatedItems = prevItems.map((item) => {
          if (item.cartId === cartId) {
            // Validate against stock
            if (newQuantity > item.stock) {
              resolve({
                success: false,
                error: `В наличии только ${item.stock} шт.`,
                maxQuantity: item.stock,
              })
              return item // Don't update if exceeds stock
            }

            resolve({
              success: true,
              message: `Количество обновлено: ${newQuantity} шт.`,
            })

            return { ...item, quantity: newQuantity }
          }
          return item
        })

        console.log("Cart after quantity update:", updatedItems)
        return updatedItems
      })
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

  // Get current quantity of specific product and size in cart
  const getItemQuantityInCart = (productId, size) => {
    const item = cartItems.find((item) => item.id === productId && item.selectedSize === size)
    return item ? item.quantity : 0
  }

  // Check if we can add more of specific item
  const canAddMore = (productId, size, stock) => {
    const currentQuantity = getItemQuantityInCart(productId, size)
    return currentQuantity < stock
  }

  // Get available quantity that can be added
  const getAvailableQuantity = (productId, size, stock) => {
    const currentQuantity = getItemQuantityInCart(productId, size)
    return Math.max(0, stock - currentQuantity)
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
    getItemQuantityInCart,
    canAddMore,
    getAvailableQuantity,
    isLoading,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
