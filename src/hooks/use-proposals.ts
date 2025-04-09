"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"

export function useProposals() {
  const router = useRouter()
  const { quoteId } = router.query

  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!quoteId || Array.isArray(quoteId)) return

    const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null
    if (!token) return

    const controller = new AbortController()

    fetch(`https://insurance-api-production-55fa.up.railway.app/api/insurance-quotes/proposals/${quoteId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar propostas")
        return res.json()
      })
      .then((data) => setProposals(data))
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Erro ao carregar as propostas:", err)
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [quoteId])

  return { proposals, loading }
}
