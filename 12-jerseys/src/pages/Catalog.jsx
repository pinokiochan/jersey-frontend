"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Search, Grid, List, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import ProductCard from "../components/ProductCard"
import LoadingSpinner from "../components/LoadingSpinner"

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [selectedTeam, setSelectedTeam] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [sortBy, setSortBy] = useState("name")

  // МЕСТО ДЛЯ ВАШИХ ТОВАРОВ - замените этот массив на ваши данные
  const mockProducts = [
    {
      id: 1,
      name: "Manchester United Retro",
      team: "Manchester United",
      color: "Красный",
      price: 25000,
      image: "/assets/manu.png?height=300&width=300",
      description: "Классическое ретро джерси Manchester United в современной интерпретации с премиальными материалами",
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
      image: "/assets/arsenal.png?height=300&width=300",
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
      image: "/assets/liverpool.png?height=300&width=300",
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
      image: "/assets/chelsea.png?height=300&width=300",
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
      image: "/assets/barcelona.jpg?height=300&width=300",
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
      image: "/assets/realmadrid.png?height=300&width=300",
      description: "Элитное джерси Real Madrid для особых случаев с премиальной отделкой",
      stock: 10,
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
      image: "/assets/psg.png?height=300&width=300",
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
      image: "/assets/bayernmunchen.png?height=300&width=300",
      description: "Классическое джерси Bayern Munich с традиционным баварским дизайном",
      stock: 18,
      category: "classic",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 9,
      name: "Atletico Madrid Classic",
      team: "Atletico Madrid",
      color: "Красный",
      price: 21500,
      image: "/assets/atleticom.png?height=300&width=300",
      description: "Классическое джерси Atletico Madrid с традиционным баварским дизайном",
      stock: 14,
      category: "classic",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 10,
      name: "Japan Vintage",
      team: "Japan",
      color: "Красный",
      price: 26500,
      image: "/assets/japan.jpg?height=300&width=300",
      description: "Винтажное джерси Japan с уникальным дизайном и аутентичными деталями",
      stock: 28,
      category: "vintage",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 11,
      name: "Milan Retro",
      team: "Milan",
      color: "Красный",
      price: 20500,
      image: "/assets/milan.png?height=300&width=300",
      description: "Классическое ретро джерси Milan в современной интерпретации с премиальными материалами",
      stock: 18,
      category: "retro",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 12,
      name: "Italy Retro",
      team: "Italy",
      color: "White",
      price: 28500,
      image: "/assets/italy.png?height=300&width=300",
      description: "Классическое ретро джерси Italy в современной интерпретации с премиальными материалами",
      stock: 8,
      category: "retro",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 13,
      name: "Germany Classic",
      team: "Germany",
      color: "White",
      price: 24500,
      image: "/assets/germany.png?height=300&width=300",
      description: "Классическое джерси Germany с традиционным баварским дизайном",
      stock: 20,
      category: "classic",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 14,
      name: "Manchester City Modern",
      team: "Manchester City",
      color: "White",
      price: 27500,
      image: "/assets/mancity.jpg?height=300&width=300",
      description: "Современное джерси Manchester City с инновационным дизайном и технологичными материалами",
      stock: 4,
      category: "modern",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 15,
      name: "Borussia Dortmund Classic",
      team: "Borussia Dortmund",
      color: "Yellow",
      price: 29500,
      image: "/assets/borussia.jpg?height=300&width=300",
      description: "Классическое джерси Borussia Dortmund с традиционным баварским дизайном",
      stock: 1,
      category: "classic",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 16,
      name: "Kairat Elite",
      team: "Kairat",
      color: "Yellow",
      price: 25500,
      image: "/assets/girona.png?height=300&width=300",
      description: "Элитное джерси Kairat для особых случаев с премиальной отделкой",
      stock: 0,
      category: "elite",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 17,
      name: "Juventus Vintage",
      team: "Juventus",
      color: "Black",
      price: 22500,
      image: "/assets/juventus.jpg?height=300&width=300",
      description: "Винтажное джерси Juventus с уникальным дизайном и аутентичными деталями",
      stock: 3,
      category: "vintage",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 18,
      name: "Inter Heritage",
      team: "Inter",
      color: "White",
      price: 21500,
      image: "/assets/inter.jpg?height=300&width=300",
      description: "Наследие Inter в современном исполнении с традиционными цветами клуба",
      stock: 5,
      category: "heritage",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 19,
      name: "Tottenham hotspur Classic",
      team: "Tottenham hotspur",
      color: "White",
      price: 27500,
      image: "/assets/tottenham.png?height=300&width=300",
      description: "Классическое джерси Tottenham hotspur с традиционным баварским дизайном",
      stock: 11,
      category: "classic",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 20,
      name: "Portugal Elite",
      team: "Portugal",
      color: "Red",
      price: 24500,
      image: "/assets/portugal.png?height=300&width=300",
      description: "Элитное джерси Portugal для особых случаев с премиальной отделкой",
      stock: 10,
      category: "elite",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 21,
      name: "Argentina Heritage",
      team: "Argentina",
      color: "Blue",
      price: 21500,
      image: "/assets/argentina.png?height=300&width=300",
      description: "Наследие Argentina в современном исполнении с традиционными цветами клуба",
      stock: 13,
      category: "heritage",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 22,
      name: "England Modern",
      team: "England",
      color: "White",
      price: 20500,
      image: "/assets/england.png?height=300&width=300",
      description: "Современное джерси England с инновационным дизайном и технологичными материалами",
      stock: 17,
      category: "modern",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 23,
      name: "Russia Classic",
      team: "Russia",
      color: "Red",
      price: 26500,
      image: "/assets/russia.png?height=300&width=300",
      description: "Классическое джерси Russia с традиционным баварским дизайном",
      stock: 16,
      category: "classic",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 24,
      name: "Roma Classic",
      team: "Roma",
      color: "Brown",
      price: 28500,
      image: "/assets/roma.png?height=300&width=300",
      description: "Классическое джерси Roma с традиционным баварским дизайном",
      stock: 22,
      category: "classic",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 25,
      name: "Brasil Elite",
      team: "Brasil",
      color: "Yellow",
      price: 29500,
      image: "/assets/brasil.png?height=300&width=300",
      description: "Элитное джерси Brasil для особых случаев с премиальной отделкой",
      stock: 16,
      category: "elite",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 26,
      name: "France Modern",
      team: "France",
      color: "Blue",
      price: 25500,
      image: "/assets/france.png?height=300&width=300",
      description: "Современное джерси France с инновационным дизайном и технологичными материалами",
      stock: 20,
      category: "modern",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 27,
      name: "Real Betis Classic",
      team: "Real Betis",
      color: "Green",
      price: 28500,
      image: "/assets/betis.png?height=300&width=300",
      description: "Классическое джерси Real Betis с традиционным баварским дизайном",
      stock: 14,
      category: "classic",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 28,
      name: "Napoli Heritage",
      team: "Napoli",
      color: "Blue",
      price: 23500,
      image: "/assets/napoli.png?height=300&width=300",
      description: "Наследие Napoli в современном исполнении с традиционными цветами клуба",
      stock: 15,
      category: "heritage",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 29,
      name: "Sporting Retro",
      team: "Sporting",
      color: "Green",
      price: 24500,
      image: "/assets/sporting.png?height=300&width=300",
      description: "Классическое ретро джерси Sporting в современной интерпретации с премиальными материалами",
      stock: 13,
      category: "retro",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
    {
      id: 30,
      name: "Porto Retro",
      team: "Porto",
      color: "Blue",
      price: 22500,
      image: "/assets/porto.png?height=300&width=300",
      description: "Классическое ретро джерси Porto в современной интерпретации с премиальными материалами",
      stock: 10,
      category: "retro",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      featured: false,
    },
  ]

  // Get unique filter options
  const teams = [...new Set(products.map((p) => p.team))].sort()
  const colors = [...new Set(products.map((p) => p.color))].sort()
  const categories = [...new Set(products.map((p) => p.category))].sort()

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 0))
        setProducts(mockProducts)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = [...products]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.team.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query),
      )
    }

    // Team filter
    if (selectedTeam) {
      filtered = filtered.filter((product) => product.team === selectedTeam)
    }

    // Color filter
    if (selectedColor) {
      filtered = filtered.filter((product) => product.color === selectedColor)
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter((product) => product.price >= Number(priceRange.min))
    }
    if (priceRange.max) {
      filtered = filtered.filter((product) => product.price <= Number(priceRange.max))
    }

    // Sort
    switch (sortBy) {
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

    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [products, searchQuery, selectedTeam, selectedColor, selectedCategory, priceRange, sortBy])

  // Handle search from URL params
  useEffect(() => {
    const searchFromUrl = searchParams.get("search")
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl)
    }
  }, [searchParams])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTeam("")
    setSelectedColor("")
    setSelectedCategory("")
    setPriceRange({ min: "", max: "" })
    setSortBy("name")
    setSearchParams({})
    setCurrentPage(1)
  }

  const hasActiveFilters =
    searchQuery || selectedTeam || selectedColor || selectedCategory || priceRange.min || priceRange.max

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Загружаем каталог...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Каталог</h1>
          <p className="text-gray-600 text-lg">
            Найдено {filteredProducts.length} из {products.length} товаров
            {filteredProducts.length > 0 && (
              <span className="ml-2 text-sm">
                (страница {currentPage} из {totalPages})
              </span>
            )}
          </p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск джерси..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="name">По названию</option>
                <option value="price-low">Цена: по возрастанию</option>
                <option value="price-high">Цена: по убыванию</option>
                <option value="stock">По наличию</option>
              </select>

              {/* View Mode */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white text-red-600 shadow-sm" : "text-gray-600"
                    }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-white text-red-600 shadow-sm" : "text-gray-600"
                    }`}
                >
                  <List size={20} />
                </button>
              </div>

              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                <SlidersHorizontal size={20} />
                <span>Фильтры</span>
                {hasActiveFilters && <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Фильтры</h3>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-red-600 hover:text-red-700 text-sm font-medium">
                      Очистить
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Team Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Команда</label>
                    <select
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    >
                      <option value="">Все команды</option>
                      {teams.map((team) => (
                        <option key={team} value={team}>
                          {team}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Color Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Цвет</label>
                    <select
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    >
                      <option value="">Все цвета</option>
                      {colors.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Категория</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    >
                      <option value="">Все категории</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Цена (₸)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        placeholder="От"
                        className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        placeholder="До"
                        className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="text-gray-400" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Товары не найдены</h3>
                <p className="text-gray-600 mb-6">Попробуйте изменить параметры поиска или фильтры</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Очистить фильтры
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Products */}
                <div
                  className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}
                >
                  {currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} viewMode={viewMode} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex flex-col items-center space-y-4">
                    {/* Page Info */}
                    <div className="text-sm text-gray-600">
                      Показано {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} из{" "}
                      {filteredProducts.length} товаров
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center space-x-2">
                      {/* Previous Button */}
                      <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg border transition-colors ${currentPage === 1
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-red-600 hover:text-red-600"
                          }`}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center space-x-1">
                        {getPageNumbers().map((page, index) => (
                          <div key={index}>
                            {page === "..." ? (
                              <span className="px-3 py-2 text-gray-400">...</span>
                            ) : (
                              <button
                                onClick={() => goToPage(page)}
                                className={`px-4 py-2 rounded-lg border transition-colors ${currentPage === page
                                  ? "border-red-600 bg-red-600 text-white"
                                  : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-red-600 hover:text-red-600"
                                  }`}
                              >
                                {page}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg border transition-colors ${currentPage === totalPages
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-red-600 hover:text-red-600"
                          }`}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>

                    {/* Quick Jump to Page */}
                    {totalPages > 10 && (
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-600">Перейти на страницу:</span>
                        <input
                          type="number"
                          min="1"
                          max={totalPages}
                          value={currentPage}
                          onChange={(e) => {
                            const page = Number.parseInt(e.target.value)
                            if (page >= 1 && page <= totalPages) {
                              goToPage(page)
                            }
                          }}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                        <span className="text-gray-600">из {totalPages}</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
