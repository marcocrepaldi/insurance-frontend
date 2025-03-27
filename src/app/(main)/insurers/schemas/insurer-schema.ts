import { z } from "zod"

export const insurerSchema = z.object({
  id: z.string(),
  nomeFantasia: z.string(),
  razaoSocial: z.string(),
  cnpj: z.string(),
  inscricaoEstadual: z.string().nullable().optional(),
  registroSusep: z.string().nullable().optional(),
  endereco: z.string().nullable().optional(),
  contato: z.string().nullable().optional(),
  produtosOferecidos: z.array(z.string()).nullable().optional(),
  comissoes: z.record(z.number()).nullable().optional(),
  logoPath: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
