'use client'

import * as React from "react"
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  flexRender,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export type Proposal = {
  id: string
  insurerName: string
  totalPremium: number
  insuredAmount: number
  observations: string
  pdfPath: string
  coverages: any[]
  createdAt: string
  updatedAt: string
}

interface DataTableDemoProps {
  data: Proposal[]
}

export function DataTableDemo({ data }: DataTableDemoProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [downloadingId, setDownloadingId] = React.useState<string | null>(null)

  function formatObservations(text: string): string[] {
    return text
      .split(/(?<=[.!?])\s+/g)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
  }

  const columns: ColumnDef<Proposal>[] = [
    {
      accessorKey: "insurerName",
      header: "Seguradora",
      enableSorting: true,
      cell: ({ row }) => <div>{row.getValue("insurerName")}</div>,
    },
    {
      accessorKey: "totalPremium",
      header: "Prêmio Total",
      enableSorting: true,
      cell: ({ row }) => (
        <div>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(row.getValue("totalPremium"))}
        </div>
      ),
    },
    {
      accessorKey: "insuredAmount",
      header: "Valor Segurado",
      enableSorting: true,
      cell: ({ row }) => (
        <div>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(row.getValue("insuredAmount"))}
        </div>
      ),
    },
    {
      accessorKey: "observations",
      header: "Observações",
      enableSorting: false,
      cell: ({ row }) => {
        const text = row.getValue("observations") as string
        const formatted = formatObservations(text)
        const preview = formatted.slice(0, 3)

        return (
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="text-left max-w-[300px] text-sm text-muted-foreground hover:underline"
                aria-label="Abrir observações completas"
              >
                <div className="line-clamp-3 space-y-1">
                  {preview.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                {formatted.length > 3 && (
                  <p className="text-xs text-blue-500">Ver mais...</p>
                )}
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Observações da proposta</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground max-h-[60vh] overflow-y-auto">
                {formatted.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )
      },
    },
    {
      id: "actions",
      header: "Fatura",
      cell: ({ row }) => {
        const proposal = row.original
        const filePath = proposal.pdfPath
        const fileName = filePath?.split("/").pop()

        const handlePreview = async () => {
          const token = localStorage.getItem("jwt_token")
          if (!fileName) return toast.error("Caminho do PDF não encontrado.")

          const url = `https://insurance-api-production-55fa.up.railway.app/api/insurance-quotes/proposals/pdf/${fileName}`

          try {
            const response = await fetch(url, {
              headers: { Authorization: `Bearer ${token}` },
            })

            if (!response.ok) throw new Error("Erro ao visualizar PDF")

            const blob = await response.blob()
            const blobUrl = URL.createObjectURL(blob)
            window.open(blobUrl, "_blank")
          } catch (err) {
            console.error(err)
            toast.error("Erro ao visualizar o PDF.")
          }
        }

        const handleDownload = async () => {
          const token = localStorage.getItem("jwt_token")
          if (!fileName) return toast.error("Caminho do PDF não encontrado.")

          const url = `https://insurance-api-production-55fa.up.railway.app/api/insurance-quotes/proposals/pdf/${fileName}`
          setDownloadingId(proposal.id)

          try {
            const response = await fetch(url, {
              headers: { Authorization: `Bearer ${token}` },
            })

            if (!response.ok) throw new Error("Erro ao baixar o PDF")

            const blob = await response.blob()
            const link = document.createElement("a")
            link.href = URL.createObjectURL(blob)
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            link.remove()
            URL.revokeObjectURL(link.href)

            toast.success("Fatura baixada com sucesso!")
          } catch (err) {
            console.error(err)
            toast.error("Erro ao baixar a fatura.")
          } finally {
            setDownloadingId(null)
          }
        }

        const isLoading = downloadingId === proposal.id

        return (
          <div className="flex items-center gap-3">
            <button
              onClick={handlePreview}
              className="text-blue-600 hover:underline text-sm disabled:opacity-50"
              disabled={isLoading}
            >
              Visualizar
            </button>
            <span className="text-muted-foreground">|</span>
            <button
              onClick={handleDownload}
              className="text-blue-600 hover:underline text-sm disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Baixando..." : "Baixar"}
            </button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center py-2">
        <Input
          placeholder="Filtrar seguradora..."
          value={(table.getColumn("insurerName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("insurerName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="even:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
    </div>
  )
}
