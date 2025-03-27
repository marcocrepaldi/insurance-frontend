"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { mapTaskToTable } from "./mapper"
import { updateTaskStatus } from "./actions"
import { TaskStatus } from "./types"

type TableRow = ReturnType<typeof mapTaskToTable>

export const columns: ColumnDef<TableRow>[] = [
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const value = row.getValue("status") as TaskStatus

      const statusColorMap: Record<TaskStatus, string> = {
        PENDING: "yellow",
        IN_PROGRESS: "blue",
        WAITING_APPROVAL: "orange",
        APPROVED: "green",
        REJECTED: "red",
      }

      const color = statusColorMap[value] ?? "gray"

      return (
        <Badge
          variant="outline"
          className={`capitalize border-${color}-500 text-${color}-600`}
        >
          {value.replace("_", " ")}
        </Badge>
      )
    },
  },
  {
    accessorKey: "label",
    header: "Rótulo",
  },
  {
    accessorKey: "assignedTo",
    header: "Responsável",
  },
  {
    accessorKey: "createdBy",
    header: "Criado por",
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const task = row.original as TableRow
      const isDisabled = task.status !== TaskStatus.WAITING_APPROVAL

      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              console.log("✅ Aprovando tarefa:", task.id)
              updateTaskStatus(task.id, TaskStatus.APPROVED)
            }}
            disabled={isDisabled}
          >
            <Check className="w-4 h-4 text-green-500" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              console.log("❌ Rejeitando tarefa:", task.id)
              updateTaskStatus(task.id, TaskStatus.REJECTED)
            }}
            disabled={isDisabled}
          >
            <X className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      )
    },
  },
]
