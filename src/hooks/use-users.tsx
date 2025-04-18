"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { userSchema } from "../schemas/users-schema"
import { mapUserToTableItem, tableSchema } from "@/lib/mapUsersToTable"

const userListSchema = z.array(userSchema)
const API_URL = process.env.NEXT_PUBLIC_API_URL

export function useUsersForTable() {
  const [data, setData] = useState<z.infer<typeof tableSchema>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!API_URL) {
      setError("❌ API URL não configurada corretamente.")
      setLoading(false)
      return
    }

    const token = localStorage.getItem("jwt_token")

    if (!token) {
      console.warn("⚠️ JWT token não encontrado no localStorage")
      setLoading(false)
      return
    }

    fetch(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorJson = await res.json()
          throw new Error(
            `[${res.status}] ${res.statusText} - ${JSON.stringify(errorJson)}`
          )
        }

        const json = await res.json()
        const payload = Array.isArray(json) ? json : json.data
        try {
          const parsed = userListSchema.parse(payload)
          const mapped = parsed.map(mapUserToTableItem)
          setData(mapped)
        } catch (err) {
          setError("Erro ao processar os dados recebidos.")
          console.error("❌ Invalid data:", err)
        }
      })
      .catch((err) => {
        setError("❌ Falha ao carregar os usuários.")
        console.error("❌ Failed to load users:", err)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div>Carregando...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!data || data.length === 0) {
    return <div>Nenhum usuário encontrado.</div>
  }

  return { data, loading, error }
}
