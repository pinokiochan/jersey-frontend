// API service for backend communication
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api"

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Product endpoints
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = `/products${queryString ? `?${queryString}` : ""}`

    try {
      return await this.request(endpoint)
    } catch (error) {
      // Fallback to mock data if backend is not available
      console.warn("Backend not available, using mock data")
      return this.getMockProducts(params)
    }
  }

  async getProduct(id) {
    try {
      return await this.request(`/products/${id}`)
    } catch (error) {
      console.warn("Backend not available, using mock data")
      return this.getMockProducts().find((p) => p.id === Number.parseInt(id))
    }
  }

  // Mock data fallback
  getMockProducts(params = {}) {
    const mockProducts = [
      {
        id: 1,
        name: "Manchester United Retro",
        team: "Manchester United",
        color: "Красный",
        price: 25000,
        image: "/placeholder.svg?height=300&width=300",
        description:
          "Классическое ретро джерси Manchester United в современной интерпретации с премиальными материалами",
        stock: 15,
        category: "retro",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: true,
      },
      {
        id: 2,
        name: "Arsenal Vintage",
        team: "Arsenal",
        color: "Красный",
        price: 22000,
        image: "/placeholder.svg?height=300&width=300",
        description: "Винтажное джерси Arsenal с уникальным дизайном и аутентичными деталями",
        stock: 8,
        category: "vintage",
        sizes: ["S", "M", "L", "XL"],
        featured: true,
      },
      {
        id: 3,
        name: "Liverpool Classic",
        team: "Liverpool",
        color: "Красный",
        price: 23000,
        image: "/placeholder.svg?height=300&width=300",
        description: "Классическое джерси Liverpool для истинных фанатов с современным кроем",
        stock: 12,
        category: "classic",
        sizes: ["XS", "S", "M", "L", "XL"],
        featured: false,
      },
      {
        id: 4,
        name: "Chelsea Modern",
        team: "Chelsea",
        color: "Синий",
        price: 24000,
        image: "/placeholder.svg?height=300&width=300",
        description: "Современное джерси Chelsea с инновационным дизайном и технологичными материалами",
        stock: 20,
        category: "modern",
        sizes: ["S", "M", "L", "XL", "XXL"],
        featured: true,
      },
      {
        id: 5,
        name: "Barcelona Heritage",
        team: "Barcelona",
        color: "Синий",
        price: 26000,
        image: "/placeholder.svg?height=300&width=300",
        description: "Наследие Barcelona в современном исполнении с традиционными цветами клуба",
        stock: 5,
        category: "heritage",
        sizes: ["M", "L", "XL"],
        featured: true,
      },
      {
        id: 6,
        name: "Real Madrid Elite",
        team: "Real Madrid",
        color: "Белый",
        price: 28000,
        image: "/placeholder.svg?height=300&width=300",
        description: "Элитное джерси Real Madrid для особых случаев с премиальной отделкой",
        stock: 0,
        category: "elite",
        sizes: ["S", "M", "L", "XL"],
        featured: false,
      },
      {
        id: 7,
        name: "PSG Limited Edition",
        team: "PSG",
        color: "Синий",
        price: 30000,
        image: "/placeholder.svg?height=300&width=300",
        description: "Лимитированная коллекция PSG с эксклюзивным дизайном",
        stock: 3,
        category: "limited",
        sizes: ["M", "L", "XL"],
        featured: true,
      },
      {
        id: 8,
        name: "Bayern Munich Classic",
        team: "Bayern Munich",
        color: "Красный",
        price: 24500,
        image: "/placeholder.svg?height=300&width=300",
        description: "Классическое джерси Bayern Munich с традиционным баварским дизайном",
        stock: 18,
        category: "classic",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        featured: false,
      },
    ]

    // Apply filters if provided
    let filtered = [...mockProducts]

    if (params.search) {
      const search = params.search.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(search) ||
          product.team.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search),
      )
    }

    if (params.team) {
      filtered = filtered.filter((product) => product.team === params.team)
    }

    if (params.color) {
      filtered = filtered.filter((product) => product.color === params.color)
    }

    if (params.category) {
      filtered = filtered.filter((product) => product.category === params.category)
    }

    if (params.minPrice) {
      filtered = filtered.filter((product) => product.price >= Number.parseInt(params.minPrice))
    }

    if (params.maxPrice) {
      filtered = filtered.filter((product) => product.price <= Number.parseInt(params.maxPrice))
    }

    if (params.featured) {
      filtered = filtered.filter((product) => product.featured)
    }

    // Apply sorting
    if (params.sortBy) {
      switch (params.sortBy) {
        case "price-low":
          filtered.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          filtered.sort((a, b) => b.price - a.price)
          break
        case "name":
          filtered.sort((a, b) => a.name.localeCompare(b.name))
          break
        case "stock":
          filtered.sort((a, b) => b.stock - a.stock)
          break
        default:
          break
      }
    }

    return {
      products: filtered,
      total: filtered.length,
      page: Number.parseInt(params.page) || 1,
      limit: Number.parseInt(params.limit) || 20,
    }
  }

  // Team endpoints
  async getTeamMembers() {
    try {
      return await this.request("/team")
    } catch (error) {
      console.warn("Backend not available, using mock team data")
      return this.getMockTeamMembers()
    }
  }

  getMockTeamMembers() {
    return [
      {
        id: 1,
        name: "Алексей Иванов",
        role: "Основатель и креативный директор",
        image: "https://ui-avatars.com/api/?name=Алексей+Иванов&background=dc2626&color=fff",
        description: "Фанат футбола с 20-летним стажем, превративший страсть в бизнес",
        email: "alexey@12jerseys.kz",
        linkedin: "#",
      },
      {
        id: 2,
        name: "Мария Петрова",
        role: "Дизайнер",
        image: "https://ui-avatars.com/api/?name=Мария+Петрова&background=dc2626&color=fff",
        description: "Создаёт уникальные дизайны, объединяющие спорт и моду",
        email: "maria@12jerseys.kz",
        linkedin: "#",
      },
      {
        id: 3,
        name: "Дмитрий Сидоров",
        role: "Менеджер по качеству",
        image: "https://ui-avatars.com/api/?name=Дмитрий+Сидоров&background=dc2626&color=fff",
        description: "Следит за тем, чтобы каждое джерси соответствовало высшим стандартам",
        email: "dmitry@12jerseys.kz",
        linkedin: "#",
      },
      {
        id: 4,
        name: "Bikosh",
        role: "Mobile Developer",
        image: "https://ui-avatars.com/api/?name=Bikosh&background=dc2626&color=fff",
        description: "Разрабатывает мобильные приложения для лучшего пользовательского опыта",
        email: "bikosh@12jerseys.kz",
        linkedin: "#",
      },
      {
        id: 5,
        name: "Ayan",
        role: "Mobile Developer",
        image: "https://ui-avatars.com/api/?name=Ayan&background=dc2626&color=fff",
        description: "Специализируется на создании интуитивных мобильных интерфейсов",
        email: "ayan@12jerseys.kz",
        linkedin: "#",
      },
      {
        id: 6,
        name: "Bakha",
        role: "Mobile Developer",
        image: "https://ui-avatars.com/api/?name=Bakha&background=dc2626&color=fff",
        description: "Эксперт по оптимизации производительности мобильных приложений",
        email: "bakha@12jerseys.kz",
        linkedin: "#",
      },
      {
        id: 7,
        name: "Berdibek",
        role: "Mobile Developer",
        image: "https://ui-avatars.com/api/?name=Berdibek&background=dc2626&color=fff",
        description: "Новый член команды, специализирующийся на кроссплатформенной разработке",
        email: "berdibek@12jerseys.kz",
        linkedin: "#",
      },
    ]
  }
}

export default new ApiService()
