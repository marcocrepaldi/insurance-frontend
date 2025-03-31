import { z } from 'zod'

export const quoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  stage: z.enum([
    'ABERTURA',
    'ABORDAGEM',
    'PROPOSTA_ENVIADA',
    'NEGOCIACAO',
    'APROVADA',
    'PERDIDA',
  ]),
  expectedPremium: z.number().nullable(),

  client: z.object({
    id: z.string(),
    name: z.string(),
  }),

  producer: z.object({
    id: z.string(),
    name: z.string(),
  }),

  createdAt: z.string(), // ou z.coerce.date() se quiser Date
  updatedAt: z.string(),
})

export type Quote = z.infer<typeof quoteSchema>
