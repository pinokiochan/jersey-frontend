"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from "lucide-react"
import { useAuth } from "../context/AuthContext"

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const { register, loading, error } = useAuth()
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Имя обязательно"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Имя должно содержать минимум 2 символа"
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Подтверждение пароля обязательно"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают"
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "Необходимо согласиться с условиями"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      const result = await register({
        name: formData.name.trim(),
        email: formData.email,
        password: formData.password,
      })

      if (result.success) {
        navigate("/")
      }
    } catch (err) {
      console.error("Registration error:", err)
    }
  }

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "", color: "" }

    let strength = 0
    if (password.length >= 6) strength++
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++
    if (password.match(/\d/)) strength++
    if (password.match(/[^a-zA-Z\d]/)) strength++

    const levels = [
      { strength: 0, text: "", color: "" },
      { strength: 1, text: "Слабый", color: "text-red-600" },
      { strength: 2, text: "Средний", color: "text-yellow-600" },
      { strength: 3, text: "Хороший", color: "text-blue-600" },
      { strength: 4, text: "Отличный", color: "text-green-600" },
    ]

    return levels[strength]
  }

  const passwordStrength = getPasswordStrength(formData.password)

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

          <h1 className="text-3xl font-black text-gray-900 mb-2">Создать аккаунт</h1>
          <p className="text-gray-600">Присоединяйтесь к команде "12"</p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Полное имя
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${
                    errors.name ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                  placeholder="Ваше имя"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

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
                  placeholder="Минимум 6 символов"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formData.password && passwordStrength.text && (
                <p className={`mt-1 text-sm ${passwordStrength.color}`}>Сложность пароля: {passwordStrength.text}</p>
              )}
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Подтвердите пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${
                    errors.confirmPassword ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                  placeholder="Повторите пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="mt-1 text-sm text-green-600 flex items-center space-x-1">
                  <CheckCircle size={16} />
                  <span>Пароли совпадают</span>
                </p>
              )}
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Terms Agreement */}
            <div>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-600"
                />
                <span className="text-sm text-gray-600">
                  Я согласен с{" "}
                  <Link to="/terms" className="text-red-600 hover:text-red-700 font-medium">
                    условиями использования
                  </Link>{" "}
                  и{" "}
                  <Link to="/privacy" className="text-red-600 hover:text-red-700 font-medium">
                    политикой конфиденциальности
                  </Link>
                </span>
              </label>
              {errors.agreeToTerms && <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>}
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
                  <span>Создать аккаунт</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Уже есть аккаунт?{" "}
              <Link to="/login" className="text-red-600 hover:text-red-700 font-semibold transition-colors">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
