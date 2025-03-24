'use client'

import * as React from 'react'
import { User } from '@/schemas/user'
import { useReactTable, ColumnDef, flexRender, getCoreRowModel } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table'

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => row.original.email,
  },
  {
    accessorKey: 'role',
    header: 'Cargo',
    cell: ({ row }) => row.original.role?.name ?? 'Sem cargo',
  },
  {
    accessorKey: 'createdAt',
    header: 'Data de Criação',
    cell: ({ row }) => row.original.createdAt,
  },
]

export function DataTableUser({ data }: { data: User[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(), // Correção aqui: usando a função diretamente
  })

  return (
    <Table>
      <TableHead>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableCell key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
