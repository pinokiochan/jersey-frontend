"use client"

import { useState } from "react"
import { User, Mail, Calendar, Package, Settings, Edit3, Save, X, Eye, Truck, CheckCircle, Clock } from "lucide-react"
import { useAuth } from "../context/AuthContext"

export default function Profile() {
  const { user, updateUser, updateOrderStatus } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })

  const handleEditSubmit = (e) => {
    e.preventDefault()
    updateUser(editForm)
    setIsEditing(false)
  }

  const handleEditCancel = () => {
    setEditForm({
      name: user?.name || "",
      email: user?.email || "",
    })
    setIsEditing(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Доставлен":
        return "bg-green-100 text-green-800"
      case "В пути":
        return "bg-blue-100 text-blue-800"
      case "Обрабатывается":
        return "bg-yellow-100 text-yellow-800"
      case "Отменен":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Доставлен":
        return <CheckCircle size={16} />
      case "В пути":
        return <Truck size={16} />
      case "Обрабатывается":
        return <Clock size={16} />
      default:
        return <Package size={16} />
    }
  }

  const tabs = [
    { id: "profile", label: "Профиль", icon: User },
    { id: "orders", label: "Заказы", icon: Package },
    { id: "settings", label: "Настройки", icon: Settings },
  ]

  // Get user orders (from user object or empty array)
  const orders = user?.orders || []

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Личный кабинет</h1>
          <p className="text-gray-600">Управляйте своим аккаунтом и заказами</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="text-red-600" size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{user?.name}</h3>
                <p className="text-gray-600 text-sm">{user?.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${activeTab === tab.id ? "bg-red-600 text-white" : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <tab.icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                    {tab.id === "orders" && orders.length > 0 && (
                      <span
                        className={`ml-auto text-xs px-2 py-1 rounded-full ${activeTab === tab.id ? "bg-white bg-opacity-20" : "bg-red-100 text-red-600"
                          }`}
                      >
                        {orders.length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Информация профиля</h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium"
                      >
                        <Edit3 size={18} />
                        <span>Редактировать</span>
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleEditSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Полное имя</label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email адрес</label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
                          required
                        />
                      </div>

                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                          <Save size={18} />
                          <span>Сохранить</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleEditCancel}
                          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                          <X size={18} />
                          <span>Отмена</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center space-x-3 mb-2">
                            <User className="text-gray-400" size={20} />
                            <span className="text-sm font-medium text-gray-600">Имя</span>
                          </div>
                          <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center space-x-3 mb-2">
                            <Mail className="text-gray-400" size={20} />
                            <span className="text-sm font-medium text-gray-600">Email</span>
                          </div>
                          <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center space-x-3 mb-2">
                            <Calendar className="text-gray-400" size={20} />
                            <span className="text-sm font-medium text-gray-600">Дата регистрации</span>
                          </div>
                          <p className="text-lg font-semibold text-gray-900">
                            {new Date(user?.joinDate).toLocaleDateString("ru-RU")}
                          </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center space-x-3 mb-2">
                            <Package className="text-gray-400" size={20} />
                            <span className="text-sm font-medium text-gray-600">Всего заказов</span>
                          </div>
                          <p className="text-lg font-semibold text-gray-900">{orders.length}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">История заказов</h2>
                    {orders.length > 0 && (
                      <div className="text-sm text-gray-600">
                        Всего заказов: <span className="font-semibold">{orders.length}</span>
                      </div>
                    )}
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="text-gray-400 mx-auto mb-4" size={48} />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Заказов пока нет</h3>
                      <p className="text-gray-600 mb-6">Оформите первый заказ в нашем каталоге</p>
                      <a
                        href="/catalog"
                        className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                      >
                        <Package size={18} />
                        <span>Перейти в каталог</span>
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">Заказ {order.id}</h3>
                              <p className="text-gray-600">
                                {new Date(order.date).toLocaleDateString("ru-RU", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-2 mb-2">
                                {getStatusIcon(order.status)}
                                <span
                                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                                >
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-xl font-black text-red-600">₸{order.total.toLocaleString()}</p>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-3 mb-4">
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center space-x-3">
                                  {item.image && (
                                    <img
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.name}
                                      className="w-12 h-12 object-cover rounded-lg"
                                    />
                                  )}
                                  <div>
                                    <span className="font-medium text-gray-900">{item.name}</span>
                                    <div className="text-sm text-gray-600">
                                      {item.team} • Размер: {item.size} • Кол-во: {item.quantity}
                                    </div>
                                  </div>
                                </div>
                                <span className="font-semibold text-gray-900">₸{item.price.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>

                          {/* Order Details */}
                          <div className="border-t border-gray-200 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Адрес доставки:</span>
                                <p className="font-medium">{order.deliveryAddress}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Способ оплаты:</span>
                                <p className="font-medium">{order.paymentMethod}</p>
                              </div>
                            </div>
                          </div>

                          {/* Order Actions */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                            <div className="flex space-x-2">
                              {order.status === "Обрабатывается" && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, "Отменен")}
                                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                                >
                                  Отменить заказ
                                </button>
                              )}
                            </div>
                            <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600 text-sm font-medium">
                              <Eye size={16} />
                              <span>Подробнее</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Настройки аккаунта</h2>

                  <div className="space-y-6">
                    <div className="p-6 border border-gray-200 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Уведомления</h3>
                      <p className="text-gray-600 mb-4">Настройте, какие уведомления вы хотите получать</p>

                      <div className="space-y-4">
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700">Email уведомления о заказах</span>
                          <input type="checkbox" defaultChecked className="rounded text-red-600 focus:ring-red-600" />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700">Новости и акции</span>
                          <input type="checkbox" defaultChecked className="rounded text-red-600 focus:ring-red-600" />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700">SMS уведомления</span>
                          <input type="checkbox" className="rounded text-red-600 focus:ring-red-600" />
                        </label>
                      </div>
                    </div>

                    <div className="p-6 border border-gray-200 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Безопасность</h3>
                      <p className="text-gray-600 mb-4">Управление паролем и безопасностью аккаунта</p>

                      <div className="space-y-4">
                        <button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                          Изменить пароль
                        </button>
                        <button className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors ml-0 sm:ml-4">
                          Двухфакторная аутентификация
                        </button>
                      </div>
                    </div>

                    <div className="p-6 border border-red-200 rounded-xl bg-red-50">
                      <h3 className="text-lg font-semibold text-red-900 mb-2">Удаление аккаунта</h3>
                      <p className="text-red-700 mb-4">Это действие нельзя отменить. Все ваши данные будут удалены.</p>

                      <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                        Удалить аккаунт
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
