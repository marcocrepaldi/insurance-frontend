import useSWR from "swr"
import { InsuranceQuote } from "@/types/insurance-quote"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function useQuotes() {
  const fetcher = async (url: string): Promise<InsuranceQuote[]> => {
    const token = localStorage.getItem("jwt_token")

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) throw new Error("Erro ao buscar cotações")
    return res.json()
  }

  const { data, error, isValidating, mutate } = useSWR(
    `${API_URL}/insurance-quotes`,
    fetcher
  )

  const isLoading = !data && !error

  return {
    quotes: data || [],
    isLoading,
    isValidating,
    isError: !!error,
    mutate,
  }
}
