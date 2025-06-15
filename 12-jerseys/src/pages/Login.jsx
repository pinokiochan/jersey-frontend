"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const { login, loading, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || "/"

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "Email обязателен"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Неверный формат email"
    }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен"
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      const result = await login(formData.email, formData.password)
      if (result.success) {
        navigate(from, { replace: true })
      }
    } catch (err) {
      console.error("Login error:", err)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-4 mb-8 group">
            <div className="relative">
              <span className="text-5xl font-black text-gray-900 tracking-tighter">12</span>
              <div className="absolute -bottom-1 left-0 w-full h-1 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></div>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-600 uppercase tracking-wider">Jerseys</div>
              <div className="text-xs text-gray-400 -mt-0.5">The 12th Man</div>
            </div>
          </Link>

          <h1 className="text-3xl font-black text-gray-900 mb-2">Добро пожаловать!</h1>
          <p className="text-gray-600">Войдите в свой аккаунт, чтобы продолжить</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email адрес
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${
                    errors.email ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${
                    errors.password ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                  placeholder="Введите пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 disabled:scale-100"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Войти</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Нет аккаунта?{" "}
              <Link to="/register" className="text-red-600 hover:text-red-700 font-semibold transition-colors">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800 font-medium mb-2">Демо-доступ:</p>
          <p className="text-sm text-blue-700">Email: demo@jerseys.com</p>
          <p className="text-sm text-blue-700">Пароль: любой (мин. 6 символов)</p>
        </div>
      </div>
    </main>
  )
}
