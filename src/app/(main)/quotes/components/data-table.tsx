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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/formatters"
import { InsuranceQuote } from "@/types/insuranceQuotesType"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SlidersHorizontal } from "lucide-react"
import { DataTablePagination } from "./data-table-pagionation"
import { CreateProposalDialog } from "../components/create-proposal-dialog"

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

  if (hasProposals) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(`/quotes/${quote.id}/proposals`)}
        title="Ver propostas cadastradas"
      >
        Ver Propostas
      </Button>
    )
  }

  return (
    <>
      <Button
        variant="default"
        size="sm"
        onClick={() => setOpen(true)}
        title="Cadastrar nova proposta"
      >
        Cadastrar Proposta
      </Button>
      <CreateProposalDialog
        open={open}
        onOpenChange={setOpen}
        quoteId={quote.id}
      />
    </>
  )
}

const serviceTypeLabels: Record<string, string> = {
  SEGURO_CARRO: "Seguro de Carro",
  SEGURO_MOTO: "Seguro de Moto",
  SEGURO_CAMINHAO: "Seguro de Caminhão",
  SEGURO_FROTAS: "Seguro de Frotas",
  AUTO_POR_ASSINATURA: "Auto por Assinatura",
  AUTO_POPULAR: "Auto Popular",
  ASSISTENCIA_24H: "Assistência 24h",
  SEGURO_RESIDENCIAL: "Seguro Residencial",
  SEGURO_CONDOMINIO: "Seguro Condomínio",
  SEGURO_EMPRESARIAL: "Seguro Empresarial",
  SEGURO_PATRIMONIAL: "Seguro Patrimonial",
  SEGURO_EQUIPAMENTOS: "Seguro Equipamentos",
  SEGURO_AGRICOLA: "Seguro Agrícola",
  VIDA_INDIVIDUAL: "Vida Individual",
  VIDA_EM_GRUPO: "Vida em Grupo",
  ACIDENTES_PESSOAIS: "Acidentes Pessoais",
  SEGURO_FUNERAL: "Seguro Funeral",
  DOENCAS_GRAVES: "Doenças Graves",
  SEGURO_PRESTAMISTA: "Seguro Prestamista",
  VIAGEM_NACIONAL_INTERNACIONAL: "Viagem Nacional/Internacional",
  VIAGEM_INTERCAMBIO: "Viagem Intercâmbio",
  VIAGEM_BAGAGEM: "Viagem - Bagagem",
  VIAGEM_COBERTURA_MEDICA: "Viagem - Cobertura Médica",
  RC_PROFISSIONAL: "RC Profissional",
  D_O: "D&O",
  E_O: "E&O",
  GARANTIA: "Garantia",
  CYBER: "Cyber",
  FIANCAS: "Fianças",
  CREDITO: "Crédito",
  RC_LIBERAIS: "RC Liberais",
  EQUIPAMENTOS_TRABALHO: "Equipamentos de Trabalho",
  VIDA_MEI: "Vida MEI",
  CONSORCIO: "Consórcio",
  PREVIDENCIA_PRIVADA: "Previdência Privada",
  CAPITALIZACAO: "Capitalização",
  ASSISTENCIAS_AVULSAS: "Assistências Avulsas",
  SAUDE_ODONTO: "Saúde / Odonto",
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

const defaultColumns: ColumnDef<InsuranceQuote>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />, size: 30,
  },
  { accessorKey: "title", header: "Título", cell: ({ row }) => <div className="font-medium">{row.original.title}</div> },
  { accessorKey: "clientName", header: "Cliente" },
  { accessorKey: "producerName", header: "Produtor" },
  {
    accessorKey: "serviceType",
    header: "Tipo de Serviço",
    cell: ({ row }) => serviceTypeLabels[row.original.serviceType] || row.original.serviceType,
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
  { accessorKey: "createdAt", header: "Criado em", cell: ({ row }) => formatDate(row.original.createdAt) },
  { id: "actions", header: "Ações", cell: ({ row }) => <ProposalActions quote={row.original} /> },
]

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

export function DataTable({ data, isValidating }: { data: InsuranceQuote[]; isValidating?: boolean }) {
  const [tableData, setTableData] = React.useState<InsuranceQuote[]>(data)
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [sorting, setSorting] = React.useState<SortingState>([])

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  )

  const table = useReactTable({
    data: tableData,
    columns: defaultColumns,
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
                  {id === "actions" ? "Ações" : id === "drag" ? "" : column.columnDef.header as string}
                </DropdownMenuCheckboxItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
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
                  <TableCell colSpan={defaultColumns.length} className="text-center">
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>
      <DataTablePagination table={table} className="px-4 py-2" />
    </div>
  )
}
