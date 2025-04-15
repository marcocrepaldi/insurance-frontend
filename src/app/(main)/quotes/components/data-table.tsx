"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ColumnDef,
  Row,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  VisibilityState,
  SortingState,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SlidersHorizontal } from "lucide-react"
import { DataTablePagination } from "./data-table-pagionation"
import { CreateProposalDialog } from "./create-proposal-dialog"
import { QuoteActionsDropdown } from "./quote-actions-dropdown"
import { EditQuoteDialog } from "./EditQuoteDialog"
import { toast } from "sonner"
import { formatCurrency, formatDate } from "@/lib/formatters"
import { InsuranceQuote } from "@/types/insuranceQuotesType"
import { Checkbox } from "@/components/ui/checkbox"
import { downloadCSV } from "@/lib/csv"

const stageColorMap: Record<InsuranceQuote["stage"], string> = {
  ABERTURA: "bg-gray-100 text-gray-800",
  EM_ABORDAGEM: "bg-yellow-100 text-yellow-800",
  PROPOSTA_ENVIADA: "bg-blue-100 text-blue-800",
  EM_NEGOCIACAO: "bg-orange-100 text-orange-800",
  APROVADA: "bg-green-100 text-green-800",
  PERDIDA: "bg-red-100 text-red-800",
  CANCELADA: "bg-muted text-muted-foreground",
}

const serviceTypeLabels: Record<string, string> = {
  SEGURO_CARRO: "Seguro de Carro",
  SEGURO_MOTO: "Seguro de Moto",
  SAUDE_ODONTO: "Saúde / Odonto",
}

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

function ProposalActions({ quote }: { quote: InsuranceQuote }) {
  const router = useRouter()
  const hasProposals = (quote.proposals ?? []).length > 0
  const [open, setOpen] = React.useState(false)

  return hasProposals ? (
    <Button
      variant="outline"
      size="sm"
      onClick={() => router.push(`/quotes/${quote.id}/proposals`)}
    >
      Ver Propostas
    </Button>
  ) : (
    <>
      <Button variant="default" size="sm" onClick={() => setOpen(true)}>
        Cadastrar Proposta
      </Button>
      <CreateProposalDialog open={open} onOpenChange={setOpen} quoteId={quote.id} />
    </>
  )
}

function StageCell({ row }: { row: Row<InsuranceQuote> }) {
  const [value, setValue] = React.useState<InsuranceQuote["stage"]>(row.original.stage)
  const [loading, setLoading] = React.useState(false)

  const handleChange = async (newStage: InsuranceQuote["stage"]) => {
    setValue(newStage)
    setLoading(true)
    try {
      const token = localStorage.getItem("jwt_token")
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/insurance-quotes/${row.original.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stage: newStage }),
      })
      toast.success("Status atualizado com sucesso.")
    } catch {
      toast.error("Erro ao atualizar status.")
      setValue(row.original.stage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <select
      value={value}
      onChange={(e) => handleChange(e.target.value as InsuranceQuote["stage"])}
      disabled={loading}
      className={`text-xs rounded px-2 py-1 ${stageColorMap[value]}`}
    >
      {Object.keys(stageColorMap).map((key) => (
        <option key={key} value={key}>{key}</option>
      ))}
    </select>
  )
}

