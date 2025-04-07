// ✅ columns.ts
import { ColumnDef } from "@tanstack/react-table"
import { Client } from "../hook/useFetchData";
import { formatDate, formatDocument } from "../utils/formatters"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GripVerticalIcon, MoreVerticalIcon } from "lucide-react"

// Handle de arrasto personalizado
export const DragHandle = ({ id }: { id: string }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground cursor-move"
      aria-label={`Arrastar cliente ${id}`}
      data-id={id} // útil para testes ou logs
    >
      <GripVerticalIcon className="size-3" />
      <span className="sr-only">Arrastar cliente {id}</span>
    </Button>
  )
}

export const columns: ColumnDef<Client>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />, // usado no sortable
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "document",
    header: "Documento",
    cell: ({ row }) => formatDocument(row.original.document),
  },
  {
    accessorKey: "birthDate",
    header: "Nascimento",
    cell: ({ row }) =>
      row.original.birthDate
        ? formatDate(row.original.birthDate)
        : "-",
  },
  
  {
    accessorKey: "phone",
    header: "Telefone",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "street",
    header: "Rua",
  },
  {
    accessorKey: "number",
    header: "Número",
  },
  {
    accessorKey: "complement",
    header: "Complemento",
  },
  {
    accessorKey: "neighborhood",
    header: "Bairro",
  },
  {
    accessorKey: "city",
    header: "Cidade",
    cell: ({ row }) => `${row.original.city} - ${row.original.state}`,
  },
  {
    accessorKey: "zipCode",
    header: "CEP",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) =>
      row.original.isActive ? (
        <Badge className="bg-green-500 text-white">Ativo</Badge>
      ) : (
        <Badge variant="outline" className="text-muted-foreground">Inativo</Badge>
      ),
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    accessorKey: "updatedAt",
    header: "Atualizado em",
    cell: ({ row }) => formatDate(row.original.updatedAt),
  },
  {
    id: "actions",
    header: "",
    cell: () => (
      <Button variant="ghost" size="icon">
        <MoreVerticalIcon className="h-4 w-4" />
      </Button>
    ),
  },
]
