"use client"

import { createContext, useContext, useState } from "react"
import { CheckCircle, AlertCircle, Info, X, ShoppingCart, Heart } from "lucide-react"

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

const ToastContainer = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

const Toast = ({ toast, onClose }) => {
  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle size={20} className="text-green-600" />
      case "error":
        return <AlertCircle size={20} className="text-red-600" />
      case "info":
        return <Info size={20} className="text-blue-600" />
      case "cart":
        return <ShoppingCart size={20} className="text-red-600" />
      case "wishlist":
        return <Heart size={20} className="text-pink-600" />
      default:
        return <Info size={20} className="text-gray-600" />
    }
  }

  const getStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "error":
        return "bg-red-50 border-red-200 text-red-800"
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800"
      case "cart":
        return "bg-red-50 border-red-200 text-red-800"
      case "wishlist":
        return "bg-pink-50 border-pink-200 text-pink-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  return (
    <div
      className={`flex items-center space-x-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm animate-fade-in max-w-sm ${getStyles()}`}
    >
      {getIcon()}
      <div className="flex-1">
        {toast.title && <div className="font-semibold text-sm">{toast.title}</div>}
        <div className="text-sm">{toast.message}</div>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
        <X size={16} />
      </button>
    </div>
  )
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = ({ type = "info", title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random()
    const newToast = { id, type, title, message, duration }

    setToasts((prev) => [...prev, newToast])

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id)
    }, duration)

    return id
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const showSuccess = (message, title = "Успешно!") => {
    return addToast({ type: "success", title, message })
  }

  const showError = (message, title = "Ошибка!") => {
    return addToast({ type: "error", title, message })
  }

  const showInfo = (message, title = "Информация") => {
    return addToast({ type: "info", title, message })
  }

  const showCartSuccess = (message, title = "Добавлено в корзину!") => {
    return addToast({ type: "cart", title, message })
  }

  const showWishlistSuccess = (message, title = "Избранное") => {
    return addToast({ type: "wishlist", title, message })
  }

  const value = {
    addToast,
    removeToast,
    showSuccess,
    showError,
    showInfo,
    showCartSuccess,
    showWishlistSuccess,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}
