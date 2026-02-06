import { type Table } from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const pagination = table.getState().pagination

  return (
    <div className="flex items-center justify-between px-2">
      {/* selection info */}
      <div className="text-muted-foreground flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">

        {/* ---------------- Rows per page ---------------- */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>

          <Select
            value={`${pagination.pageSize}`}
            onValueChange={(value) =>
              table.setPagination((old) => ({
                ...old,
                pageIndex: 0, // reset
                pageSize: Number(value),
              }))
            }
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent side="top">
              {[10, 25, 50, 100].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ---------------- page info ---------------- */}
        <div className="flex w-[120px] items-center justify-center text-sm font-medium">
          Page {pagination.pageIndex + 1} of {table.getPageCount()}
        </div>

        {/* ---------------- navigation ---------------- */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              table.setPagination((old) => ({
                ...old,
                pageIndex: 0,
              }))
            }
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              table.setPagination((old) => ({
                ...old,
                pageIndex: table.getPageCount() - 1,
              }))
            }
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
