"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function useAuth() {
  const [user, setUser] = useState<any>(null) // 👈 substitua `any` por uma tipagem real se tiver
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // ✅ Função de logout estável com useCallback
  const logout = useCallback(() => {
    localStorage.clear()
    setUser(null)
    setToken(null)
    router.push("/login")
  }, [router])

  // ✅ Autentica com token do localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("jwt_token")

    if (!storedToken || !API_URL) {
      setLoading(false)
      return
    }

    axios
      .get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => {
        setUser(res.data)
        setToken(storedToken)
      })
      .catch(() => {
        logout()
      })
      .finally(() => {
        setLoading(false)
      })
  }, [logout])

  return {
    user,
    token,
    loading,
    logout,
    isAuthenticated: !!user && !!token,
  }
}
