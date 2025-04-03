"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"  // Para capturar o `quoteId` da URL

export function useProposals() {
  const router = useRouter()
  const { quoteId } = router.query  // Obtendo o `quoteId` da URL
  
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!quoteId) return  // Espera até que o `quoteId` esteja disponível

    // Fazer a requisição para obter as propostas associadas à cotação
    fetch(`https://insurance-api-production-55fa.up.railway.app/api/insurance-quotes/proposals/${quoteId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`,  // Autenticação com JWT
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProposals(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Erro ao carregar as propostas:", error)
        setLoading(false)
      })
  }, [quoteId])  // O efeito é executado quando o `quoteId` muda

  return { proposals, loading }
}
