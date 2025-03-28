import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { mapTaskToTable } from "./mapper"
import { TaskStatus } from "./types"
import { TaskActionsCell } from "./components/TaskActionsCell"
import { TaskRowMenu } from "./components/TaskRowMenu"

type TableRow = ReturnType<typeof mapTaskToTable>

export const columns: ColumnDef<TableRow>[] = [
  { accessorKey: "title", header: "Título" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const value = row.getValue("status") as TaskStatus
      const colors: Record<TaskStatus, string> = {
        PENDING: "yellow",
        IN_PROGRESS: "blue",
        WAITING_APPROVAL: "orange",
        APPROVED: "green",
        REJECTED: "red",
      }

      return (
        <Badge
          variant="outline"
          className={`capitalize border-${colors[value]}-500 text-${colors[value]}-600`}
        >
          {value.replace("_", " ")}
        </Badge>
      )
    },
  },
  { accessorKey: "label", header: "Rótulo" },
  { accessorKey: "assignedTo", header: "Responsável" },
  { accessorKey: "createdBy", header: "Criado por" },
  { accessorKey: "createdAt", header: "Criado em" },
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
