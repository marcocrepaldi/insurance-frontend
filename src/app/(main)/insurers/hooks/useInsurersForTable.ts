"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { insurerSchema } from "../schemas/insurer-schema"
import { mapInsurerToTableItem, tableSchema } from "../lib/mapInsurerToTable"

const insurerListSchema = z.array(insurerSchema)

export function useInsurersForTable() {
  const [data, setData] = useState<z.infer<typeof tableSchema>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("jwt_token")

    if (!token) {
      console.warn("⚠️ JWT token não encontrado no localStorage")
      setLoading(false)
      return
    }

    fetch("https://insurance-api-production-55fa.up.railway.app/api/insurers", {
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
        const parsed = insurerListSchema.parse(payload)
        const mapped = parsed.map(mapInsurerToTableItem)

        setData(mapped)
      })
      .catch((err) => {
        console.error("❌ Failed to load insurers:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { data, loading }
}
