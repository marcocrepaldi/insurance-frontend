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

export const coverageSchema = z.object({
  name: z.string(),
  value: z.number(),
  deductible: z.string().optional(),
})

export const proposalSchema = z.object({
  id: z.string(),
  insurerName: z.string(),
  totalPremium: z.number(),
  insuredAmount: z.number(),
  observations: z.string().nullable(),
  pdfPath: z.string().nullable(),
  coverages: z.array(coverageSchema).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

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
  proposals: z.array(proposalSchema).optional(),
})

export type InsuranceQuote = z.infer<typeof insuranceQuoteSchema>
export type QuoteStage = z.infer<typeof quoteStageEnum>
