// src/schemas/producer-schema.ts
import { z } from "zod"

export const producerSchema = z.object({
  id: z.string(),
  name: z.string(),
  cpfCnpj: z.string(),
  phone: z.string(),
  email: z.string(),
  type: z.enum(["INTERNAL", "EXTERNAL"]),
  pixKey: z.string().nullable().optional(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
