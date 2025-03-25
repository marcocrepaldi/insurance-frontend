"use client"

import { useEffect, useState } from "react"
import { User } from "@/schemas/user"
import { UserTable } from "./user-table"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

export function UsersClientPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("jwt_token")
        if (!token) {
          throw new Error("Token JWT não encontrado. Faça login novamente.")
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            throw new Error("Acesso negado. Você não tem permissão para visualizar esta página.")
          } else {
            throw new Error(`Erro ao buscar usuários. [HTTP ${res.status}]`)
          }
        }

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

  if (error) {
    return (
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <UserTable data={users} />
}
