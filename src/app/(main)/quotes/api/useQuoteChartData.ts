// src/hooks/useQuoteChartData.ts
import { useEffect, useState } from "react"

interface Quote {
  createdAt: string
  // Ex: automovel, vida, residencial, etc (adapte de acordo com seus dados)
  serviceType: string
}

interface ChartPoint {
  date: string
  [service: string]: number | string
}

export function useQuoteChartData() {
  const [data, setData] = useState<ChartPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("jwt_token")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/insurance-quotes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) return

      const quotes: Quote[] = await res.json()

      // Agrupar por data e tipo de serviço
      const grouped: Record<string, Record<string, number>> = {}

      for (const quote of quotes) {
        const date = new Date(quote.createdAt).toISOString().slice(0, 10) // yyyy-mm-dd
        const type = quote["serviceType"] ?? "automovel" // ← ajuste conforme tiver esse campo

        if (!grouped[date]) grouped[date] = {}
        grouped[date][type] = (grouped[date][type] ?? 0) + 1
      }

      const result = Object.entries(grouped).map(([date, types]) => ({
        date,
        ...types,
      }))

      setData(result)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  return { data, isLoading }
}
