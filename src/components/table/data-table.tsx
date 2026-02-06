"use client"

import React from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type SortingState,
  type VisibilityState,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { DataTablePagination } from "./data-table-pagination"
import { ChevronDown } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]

  page: number
  perPage: number
  total: number
  loading: boolean

  onPaginationChange: (pagination: PaginationState) => void
  onSortingChange: (sorting: SortingState) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  page,
  perPage,
  total,
  loading,
  onPaginationChange,
  onSortingChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,

    getCoreRowModel: getCoreRowModel(),

    manualPagination: true,
    manualSorting: true,

    pageCount: Math.ceil(total / perPage),

    /* =========================
       🔥 CRITICAL FIX HERE
       unwrap updater → real values
    ========================= */
    onPaginationChange: (updater) => {
      const current = {
        pageIndex: page,
        pageSize: perPage,
      }

      const next =
        typeof updater === "function"
          ? updater(current)
          : updater

      onPaginationChange(next)
    },

    onSortingChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater(sorting)
          : updater

      setSorting(next)

      // convert TanStack → API shape
      const first = next[0]

      if (!first) return

      onSortingChange(first.id, first.desc ? "desc" : "asc")
    },

    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: page, // 0 based everywhere
        pageSize: perPage,
      },
    },
  })

  return (
    <div className="space-y-4">

      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((c) => c.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(v) =>
                    column.toggleVisibility(!!v)
                  }
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-hidden rounded-md border relative">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              // 🔥 skeleton rows
              Array.from({ length: perPage }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}
