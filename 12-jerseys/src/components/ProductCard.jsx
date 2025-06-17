"use client"

import { useState } from "react"
import { ShoppingCart, Heart, Eye, Tag } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useWishlist } from "../context/WishlistContext"
import { useToast } from "../context/ToastContext"

export default function ProductCard({ product, viewMode = "grid" }) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [selectedSize, setSelectedSize] = useState("M")
  const { addToCart, isLoading, getAvailableQuantity } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { showCartSuccess, showError, showWishlistSuccess } = useToast()
  const navigate = useNavigate()

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const availableQuantity = getAvailableQuantity(product.id, selectedSize, product.stock)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (availableQuantity === 0) {
      showError(`Товар "${product.name}" размера ${selectedSize} уже в корзине в максимальном количестве`)
      return
    }

    try {
      const result = await addToCart(product, selectedSize)

      if (result && result.success) {
        showCartSuccess(result.message || `${product.name} (${selectedSize}) добавлен в корзину`, "Товар добавлен!")
      } else {
        showError(result?.error || "Ошибка при добавлении в корзину")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      showError("Произошла ошибка при добавлении товара")
    }
  }

  const handleToggleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const wasAdded = toggleWishlist(product)
    if (wasAdded) {
      showWishlistSuccess(`${product.name} добавлен в избранное`, "Добавлено в избранное!")
    } else {
      showWishlistSuccess(`${product.name} удален из избранного`, "Удалено из избранного")
    }
  }

  const handleViewProduct = (e) => {
    e.preventDefault()
    navigate(`/product/${product.id}`)
  }

  if (viewMode === "list") {
    return (
      <div
        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleViewProduct}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-48 h-48 flex-shrink-0">
            {!imageError ? (
              <img
                src={product.image || product.imageUrl || "/placeholder.svg?height=200&width=200"}
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  isHovered ? "scale-105" : "scale-100"
                } ${imageLoading ? "opacity-0" : "opacity-100"}`}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true)
                  setImageLoading(false)
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Tag className="text-gray-400" size={20} />
                  </div>
                  <p className="text-xs text-gray-400">No Image</p>
                </div>
              </div>
            )}

            {imageLoading && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}

            {/* Stock Badge */}
            {product.stock < 5 && product.stock > 0 && (
              <div className="absolute top-3 left-3">
                <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  Осталось {product.stock}
                </span>
              </div>
            )}

            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">Нет в наличии</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
                  {product.name}
                </h3>
                <button
                  onClick={handleToggleLike}
                  className={`p-2 rounded-full transition-all ${
                    isInWishlist(product.id)
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600"
                  }`}
                >
                  <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {product.team}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600 text-sm">{product.color}</span>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2 mb-4">{product.description}</p>

              <div className="flex items-center gap-2 mb-4">
                <label className="text-sm font-medium text-gray-700">Размер:</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-black text-red-600">₸{Number(product.price).toLocaleString()}</p>
                {product.stock > 0 && <p className="text-xs text-gray-500">В наличии: {product.stock} шт.</p>}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleViewProduct}
                  className="p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  title="Просмотр"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isLoading || availableQuantity === 0}
                  className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center space-x-2 ${
                    product.stock === 0 || isLoading || availableQuantity === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700 hover:scale-105 shadow-lg shadow-red-600/25"
                  }`}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      <span>В корзину</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid view (default)
  return (
    <div
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewProduct}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-50">
        {!imageError ? (
          <img
            src={product.image || product.imageUrl || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-300 ${
              isHovered ? "scale-110" : "scale-100"
            } ${imageLoading ? "opacity-0" : "opacity-100"}`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true)
              setImageLoading(false)
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <Tag className="text-gray-400" size={24} />
              </div>
              <p className="text-sm text-gray-400 font-medium">No Image Available</p>
            </div>
          </div>
        )}

        {imageLoading && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}

        {/* Overlay with quick actions */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-3 transition-opacity duration-300 ${
            isHovered && !imageLoading ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={handleViewProduct}
            className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            title="Быстрый просмотр"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={handleToggleLike}
            className={`p-3 rounded-full transition-all shadow-lg ${
              isInWishlist(product.id)
                ? "bg-red-600 text-white"
                : "bg-white text-gray-900 hover:bg-red-600 hover:text-white"
            }`}
            title="Добавить в избранное"
          >
            <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Stock Badge */}
        {product.stock < 5 && product.stock > 0 && (
          <div className="absolute top-3 left-3">
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              Осталось {product.stock}
            </span>
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              Нет в наличии
            </span>
          </div>
        )}

        {/* Like Button - Always Visible */}
        <button
          onClick={handleToggleLike}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all shadow-lg ${
            isInWishlist(product.id)
              ? "bg-red-600 text-white"
              : "bg-white/90 text-gray-700 hover:bg-red-600 hover:text-white backdrop-blur-sm"
          }`}
          title="Добавить в избранное"
        >
          <Heart size={16} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-2">
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{product.team}</span>
            <span className="text-gray-400 text-xs">•</span>
            <span className="text-gray-600 text-xs">{product.color}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <label className="text-sm font-medium text-gray-700">Размер:</label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-black text-red-600 mb-1">₸{Number(product.price).toLocaleString()}</p>
            {product.stock > 0 && <p className="text-xs text-gray-500">В наличии</p>}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isLoading || availableQuantity === 0}
            className={`p-3 rounded-xl font-bold transition-all duration-300 ${
              product.stock === 0 || isLoading || availableQuantity === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : `${
                    isHovered
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/25 scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-red-600 hover:text-white"
                  }`
            }`}
            title={
              product.stock === 0
                ? "Нет в наличии"
                : availableQuantity === 0
                  ? "Максимум в корзине"
                  : "Добавить в корзину"
            }
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : (
              <ShoppingCart size={18} />
            )}
          </button>
        </div>

        {/* Stock warning for low inventory */}
        {product.stock > 0 && product.stock < 5 && (
          <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-xs text-orange-700 font-medium text-center">
              ⚡ Торопись! Осталось всего {product.stock} шт.
            </p>
          </div>
        )}

        {/* Quick product info on hover */}
        {isHovered && product.description && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border-l-4 border-red-600">
            <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}
