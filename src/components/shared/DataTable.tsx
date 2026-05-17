"use client"
"use no memo"

/**
 * WHY TANSTACK TABLE + SHADCN, NOT AG GRID
 *
 * AG Grid owns both the logic layer (sort/filter/pagination state) AND the
 * markup layer (it renders its own DOM). That means you fight its CSS to match
 * your design tokens, and the enterprise features (server-side row model,
 * grouping, Excel export) are paywalled.
 *
 * TanStack Table is headless — pure logic, zero DOM output. It tells you what
 * rows exist and in what order; you decide how to render them. shadcn's Table
 * components are the rendering layer: plain <table>/<thead>/<tr>/<td> elements
 * with your Tailwind tokens applied. The two libraries are completely unaware
 * of each other, which means you keep full control over both layers.
 *
 * Use AG Grid if you need a spreadsheet-grade grid (100k+ rows, virtual
 * scrolling, pivot tables). For every other table in this codebase, DataTable
 * is the right choice.
 */

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export interface DataTablePagination {
  total: number
  offset: number
  limit: number
  onNext: () => void
  onPrev: () => void
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  isLoading?: boolean
  loadingRows?: number
  emptyMessage?: string
  pagination?: DataTablePagination
}

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  loadingRows = 5,
  emptyMessage = "No results.",
  pagination,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {Array.from({ length: loadingRows }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full" />
        ))}
      </div>
    )
  }

  const page = pagination && pagination.limit > 0 ? Math.floor(pagination.offset / pagination.limit) + 1 : null
  const totalPages = pagination && pagination.limit > 0 ? Math.ceil(pagination.total / pagination.limit) : null

  return (
    <div className="flex flex-col">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => {
                const canSort = header.column.getCanSort()
                const sorted = header.column.getIsSorted()
                return (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center gap-1 hover:text-fg transition-colors"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sorted === "asc" ? (
                          <ChevronUp size={13} />
                        ) : sorted === "desc" ? (
                          <ChevronDown size={13} />
                        ) : (
                          <ChevronsUpDown size={13} className="opacity-40" />
                        )}
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-sm text-fg-3 py-8">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {pagination && totalPages && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-fg-3">
            Page {page} of {totalPages} · {pagination.total} total
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.offset === 0}
              onClick={pagination.onPrev}
            >
              <ChevronLeft size={14} />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.offset + pagination.limit >= pagination.total}
              onClick={pagination.onNext}
            >
              Next
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
