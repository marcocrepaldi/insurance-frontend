import { z } from "zod"
import { insurerSchema } from "../schemas/insurer-schema"

export const tableSchema = z.object({
  id: z.string(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
})

export function mapInsurerToTableItem(
  insurer: z.infer<typeof insurerSchema>
): z.infer<typeof tableSchema> {
  return {
    id: insurer.id,
    header: insurer.nomeFantasia,
    type: insurer.produtosOferecidos?.[0] || "Outro",
    status: insurer.comissoes ? "Ativa" : "Incompleta",
    target: String(Object.keys(insurer.comissoes || {}).length || 0),
    limit: String(Math.floor(Math.random() * 30) + 1),
    reviewer: "Definir analista",
  }
}
