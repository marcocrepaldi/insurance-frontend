// src/app/(main)/quotes/hooks/use-proposals-by-quote.ts
import useSWR from 'swr'
import { InsuranceProposal } from '../types'

export function useProposalsByQuote(quoteId: string) {
  const fetcher = async (url: string): Promise<InsuranceProposal[]> => {
    const res = await fetch(url, { credentials: 'include' })
    if (!res.ok) throw new Error('Erro ao carregar propostas')
    return res.json()
  }

  const { data, error } = useSWR<InsuranceProposal[]>(
    quoteId ? `/api/insurance-quotes/${quoteId}/proposals` : null,
    fetcher
  )

  const isLoading = !data && !error

  return {
    proposals: data ?? [],
    isLoading,
    error,
  }
}
