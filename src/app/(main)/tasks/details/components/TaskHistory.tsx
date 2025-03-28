"use client"

import { useTaskHistory } from "../../use-task-history"
import { Loader2, HistoryIcon, User, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

interface TaskHistoryProps {
  taskId: string
}

export default function TaskHistory({ taskId }: TaskHistoryProps) {
  const { history, isLoading, isError } = useTaskHistory(taskId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (isError || !history || history.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-10">
        Nenhum histórico disponível para essa tarefa.
      </div>
    )
  }

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <HistoryIcon className="w-5 h-5" />
          Histórico de Alterações
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {history.map((entry) => (
          <div key={entry.id} className="flex gap-3 items-center border-b pb-3 last:border-0 last:pb-0">
            <Badge variant="outline">{entry.action.replace("_", " ")}</Badge>

            {entry.from && entry.to && (
              <div className="text-sm text-muted-foreground">
                Alterado de <Badge variant="secondary">{entry.from}</Badge> para <Badge variant="secondary">{entry.to}</Badge>
              </div>
            )}

            <div className="flex items-center gap-2 ml-auto text-xs text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{entry.changedBy.name}</span>

              <Clock className="w-4 h-4 ml-2" />
              <span>{format(new Date(entry.changedAt), "dd/MM/yyyy HH:mm")}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
