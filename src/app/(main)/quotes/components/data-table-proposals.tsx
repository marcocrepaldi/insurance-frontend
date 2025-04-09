// src/quotes/components/data-table-proposals.tsx
'use client'

import * as React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export type Proposal = {
  id: string
  insurerName: string
  totalPremium: number
  insuredAmount: number
  observations: string
  pdfPath: string
  coverages: { name: string; value: number; deductible?: string }[]
  createdAt: string
  updatedAt: string
  quote?: {
    title: string
    client?: { name: string }
    producer?: { name: string }
  }
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

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const columns: ColumnDef<Proposal>[] = [
    {
      accessorKey: 'insurerName',
      header: 'Seguradora',
      cell: ({ row }) => <div>{row.getValue('insurerName')}</div>,
    },
    {
      accessorKey: 'totalPremium',
      header: 'Prêmio Total',
      cell: ({ row }) => <div>{formatCurrency(row.getValue('totalPremium'))}</div>,
    },
    {
      accessorKey: 'insuredAmount',
      header: 'Valor Segurado',
      cell: ({ row }) => <div>{formatCurrency(row.getValue('insuredAmount'))}</div>,
    },
    {
      accessorKey: 'observations',
      header: 'Observações',
      cell: ({ row }) => {
        const text = (row.getValue('observations') as string).slice(0, 50)
        const lines = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0)
        const preview = lines.slice(0, 2)

        return (
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-left max-w-[300px] space-y-1 text-sm text-muted-foreground hover:underline">
                {preview.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
                {lines.length > 2 && <p className="text-xs text-blue-500">Ver mais...</p>}
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Observações da proposta</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground max-h-[60vh] overflow-y-auto">
                {lines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )
      },
    },
    {
      id: 'coverages',
      header: 'Coberturas',
      cell: ({ row }) => {
        const coverages = row.original.coverages
        if (!Array.isArray(coverages) || coverages.length === 0) return '-'

        return (
          <div className="flex flex-wrap gap-1 max-w-[320px] overflow-hidden">
            {coverages.map((cob, i) => (
              <Badge key={i} variant="outline" className="text-xs truncate">
                {cob.name} ({formatCurrency(Number(cob.value) || 0)})
              </Badge>
            ))}
          </div>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Criado em',
      cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleDateString('pt-BR'),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Atualizado em',
      cell: ({ row }) => new Date(row.getValue('updatedAt')).toLocaleDateString('pt-BR'),
    },
    {
      id: 'actions',
      header: 'Fatura',
      cell: ({ row }) => {
        const proposal = row.original
        const fileName = proposal.pdfPath?.split('/').pop()
        const token = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null

        const handleDownload = async () => {
          if (!fileName || !token) return toast.error('Arquivo não encontrado.')

          setDownloadingId(proposal.id)
          try {
            const res = await fetch(`https://insurance-api-production-55fa.up.railway.app/api/insurance-quotes/proposals/pdf/${fileName}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            if (!res.ok) throw new Error()

            const blob = await res.blob()
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            link.remove()
            toast.success('Fatura baixada com sucesso!')
          } catch {
            toast.error('Erro ao baixar fatura.')
          } finally {
            setDownloadingId(null)
          }
        }

        const handlePreview = async () => {
          if (!fileName || !token) return toast.error('Arquivo não encontrado.')
          try {
            const res = await fetch(`https://insurance-api-production-55fa.up.railway.app/api/insurance-quotes/proposals/pdf/${fileName}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            if (!res.ok) throw new Error()
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            window.open(url, '_blank')
          } catch {
            toast.error('Erro ao visualizar fatura.')
          }
        }

        return (
          <div className="flex flex-col gap-1">
            <button onClick={handlePreview} className="text-blue-600 hover:underline text-sm">Visualizar</button>
            <button onClick={handleDownload} className="text-blue-600 hover:underline text-sm" disabled={downloadingId === proposal.id}>
              {downloadingId === proposal.id ? 'Baixando...' : 'Baixar'}
            </button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center py-2">
        <Input
          placeholder="Filtrar seguradora..."
          value={(table.getColumn('insurerName')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('insurerName')?.setFilterValue(event.target.value)
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
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className="even:bg-muted/50">
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
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Anterior
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Próximo
        </Button>
      </div>
    </div>
  )
}
