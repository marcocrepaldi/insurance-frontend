// src/app/(main)/quotes/schemas/quoteServiceSchemas.ts
import { z } from "zod"

const schemas = {
  SEGURO_CARRO: z.object({
    placa: z.string().min(7, "Placa inválida"),
    modelo: z.string(),
    ano: z.coerce.number().min(1900).max(new Date().getFullYear()),
  }),
  VIDA_INDIVIDUAL: z.object({
    idade: z.coerce.number().min(18),
    fumante: z.enum(["sim", "nao"]),
  }),
  // adicione mais schemas conforme necessário
} as const

export const quoteServiceSchemas = schemas

export type QuoteServiceType = keyof typeof schemas
export type QuoteServiceDetails = {
  [K in QuoteServiceType]?: z.infer<(typeof schemas)[K]>
}