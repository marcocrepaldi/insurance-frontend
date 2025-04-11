'use client'

import { InsuranceQuote } from "@/types/insuranceQuotesType"
import {
  TrendingDownIcon,
  ClockIcon,
  LoaderIcon,
  XCircleIcon,
  HandshakeIcon,
  SendIcon,
  FileCheck2Icon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const stageMetadata: Record<
  InsuranceQuote["stage"],
  {
    label: string
    icon: React.ReactNode
    color: string
    trendText: string
  }
> = {
  ABERTURA: {
    label: "Em Aberto",
    icon: <ClockIcon className="size-4" />,
    color: "text-muted-foreground",
    trendText: "Aguardando abordagem",
  },
  EM_ABORDAGEM: {
    label: "Em Abordagem",
    icon: <LoaderIcon className="size-4" />,
    color: "text-blue-600",
    trendText: "Contato em andamento",
  },
  PROPOSTA_ENVIADA: {
    label: "Proposta Enviada",
    icon: <SendIcon className="size-4" />,
    color: "text-sky-600",
    trendText: "Aguardando retorno do cliente",
  },
  EM_NEGOCIACAO: {
    label: "Em Negociação",
    icon: <HandshakeIcon className="size-4" />,
    color: "text-orange-600",
    trendText: "Negociação ativa",
  },
  APROVADA: {
    label: "Aprovada",
    icon: <FileCheck2Icon className="size-4" />,
    color: "text-green-600",
    trendText: "Cliente aprovou a proposta",
  },
  PERDIDA: {
    label: "Perdida",
    icon: <TrendingDownIcon className="size-4" />,
    color: "text-red-600",
    trendText: "Proposta não convertida",
  },
  CANCELADA: {
    label: "Cancelada",
    icon: <XCircleIcon className="size-4" />,
    color: "text-muted-foreground",
    trendText: "Cancelada pelo corretor ou cliente",
  },
}

export function SectionCardsQuotes({ quotes }: { quotes: InsuranceQuote[] }) {
  const grouped = quotes.reduce<Record<string, number>>((acc, quote) => {
    acc[quote.stage] = (acc[quote.stage] || 0) + 1
    return acc
  }, {})

  return (
    <div className="@xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 lg:px-6">
      {Object.entries(stageMetadata).map(([key, meta]) => {
        const count = grouped[key] || 0

        return (
          <Card key={key} className="bg-card text-card-foreground border">
            <CardHeader className="relative @container/card">
              <CardDescription className="text-muted-foreground">
                {meta.label}
              </CardDescription>
              <CardTitle
                className={`@[250px]/card:text-3xl text-2xl font-semibold tabular-nums ${meta.color}`}
              >
                {count}
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge
                  variant="outline"
                  className="flex gap-1 rounded-lg text-xs border-border text-foreground"
                >
                  {meta.icon}
                  {meta.trendText}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        )
      })}
    </div>
  )
}
