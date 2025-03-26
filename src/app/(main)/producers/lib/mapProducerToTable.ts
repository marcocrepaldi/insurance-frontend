// src/lib/mapProducerToTable.ts
import { z } from "zod"
import { producerSchema } from "../schemas/producer-schema"

export const tableSchema = z.object({
  id: z.string(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
})

export function mapProducerToTableItem(
  producer: z.infer<typeof producerSchema>
): z.infer<typeof tableSchema> {
  return {
    id: producer.id,
    header: producer.name,
    type: producer.type === "INTERNAL" ? "Internal" : "External",
    status: producer.isActive ? "Done" : "In Progress",
    target: String(Math.floor(Math.random() * 50) + 1),
    limit: String(Math.floor(Math.random() * 30) + 1),
    reviewer: "Assign reviewer",
  }
}
