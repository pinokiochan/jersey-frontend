"use client"

import { createContext, useContext, useState, useEffect } from "react"

const WishlistContext = createContext()

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([])

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const savedWishlist = localStorage.getItem("wishlist")
        if (savedWishlist) {
          const parsedWishlist = JSON.parse(savedWishlist)
          if (Array.isArray(parsedWishlist)) {
            setWishlistItems(parsedWishlist)
          }
        }
      } catch (error) {
        console.error("Error loading wishlist from localStorage:", error)
        setWishlistItems([])
        localStorage.removeItem("wishlist")
      }
    }

    loadWishlist()
  }, [])

  // Save wishlist to localStorage whenever wishlistItems changes
  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems))
    } catch (error) {
      console.error("Error saving wishlist to localStorage:", error)
    }
  }, [wishlistItems])

  const addToWishlist = (product) => {
    setWishlistItems((prevItems) => {
      const isAlreadyInWishlist = prevItems.some((item) => item.id === product.id)
      if (!isAlreadyInWishlist) {
        return [...prevItems, { ...product, addedAt: new Date().toISOString() }]
      }
      return prevItems
    })
  }

  const removeFromWishlist = (productId) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const toggleWishlist = (product) => {
    const isInWishlist = wishlistItems.some((item) => item.id === product.id)
    if (isInWishlist) {
      removeFromWishlist(product.id)
      return false
    } else {
      addToWishlist(product)
      return true
    }
  }

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId)
  }

  const clearWishlist = () => {
    setWishlistItems([])
    localStorage.removeItem("wishlist")
  }

  const getWishlistCount = () => {
    return wishlistItems.length
  }

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
