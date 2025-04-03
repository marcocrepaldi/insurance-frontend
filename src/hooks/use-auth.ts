import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function useAuth() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (!storedToken || !API_URL) {
      setLoading(false)
      return
    }

    axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${storedToken}` },
    }).then((res) => {
      setUser(res.data)
      setToken(storedToken)
    }).catch(() => {
      logout()
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  const logout = () => {
    localStorage.clear()
    setUser(null)
    setToken(null)
    router.push('/login')
  }

  return { user, token, loading, logout, isAuthenticated: !!user && !!token }
}