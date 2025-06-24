"use client"

import { X, AlertTriangle, Trash2, Check } from "lucide-react"

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Подтвердите действие",
  message = "Вы уверены, что хотите выполнить это действие?",
  confirmText = "Подтвердить",
  cancelText = "Отмена",
  type = "danger", // danger, warning, info
}) => {
  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: <Trash2 className="w-6 h-6 text-red-600" />,
          iconBg: "bg-red-100",
          confirmBtn: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
        }
      case "warning":
        return {
          icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
          iconBg: "bg-yellow-100",
          confirmBtn: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
        }
      default:
        return {
          icon: <Check className="w-6 h-6 text-blue-600" />,
          iconBg: "bg-blue-100",
          confirmBtn: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
        }
    }
  }

  const typeStyles = getTypeStyles()

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        {/* Modal */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${typeStyles.iconBg}`}>
                {typeStyles.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Message */}
          <div className="mb-6">
            <p className="text-gray-600 leading-relaxed">{message}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm()
                onClose()
              }}
              className={`px-4 py-2 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${typeStyles.confirmBtn}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
