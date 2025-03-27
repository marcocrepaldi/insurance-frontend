import { Task } from "./types"

export const mapTaskToTable = (task: Task) => ({
    id: task.id,
    title: task.title,
    status: task.status,
    label: task.label ?? "-",
    assignedTo: task.assignedTo
      ? `${task.assignedTo.name} (${task.assignedTo.email})`
      : "-",
    createdBy: task.createdBy
      ? `${task.createdBy.name} (${task.createdBy.email})`
      : "-",
    createdAt: new Date(task.createdAt).toLocaleDateString("pt-BR"),
  })
  
