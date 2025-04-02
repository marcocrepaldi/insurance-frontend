"use client"

import { useEffect, useState } from "react"

export type Role = "Admin" | "User" | string

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
  [key: string]: any
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      const storedToken = localStorage.getItem("jwt_token")

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setToken(storedToken)
        console.log("[useAuth] Usuário carregado:", parsedUser)
      } else {
        console.warn("[useAuth] Usuário ou token não encontrados.")
      }
    } catch (error) {
      console.error("[useAuth] Erro ao carregar autenticação:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const isAdmin = user?.role === "Admin"
  const isAuthenticated = !!user && !!token

  return {
    user,
    userId: user?.id ?? null,
    token,
    isAdmin,
    isAuthenticated,
    isLoading,
  }
}
