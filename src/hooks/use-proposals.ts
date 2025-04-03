import useSWR from 'swr'
import { InsuranceProposal } from '../types'

export function useProposalsByQuote(quoteId: string) {
  const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => res.json())
  const { data, error, isLoading } = useSWR(
    quoteId ? \`/api/insurance-quotes/\${quoteId}/proposals\` : null,
    fetcher
  )
  return { proposals: data ?? [], isLoading, error }
}