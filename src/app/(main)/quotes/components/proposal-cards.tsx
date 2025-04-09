// src/quotes/components/proposal-cards.tsx
'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Proposal } from './data-table-proposals'
import { toast } from 'sonner'

interface ProposalCardsProps {
  data: Proposal[]
}

export function ProposalCards({ data }: ProposalCardsProps) {
  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const handleDownload = async (proposal: Proposal) => {
    const fileName = proposal.pdfPath?.split('/').pop()
    const token = localStorage.getItem('jwt_token')
    if (!fileName || !token) return toast.error('Arquivo não encontrado.')

    try {
      const res = await fetch(`https://insurance-api-production-55fa.up.railway.app/api/insurance-quotes/proposals/pdf/${fileName}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Fatura baixada com sucesso!')
    } catch {
      toast.error('Erro ao baixar fatura.')
    }
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {data.map((proposal) => (
        <Card key={proposal.id} className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">
              {proposal.insurerName} —{' '}
              <span className="text-muted-foreground font-normal">
                {proposal.quote?.title}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><strong>Prêmio Total:</strong> {formatCurrency(proposal.totalPremium)}</div>
            <div><strong>Valor Segurado:</strong> {formatCurrency(proposal.insuredAmount)}</div>

            <div>
              <strong>Observações:</strong>
              <p className="text-muted-foreground line-clamp-3">
                {proposal.observations || 'Sem observações'}
              </p>
            </div>

            {proposal.coverages?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {proposal.coverages.map((cob, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {cob.name} ({formatCurrency(Number(cob.value) || 0)})
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex justify-between pt-2">
              <Button variant="link" onClick={() => handleDownload(proposal)} className="p-0 text-sm">
                Baixar PDF
              </Button>
              <span className="text-xs text-muted-foreground">
                Atualizado em {new Date(proposal.updatedAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
