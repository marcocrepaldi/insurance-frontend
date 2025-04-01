import useSWR from 'swr'
import { InsuranceProposal } from '../types'
import { useAuth } from './use-auth'

export function useProposalsByQuote(quoteId: string) {
  const { token } = useAuth()

  const fetcher = async (url: string) => {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) throw new Error('Erro ao buscar propostas')

    const data = await res.json()
    return data as InsuranceProposal[]
  }

  const swr = useSWR(
    quoteId && token
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/insurance-quotes/${quoteId}/proposals`
      : null,
    fetcher
  )

  return {
    proposals: swr.data ?? [],
    isLoading: !swr.data && !swr.error,
    error: swr.error,
  }
}
