"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertTriangle,
  Download,
  Grid,
  List,
  Star,
  TrendingUp,
  TrendingDown,
  X,
  Save,
} from "lucide-react"
import dataService from "../../services/dataService"
import { useToast } from "../../context/ToastContext"
import ConfirmModal from "../../components/ConfirmModal"

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [selectedProducts, setSelectedProducts] = useState([])
  const [viewMode, setViewMode] = useState("table")
  const [showProductModal, setShowProductModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "danger",
    onConfirm: null,
  })

  const { showSuccess, showError } = useToast()

  const categories = ["all", "retro", "vintage", "classic", "modern", "heritage", "elite", "limited"]
  const statusOptions = [
    { value: "all", label: "Все статусы" },
    { value: "active", label: "Активные" },
    { value: "inactive", label: "Неактивные" },
    { value: "draft", label: "Черновики" },
  ]

  const stockOptions = [
    { value: "all", label: "Все товары" },
    { value: "in_stock", label: "В наличии" },
    { value: "low_stock", label: "Мало на складе" },
    { value: "out_of_stock", label: "Нет в наличии" },
  ]

  // Load products on component mount
  useEffect(() => {
    loadProducts()
  }, [])

  // Filter products when filters change
  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, categoryFilter, statusFilter, stockFilter])

  const loadProducts = () => {
    const loadedProducts = dataService.getProducts()
    setProducts(loadedProducts)
  }

  const filterProducts = () => {
    let filtered = [...products]

    if (searchTerm) {
      filtered = dataService.searchProducts(searchTerm)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((product) => product.category === categoryFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((product) => product.status === statusFilter)
    }

    if (stockFilter !== "all") {
      switch (stockFilter) {
        case "in_stock":
          filtered = filtered.filter((product) => product.stock > 10)
          break
        case "low_stock":
          filtered = filtered.filter((product) => product.stock > 0 && product.stock <= 10)
          break
        case "out_of_stock":
          filtered = filtered.filter((product) => product.stock === 0)
          break
      }
    }

    setFilteredProducts(filtered)
  }

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setFormData({
      name: "",
      team: "",
      category: "retro",
      price: "",
      cost: "",
      stock: "",
      description: "",
      status: "active",
      sizes: ["S", "M", "L", "XL"],
      color: "",
      image: "/placeholder.svg?height=300&width=300",
    })
    setIsEditing(true)
    setShowProductModal(true)
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(product)
    setFormData({ ...product })
    setIsEditing(true)
    setShowProductModal(true)
  }

  const handleViewProduct = (product) => {
    setSelectedProduct(product)
    setFormData({ ...product })
    setIsEditing(false)
    setShowProductModal(true)
  }

  const handleSaveProduct = () => {
    try {
      if (selectedProduct) {
        // Update existing product
        const updatedProduct = dataService.updateProduct(selectedProduct.id, formData)
        if (updatedProduct) {
          loadProducts()
          setShowProductModal(false)
          showSuccess("Товар успешно обновлен!")
        }
      } else {
        // Add new product
        const newProduct = dataService.addProduct({
          ...formData,
          price: Number.parseFloat(formData.price),
          cost: Number.parseFloat(formData.cost),
          stock: Number.parseInt(formData.stock),
          sold: 0,
          rating: 4.5,
          featured: false,
        })
        if (newProduct) {
          loadProducts()
          setShowProductModal(false)
          showSuccess("Товар успешно добавлен!")
        }
      }
    } catch (error) {
      console.error("Error saving product:", error)
      showError("Ошибка при сохранении товара")
    }
  }

  const handleDeleteProduct = (productId) => {
    const product = products.find((p) => p.id === productId)
    setConfirmModal({
      isOpen: true,
      title: "Удалить товар",
      message: `Вы уверены, что хотите удалить товар "${product?.name}"? Это действие нельзя отменить.`,
      type: "danger",
      onConfirm: () => {
        try {
          dataService.deleteProduct(productId)
          loadProducts()
          showSuccess("Товар успешно удален!")
        } catch (error) {
          console.error("Error deleting product:", error)
          showError("Ошибка при удалении товара")
        }
      },
    })
  }

  const handleBulkAction = (action) => {
    if (selectedProducts.length === 0) return

    const getActionConfig = (action) => {
      switch (action) {
        case "activate":
          return {
            title: "Активировать товары",
            message: `Вы хотите активировать ${selectedProducts.length} товаров?`,
            type: "info",
          }
        case "deactivate":
          return {
            title: "Деактивировать товары",
            message: `Вы хотите деактивировать ${selectedProducts.length} товаров?`,
            type: "warning",
          }
        case "delete":
          return {
            title: "Удалить товары",
            message: `Вы уверены, что хотите удалить ${selectedProducts.length} товаров? Это действие нельзя отменить.`,
            type: "danger",
          }
        default:
          return {
            title: "Подтвердите действие",
            message: "Вы уверены?",
            type: "info",
          }
      }
    }

    const config = getActionConfig(action)

    setConfirmModal({
      isOpen: true,
      ...config,
      onConfirm: () => {
        try {
          selectedProducts.forEach((productId) => {
            switch (action) {
              case "activate":
                dataService.updateProduct(productId, { status: "active" })
                break
              case "deactivate":
                dataService.updateProduct(productId, { status: "inactive" })
                break
              case "delete":
                dataService.deleteProduct(productId)
                break
            }
          })
          loadProducts()
          setSelectedProducts([])
          showSuccess(`Операция выполнена для ${selectedProducts.length} товаров`)
        } catch (error) {
          console.error("Error performing bulk action:", error)
          showError("Ошибка при выполнении операции")
        }
      },
    })
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Нет в наличии", color: "text-red-600 bg-red-50" }
    if (stock <= 10) return { text: "Мало на складе", color: "text-yellow-600 bg-yellow-50" }
    return { text: "В наличии", color: "text-green-600 bg-green-50" }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50"
      case "inactive":
        return "text-red-600 bg-red-50"
      case "draft":
        return "text-gray-600 bg-gray-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Активный"
      case "inactive":
        return "Неактивный"
      case "draft":
        return "Черновик"
      default:
        return status
    }
  }

  const calculateProfit = (price, cost) => {
    return (((price - cost) / price) * 100).toFixed(1)
  }

  const toggleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const selectAllProducts = () => {
    setSelectedProducts(
      selectedProducts.length === filteredProducts.length ? [] : filteredProducts.map((product) => product.id),
    )
  }

  const exportProducts = () => {
    const csvContent = [
      ["ID", "Название", "Команда", "Категория", "Цена", "Остаток", "Статус"].join(","),
      ...filteredProducts.map((product) =>
        [
          product.id,
          product.name,
          product.team,
          product.category,
          product.price,
          product.stock,
          getStatusText(product.status),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "products.csv"
    a.click()
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Управление товарами</h1>
          <p className="text-gray-600">Управляйте каталогом товаров и инвентарем</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportProducts}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={16} />
            <span>Экспорт</span>
          </button>
          <button
            onClick={handleAddProduct}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus size={16} />
            <span>Добавить товар</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Всего товаров</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Активные</p>
              <p className="text-2xl font-bold text-gray-900">{products.filter((p) => p.status === "active").length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Мало на складе</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter((p) => p.stock > 0 && p.stock <= 10).length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Нет в наличии</p>
              <p className="text-2xl font-bold text-gray-900">{products.filter((p) => p.stock === 0).length}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Поиск товаров..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            >
              <option value="all">Все категории</option>
              {categories.slice(1).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            >
              {stockOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-3">
            {selectedProducts.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Выбрано: {selectedProducts.length}</span>
                <button
                  onClick={() => handleBulkAction("activate")}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                >
                  Активировать
                </button>
                <button
                  onClick={() => handleBulkAction("deactivate")}
                  className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                >
                  Деактивировать
                </button>
                <button
                  onClick={() => handleBulkAction("delete")}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                >
                  Удалить
                </button>
              </div>
            )}

            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "table" ? "bg-white text-red-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid" ? "bg-white text-red-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={selectAllProducts}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-600"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Товар
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Цена</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Остаток
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Продано
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock)
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-600"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">
                            {product.team} • {product.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">₽{product.price?.toLocaleString()}</div>
                        {product.cost && (
                          <div className="text-sm text-gray-500">
                            Прибыль: {calculateProfit(product.price, product.cost)}%
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}
                      >
                        {product.stock} шт.
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">{product.sold || 0}</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-500">{product.rating || 4.5}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}
                      >
                        {getStatusText(product.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewProduct(product)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Просмотреть"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Редактировать"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Удалить"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Товары не найдены</h3>
            <p className="mt-1 text-sm text-gray-500">Попробуйте изменить параметры поиска или фильтры.</p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {isEditing ? (selectedProduct ? "Редактировать товар" : "Добавить товар") : "Просмотр товара"}
                </h2>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Название</label>
                    <input
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Команда</label>
                    <input
                      type="text"
                      value={formData.team || ""}
                      onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Категория</label>
                    <select
                      value={formData.category || ""}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-50"
                    >
                      {categories.slice(1).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Цвет</label>
                    <input
                      type="text"
                      value={formData.color || ""}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Цена (₽)</label>
                    <input
                      type="number"
                      value={formData.price || ""}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Себестоимость (₽)</label>
                    <input
                      type="number"
                      value={formData.cost || ""}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Остаток</label>
                    <input
                      type="number"
                      value={formData.stock || ""}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Изображение</label>
                  <div className="space-y-3">
                    <input
                      type="url"
                      value={formData.image || ""}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      disabled={!isEditing}
                      placeholder="URL изображения или выберите файл"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-50"
                    />
                    {isEditing && (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onload = (event) => {
                                setFormData({ ...formData, image: event.target.result })
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                        <p className="text-xs text-gray-500 mt-1">Поддерживаются форматы: JPG, PNG, GIF</p>
                      </div>
                    )}
                    {formData.image && (
                      <div className="mt-2">
                        <img
                          src={formData.image || "/placeholder.svg"}
                          alt="Предварительный просмотр"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=128&width=128"
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Статус</label>
                  <select
                    value={formData.status || ""}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-50"
                  >
                    <option value="active">Активный</option>
                    <option value="inactive">Неактивный</option>
                    <option value="draft">Черновик</option>
                  </select>
                </div>
              </div>

              {isEditing && (
                <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowProductModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleSaveProduct}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Save size={16} />
                    <span>Сохранить</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText={confirmModal.type === "danger" ? "Удалить" : "Подтвердить"}
        cancelText="Отмена"
      />
    </div>
  )
}

export default AdminProducts
