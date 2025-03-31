'use client'

import { useEffect, useState } from 'react'
import { z } from 'zod'

const clientSchema = z.object({
  id: z.string(),
  name: z.string(),
})

const clientsSchema = z.array(clientSchema)

export function useClients() {
  const [clients, setClients] = useState<z.infer<typeof clientSchema>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token =
      localStorage.getItem('jwt_token') || localStorage.getItem('token')
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    if (!token || !API_URL) {
      console.warn('⚠️ Token JWT ou API URL ausente.')
      setLoading(false)
      return
    }

    fetch(`${API_URL}/clients`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errJson = await res.json()
          throw new Error(`[${res.status}] ${res.statusText} - ${JSON.stringify(errJson)}`)
        }

        const json = await res.json()
        const payload = Array.isArray(json) ? json : json.data
        const parsed = clientsSchema.parse(payload)

        setClients(parsed)
      })
      .catch((err) => {
        console.error('❌ Erro ao buscar clientes:', err)
        setClients([]) // fallback seguro
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { clients, loading }
}
