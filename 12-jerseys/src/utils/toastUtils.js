"use client"

import { useToast } from "../context/ToastContext"

// Helper function to show success toast
export const showSuccess = (message, title = "Успешно!") => {
  const { showSuccess: showSuccessToast } = useToast()
  return showSuccessToast(message, title)
}

// Helper function to show error toast
export const showError = (message, title = "Ошибка!") => {
  const { showError: showErrorToast } = useToast()
  return showErrorToast(message, title)
}

// Helper function to show info toast
export const showInfo = (message, title = "Информация") => {
  const { showInfo: showInfoToast } = useToast()
  return showInfoToast(message, title)
}

// Helper function to show cart success toast
export const showCartSuccess = (message, title = "Добавлено в корзину!") => {
  const { showCartSuccess: showCartSuccessToast } = useToast()
  return showCartSuccessToast(message, title)
}

// Helper function to show wishlist success toast
export const showWishlistSuccess = (message, title = "Избранное") => {
  const { showWishlistSuccess: showWishlistSuccessToast } = useToast()
  return showWishlistSuccessToast(message, title)
}
