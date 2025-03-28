"use client"

import { useTaskDetails } from "../../use-task-details"
import {
  Loader2,
  Calendar,
  User,
  Tag,
  Info,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { format } from "date-fns"
import { TaskComments } from "../../components/TaskComments"

interface TaskDetailsProps {
  taskId: string
}

export default function TaskDetails({ taskId }: TaskDetailsProps) {
  const { task, isLoading, isError } = useTaskDetails(taskId)

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId") || ""
      : ""

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (isError || !task) {
    return (
      <div className="text-red-500 text-center py-10">
        Não foi possível carregar os detalhes da tarefa.
      </div>
    )
  }

  const statusFormatted = task.status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-2xl">{task.title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Info className="w-5 h-5" />
            <p>{task.description ?? "Sem descrição adicional."}</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {task.label && (
              <Badge variant="secondary">
                <Tag className="w-4 h-4 mr-2" />
                {task.label}
              </Badge>
            )}

            {task.assignedTo && (
              <Badge variant="secondary">
                <User className="w-4 h-4 mr-2" />
                Responsável: {task.assignedTo.name}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-5 h-5" />
            <span>
              Criada por{" "}
              <strong>{task.createdBy?.name || "Desconhecido"}</strong> em{" "}
              <strong>
                {format(new Date(task.createdAt), "dd/MM/yyyy HH:mm")}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span>Status:</span>
            <Badge variant="outline">{statusFormatted}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* 💬 Comentários */}
      <TaskComments taskId={taskId} userId={userId} />
    </div>
  )
}
