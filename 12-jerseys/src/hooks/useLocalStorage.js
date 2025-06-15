"use client"

import { useState, useEffect } from "react"
import ApiService from "../services/api"

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)

  const fetchProducts = async (newFilters = {}) => {
    try {
      setLoading(true)
      setError(null)

      const params = { ...filters, ...newFilters }
      const response = await ApiService.getProducts(params)

      setProducts(response.products || response)
      setTotal(response.total || response.length)
    } catch (err) {
      setError(err.message)
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const refetch = (newFilters = {}) => {
    fetchProducts(newFilters)
  }

  return {
    products,
    loading,
    error,
    total,
    refetch,
  }
}

export const useProduct = (id) => {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await ApiService.getProduct(id)
        setProduct(response)
      } catch (err) {
        setError(err.message)
        console.error("Error fetching product:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  return { product, loading, error }
}
