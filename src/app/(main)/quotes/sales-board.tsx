// src/app/(app)/quotes/sales-board.tsx
'use client'

import { useQuotes } from './use-quotes'
import { QuoteColumn } from './quote-column'

const STAGES = [
  { id: 'ABERTURA', title: 'Abertura' },
  { id: 'EM_ABORDAGEM', title: 'Abordagem' },
  { id: 'PROPOSTA_ENVIADA', title: 'Proposta Enviada' },
  { id: 'EM_NEGOCIACAO', title: 'Negociação' },
  { id: 'APROVADA', title: 'Aprovada' },
  { id: 'PERDIDA', title: 'Perdida' },
]

export function SalesBoard() {
  const { quotes, isLoading } = useQuotes()

  if (isLoading || !quotes) return <p>Carregando...</p>

  return (
    <div className="flex gap-4 overflow-x-auto p-4">
      {STAGES.map((stage) => (
        <QuoteColumn
          key={stage.id}
          title={stage.title}
          quotes={quotes.filter((q) => q.stage === stage.id)}
        />
      ))}
    </div>
  )
}
