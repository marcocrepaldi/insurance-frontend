// constants.ts
import { TaskStatus } from "./types"

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  WAITING_APPROVAL: "Aguardando Aprovação",
  APPROVED: "Aprovada",
  REJECTED: "Rejeitada",
  PENDING: "Pendente",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluída",
}

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  WAITING_APPROVAL: "border-orange-400 text-orange-500",
  APPROVED: "border-green-400 text-green-600",
  REJECTED: "border-red-400 text-red-500",
  PENDING: "border-yellow-400 text-yellow-600",
  IN_PROGRESS: "border-blue-400 text-blue-600",
  COMPLETED: "border-gray-400 text-gray-500",
};