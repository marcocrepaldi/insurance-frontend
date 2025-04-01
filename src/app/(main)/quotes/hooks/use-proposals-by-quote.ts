import useSWR from 'swr'
import { InsuranceProposal } from '../types'

export function useProposalsByQuote(quoteId: string) {
  const fetcher = async (url: string) => {
    const res = await fetch(url, { credentials: 'include' })
    if (!res.ok) throw new Error('Erro ao buscar propostas')
    const data = await res.json()
    return data as InsuranceProposal[]
  }

  const swr = useSWR(
    quoteId ? `/api/insurance-quotes/${quoteId}/proposals` : null,
    fetcher
  )

  return {
    proposals: swr.data ?? [],
    isLoading: !swr.data && !swr.error,
    error: swr.error,
  }
}
