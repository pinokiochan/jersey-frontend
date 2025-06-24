"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Phone,
  Download,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  X,
  Save,
} from "lucide-react"
import dataService from "../../services/dataService"
import { useToast } from "../../context/ToastContext"
import ConfirmModal from "../../components/ConfirmModal"

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUsers, setSelectedUsers] = useState([])
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const { showSuccess, showError } = useToast()

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [bulkAction, setBulkAction] = useState(null)

  const roleOptions = [
    { value: "all", label: "Все роли" },
    { value: "customer", label: "Клиенты" },
    { value: "admin", label: "Администраторы" },
    { value: "manager", label: "Менеджеры" },
  ]

  const statusOptions = [
    { value: "all", label: "Все статусы" },
    { value: "active", label: "Активные" },
    { value: "inactive", label: "Неактивные" },
    { value: "banned", label: "Заблокированные" },
  ]

  // Load users on component mount
  useEffect(() => {
    loadUsers()
  }, [])

  // Filter users when filters change
  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, roleFilter, statusFilter])

  const loadUsers = () => {
    const loadedUsers = dataService.getUsers()
    setUsers(loadedUsers)
  }

  const filterUsers = () => {
    let filtered = [...users]

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm),
      )
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
  }

  const handleAddUser = () => {
    setSelectedUser(null)
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "customer",
      status: "active",
    })
    setIsEditing(true)
    setShowUserModal(true)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setFormData({ ...user })
    setIsEditing(true)
    setShowUserModal(true)
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setFormData({ ...user })
    setIsEditing(false)
    setShowUserModal(true)
  }

  const handleSaveUser = () => {
    try {
      if (selectedUser) {
        // Update existing user
        const updatedUser = dataService.updateUser(selectedUser.id, formData)
        if (updatedUser) {
          loadUsers()
          setShowUserModal(false)
          showSuccess("Пользователь успешно обновлен!")
        }
      } else {
        // Add new user
        const newUser = dataService.addUser({
          ...formData,
          avatar: `https://ui-avatars.com/api/?name=${formData.name}&background=dc2626&color=fff`,
          addresses: [],
          preferences: { notifications: true, newsletter: true, sms: false },
        })
        if (newUser) {
          loadUsers()
          setShowUserModal(false)
          showSuccess("Пользователь успешно добавлен!")
        }
      }
    } catch (error) {
      console.error("Error saving user:", error)
      showError("Ошибка при сохранении пользователя")
    }
  }

  const handleDeleteUser = (userId) => {
    const user = users.find((u) => u.id === userId)
    setUserToDelete(user)
    setShowConfirmModal(true)
  }

  const confirmDeleteUser = () => {
    if (userToDelete) {
      try {
        dataService.deleteUser(userToDelete.id)
        loadUsers()
        showSuccess("Пользователь успешно удален!")
      } catch (error) {
        console.error("Error deleting user:", error)
        showError("Ошибка при удалении пользователя")
      }
    }
    setUserToDelete(null)
  }

  const updateUserStatus = (userId, newStatus) => {
    try {
      dataService.updateUser(userId, { status: newStatus })
      loadUsers()
      showSuccess(`Статус пользователя изменен на "${getStatusText(newStatus)}"`)
    } catch (error) {
      console.error("Error updating user status:", error)
      showError("Ошибка при изменении статуса")
    }
  }

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) return
    setBulkAction(action)
    setShowConfirmModal(true)
  }

  const confirmBulkAction = () => {
    if (!bulkAction || selectedUsers.length === 0) return

    try {
      selectedUsers.forEach((userId) => {
        switch (bulkAction) {
          case "activate":
            dataService.updateUser(userId, { status: "active" })
            break
          case "deactivate":
            dataService.updateUser(userId, { status: "inactive" })
            break
          case "ban":
            dataService.updateUser(userId, { status: "banned" })
            break
          case "delete":
            dataService.deleteUser(userId)
            break
        }
      })
      loadUsers()
      setSelectedUsers([])
      showSuccess(`Операция выполнена для ${selectedUsers.length} пользователей`)
    } catch (error) {
      console.error("Error performing bulk action:", error)
      showError("Ошибка при выполнении операции")
    }
    setBulkAction(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50 border-green-200"
      case "inactive":
        return "text-gray-600 bg-gray-50 border-gray-200"
      case "banned":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Активный"
      case "inactive":
        return "Неактивный"
      case "banned":
        return "Заблокирован"
      default:
        return status
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle size={16} />
      case "inactive":
        return <Clock size={16} />
      case "banned":
        return <XCircle size={16} />
      default:
        return <Clock size={16} />
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "text-purple-600 bg-purple-50"
      case "manager":
        return "text-blue-600 bg-blue-50"
      case "customer":
        return "text-gray-600 bg-gray-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getRoleText = (role) => {
    switch (role) {
      case "admin":
        return "Администратор"
      case "manager":
        return "Менеджер"
      case "customer":
        return "Клиент"
      default:
        return role
    }
  }

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const selectAllUsers = () => {
    setSelectedUsers(selectedUsers.length === filteredUsers.length ? [] : filteredUsers.map((user) => user.id))
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

  const exportUsers = () => {
    const csvContent = [
      ["ID", "Имя", "Email", "Телефон", "Роль", "Статус", "Дата регистрации", "Заказов", "Потрачено"].join(","),
      ...filteredUsers.map((user) =>
        [
          user.id,
          user.name,
          user.email,
          user.phone,
          getRoleText(user.role),
          getStatusText(user.status),
          formatDate(user.joinDate),
          user.ordersCount,
          user.totalSpent,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "users.csv"
    a.click()
    showSuccess("Данные пользователей экспортированы!")
  }

  const getBulkActionTitle = () => {
    switch (bulkAction) {
      case "activate":
        return "Активация пользователей"
      case "deactivate":
        return "Деактивация пользователей"
      case "ban":
        return "Блокировка пользователей"
      case "delete":
        return "Удаление пользователей"
      default:
        return "Подтвердите действие"
    }
  }

  const getBulkActionMessage = () => {
    const count = selectedUsers.length
    switch (bulkAction) {
      case "activate":
        return `Вы уверены, что хотите активировать ${count} пользователей?`
      case "deactivate":
        return `Вы уверены, что хотите деактивировать ${count} пользователей?`
      case "ban":
        return `Вы уверены, что хотите заблокировать ${count} пользователей?`
      case "delete":
        return `Вы уверены, что хотите удалить ${count} пользователей? Это действие нельзя отменить.`
      default:
        return "Подтвердите выполнение операции"
    }
  }

  const getBulkActionConfirmText = () => {
    switch (bulkAction) {
      case "activate":
        return "Активировать"
      case "deactivate":
        return "Деактивировать"
      case "ban":
        return "Заблокировать"
      case "delete":
        return "Удалить"
      default:
        return "Подтвердить"
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Управление пользователями</h1>
          <p className="text-gray-600">Управляйте учетными записями пользователей</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportUsers}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={16} />
            <span>Экспорт</span>
          </button>
          <button
            onClick={handleAddUser}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus size={16} />
            <span>Добавить пользователя</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Всего пользователей</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Активные</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter((u) => u.status === "active").length}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Администраторы</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter((u) => u.role === "admin").length}</p>
            </div>
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Заблокированные</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter((u) => u.status === "banned").length}</p>
            </div>
            <UserX className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Поиск по имени, email или телефону..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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

          {selectedUsers.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Выбрано: {selectedUsers.length}</span>
              <button
                onClick={() => handleBulkAction("activate")}
                className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                <CheckCircle size={14} />
                <span>Активировать</span>
              </button>
              <button
                onClick={() => handleBulkAction("ban")}
                className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Ban size={14} />
                <span>Заблокировать</span>
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

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={selectAllUsers}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-600"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пользователь
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Контакты
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Роль</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Активность
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-600"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=dc2626&color=fff`
                        }}
                      />
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center space-x-1 text-sm text-gray-900">
                        <Mail size={14} />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                        <Phone size={14} />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}
                    >
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}
                    >
                      {getStatusIcon(user.status)}
                      <span>{getStatusText(user.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-gray-900">{user.ordersCount || 0} заказов</div>
                      <div className="text-gray-500">₽{(user.totalSpent || 0).toLocaleString()}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Вход: {user.lastLogin ? formatDate(user.lastLogin) : "Никогда"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Просмотреть"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Редактировать"
                      >
                        <Edit size={16} />
                      </button>
                      {user.status !== "banned" ? (
                        <button
                          onClick={() => updateUserStatus(user.id, "banned")}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Заблокировать"
                        >
                          <Ban size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => updateUserStatus(user.id, "active")}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Разблокировать"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Удалить"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Пользователи не найдены</h3>
            <p className="mt-1 text-sm text-gray-500">Попробуйте изменить параметры поиска или фильтры.</p>
          </div>
        )}
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {isEditing
                    ? selectedUser
                      ? "Редактировать пользователя"
                      : "Добавить пользователя"
                    : "Просмотр пользователя"}
                </h2>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
                    <input
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
                    <input
                      type="tel"
                      value={formData.phone || ""}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Роль</label>
                    <select
                      value={formData.role || ""}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-50"
                    >
                      <option value="customer">Клиент</option>
                      <option value="manager">Менеджер</option>
                      <option value="admin">Администратор</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Статус</label>
                  <select
                    value={formData.status || ""}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-50"
                  >
                    <option value="active">Активный</option>
                    <option value="inactive">Неактивный</option>
                    <option value="banned">Заблокирован</option>
                  </select>
                </div>

                {!isEditing && selectedUser && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Дата регистрации</label>
                      <div className="text-sm text-gray-900">{formatDate(selectedUser.joinDate)}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Последний вход</label>
                      <div className="text-sm text-gray-900">
                        {selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : "Никогда"}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Заказов</label>
                      <div className="text-sm text-gray-900">{selectedUser.ordersCount || 0}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Потрачено</label>
                      <div className="text-sm text-gray-900">₽{(selectedUser.totalSpent || 0).toLocaleString()}</div>
                    </div>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleSaveUser}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Save size={16} />
                    <span>Сохранить</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false)
          setUserToDelete(null)
          setBulkAction(null)
        }}
        onConfirm={userToDelete ? confirmDeleteUser : confirmBulkAction}
        title={userToDelete ? "Удаление пользователя" : getBulkActionTitle()}
        message={
          userToDelete
            ? `Вы уверены, что хотите удалить пользователя "${userToDelete.name}"? Это действие нельзя отменить.`
            : getBulkActionMessage()
        }
        confirmText={userToDelete ? "Удалить" : getBulkActionConfirmText()}
        type="danger"
      />
    </div>
  )
}

export default AdminUsers
