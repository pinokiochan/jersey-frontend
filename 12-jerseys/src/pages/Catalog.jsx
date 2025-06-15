"use client"

import { useState, useEffect } from "react"
import { Search, Grid, List, SlidersHorizontal } from "lucide-react"
import ProductCard from "../components/ProductCard"
import LoadingSpinner from "../components/LoadingSpinner"

export default function Catalog() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [sortBy, setSortBy] = useState("name")
  const [showFilters, setShowFilters] = useState(false)

  // Mock products data
  const mockProducts = [
    {
      id: 1,
      name: "Manchester United Retro",
      team: "Manchester United",
      color: "Красный",
      price: 25000,
      image: "/placeholder.svg?height=300&width=300",
      description: "Классическое ретро джерси Manchester United в современной интерпретации",
      stock: 15,
    },
    {
      id: 2,
      name: "Arsenal Vintage",
      team: "Arsenal",
      color: "Красный",
      price: 22000,
      image: "/placeholder.svg?height=300&width=300",
      description: "Винтажное джерси Arsenal с уникальным дизайном",
      stock: 8,
    },
    {
      id: 3,
      name: "Liverpool Classic",
      team: "Liverpool",
      color: "Красный",
      price: 23000,
      image: "/placeholder.svg?height=300&width=300",
      description: "Классическое джерси Liverpool для истинных фанатов",
      stock: 12,
    },
    {
      id: 4,
      name: "Chelsea Modern",
      team: "Chelsea",
      color: "Синий",
      price: 24000,
      image: "/placeholder.svg?height=300&width=300",
      description: "Современное джерси Chelsea с инновационным дизайном",
      stock: 20,
    },
    {
      id: 5,
      name: "Barcelona Heritage",
      team: "Barcelona",
      color: "Синий",
      price: 26000,
      image: "/placeholder.svg?height=300&width=300",
      description: "Наследие Barcelona в современном исполнении",
      stock: 5,
    },
    {
      id: 6,
      name: "Real Madrid Elite",
      team: "Real Madrid",
      color: "Белый",
      price: 28000,
      image: "/placeholder.svg?height=300&width=300",
      description: "Элитное джерси Real Madrid для особых случаев",
      stock: 0,
    },
  ]

  useEffect(() => {
    // Simulate API call
    const loadProducts = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setProducts(mockProducts)
      setFilteredProducts(mockProducts)
      setLoading(false)
    }

    loadProducts()
  }, [])

  useEffect(() => {
    let filtered = [...products]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.team.toLowerCase().includes(searchQuery.toLowerCase()),
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

    // Price filter
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedTeam, selectedColor, priceRange, sortBy])

  const teams = [...new Set(products.map((p) => p.team))]
  const colors = [...new Set(products.map((p) => p.color))]

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTeam("")
    setSelectedColor("")
    setPriceRange([0, 50000])
    setSortBy("name")
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
          <p className="text-gray-600">Найди своё идеальное джерси из нашей коллекции</p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию или команде..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
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
              </select>

              {/* View Mode */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-white text-red-600 shadow-sm" : "text-gray-600"
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list" ? "bg-white text-red-600 shadow-sm" : "text-gray-600"
                  }`}
                >
                  <List size={20} />
                </button>
              </div>

              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-colors ${
                  showFilters ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <SlidersHorizontal size={20} />
                <span>Фильтры</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Team Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Команда</label>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Цвет</label>
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

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Цена: ₸{priceRange[0].toLocaleString()} - ₸{priceRange[1].toLocaleString()}
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button onClick={clearFilters} className="text-red-600 hover:text-red-700 font-medium">
                  Сбросить фильтры
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Найдено {filteredProducts.length} из {products.length} товаров
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Товары не найдены</h3>
            <p className="text-gray-600 mb-6">Попробуйте изменить параметры поиска или фильтры</p>
            <button
              onClick={clearFilters}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
            }`}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
