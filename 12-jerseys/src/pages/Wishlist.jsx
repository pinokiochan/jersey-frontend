"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Heart, ShoppingBag, ArrowLeft, Grid, List } from "lucide-react"
import { useWishlist } from "../context/WishlistContext"
import ProductCard from "../components/ProductCard"

export default function Wishlist() {
  const { wishlistItems, clearWishlist } = useWishlist()
  const [viewMode, setViewMode] = useState("grid")

  if (wishlistItems.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="text-gray-400" size={32} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Список избранного пуст</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Добавьте товары в избранное, чтобы вернуться к ним позже
            </p>
            <Link
              to="/catalog"
              className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Перейти в каталог</span>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/catalog"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Вернуться в каталог</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">Избранное</h1>
              <p className="text-gray-600">
                {wishlistItems.length} {wishlistItems.length === 1 ? "товар" : "товара"} в избранном
              </p>
            </div>

            <div className="flex items-center gap-4">
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

              <button onClick={clearWishlist} className="text-red-600 hover:text-red-700 font-medium">
                Очистить список
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-6"
          }
        >
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} viewMode={viewMode} />
          ))}
        </div>

        {/* Cart Link */}
        <div className="mt-12 text-center">
          <Link
            to="/cart"
            className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold transition-colors"
          >
            <ShoppingBag size={20} />
            <span>Перейти в корзину</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
