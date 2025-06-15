"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard } from "lucide-react"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  // Debug logging
  useEffect(() => {
    console.log("Cart component rendered with items:", cartItems)
  }, [cartItems])

  const handleQuantityChange = (cartId, newQuantity) => {
    updateQuantity(cartId, newQuantity)
  }

  const handleRemoveItem = (cartId) => {
    removeFromCart(cartId)
  }

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      // Redirect to login with return path
      return
    }

    setIsCheckingOut(true)

    // Simulate checkout process
    setTimeout(() => {
      alert("Заказ оформлен! Спасибо за покупку!")
      clearCart()
      setIsCheckingOut(false)
    }, 2000)
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="text-gray-400" size={32} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Корзина пуста</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Добавьте товары в корзину, чтобы оформить заказ</p>
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/catalog"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Продолжить покупки</span>
          </Link>

          <h1 className="text-4xl font-black text-gray-900 mb-2">Корзина</h1>
          <p className="text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? "товар" : "товара"} в корзине
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              // Add validation for required fields
              if (!item.cartId || !item.name || !item.price) {
                console.warn("Invalid cart item:", item)
                return null
              }

              return (
                <div key={item.cartId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg?height=100&width=100"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span>{item.team}</span>
                        <span>•</span>
                        <span>{item.color}</span>
                        <span>•</span>
                        <span>Размер: {item.selectedSize}</span>
                      </div>
                      <div className="text-xl font-black text-red-600">₸{Number(item.price).toLocaleString()}</div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(item.cartId, item.quantity - 1)}
                        className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>

                      <button
                        onClick={() => handleQuantityChange(item.cartId, item.quantity + 1)}
                        className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.cartId)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Итого</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Товары ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
                  </span>
                  <span className="font-semibold">₸{getCartTotal().toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Доставка</span>
                  <span className="font-semibold text-green-600">Бесплатно</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-gray-900">К оплате</span>
                    <span className="font-black text-red-600">₸{getCartTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {!isAuthenticated ? (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    state={{ from: { pathname: "/cart" } }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Войти для оформления</span>
                  </Link>
                  <p className="text-sm text-gray-600 text-center">
                    Или{" "}
                    <Link to="/register" className="text-red-600 hover:text-red-700 font-semibold">
                      создайте аккаунт
                    </Link>
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center space-x-2"
                >
                  {isCheckingOut ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      <span>Оформить заказ</span>
                    </>
                  )}
                </button>
              )}

              <div className="mt-4 text-center">
                <button
                  onClick={clearCart}
                  className="text-gray-500 hover:text-red-600 text-sm font-medium transition-colors"
                >
                  Очистить корзину
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
