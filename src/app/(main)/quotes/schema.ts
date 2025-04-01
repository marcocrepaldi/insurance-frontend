import { z } from 'zod'

export const quoteSchema = z.object({
  id: z.string(),

  /** Título da cotação */
  title: z.string(),

  /** Descrição opcional da oportunidade */
  description: z.string().optional(),

  /** Estágio atual do funil de vendas */
  stage: z.enum([
    'ABERTURA',
    'EM_ABORDAGEM',
    'PROPOSTA_ENVIADA',
    'EM_NEGOCIACAO',
    'APROVADA',
    'PERDIDA',
    'CANCELADA',
  ]),

  /** Valor estimado do prêmio */
  expectedPremium: z.number().nullable(),

  /** Cliente associado à cotação */
  client: z.object({
    id: z.string(),
    name: z.string(),
  }),

  /** Produtor responsável */
  producer: z.object({
    id: z.string(),
    name: z.string(),
  }),

  /** Datas do registro */
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Quote = z.infer<typeof quoteSchema>
