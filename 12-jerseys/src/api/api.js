// Updated API service to use DataService for local storage
import dataService from "./dataService"

class ApiService {
  async request(endpoint, options = {}) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // For now, we'll use localStorage through dataService
    // This structure makes it easy to replace with real API calls later
    return this.handleLocalStorageRequest(endpoint, options)
  }

  handleLocalStorageRequest(endpoint, options = {}) {
    const method = options.method || "GET"

    try {
      // Products endpoints
      if (endpoint.startsWith("/products")) {
        if (method === "GET") {
          if (endpoint.includes("?")) {
            // Handle search with parameters
            const [path, queryString] = endpoint.split("?")
            const params = new URLSearchParams(queryString)
            const filters = Object.fromEntries(params.entries())

            if (path === "/products") {
              return {
                products: dataService.searchProducts(filters.search || "", filters),
                total: dataService.getProducts().length,
              }
            }
          } else if (endpoint === "/products") {
            return {
              products: dataService.getProducts(),
              total: dataService.getProducts().length,
            }
          } else {
            // Get single product
            const id = endpoint.split("/")[2]
            return dataService.getProduct(id)
          }
        }
      }

      // Team endpoints
      if (endpoint === "/team") {
        return dataService.getMockTeamMembers()
      }

      // Orders endpoints
      if (endpoint.startsWith("/orders")) {
        return dataService.getOrders()
      }

      // Users endpoints
      if (endpoint.startsWith("/users")) {
        return dataService.getUsers()
      }

      throw new Error(`Endpoint ${endpoint} not found`)
    } catch (error) {
      console.error("LocalStorage request failed:", error)
      throw error
    }
  }

  // Product endpoints - now using dataService
  async getProducts(params = {}) {
    try {
      const result = dataService.searchProducts(params.search || "", params)
      return {
        products: result,
        total: result.length,
        page: Number.parseInt(params.page) || 1,
        limit: Number.parseInt(params.limit) || 20,
      }
    } catch (error) {
      console.warn("Error getting products:", error)
      return { products: [], total: 0, page: 1, limit: 20 }
    }
  }

  async getProduct(id) {
    try {
      return dataService.getProduct(id)
    } catch (error) {
      console.warn("Error getting product:", error)
      return null
    }
  }

  // Keep mock data methods for backward compatibility
  getMockProducts(params = {}) {
    return dataService.searchProducts(params.search || "", params)
  }

  getMockTeamMembers() {
    return dataService.getMockTeamMembers()
  }
}

export default new ApiService()
