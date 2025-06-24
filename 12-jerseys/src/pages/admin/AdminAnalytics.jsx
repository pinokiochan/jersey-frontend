"use client"

import { useState, useEffect } from "react"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Download,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"
import dataService from "../../services/dataService"

const AdminAnalytics = () => {
  const [timeFilter, setTimeFilter] = useState("30d")
  const [analytics, setAnalytics] = useState({
    revenue: {
      current: 0,
      previous: 0,
      growth: 0,
    },
    orders: {
      current: 0,
      previous: 0,
      growth: 0,
    },
    customers: {
      current: 0,
      previous: 0,
      growth: 0,
    },
    avgOrderValue: {
      current: 0,
      previous: 0,
      growth: 0,
    },
  })

  const [topProducts, setTopProducts] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  const timeOptions = [
    { value: "7d", label: "7 дней" },
    { value: "30d", label: "30 дней" },
    { value: "90d", label: "90 дней" },
    { value: "1y", label: "1 год" },
  ]

  // Load analytics data
  useEffect(() => {
    loadAnalytics()
  }, [timeFilter])

  const loadAnalytics = () => {
    setLoading(true)
    try {
      const products = dataService.getProducts()
      const users = dataService.getUsers()
      const orders = dataService.getOrders()

      // Calculate real analytics
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
      const totalOrders = orders.length
      const totalUsers = users.length
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      // Mock previous period data (in real app, this would be historical data)
      const previousRevenue = totalRevenue * 0.85
      const previousOrders = Math.floor(totalOrders * 0.9)
      const previousUsers = Math.floor(totalUsers * 0.88)
      const previousAvgOrderValue = avgOrderValue * 0.92

      setAnalytics({
        revenue: {
          current: totalRevenue,
          previous: previousRevenue,
          growth: previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0,
        },
        orders: {
          current: totalOrders,
          previous: previousOrders,
          growth: previousOrders > 0 ? ((totalOrders - previousOrders) / previousOrders) * 100 : 0,
        },
        customers: {
          current: totalUsers,
          previous: previousUsers,
          growth: previousUsers > 0 ? ((totalUsers - previousUsers) / previousUsers) * 100 : 0,
        },
        avgOrderValue: {
          current: avgOrderValue,
          previous: previousAvgOrderValue,
          growth:
            previousAvgOrderValue > 0 ? ((avgOrderValue - previousAvgOrderValue) / previousAvgOrderValue) * 100 : 0,
        },
      })

      // Get top products by sales
      const topProductsData = products
        .filter((p) => p.sold > 0)
        .sort((a, b) => (b.sold || 0) - (a.sold || 0))
        .slice(0, 5)
        .map((product) => ({
          name: product.name,
          sales: product.sold || 0,
          revenue: (product.sold || 0) * product.price,
          growth: Math.random() * 30 - 10, // Mock growth data
        }))

      setTopProducts(topProductsData)

      // Generate recent activity from orders and users
      const activities = []

      // Add recent orders
      orders.slice(0, 3).forEach((order) => {
        activities.push({
          type: "order",
          message: `Новый заказ ${order.id}`,
          time: getTimeAgo(order.date),
          amount: order.total,
        })
      })

      // Add recent user registrations
      users.slice(-2).forEach((user) => {
        activities.push({
          type: "user",
          message: `Новый пользователь ${user.name} зарегистрирован`,
          time: getTimeAgo(user.joinDate),
        })
      })

      // Add low stock alerts
      const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5)
      lowStockProducts.slice(0, 2).forEach((product) => {
        activities.push({
          type: "product",
          message: `Товар '${product.name}' заканчивается (${product.stock} шт.)`,
          time: "1 час назад",
        })
      })

      setRecentActivity(activities.sort(() => Math.random() - 0.5).slice(0, 5))
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Только что"
    if (diffInHours < 24) return `${diffInHours} час${diffInHours > 1 ? "а" : ""} назад`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} дн${diffInDays > 1 ? "я" : "ь"} назад`

    return date.toLocaleDateString("ru-RU")
  }

  const getGrowthColor = (growth) => {
    return growth >= 0 ? "text-green-600" : "text-red-600"
  }

  const getGrowthIcon = (growth) => {
    return growth >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case "order":
        return <ShoppingBag size={16} className="text-blue-600" />
      case "user":
        return <Users size={16} className="text-green-600" />
      case "product":
        return <Package size={16} className="text-orange-600" />
      default:
        return <Activity size={16} className="text-gray-600" />
    }
  }

  const exportAnalytics = () => {
    const data = {
      period: timeOptions.find((opt) => opt.value === timeFilter)?.label,
      revenue: analytics.revenue,
      orders: analytics.orders,
      customers: analytics.customers,
      avgOrderValue: analytics.avgOrderValue,
      topProducts: topProducts,
      generatedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analytics-${timeFilter}.json`
    a.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загружаем аналитику...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Аналитика и отчеты</h1>
          <p className="text-gray-600">Анализ производительности и ключевых метрик</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
          >
            {timeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={exportAnalytics}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={16} />
            <span>Экспорт</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className={`flex items-center space-x-1 ${getGrowthColor(analytics.revenue.growth)}`}>
              {getGrowthIcon(analytics.revenue.growth)}
              <span className="text-sm font-medium">
                {analytics.revenue.growth > 0 ? "+" : ""}
                {analytics.revenue.growth.toFixed(1)}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Выручка</p>
            <p className="text-2xl font-bold text-gray-900">₽{analytics.revenue.current.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">
              Предыдущий период: ₽{analytics.revenue.previous.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
            <div className={`flex items-center space-x-1 ${getGrowthColor(analytics.orders.growth)}`}>
              {getGrowthIcon(analytics.orders.growth)}
              <span className="text-sm font-medium">
                {analytics.orders.growth > 0 ? "+" : ""}
                {analytics.orders.growth.toFixed(1)}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Заказы</p>
            <p className="text-2xl font-bold text-gray-900">{analytics.orders.current}</p>
            <p className="text-sm text-gray-500 mt-1">Предыдущий период: {analytics.orders.previous}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className={`flex items-center space-x-1 ${getGrowthColor(analytics.customers.growth)}`}>
              {getGrowthIcon(analytics.customers.growth)}
              <span className="text-sm font-medium">
                {analytics.customers.growth > 0 ? "+" : ""}
                {analytics.customers.growth.toFixed(1)}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Клиенты</p>
            <p className="text-2xl font-bold text-gray-900">{analytics.customers.current}</p>
            <p className="text-sm text-gray-500 mt-1">Предыдущий период: {analytics.customers.previous}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <div className={`flex items-center space-x-1 ${getGrowthColor(analytics.avgOrderValue.growth)}`}>
              {getGrowthIcon(analytics.avgOrderValue.growth)}
              <span className="text-sm font-medium">
                {analytics.avgOrderValue.growth > 0 ? "+" : ""}
                {analytics.avgOrderValue.growth.toFixed(1)}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Средний чек</p>
            <p className="text-2xl font-bold text-gray-900">
              ₽{Math.round(analytics.avgOrderValue.current).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Предыдущий период: ₽{Math.round(analytics.avgOrderValue.previous).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Топ товары</h2>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            {topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-red-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.sales} продаж</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₽{product.revenue.toLocaleString()}</p>
                      <div className={`flex items-center space-x-1 ${getGrowthColor(product.growth)}`}>
                        {getGrowthIcon(product.growth)}
                        <span className="text-sm font-medium">
                          {product.growth > 0 ? "+" : ""}
                          {product.growth.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Нет данных о продажах</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Последняя активность</h2>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500">{activity.time}</p>
                        {activity.amount && (
                          <p className="text-sm font-semibold text-green-600">₽{activity.amount.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Нет активности</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">График производительности</h2>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg">Выручка</button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Заказы</button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Клиенты</button>
          </div>
        </div>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">График будет отображаться здесь</p>
            <p className="text-sm text-gray-400">Интеграция с библиотекой графиков</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAnalytics
