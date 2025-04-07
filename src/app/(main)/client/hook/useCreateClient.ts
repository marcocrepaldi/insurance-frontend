import { useState } from "react"
import { Client } from "./type"

export interface CreateClientInput {
  name: string
  document: string
  birthDate?: string | null
  phone?: string | null
  email?: string | null
  street?: string | null
  number?: string | null
  complement?: string | null
  neighborhood?: string | null
  city?: string | null
  state?: string | null
  zipCode?: string | null
  indicatedById?: string | null
  isActive?: boolean
  documents?: string[]
}

export function useCreateClient() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const createClient = async (data: CreateClientInput): Promise<Client | null> => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const token = localStorage.getItem("jwt_token")

      if (!token) {
        throw new Error("Token JWT não encontrado. Faça login novamente.")
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null)
        throw new Error(errorBody?.message || "Erro ao criar cliente")
      }

      const createdClient: Client = await response.json()
      setSuccess(true)
      return createdClient
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido"
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    createClient,
    loading,
    error,
    success,
  }
}
