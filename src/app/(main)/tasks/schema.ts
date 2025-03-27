import { z } from "zod"

export const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3, "Título obrigatório"),
  description: z.string().nullable(),
  status: z.enum(["PENDING", "IN_PROGRESS", "WAITING_APPROVAL", "APPROVED", "REJECTED"]),
  label: z.enum(["BUG", "FEATURE", "URGENT", "IMPROVEMENT"]).nullable(),
  assignedTo: z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    roleId: z.string().uuid(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  createdBy: z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    roleId: z.string().uuid(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type TaskSchema = z.infer<typeof taskSchema>
