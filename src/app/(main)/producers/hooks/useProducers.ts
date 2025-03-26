// src/hooks/useProducersForTable.ts
"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { producerSchema } from "../schemas/producer-schema"
import { mapProducerToTableItem, tableSchema } from "../lib/mapProducerToTable"

const producerListSchema = z.array(producerSchema)

export function useProducersForTable() {
  const [data, setData] = useState<z.infer<typeof tableSchema>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("jwt_token")

    if (!token) {
      console.warn("⚠️ JWT token não encontrado no localStorage")
      setLoading(false)
      return
    }

    fetch("https://insurance-api-production-55fa.up.railway.app/api/producers", {
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

        // Garante que o formato seja um array antes de validar
        const payload = Array.isArray(json) ? json : json.data

        const parsed = producerListSchema.parse(payload)
        const mapped = parsed.map(mapProducerToTableItem)

        setData(mapped)
      })
      .catch((err) => {
        console.error("❌ Failed to load producers:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { data, loading }
}
