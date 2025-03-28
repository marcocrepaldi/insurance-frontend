"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Check, X, Loader2 } from "lucide-react"
import { updateTaskStatus } from "../actions"
import { TaskStatus } from "../types"

interface TaskActionsCellProps {
  taskId: string
}

export function TaskActionsCell({ taskId }: TaskActionsCellProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async (status: TaskStatus) => {
    setLoading(true)
    toast.info(`Enviando status: ${status}`)
    try {
      await updateTaskStatus(taskId, status)
      toast.success(`Status atualizado para: ${status}`)
    } catch (error: any) {
      toast.error(`Erro ao atualizar: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        disabled={loading}
        onClick={() => handleClick(TaskStatus.APPROVED)}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 text-green-500" />}
      </Button>

      <Button
        variant="outline"
        size="icon"
        disabled={loading}
        onClick={() => handleClick(TaskStatus.REJECTED)}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 text-red-500" />}
      </Button>
    </div>
  )
}
