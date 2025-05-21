"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import { authService } from "../api/authApi"

interface IUser {
  username: string
  password: string
}

interface AuthContextType {
  user: IUser | null
  loading: boolean
  login: (user: IUser) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async ({ username, password }: IUser) => {
    try {
      const token = await authService.login({ username, password })
      if (!token) throw new Error("No token returned")
      localStorage.setItem("token", token)
      setUser({ username, password }) // ideally replace with real user info from backend
      localStorage.setItem("user", JSON.stringify({ username, password }))
      return { success: true }
    } catch (e) {
      return { success: false, error: "Invalid login or password" }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
