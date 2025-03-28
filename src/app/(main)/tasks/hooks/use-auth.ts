'use client'

import { useEffect, useState } from 'react'

interface AuthUser {
  id: string
  name: string
  [key: string]: any
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        console.log('[useAuth] Usuário carregado:', parsedUser)
      } catch (error) {
        console.error('[useAuth] Erro ao parsear user do localStorage:', error)
      }
    } else {
      console.warn('[useAuth] Nenhum usuário encontrado no localStorage.')
    }

    setIsLoading(false)
  }, [])

  return {
    user,
    userId: user?.id ?? null,
    isLoading,
    isAuthenticated: !!user,
  }
}
