"use client"

import { Component } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Что-то пошло не так</h2>
            <p className="text-gray-600 mb-6">Произошла ошибка при загрузке страницы. Попробуйте обновить страницу.</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <RefreshCw size={18} />
              <span>Обновить страницу</span>
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
