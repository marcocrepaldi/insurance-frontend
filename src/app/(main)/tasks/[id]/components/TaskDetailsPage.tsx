"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTaskDetails } from "../../use-task-details"
import { useUsers } from "../../use-users"
import { useAuth } from "../../hooks/use-auth"
import TaskHistory from "./TaskHistory"
import { TaskComments } from "../../components/TaskComments"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { mutate } from "swr"
import { TASK_STATUS_LABELS } from "../../constants"
import { TaskStatus } from "../../types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, CheckCircle } from "lucide-react"

const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  WAITING_APPROVAL: "border-orange-400 text-orange-500",
  APPROVED: "border-green-400 text-green-600",
  REJECTED: "border-red-400 text-red-500",
  PENDING: "border-yellow-400 text-yellow-600",
  IN_PROGRESS: "border-blue-400 text-blue-600",
  COMPLETED: "border-gray-400 text-gray-500",
}

export default function TaskDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { task, isLoading } = useTaskDetails(id as string)
  const { users } = useUsers()

  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [updatingUser, setUpdatingUser] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<TaskStatus | null>(null)
  const [pendingUser, setPendingUser] = useState<string | null>(null)

  const confirmStatusChange = async () => {
    if (!task || !pendingStatus || pendingStatus === task.status) return
    const token = localStorage.getItem("jwt_token")
    if (!token) {
      toast.error("Token JWT não encontrado")
      return
    }

    setUpdatingStatus(true)
    try {
      const res = await fetch(
        `https://insurance-api-production-55fa.up.railway.app/api/tasks/${task.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: pendingStatus }),
        }
      )
      if (!res.ok) throw new Error("Erro ao atualizar status")
      toast.success("Status atualizado com sucesso")
      mutate(`/api/tasks/${task.id}`)
      mutate("/api/tasks")
    } catch {
      toast.error("Erro ao atualizar status")
    } finally {
      setUpdatingStatus(false)
      setPendingStatus(null)
    }
  }

  const confirmUserTransfer = async () => {
    if (!task || !pendingUser || task.assignedTo?.id === pendingUser) return
    const token = localStorage.getItem("jwt_token")
    if (!token) {
      toast.error("Token JWT não encontrado")
      return
    }

    setUpdatingUser(true)
    try {
      const res = await fetch(
        `https://insurance-api-production-55fa.up.railway.app/api/tasks/${task.id}/assign`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: pendingUser }),
        }
      )
      if (!res.ok) throw new Error("Erro ao transferir tarefa")
      toast.success("Tarefa transferida com sucesso")
      mutate(`/api/tasks/${task.id}`)
      mutate("/api/tasks")
    } catch {
      toast.error("Erro ao transferir tarefa")
    } finally {
      setUpdatingUser(false)
      setPendingUser(null)
    }
  }

  const handleQuickAction = () => {
    if (!task) return
    if (task.status === TaskStatus.PENDING) {
      setPendingStatus(TaskStatus.IN_PROGRESS)
    } else if (task.status === TaskStatus.IN_PROGRESS) {
      setPendingStatus(TaskStatus.COMPLETED)
    }
  }

  if (isLoading || !task)
    return <p className="text-muted-foreground">Carregando tarefa...</p>

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center text-sm text-muted-foreground hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
      </button>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{task.title}</h2>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`capitalize ${TASK_STATUS_COLORS[task.status]} text-sm`}
          >
            {TASK_STATUS_LABELS[task.status]}
          </Badge>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Select
                value={task.status}
                onValueChange={(status) => setPendingStatus(status as TaskStatus)}
                disabled={updatingStatus}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {TASK_STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar alteração</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja alterar o status da tarefa?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmStatusChange}>
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* 👤 Transferência de tarefa */}
      <div className="max-w-xs">
        <label className="text-sm text-muted-foreground">Responsável</label>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Select
              value={task.assignedTo?.id}
              onValueChange={(val) => setPendingUser(val)}
              disabled={updatingUser}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar usuário" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar transferência</AlertDialogTitle>
              <AlertDialogDescription>
                Deseja transferir a responsabilidade desta tarefa?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmUserTransfer}>
                Transferir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {task.status === TaskStatus.PENDING && (
        <Button onClick={handleQuickAction} variant="default" size="sm">
          <Play className="w-4 h-4 mr-2" /> Iniciar Tarefa
        </Button>
      )}

      {task.status === TaskStatus.IN_PROGRESS && (
        <Button
          onClick={handleQuickAction}
          variant="default"
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <CheckCircle className="w-4 h-4 mr-2" /> Marcar como Concluída
        </Button>
      )}

      {task.description && (
        <p className="text-muted-foreground whitespace-pre-line">
          {task.description}
        </p>
      )}

      <Separator />
      <TaskComments taskId={task.id} />

      <Separator />
      <TaskHistory taskId={task.id} />
    </div>
  )
}