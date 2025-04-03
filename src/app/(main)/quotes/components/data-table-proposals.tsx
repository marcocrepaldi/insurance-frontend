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

// Tipo para as propostas (proposals)
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

// Tipo para a prop 'data' do DataTableDemo
interface DataTableDemoProps {
  data: Proposal[]
}

export function DataTableDemo({ data }: DataTableDemoProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const columns: ColumnDef<Proposal>[] = [
    {
      accessorKey: "insurerName",
      header: "Insurer Name",
      cell: ({ row }) => <div>{row.getValue("insurerName")}</div>,
    },
    {
      accessorKey: "totalPremium",
      header: "Total Premium",
      cell: ({ row }) => <div>{row.getValue("totalPremium")}</div>,
    },
    {
      accessorKey: "insuredAmount",
      header: "Insured Amount",
      cell: ({ row }) => <div>{row.getValue("insuredAmount")}</div>,
    },
    {
      accessorKey: "observations",
      header: "Observations",
      cell: ({ row }) => <div>{row.getValue("observations")}</div>,
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
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter insurer names..."
          value={(table.getColumn("insurerName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("insurerName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
