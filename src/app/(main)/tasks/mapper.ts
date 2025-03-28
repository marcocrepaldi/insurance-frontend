import { Task } from "./types"

export const mapTaskToTable = (task: Task) => ({
  id: task.id,
  title: task.title,
  status: task.status,
  label: task.label,
  assignedTo: task.assignedTo.name,
  createdBy: task.createdBy.name,
  createdAt: new Date(task.createdAt).toLocaleDateString(),
})

// 👇 Adicione esta linha aqui!
export type TableRow = ReturnType<typeof mapTaskToTable>;
