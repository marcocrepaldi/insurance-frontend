import { z } from "zod"

export const quoteStageEnum = z.enum([
  "ABERTURA",
  "EM_ABORDAGEM",
  "PROPOSTA_ENVIADA",
  "EM_NEGOCIACAO",
  "APROVADA",
  "PERDIDA",
  "CANCELADA",
])

export const insuranceQuoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  stage: quoteStageEnum,
  expectedPremium: z.number().nullable(),
  proposalSentAt: z.string().nullable(),
  expectedDecisionDate: z.string().nullable(),
  clientName: z.string(),
  producerName: z.string(),
  suggestedProducts: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  // Campos futuros opcionais:
  // wonReason: z.string().nullable().optional(),
  // lostReason: z.string().nullable().optional(),
})

export type InsuranceQuote = z.infer<typeof insuranceQuoteSchema>
export type QuoteStage = z.infer<typeof quoteStageEnum>
