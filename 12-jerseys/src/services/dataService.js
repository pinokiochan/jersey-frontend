// Centralized data service for managing all application data
class DataService {
  constructor() {
    this.initializeData()
  }

  // Add this method after the constructor
  forceInitialization() {
    // Clear existing data and reinitialize with fresh default data
    localStorage.removeItem("products")
    localStorage.removeItem("users")
    localStorage.removeItem("orders")
    this.initializeData()

    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent("productsUpdated"))

    return this.getProducts()
  }

  // Update the initializeData method to be more robust
  initializeData() {
    // Always ensure we have products data
    const existingProducts = localStorage.getItem("products")
    if (!existingProducts || JSON.parse(existingProducts).length === 0) {
      this.saveProducts(this.getDefaultProducts())
    }

    if (!localStorage.getItem("users")) {
      this.saveUsers(this.getDefaultUsers())
    }
    if (!localStorage.getItem("orders")) {
      this.saveOrders(this.getDefaultOrders())
    }
  }

  // Products CRUD
  getProducts() {
    try {
      const products = JSON.parse(localStorage.getItem("products"))
      if (!products || products.length === 0) {
        // If no products found, initialize with default data
        const defaultProducts = this.getDefaultProducts()
        this.saveProducts(defaultProducts)
        return defaultProducts
      }
      return products
    } catch (error) {
      console.error("Error loading products:", error)
      const defaultProducts = this.getDefaultProducts()
      this.saveProducts(defaultProducts)
      return defaultProducts
    }
  }

  saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products))
  }

  getProduct(id) {
    const products = this.getProducts()
    return products.find((p) => p.id === Number.parseInt(id))
  }

  addProduct(product) {
    const products = this.getProducts()
    const newProduct = {
      ...product,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    products.push(newProduct)
    this.saveProducts(products)
    return newProduct
  }

  updateProduct(id, updates) {
    const products = this.getProducts()
    const index = products.findIndex((p) => p.id === Number.parseInt(id))
    if (index !== -1) {
      products[index] = {
        ...products[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      this.saveProducts(products)
      return products[index]
    }
    return null
  }

  deleteProduct(id) {
    const products = this.getProducts()
    const filtered = products.filter((p) => p.id !== Number.parseInt(id))
    this.saveProducts(filtered)
    return true
  }

  // Users CRUD
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem("users")) || []
    } catch (error) {
      console.error("Error loading users:", error)
      return this.getDefaultUsers()
    }
  }

  saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users))
  }

  getUser(id) {
    const users = this.getUsers()
    return users.find((u) => u.id === Number.parseInt(id))
  }

  addUser(user) {
    const users = this.getUsers()
    const newUser = {
      ...user,
      id: Date.now(),
      joinDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      ordersCount: 0,
      totalSpent: 0,
    }
    users.push(newUser)
    this.saveUsers(users)
    return newUser
  }

  updateUser(id, updates) {
    const users = this.getUsers()
    const index = users.findIndex((u) => u.id === Number.parseInt(id))
    if (index !== -1) {
      users[index] = {
        ...users[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      this.saveUsers(users)

      // Update current user in AuthContext if it's the same user
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (currentUser.id === Number.parseInt(id)) {
        localStorage.setItem("user", JSON.stringify(users[index]))
      }

      return users[index]
    }
    return null
  }

  deleteUser(id) {
    const users = this.getUsers()
    const filtered = users.filter((u) => u.id !== Number.parseInt(id))
    this.saveUsers(filtered)
    return true
  }

  // Orders CRUD
  getOrders() {
    try {
      return JSON.parse(localStorage.getItem("orders")) || []
    } catch (error) {
      console.error("Error loading orders:", error)
      return this.getDefaultOrders()
    }
  }

  saveOrders(orders) {
    localStorage.setItem("orders", JSON.stringify(orders))
  }

  getOrder(id) {
    const orders = this.getOrders()
    return orders.find((o) => o.id === id)
  }

  addOrder(order) {
    const orders = this.getOrders()
    const newOrder = {
      ...order,
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      status: "Обрабатывается",
    }
    orders.unshift(newOrder)
    this.saveOrders(orders)

    // Update user's order count and total spent
    if (order.userId) {
      this.updateUserStats(order.userId, order.total)
    }

    return newOrder
  }

  updateOrder(id, updates) {
    const orders = this.getOrders()
    const index = orders.findIndex((o) => o.id === id)
    if (index !== -1) {
      orders[index] = {
        ...orders[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      this.saveOrders(orders)
      return orders[index]
    }
    return null
  }

  updateUserStats(userId, orderTotal) {
    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.id === Number.parseInt(userId))
    if (userIndex !== -1) {
      users[userIndex].ordersCount = (users[userIndex].ordersCount || 0) + 1
      users[userIndex].totalSpent = (users[userIndex].totalSpent || 0) + orderTotal
      this.saveUsers(users)
    }
  }

  // Search and filter methods
  searchProducts(query, filters = {}) {
    let products = this.getProducts()

    if (query) {
      const searchTerm = query.toLowerCase()
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.team.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm),
      )
    }

    // Apply filters
    if (filters.team) {
      products = products.filter((p) => p.team === filters.team)
    }
    if (filters.category) {
      products = products.filter((p) => p.category === filters.category)
    }
    if (filters.minPrice) {
      products = products.filter((p) => p.price >= filters.minPrice)
    }
    if (filters.maxPrice) {
      products = products.filter((p) => p.price <= filters.maxPrice)
    }
    if (filters.status) {
      products = products.filter((p) => p.status === filters.status)
    }

    return products
  }

  // Analytics methods
  getAnalytics() {
    const products = this.getProducts()
    const users = this.getUsers()
    const orders = this.getOrders()

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
    const totalOrders = orders.length
    const totalUsers = users.length
    const totalProducts = products.length

    return {
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
      recentOrders: orders.slice(0, 5),
      topProducts: this.getTopProducts(),
      monthlyGrowth: this.calculateGrowth(),
    }
  }

  getTopProducts() {
    const products = this.getProducts()
    return products
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, 5)
      .map((product) => ({
        ...product,
        revenue: (product.sold || 0) * product.price,
      }))
  }

  calculateGrowth() {
    // Mock growth calculation - in real app this would be based on historical data
    return {
      revenue: 12.5,
      orders: 8.3,
      users: 15.2,
      products: 3.1,
    }
  }

  // Default data
  getDefaultProducts() {
    return [
      {
        id: 1,
        name: "Manchester United Retro",
        team: "Manchester United",
        color: "Красный",
        price: 25000,
        cost: 15000,
        image: "/assets/manu.png?height=300&width=300",
        description:
          "Классическое ретро джерси Manchester United в современной интерпретации с премиальными материалами",
        stock: 15,
        sold: 156,
        rating: 4.8,
        category: "retro",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 2,
        name: "Arsenal Vintage",
        team: "Arsenal",
        color: "Красный",
        price: 22000,
        cost: 13000,
        image: "/assets/arsenal.png?height=300&width=300",
        description: "Винтажное джерси Arsenal с уникальным дизайном и аутентичными деталями",
        stock: 8,
        sold: 134,
        rating: 4.7,
        category: "vintage",
        status: "active",
        sizes: ["S", "M", "L", "XL"],
        featured: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 3,
        name: "Liverpool Classic",
        team: "Liverpool",
        color: "Красный",
        price: 23000,
        cost: 14000,
        image: "/assets/liverpool.png?height=300&width=300",
        description: "Классическое джерси Liverpool для истинных фанатов с современным кроем",
        stock: 12,
        sold: 128,
        rating: 4.6,
        category: "classic",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 4,
        name: "Chelsea Modern",
        team: "Chelsea",
        color: "Синий",
        price: 24000,
        cost: 14400,
        image: "/assets/chelsea.png?height=300&width=300",
        description: "Современное джерси Chelsea с инновационным дизайном и технологичными материалами",
        stock: 20,
        sold: 89,
        rating: 4.5,
        category: "modern",
        status: "active",
        sizes: ["S", "M", "L", "XL", "XXL"],
        featured: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 5,
        name: "Barcelona Heritage",
        team: "Barcelona",
        color: "Синий",
        price: 26000,
        cost: 15600,
        image: "/assets/barcelona.jpg?height=300&width=300",
        description: "Наследие Barcelona в современном исполнении с традиционными цветами клуба",
        stock: 5,
        sold: 203,
        rating: 4.9,
        category: "heritage",
        status: "active",
        sizes: ["M", "L", "XL"],
        featured: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 6,
        name: "Real Madrid Elite",
        team: "Real Madrid",
        color: "Белый",
        price: 28000,
        cost: 16800,
        image: "/assets/realmadrid.png?height=300&width=300",
        description: "Элитное джерси Real Madrid для особых случаев с премиальной отделкой",
        stock: 10,
        sold: 187,
        rating: 4.8,
        category: "elite",
        status: "active",
        sizes: ["S", "M", "L", "XL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 7,
        name: "PSG Limited Edition",
        team: "PSG",
        color: "Синий",
        price: 30000,
        cost: 18000,
        image: "/assets/psg.png?height=300&width=300",
        description: "Лимитированная коллекция PSG с эксклюзивным дизайном",
        stock: 3,
        sold: 45,
        rating: 4.7,
        category: "limited",
        status: "active",
        sizes: ["M", "L", "XL"],
        featured: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 8,
        name: "Bayern Munich Classic",
        team: "Bayern Munich",
        color: "Красный",
        price: 24500,
        cost: 14700,
        image: "/assets/bayernmunchen.png?height=300&width=300",
        description: "Классическое джерси Bayern Munich с традиционным баварским дизайном",
        stock: 18,
        sold: 156,
        rating: 4.6,
        category: "classic",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 9,
        name: "Atletico Madrid Classic",
        team: "Atletico Madrid",
        color: "Красный",
        price: 21500,
        cost: 12900,
        image: "/assets/atleticom.png?height=300&width=300",
        description: "Классическое джерси Atletico Madrid с традиционным дизайном",
        stock: 14,
        sold: 98,
        rating: 4.4,
        category: "classic",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 10,
        name: "Japan Vintage",
        team: "Japan",
        color: "Красный",
        price: 26500,
        cost: 15900,
        image: "/assets/japan.jpg?height=300&width=300",
        description: "Винтажное джерси Japan с уникальным дизайном и аутентичными деталями",
        stock: 28,
        sold: 76,
        rating: 4.5,
        category: "vintage",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 11,
        name: "Milan Retro",
        team: "Milan",
        color: "Красный",
        price: 20500,
        cost: 12300,
        image: "/assets/milan.png?height=300&width=300",
        description: "Классическое ретро джерси Milan в современной интерпретации с премиальными материалами",
        stock: 18,
        sold: 112,
        rating: 4.7,
        category: "retro",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 12,
        name: "Italy Retro",
        team: "Italy",
        color: "Белый",
        price: 28500,
        cost: 17100,
        image: "/assets/italy.png?height=300&width=300",
        description: "Классическое ретро джерси Italy в современной интерпретации с премиальными материалами",
        stock: 8,
        sold: 134,
        rating: 4.8,
        category: "retro",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 13,
        name: "Germany Classic",
        team: "Germany",
        color: "Белый",
        price: 24500,
        cost: 14700,
        image: "/assets/germany.png?height=300&width=300",
        description: "Классическое джерси Germany с традиционным дизайном",
        stock: 20,
        sold: 145,
        rating: 4.6,
        category: "classic",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 14,
        name: "Manchester City Modern",
        team: "Manchester City",
        color: "Белый",
        price: 27500,
        cost: 16500,
        image: "/assets/mancity.jpg?height=300&width=300",
        description: "Современное джерси Manchester City с инновационным дизайном и технологичными материалами",
        stock: 4,
        sold: 67,
        rating: 4.3,
        category: "modern",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 15,
        name: "Borussia Dortmund Classic",
        team: "Borussia Dortmund",
        color: "Желтый",
        price: 29500,
        cost: 17700,
        image: "/assets/borussia.jpg?height=300&width=300",
        description: "Классическое джерси Borussia Dortmund с традиционным дизайном",
        stock: 1,
        sold: 23,
        rating: 4.4,
        category: "classic",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 16,
        name: "Kairat Elite",
        team: "Kairat",
        color: "Желтый",
        price: 25500,
        cost: 15300,
        image: "/assets/girona.png?height=300&width=300",
        description: "Элитное джерси Kairat для особых случаев с премиальной отделкой",
        stock: 0,
        sold: 12,
        rating: 4.2,
        category: "elite",
        status: "inactive",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 17,
        name: "Juventus Vintage",
        team: "Juventus",
        color: "Черный",
        price: 22500,
        cost: 13500,
        image: "/assets/juventus.jpg?height=300&width=300",
        description: "Винтажное джерси Juventus с уникальным дизайном и аутентичными деталями",
        stock: 3,
        sold: 89,
        rating: 4.6,
        category: "vintage",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 18,
        name: "Inter Heritage",
        team: "Inter",
        color: "Белый",
        price: 21500,
        cost: 12900,
        image: "/assets/inter.jpg?height=300&width=300",
        description: "Наследие Inter в современном исполнении с традиционными цветами клуба",
        stock: 5,
        sold: 56,
        rating: 4.4,
        category: "heritage",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 19,
        name: "Tottenham Hotspur Classic",
        team: "Tottenham Hotspur",
        color: "Белый",
        price: 27500,
        cost: 16500,
        image: "/assets/tottenham.png?height=300&width=300",
        description: "Классическое джерси Tottenham Hotspur с традиционным дизайном",
        stock: 11,
        sold: 78,
        rating: 4.3,
        category: "classic",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 20,
        name: "Portugal Elite",
        team: "Portugal",
        color: "Красный",
        price: 24500,
        cost: 14700,
        image: "/assets/portugal.png?height=300&width=300",
        description: "Элитное джерси Portugal для особых случаев с премиальной отделкой",
        stock: 10,
        sold: 145,
        rating: 4.7,
        category: "elite",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 21,
        name: "Argentina Heritage",
        team: "Argentina",
        color: "Синий",
        price: 21500,
        cost: 12900,
        image: "/assets/argentina.png?height=300&width=300",
        description: "Наследие Argentina в современном исполнении с традиционными цветами клуба",
        stock: 13,
        sold: 167,
        rating: 4.8,
        category: "heritage",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 22,
        name: "England Modern",
        team: "England",
        color: "Белый",
        price: 20500,
        cost: 12300,
        image: "/assets/england.png?height=300&width=300",
        description: "Современное джерси England с инновационным дизайном и технологичными материалами",
        stock: 17,
        sold: 134,
        rating: 4.5,
        category: "modern",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 23,
        name: "Russia Classic",
        team: "Russia",
        color: "Красный",
        price: 26500,
        cost: 15900,
        image: "/assets/russia.png?height=300&width=300",
        description: "Классическое джерси Russia с традиционным дизайном",
        stock: 16,
        sold: 89,
        rating: 4.4,
        category: "classic",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 24,
        name: "Roma Classic",
        team: "Roma",
        color: "Коричневый",
        price: 28500,
        cost: 17100,
        image: "/assets/roma.png?height=300&width=300",
        description: "Классическое джерси Roma с традиционным дизайном",
        stock: 22,
        sold: 123,
        rating: 4.6,
        category: "classic",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 25,
        name: "Brasil Elite",
        team: "Brasil",
        color: "Желтый",
        price: 29500,
        cost: 17700,
        image: "/assets/brasil.png?height=300&width=300",
        description: "Элитное джерси Brasil для особых случаев с премиальной отделкой",
        stock: 16,
        sold: 245,
        rating: 4.9,
        category: "elite",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 26,
        name: "France Modern",
        team: "France",
        color: "Синий",
        price: 25500,
        cost: 15300,
        image: "/assets/france.png?height=300&width=300",
        description: "Современное джерси France с инновационным дизайном и технологичными материалами",
        stock: 20,
        sold: 178,
        rating: 4.7,
        category: "modern",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 27,
        name: "Real Betis Classic",
        team: "Real Betis",
        color: "Зеленый",
        price: 28500,
        cost: 17100,
        image: "/assets/betis.png?height=300&width=300",
        description: "Классическое джерси Real Betis с традиционным дизайном",
        stock: 14,
        sold: 67,
        rating: 4.3,
        category: "classic",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 28,
        name: "Napoli Heritage",
        team: "Napoli",
        color: "Синий",
        price: 23500,
        cost: 14100,
        image: "/assets/napoli.png?height=300&width=300",
        description: "Наследие Napoli в современном исполнении с традиционными цветами клуба",
        stock: 15,
        sold: 134,
        rating: 4.6,
        category: "heritage",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 29,
        name: "Sporting Retro",
        team: "Sporting",
        color: "Зеленый",
        price: 24500,
        cost: 14700,
        image: "/assets/sporting.png?height=300&width=300",
        description: "Классическое ретро джерси Sporting в современной интерпретации с премиальными материалами",
        stock: 13,
        sold: 98,
        rating: 4.5,
        category: "retro",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 30,
        name: "Porto Retro",
        team: "Porto",
        color: "Синий",
        price: 22500,
        cost: 13500,
        image: "/assets/porto.png?height=300&width=300",
        description: "Классическое ретро джерси Porto в современной интерпретации с премиальными материалами",
        stock: 10,
        sold: 87,
        rating: 4.4,
        category: "retro",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ]
  }

  getDefaultUsers() {
    return [
      {
        id: 1,
        name: "Иван Петров",
        email: "ivan@example.com",
        phone: "+7 (999) 123-45-67",
        role: "customer",
        status: "active",
        joinDate: "2024-01-10T10:30:00Z",
        lastLogin: "2024-01-15T14:20:00Z",
        ordersCount: 5,
        totalSpent: 22500,
        avatar: "/placeholder.svg?height=40&width=40",
        addresses: [],
        preferences: { notifications: true, newsletter: true, sms: false },
      },
      {
        id: 2,
        name: "Мария Сидорова",
        email: "maria@example.com",
        phone: "+7 (999) 234-56-78",
        role: "customer",
        status: "active",
        joinDate: "2024-01-08T09:15:00Z",
        lastLogin: "2024-01-14T16:45:00Z",
        ordersCount: 3,
        totalSpent: 15600,
        avatar: "/placeholder.svg?height=40&width=40",
        addresses: [],
        preferences: { notifications: true, newsletter: false, sms: true },
      },
    ]
  }

  getDefaultOrders() {
    return [
      {
        id: "ORD-001",
        userId: 1,
        customerName: "Иван Петров",
        customerEmail: "ivan@example.com",
        date: "2024-01-15T14:30:00Z",
        status: "Ожидает",
        total: 4500,
        items: [
          {
            id: 1,
            name: "Manchester United Retro",
            quantity: 1,
            price: 25000,
            size: "L",
          },
        ],
        deliveryAddress: "Москва, ул. Примерная, д. 1",
        paymentMethod: "Картой онлайн",
      },
    ]
  }

  // Get orders for admin panel
  getOrdersForAdmin() {
    const orders = this.getOrders()
    const users = this.getUsers()

    return orders.map((order) => {
      const user = users.find((u) => u.id === order.userId)
      return {
        ...order,
        customer: user
          ? {
              name: user.name,
              email: user.email,
              phone: user.phone,
            }
          : {
              name: order.customerName || "Неизвестный",
              email: order.customerEmail || "",
              phone: order.customerPhone || "",
            },
      }
    })
  }

  // Add order from checkout
  addOrderFromCheckout(orderData, userId = null) {
    const orders = this.getOrders()
    const newOrder = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      userId: userId,
      date: new Date().toISOString(),
      status: "pending",
      paymentStatus: "pending",
    }

    orders.unshift(newOrder)
    this.saveOrders(orders)

    // Update user stats if userId provided
    if (userId) {
      this.updateUserStats(userId, orderData.total)
    }

    return newOrder
  }

  // Register new user and save to admin panel
  registerUser(userData) {
    const users = this.getUsers()
    const newUser = {
      ...userData,
      id: Date.now(),
      role: "customer",
      status: "active",
      joinDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      ordersCount: 0,
      totalSpent: 0,
      avatar: `https://ui-avatars.com/api/?name=${userData.name}&background=dc2626&color=fff`,
      addresses: [],
      preferences: { notifications: true, newsletter: true, sms: false },
    }

    users.push(newUser)
    this.saveUsers(users)
    return newUser
  }

  // Update user login time
  updateUserLogin(userId) {
    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.id === Number.parseInt(userId))
    if (userIndex !== -1) {
      users[userIndex].lastLogin = new Date().toISOString()
      this.saveUsers(users)
    }
  }

  // Utility method to clear all data (for testing)
  clearAllData() {
    localStorage.removeItem("products")
    localStorage.removeItem("users")
    localStorage.removeItem("orders")
    localStorage.removeItem("user")
    localStorage.removeItem("cart")
    localStorage.removeItem("wishlist")
    this.initializeData()
  }
}

export default new DataService()
