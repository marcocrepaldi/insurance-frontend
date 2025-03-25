import { useEffect, useState } from "react"

// ✅ Interface com tipagem do cliente (pode ser movida para um arquivo types.ts se for reaproveitada)
export interface Client {
    id: string
    name: string
    document: string
    birthDate: string // formato ISO: "1990-05-15"
    phone: string
    email: string
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
    documents: string[] // caminhos de arquivos PDF, JPEG, etc.
    indicatedById: string | null
    isActive: boolean
    createdAt: string // ISO Date
    updatedAt: string // ISO Date
  }
  

// ✅ Hook personalizado para buscar clientes da API
export function useFetchClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Função interna para buscar os dados
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
          headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${token}`, // descomente se necessário
          },
          cache: "no-store", // ⛔️ Evita cache e força dados atualizados
        })

        if (!response.ok) {
          throw new Error(`Erro ${response.status} ao buscar clientes`)
        }

        const data: Client[] = await response.json()
        setClients(data)
      } catch (err: any) {
        console.error("Erro ao buscar clientes:", err)
        setError(err.message || "Erro inesperado")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { clients, loading, error }
}
