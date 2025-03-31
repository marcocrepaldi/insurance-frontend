// src/app/(app)/quotes/section-cards.tsx
'use client'

import { useQuotes } from './use-quotes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const STAGES = [
  { id: 'ABERTURA', title: 'Abertura' },
  { id: 'EM_ABORDAGEM', title: 'Abordagem' },
  { id: 'PROPOSTA_ENVIADA', title: 'Propostas Enviadas' },
  { id: 'EM_NEGOCIACAO', title: 'Negociação' },
  { id: 'APROVADA', title: 'Aprovadas' },
  { id: 'PERDIDA', title: 'Perdidas' },
]

export function SectionCards() {
  const { quotes, isLoading } = useQuotes()

  const countByStage = (stageId: string) =>
    quotes?.filter((q) => q.stage === stageId).length || 0

  if (isLoading) {
    return <p className="p-4 text-sm text-muted-foreground">Carregando estatísticas...</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {STAGES.map((stage) => (
        <Card key={stage.id} className="shadow-sm border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{stage.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">{countByStage(stage.id)}</span>
            <p className="text-muted-foreground text-xs mt-1">cotações</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
