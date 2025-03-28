import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { mapTaskToTable } from "./mapper"
import { TaskStatus } from "./types"
import { TaskActionsCell } from "./components/TaskActionsCell"
import { TaskRowMenu } from "./components/TaskRowMenu"
import { TASK_STATUS_LABELS, TASK_STATUS_COLORS } from "./constants"

type TableRow = ReturnType<typeof mapTaskToTable>

export const columns: ColumnDef<TableRow>[] = [
  {
    accessorKey: "title",
    header: "Título",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    enableGlobalFilter: true,
    cell: ({ row }) => {
      const value = row.getValue("status") as TaskStatus
      return (
        <Badge
          variant="outline"
          className={`capitalize text-sm ${TASK_STATUS_COLORS[value]}`}
        >
          {TASK_STATUS_LABELS[value]}
        </Badge>
      )
    },
  },
  {
    accessorKey: "label",
    header: "Rótulo",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "assignedTo",
    header: "Responsável",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "createdBy",
    header: "Criado por",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <TaskActionsCell
        taskId={row.original.id}
        status={row.original.status}
      />
    ),
  },
  {
    id: "menu",
    header: "",
    cell: ({ row }) => <TaskRowMenu taskId={row.original.id} />, 
  },
]
