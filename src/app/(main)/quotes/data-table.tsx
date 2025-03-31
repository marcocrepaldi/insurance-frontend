'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
import { useState } from 'react'
import { Quote } from './schema'
import { useQuotes } from './use-quotes'

export function QuotesDataTable() {
  const { quotes, isLoading } = useQuotes()
  const [filter, setFilter] = useState('')

  const columns: ColumnDef<Quote>[] = [
    {
      accessorKey: 'title',
      header: 'Título',
    },
    {
      accessorKey: 'client.name',
      header: 'Cliente',
      cell: ({ row }) => row.original.client?.name ?? '-',
    },
    {
      accessorKey: 'producer.name',
      header: 'Produtor',
      cell: ({ row }) => row.original.producer?.name ?? '-',
    },
    {
      accessorKey: 'expectedPremium',
      header: 'Prêmio',
      cell: ({ row }) =>
        row.original.expectedPremium
          ? `R$ ${row.original.expectedPremium.toFixed(2)}`
          : '-',
    },
    {
      accessorKey: 'stage',
      header: 'Etapa',
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => (
        <Button variant="outline" size="sm" onClick={() => console.log('Ver', row.original.id)}>
          Ver
        </Button>
      ),
    },
  ]

  const filteredData = (quotes ?? []).filter((q) =>
    q.title.toLowerCase().includes(filter.toLowerCase()) ||
    q.client?.name.toLowerCase().includes(filter.toLowerCase())
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return <p className="p-4">Carregando cotações...</p>
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Buscar por título ou cliente..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full max-w-sm"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                  Nenhuma cotação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
