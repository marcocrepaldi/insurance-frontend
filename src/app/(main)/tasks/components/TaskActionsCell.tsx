"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { updateTaskStatus } from "../actions"
import { TaskStatus } from "../types"
import { toast } from "sonner"

interface TaskActionsCellProps {
  taskId: string
  status: TaskStatus
}

export function TaskActionsCell({ taskId, status }: TaskActionsCellProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleApprove = async () => {
    setIsUpdating(true)
    await updateTaskStatus(taskId, TaskStatus.APPROVED)
    toast.success("Tarefa aprovada com sucesso!")
    setIsUpdating(false)
  }

  const handleReject = async () => {
    setIsUpdating(true)
    await updateTaskStatus(taskId, TaskStatus.REJECTED)
    toast.success("Tarefa rejeitada com sucesso!")
    setIsUpdating(false)
  }

  const isDisabled = status !== TaskStatus.WAITING_APPROVAL || isUpdating

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleApprove}
        disabled={isDisabled}
      >
        <Check className="w-4 h-4 text-green-500" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={handleReject}
        disabled={isDisabled}
      >
        <X className="w-4 h-4 text-red-500" />
      </Button>
    </div>
  )
}
