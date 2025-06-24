"use client"

import { useState, useEffect } from "react"
import dataService from "../services/dataService"

export const useProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const loadedProducts = dataService.getProducts()
      setProducts(loadedProducts)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getProduct = (id) => {
    return dataService.getProduct(id)
  }

  const searchProducts = (query, filters = {}) => {
    return dataService.searchProducts(query, filters)
  }

  const getFeaturedProducts = () => {
    return products.filter((product) => product.featured && product.status === "active")
  }

  const getProductsByCategory = (category) => {
    return products.filter((product) => product.category === category && product.status === "active")
  }

  return {
    products: products.filter((p) => p.status === "active"), // Only show active products to customers
    loading,
    error,
    getProduct,
    searchProducts,
    getFeaturedProducts,
    getProductsByCategory,
    refetch: loadProducts,
  }
}
