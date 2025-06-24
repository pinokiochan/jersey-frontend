"use client"

import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!user?.isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
