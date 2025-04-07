import { useEffect, useState } from "react"

// ✅ Tipo Client centralizado (ideal manter em types.ts ou models.ts para reuso)
export interface Client {
  id: string
  name: string
  document: string
  birthDate: string | null // formato ISO (pode ser null)
  phone: string | null
  email: string | null
  street: string | null
  number: string | null
  complement: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  documents: string[]
  indicatedById: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// ✅ Hook para buscar clientes
export function useFetchClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
          headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${token}`, // se necessário
          },
          cache: "no-store", // força dados atualizados
        })

        if (!response.ok) {
          throw new Error(`Erro ${response.status} ao buscar clientes`)
        }

        const data: Client[] = await response.json()
        setClients(data)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Erro inesperado"
        console.error("Erro ao buscar clientes:", message)
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  return { clients, loading, error }
}
