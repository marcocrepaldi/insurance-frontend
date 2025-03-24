'use client'

import { useEffect, useState } from 'react'
import { User } from '@/schemas/user'
import { UserTable } from './user-table'

export function UsersClientPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('jwt_token')
        if (!token) throw new Error('Token JWT não encontrado.')

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error('Erro ao buscar usuários.')

        const data = await res.json()
        setUsers(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) return <p className="p-4">Carregando usuários...</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>

  return <UserTable data={users} />
}
