"use client"

import { useState, useEffect } from "react"
import {
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import dataService from "../../services/dataService"

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = () => {
    try {
      const data = dataService.getAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "Выполнен":
        return "text-green-600 bg-green-50"
      case "Обрабатывается":
        return "text-blue-600 bg-blue-50"
      case "Ожидает":
        return "text-yellow-600 bg-yellow-50"
      case "Отменен":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case "Выполнен":
        return <CheckCircle size={14} />
      case "Обрабатывается":
        return <Clock size={14} />
      case "Ожидает":
        return <AlertTriangle size={14} />
      default:
        return <Clock size={14} />
    }
  }

  return (
    <div className="space-y-4">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Добро пожаловать в панель администратора!</h1>
        <p className="text-red-100">Управляйте своим интернет-магазином джерси эффективно</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Общая выручка</p>
              <p className="text-2xl font-bold text-gray-900">₽{analytics?.totalRevenue?.toLocaleString() || "0"}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{analytics?.monthlyGrowth?.revenue || 0}% за месяц</span>
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Всего заказов</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.totalOrders || 0}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{analytics?.monthlyGrowth?.orders || 0}% за месяц</span>
              </div>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Клиенты</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.totalUsers || 0}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{analytics?.monthlyGrowth?.users || 0}% за месяц</span>
              </div>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Товары</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.totalProducts || 0}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{analytics?.monthlyGrowth?.products || 0}% за месяц</span>
              </div>
            </div>
            <Package className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Последние заказы</h3>
              <button className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center">
                Посмотреть все
                <ArrowUpRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics?.recentOrders?.length > 0 ? (
                analytics.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-500">{order.customerName || order.customerEmail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₽{order.total?.toLocaleString()}</p>
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}
                      >
                        {getOrderStatusIcon(order.status)}
                        <span>{order.status}</span>
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Нет заказов</h3>
                  <p className="mt-1 text-sm text-gray-500">Заказы появятся здесь после оформления</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Топ товары</h3>
              <button className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center">
                Посмотреть все
                <ArrowUpRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics?.topProducts?.length > 0 ? (
                analytics.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-red-600">#{index + 1}</span>
                      </div>
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.sold || 0} продаж</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₽{product.revenue?.toLocaleString()}</p>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-500 ml-1">{product.rating || 4.5}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Нет данных о продажах</h3>
                  <p className="mt-1 text-sm text-gray-500">Статистика появится после первых продаж</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Package className="w-6 h-6 text-blue-600" />
            <span className="font-medium text-blue-900">Добавить товар</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Users className="w-6 h-6 text-green-600" />
            <span className="font-medium text-green-900">Управление пользователями</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <ShoppingCart className="w-6 h-6 text-purple-600" />
            <span className="font-medium text-purple-900">Просмотр заказов</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <TrendingUp className="w-6 h-6 text-orange-600" />
            <span className="font-medium text-orange-900">Аналитика</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
