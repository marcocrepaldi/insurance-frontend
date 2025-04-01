'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useProposalsByQuote } from '../hooks/use-proposals-by-quote'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface QuoteProposalsSheetProps {
  quoteId: string
}

export function QuoteProposalsSheet({ quoteId }: QuoteProposalsSheetProps) {
  const [open, setOpen] = useState(false)
  const { proposals, isLoading } = useProposalsByQuote(quoteId)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          Ver Propostas
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:w-[600px]">
        <SheetHeader>
          <SheetTitle>Propostas Recebidas</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="animate-spin w-5 h-5 mr-2" />
              Carregando propostas...
            </div>
          )}

          {!isLoading && proposals.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhuma proposta foi enviada para esta cotação ainda.
            </p>
          )}

          {!isLoading &&
            proposals.map((proposal) => (
              <div
                key={proposal.id}
                className="border rounded-lg p-4 shadow-sm bg-muted"
              >
                <div className="text-sm font-medium text-primary">
                  {proposal.insurerName}
                </div>
                <div className="text-sm text-muted-foreground">
                  Valor Segurado: R$ {proposal.insuredAmount.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Prêmio Total: R$ {proposal.totalPremium.toFixed(2)}
                </div>
                <div className="text-xs mt-2">{proposal.observations}</div>

                {proposal.pdfPath && (
                  <a
                    href={`/${proposal.pdfPath}`}
                    target="_blank"
                    className="block mt-3 text-xs text-blue-600 hover:underline"
                  >
                    Visualizar PDF da Proposta
                  </a>
                )}
              </div>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
