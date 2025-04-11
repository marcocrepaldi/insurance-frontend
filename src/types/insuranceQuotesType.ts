export type InsuranceQuote = {
  id: string
  title: string
  description: string | null
  stage:
    | "ABERTURA"
    | "EM_ABORDAGEM"
    | "PROPOSTA_ENVIADA"
    | "EM_NEGOCIACAO"
    | "APROVADA"
    | "PERDIDA"
    | "CANCELADA"
  serviceType: string // <--- adicione esta linha
  expectedPremium: number | null
  proposalSentAt: string | null
  expectedDecisionDate: string | null
  createdAt: string
  updatedAt: string
  clientName: string
  producerName: string
  proposals?: {
    id: string
  }[]
}
