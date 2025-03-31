// src/app/(app)/quotes/use-quotes.ts
import useSWR from 'swr'
import { quoteSchema } from './schema'
import { z } from 'zod'

const quotesSchema = z.array(quoteSchema)

export const useQuotes = () => {
  const fetcher = async (url: string) => {
    try {
      const res = await fetch(url, { credentials: 'include' })
      const json = await res.json()
      return quotesSchema.parse(json)
    } catch (error) {
      console.error('Erro ao carregar cotações:', error)
      return []
    }
  }

  const { data, error, mutate } = useSWR('/api/insurance-quotes', fetcher)

  const isLoading = !data && !error

  return {
    quotes: data ?? [],
    isLoading,
    mutate,
  }
}