function DraggableRow({ row }: { row: Row<InsuranceQuote> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({ id: row.original.id })
  return (
    <TableRow
      ref={setNodeRef}
      data-dragging={isDragging}
      className="data-[dragging=true]:opacity-70"
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  )
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function ServiceDetailsCell({ details }: { details?: any }) {
  const [open, setOpen] = React.useState(false)

  if (!details || (typeof details === "object" && Object.keys(details).length === 0))
    return "—"

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-xs"
      >
        Ver Detalhes
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Serviço</DialogTitle>
          </DialogHeader>
          <div className="text-sm max-h-[400px] overflow-auto whitespace-pre-wrap break-words">
            <pre className="text-muted-foreground">
              {typeof details === "string"
                ? details
                : JSON.stringify(details, null, 2)}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}


export function DataTable({ data, isValidating }: { data: InsuranceQuote[]; isValidating?: boolean }) {
  const [tableData, setTableData] = React.useState<InsuranceQuote[]>(data)
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [editQuote, setEditQuote] = React.useState<InsuranceQuote | null>(null)
  const [selectedRowIds, setSelectedRowIds] = React.useState<Record<string, boolean>>({})
  const router = useRouter()

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor))

  const handleExportCSV = () => {
    const selectedData = tableData.filter((item) => selectedRowIds[item.id])
    downloadCSV(selectedData, "quotes.csv", {
      headers: {
        title: "Título",
        clientName: "Cliente",
        serviceType: "Tipo de Serviço",
        createdAt: "Criado em",
        stage: "",
        id: "",
        producer: "",
        client: "",
        description: "",
        expectedPremium: "",
        proposalSentAt: "",
        expectedDecisionDate: "",
        updatedAt: "",
        producerName: "",
        proposals: "",
        serviceDetails: ""
      },
      transformRow: (row) => ({
        title: row.title,
        clientName: row.client?.name ?? row.clientName,
        serviceType: row.serviceType,
        createdAt: new Date(row.createdAt).toLocaleDateString("pt-BR"),
      }),
    })
  }
  const columns: ColumnDef<InsuranceQuote>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={Object.keys(selectedRowIds).length === tableData.length}
          onCheckedChange={(checked) => {
            const newState = tableData.reduce((acc, quote) => {
              acc[quote.id] = !!checked
              return acc
            }, {} as Record<string, boolean>)
            setSelectedRowIds(checked ? newState : {})
          }}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={!!selectedRowIds[row.original.id]}
          onCheckedChange={(checked) => {
            setSelectedRowIds((prev) => ({ ...prev, [row.original.id]: !!checked }))
          }}
        />
      ),
    },
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
      accessorKey: "title",
      header: "Título",
      cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
    },
    {
      accessorKey: "client.name",
      header: "Cliente",
      cell: ({ row }) => row.original.client?.name || row.original.clientName || "—",
    },
    {
      accessorKey: "producer.name",
      header: "Produtor",
      cell: ({ row }) => row.original.producer?.name || row.original.producerName || "—",
    },
    {
      accessorKey: "serviceType",
      header: "Tipo de Produto",
      cell: ({ row }) => serviceTypeLabels[row.original.serviceType] || row.original.serviceType,
    },
    {
      accessorKey: "stage",
      header: "Status",
      cell: StageCell,
    },
    {
      accessorKey: "expectedPremium",
      header: "Prêmio Estimado",
      cell: ({ row }) => row.original.expectedPremium !== null ? formatCurrency(row.original.expectedPremium) : "—",
    },
    {
      accessorKey: "proposalSentAt",
      header: "Data de Envio",
      cell: ({ row }) => row.original.proposalSentAt ? formatDate(row.original.proposalSentAt) : "—",
    },
    {
      accessorKey: "expectedDecisionDate",
      header: "Decisão Esperada",
      cell: ({ row }) => row.original.expectedDecisionDate ? formatDate(row.original.expectedDecisionDate) : "—",
    },
    {
      accessorKey: "createdAt",
      header: "Criado em",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "serviceDetails",
      header: "Detalhes",
      cell: ({ row }) => (
        <ServiceDetailsCell details={row.original.serviceDetails} />
      ),
    },
   
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <ProposalActions quote={row.original} />
          <QuoteActionsDropdown
            quote={row.original}
            onEdit={() => setEditQuote(row.original)}
            onDeleted={() => setTableData((prev) => prev.filter((q) => q.id !== row.original.id))}
          />
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: tableData,
    columns,
    state: { columnVisibility, globalFilter, sorting },
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
      <div className="flex flex-col gap-2 border-b px-4 py-2 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Buscar por título ou cliente..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="h-8 w-full max-w-sm"
        />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            Exportar CSV
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <SlidersHorizontal className="size-4" />
                <span className="sr-only">Exibir/ocultar colunas</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {table.getAllLeafColumns().map((column) => {
                const id = column.id
                return (
                  <DropdownMenuCheckboxItem
                    key={id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={() => column.toggleVisibility()}
                  >
                    {id === "actions"
                      ? "Ações"
                      : id === "drag"
                      ? ""
                      : column.columnDef.header as string}
                  </DropdownMenuCheckboxItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {isValidating && (
        <div className="text-xs text-muted-foreground px-4 py-2">
          Atualizando cotações...
        </div>
      )}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={header.column.getCanSort() ? "cursor-pointer" : undefined}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "asc"
                        ? " ▲"
                        : header.column.getIsSorted() === "desc"
                        ? " ▼"
                        : null}
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
                  <TableCell colSpan={table.getAllColumns().length} className="text-center">
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>
      <DataTablePagination table={table} className="px-4 py-2" />
      {editQuote && (
        <EditQuoteDialog
          quote={editQuote}
          open={!!editQuote}
          onOpenChange={(open) => {
            if (!open) setEditQuote(null)
          }}
          onUpdated={() => {
            setEditQuote(null)
            router.refresh()
          }}
        />
      )}
    </div>
  )
}
