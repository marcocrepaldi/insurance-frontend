"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ColumnDef,
  Row,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table"
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/formatters"
import { InsuranceQuote } from "@/types/insuranceQuotesType"

function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({ id })
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <span className="cursor-grab">☰</span>
    </Button>
  )
}

function ProposalLink({ quote }: { quote: InsuranceQuote }) {
  const router = useRouter()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => router.push(`/quotes/${quote.id}/proposals`)}
    >
      Ver Propostas
    </Button>
  )
}


const stageColorMap: Record<string, string> = {
  ABERTURA: "bg-gray-100 text-gray-800",
  EM_ABORDAGEM: "bg-yellow-100 text-yellow-800",
  PROPOSTA_ENVIADA: "bg-blue-100 text-blue-800",
  EM_NEGOCIACAO: "bg-orange-100 text-orange-800",
  APROVADA: "bg-green-100 text-green-800",
  PERDIDA: "bg-red-100 text-red-800",
  CANCELADA: "bg-muted text-muted-foreground",
}

const columns: ColumnDef<InsuranceQuote>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
    size: 30,
  },
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.title}</div>
    ),
  },
  {
    accessorKey: "clientName",
    header: "Cliente",
  },
  {
    accessorKey: "producerName",
    header: "Produtor",
  },
  {
    accessorKey: "stage",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={stageColorMap[row.original.stage] || "bg-muted"}>
        {row.original.stage}
      </Badge>
    ),
  },
  {
    accessorKey: "expectedPremium",
    header: "Prêmio Estimado",
    cell: ({ row }) =>
      row.original.expectedPremium !== null
        ? formatCurrency(row.original.expectedPremium)
        : "—",
  },
  {
    accessorKey: "proposalSentAt",
    header: "Data de Envio",
    cell: ({ row }) =>
      row.original.proposalSentAt
        ? formatDate(row.original.proposalSentAt)
        : "—",
  },
  {
    accessorKey: "expectedDecisionDate",
    header: "Decisão Esperada",
    cell: ({ row }) =>
      row.original.expectedDecisionDate
        ? formatDate(row.original.expectedDecisionDate)
        : "—",
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => <ProposalLink quote={row.original} />,
  },
]

function DraggableRow({ row }: { row: Row<InsuranceQuote> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      ref={setNodeRef}
      data-dragging={isDragging}
      className="data-[dragging=true]:opacity-70"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable({
  data,
  isValidating,
}: {
  data: InsuranceQuote[]
  isValidating?: boolean
}) {
  const [tableData, setTableData] = React.useState<InsuranceQuote[]>(data)

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  )

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const dataIds = React.useMemo(() => tableData.map((item) => item.id), [tableData])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = tableData.findIndex((item) => item.id === active.id)
      const newIndex = tableData.findIndex((item) => item.id === over?.id)
      setTableData(arrayMove(tableData, oldIndex, newIndex))
    }
  }

  return (
    <div className="rounded-xl border">
      {isValidating && (
        <div className="text-xs text-muted-foreground px-4 py-2">
          Atualizando cotações...
        </div>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <DraggableRow key={row.id} row={row} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>
    </div>
  )
}
