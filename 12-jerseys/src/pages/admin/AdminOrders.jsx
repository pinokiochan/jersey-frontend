"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Download,
  Eye,
  Trash2,
  Check,
  X,
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import dataService from "../../services/dataService"
import { useToast } from "../../context/ToastContext"
import ConfirmModal from "../../components/ConfirmModal"

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrders, setSelectedOrders] = useState([])
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const { showSuccess, showError } = useToast()

  // Confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [confirmData, setConfirmData] = useState(null)

  const statusOptions = [
    { value: "all", label: "Все статусы" },
    { value: "pending", label: "Ожидает" },
    { value: "processing", label: "Обрабатывается" },
    { value: "shipped", label: "Отправлен" },
    { value: "completed", label: "Выполнен" },
    { value: "cancelled", label: "Отменен" },
  ]

  // Load orders on component mount
  useEffect(() => {
    loadOrders()
  }, [])

  // Filter orders when filters change
  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  const loadOrders = () => {
    const loadedOrders = dataService.getOrdersForAdmin()
    setOrders(loadedOrders)
  }

  const filterOrders = () => {
    let filtered = [...orders]

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200"
      case "processing":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "shipped":
        return "text-purple-600 bg-purple-50 border-purple-200"
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Выполнен"
      case "processing":
        return "Обрабатывается"
      case "shipped":
        return "Отправлен"
      case "pending":
        return "Ожидает"
      case "cancelled":
        return "Отменен"
      default:
        return status
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} />
      case "processing":
        return <Package size={16} />
      case "shipped":
        return <Truck size={16} />
      case "pending":
        return <Clock size={16} />
      case "cancelled":
        return <XCircle size={16} />
      default:
        return <AlertCircle size={16} />
    }
  }

  const updateOrderStatus = (orderId, newStatus) => {
    try {
      dataService.updateOrder(orderId, { status: newStatus })
      loadOrders() // Reload orders
      showSuccess(`Статус заказа изменен на "${getStatusText(newStatus)}"`)
    } catch (error) {
      console.error("Error updating order status:", error)
      showError("Ошибка при изменении статуса заказа")
    }
  }

  // Confirmation handlers
  const handleConfirmAction = () => {
    if (!confirmAction) return

    try {
      switch (confirmAction.type) {
        case "bulkAccept":
          selectedOrders.forEach((orderId) => {
            dataService.updateOrder(orderId, { status: "processing" })
          })
          showSuccess(`Принято ${selectedOrders.length} заказов`)
          break

        case "bulkDecline":
          selectedOrders.forEach((orderId) => {
            dataService.updateOrder(orderId, { status: "cancelled" })
          })
          showSuccess(`Отклонено ${selectedOrders.length} заказов`)
          break

        case "bulkDelete":
          const orders = dataService.getOrders()
          const filtered = orders.filter((order) => !selectedOrders.includes(order.id))
          dataService.saveOrders(filtered)
          showSuccess(`Удалено ${selectedOrders.length} заказов`)
          break

        case "singleAccept":
          dataService.updateOrder(confirmData.orderId, { status: "processing" })
          showSuccess("Заказ принят")
          break

        case "singleDecline":
          dataService.updateOrder(confirmData.orderId, { status: "cancelled" })
          showSuccess("Заказ отклонен")
          break
      }

      loadOrders()
      setSelectedOrders([])
    } catch (error) {
      console.error("Error performing action:", error)
      showError("Ошибка при выполнении операции")
    }

    setShowConfirmModal(false)
    setConfirmAction(null)
    setConfirmData(null)
  }

  const handleBulkAction = (action) => {
    if (selectedOrders.length === 0) return

    const actionConfig = {
      accept: {
        type: "bulkAccept",
        title: "Принятие заказов",
        message: `Вы уверены, что хотите принять ${selectedOrders.length} заказов?`,
        confirmText: "Принять",
        confirmType: "success",
      },
      decline: {
        type: "bulkDecline",
        title: "Отклонение заказов",
        message: `Вы уверены, что хотите отклонить ${selectedOrders.length} заказов?`,
        confirmText: "Отклонить",
        confirmType: "warning",
      },
      delete: {
        type: "bulkDelete",
        title: "Удаление заказов",
        message: `Вы уверены, что хотите удалить ${selectedOrders.length} заказов? Это действие нельзя отменить.`,
        confirmText: "Удалить",
        confirmType: "danger",
      },
    }

    setConfirmAction(actionConfig[action])
    setShowConfirmModal(true)
  }

  const handleSingleAction = (action, orderId) => {
    const actionConfig = {
      accept: {
        type: "singleAccept",
        title: "Принятие заказа",
        message: "Вы уверены, что хотите принять этот заказ?",
        confirmText: "Принять",
        confirmType: "success",
      },
      decline: {
        type: "singleDecline",
        title: "Отклонение заказа",
        message: "Вы уверены, что хотите отклонить этот заказ?",
        confirmText: "Отклонить",
        confirmType: "warning",
      },
    }

    setConfirmAction(actionConfig[action])
    setConfirmData({ orderId })
    setShowConfirmModal(true)
  }

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  const selectAllOrders = () => {
    setSelectedOrders(selectedOrders.length === filteredOrders.length ? [] : filteredOrders.map((order) => order.id))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const exportOrders = () => {
    const csvContent = [
      ["ID", "Клиент", "Email", "Сумма", "Статус", "Дата"].join(","),
      ...filteredOrders.map((order) =>
        [
          order.id,
          order.customer.name,
          order.customer.email,
          order.total,
          getStatusText(order.status),
          formatDate(order.date),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "orders.csv"
    a.click()
    showSuccess("Данные заказов экспортированы!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Управление заказами</h1>
          <p className="text-gray-600">Просматривайте и управляйте всеми заказами</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportOrders}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={16} />
            <span>Экспорт</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Всего заказов</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ожидают</p>
              <p className="text-2xl font-bold text-gray-900">{orders.filter((o) => o.status === "pending").length}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Выполнены</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter((o) => o.status === "completed").length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Общая сумма</p>
              <p className="text-2xl font-bold text-gray-900">
                ₽{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
              </p>
            </div>
            <Truck className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Поиск по ID, клиенту или email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {selectedOrders.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Выбрано: {selectedOrders.length}</span>
              <button
                onClick={() => handleBulkAction("accept")}
                className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                <Check size={14} />
                <span>Принять</span>
              </button>
              <button
                onClick={() => handleBulkAction("decline")}
                className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <X size={14} />
                <span>Отклонить</span>
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Trash2 size={14} />
                <span>Удалить</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={selectAllOrders}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-600"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Заказ
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сумма
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleOrderSelection(order.id)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-600"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{order.id}</div>
                      <div className="text-sm text-gray-500">{order.items?.length || 0} товар(ов)</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{order.customer?.name || "Неизвестный"}</div>
                      <div className="text-sm text-gray-500">{order.customer?.email || ""}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">₽{order.total?.toLocaleString() || 0}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(order.date)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowOrderModal(true)
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Просмотреть"
                      >
                        <Eye size={16} />
                      </button>
                      {order.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleSingleAction("accept", order.id)}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Принять"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => handleSingleAction("decline", order.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Отклонить"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Заказы не найдены</h3>
            <p className="mt-1 text-sm text-gray-500">Попробуйте изменить параметры поиска или фильтры.</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowOrderModal(false)}
            />

            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Детали заказа {selectedOrder.id}</h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(selectedOrder.status)}
                    <span className="font-medium">Статус заказа:</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}
                  >
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>

                {/* Customer Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Информация о клиенте</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Имя</label>
                      <p className="font-medium">{selectedOrder.customer?.name || "Неизвестный"}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <p className="font-medium">{selectedOrder.customer?.email || ""}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Телефон</label>
                      <p className="font-medium">{selectedOrder.customer?.phone || ""}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Адрес доставки</label>
                      <p className="font-medium">{selectedOrder.deliveryAddress || "Не указан"}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Товары</h4>
                  <div className="space-y-3">
                    {(selectedOrder.items || []).map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.size && `Размер: ${item.size} • `}Количество: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">₽{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Итого:</span>
                    <span>₽{selectedOrder.total?.toLocaleString() || 0}</span>
                  </div>
                </div>

                {/* Actions */}
                {selectedOrder.status === "pending" && (
                  <div className="flex items-center space-x-3 pt-4 border-t">
                    <button
                      onClick={() => {
                        handleSingleAction("accept", selectedOrder.id)
                        setShowOrderModal(false)
                      }}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Принять заказ
                    </button>
                    <button
                      onClick={() => {
                        handleSingleAction("decline", selectedOrder.id)
                        setShowOrderModal(false)
                      }}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Отклонить заказ
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false)
          setConfirmAction(null)
          setConfirmData(null)
        }}
        onConfirm={handleConfirmAction}
        title={confirmAction?.title || ""}
        message={confirmAction?.message || ""}
        confirmText={confirmAction?.confirmText || "Подтвердить"}
        type={confirmAction?.confirmType || "warning"}
      />
    </div>
  )
}

export default AdminOrders
