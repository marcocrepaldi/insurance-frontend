// src/hooks/use-quotes.ts
"use client"

import useSWR from "swr"
import { InsuranceQuote } from "@/types/insurance-quote"
import { useAuth } from "@/hooks/use-auth"

const fetcher = async (url: string, token: string) => {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}))
    throw new Error(errData?.message || "Erro ao buscar cotações")
  }

  return res.json()
}

export function useQuotes() {
  const { token } = useAuth()
  const shouldFetch = !!token

  const {
    data,
    error,
    isValidating,
    mutate,
  } = useSWR<InsuranceQuote[]>(
    shouldFetch ? [`${process.env.NEXT_PUBLIC_API_URL}/insurance-quotes`, token] : null,
    ([url, token]) => fetcher(url, token)
  )

  const isLoading = !data && !error

  return {
    quotes: data,
    isLoading,
    isValidating,
    error,
    mutate,
  }
}
