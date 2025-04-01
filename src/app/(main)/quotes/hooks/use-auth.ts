'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface Role {
  id: string
  name: string
}

interface User {
  id: string
  name: string
  email: string
  role: Role
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const logout = useCallback(() => {
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
    router.push('/login')
  }, [router])

  useEffect(() => {
    const storedToken =
      localStorage.getItem('jwt_token') || localStorage.getItem('token')

    if (!storedToken || !API_URL) {
      console.warn('⚠️ Token JWT ou API URL não definidos.')
      setLoading(false)
      return
    }

    axios
      .get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then((res) => {
        if (res?.data?.id) {
          setUser(res.data)
          setToken(storedToken)
          localStorage.setItem('user', JSON.stringify(res.data))
          localStorage.setItem('token', storedToken)
        } else {
          console.warn('⚠️ Dados inválidos no /auth/me. Executando logout.')
          logout()
        }
      })
      .catch((err) => {
        console.error('❌ Erro ao autenticar usuário:', err)
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
