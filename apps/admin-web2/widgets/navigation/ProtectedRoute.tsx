"use client"

import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../shared/context/AuthContext"

export default function ProtectedRoute({ children } : any) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
