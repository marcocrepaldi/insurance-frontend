'use client'

import * as React from 'react'
import { User, userSchema } from '@/schemas/user'
import { toast } from 'sonner'
import { fetchUsers } from '@/lib/api/users'
import { DataTableUser } from '@/components/tables/data-table-user'
import { z } from 'zod'

export default function UserPage() {
  const [users, setUsers] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers()
        // Usar z.array(userSchema) para validar os dados
        const validated = z.array(userSchema).parse(data)
        setUsers(validated)
      } catch (err) {
        // Exibe uma mensagem de erro com toast e define um array vazio como fallback
        toast.error('Erro ao carregar usuários. Por favor, tente novamente.')
        console.error(err)
        setUsers([]) // Fallback caso a validação falhe ou a requisição falhe
      } finally {
        setLoading(false)
      }
    }

    getUsers()
  }, [])

  if (loading) return <div className="p-6">Carregando usuários...</div>

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Usuários</h1>
      <DataTableUser data={users} />
    </div>
  )
}
