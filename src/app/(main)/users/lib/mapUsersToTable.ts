// src/app/(app)/users/lib/mapUserToTable.ts
import { z } from "zod"
import { userSchema } from "../schemas/users-schema"

export const tableSchema = z.object({
  id: z.string(),
  header: z.string(),  // Nome do usuário
  type: z.string(),    // Nome da role
  status: z.string(),  // Status de exibição
  target: z.string(),  // Meta (exemplo)
  limit: z.string(),   // Limite (exemplo)
  reviewer: z.string() // Nome do revisor (fixo inicialmente)
})

export function mapUserToTableItem(
  user: z.infer<typeof userSchema>
): z.infer<typeof tableSchema> {
  return {
    id: user.id,
    header: user.name,
    type: user.role?.name || "No role",
    status: "Done", // ou lógica futura de status
    target: String(Math.floor(Math.random() * 50) + 1),
    limit: String(Math.floor(Math.random() * 30) + 1),
    reviewer: "Assign reviewer",
  }
}
