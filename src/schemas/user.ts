import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.object({
    id: z.string(),
    name: z.string(),
  }).nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type User = z.infer<typeof userSchema>
