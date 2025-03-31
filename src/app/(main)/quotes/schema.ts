// src/app/(app)/quotes/schema.ts
import { z } from 'zod'

export const quoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  stage: z.string(),
  expectedPremium: z.number().nullable(),
  client: z.object({ name: z.string() }),
  producer: z.object({ name: z.string() }),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Quote = z.infer<typeof quoteSchema>
