"use client"

import Link from "next/link"
import { useTaskDetails } from "../../use-task-details"
import {
  Loader2,
  Calendar,
  User,
  Tag,
  Info,
  ArrowLeft,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { TaskComments } from "../../components/TaskComments"

interface TaskDetailsProps {
  taskId: string
}

export default function TaskDetails({ taskId }: TaskDetailsProps) {
  const { task, isLoading, isError } = useTaskDetails(taskId)

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
      {/* 🔙 Botão de voltar */}
      <Button asChild variant="ghost" className="flex gap-2 items-center">
        <Link href="/tasks">
          <ArrowLeft className="w-4 h-4" />
          Voltar para Tarefas
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{task.title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {task.description ?? "Sem descrição adicional."}
          </CardDescription>
        </CardHeader>

        <Separator className="mb-2" />

        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <span className="font-medium">
              {task.label ?? "Sem categoria"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>
              Responsável:{" "}
              <strong>{task.assignedTo?.name || "Não definido"}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              Criada por{" "}
              <strong>{task.createdBy?.name || "Desconhecido"}</strong> em{" "}
              <strong>
                {format(new Date(task.createdAt), "dd/MM/yyyy HH:mm")}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>Status:</span>
            <Badge variant="outline" className="capitalize">
              {statusFormatted}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 💬 Comentários */}
      <TaskComments taskId={taskId} />
    </div>
  )
}
