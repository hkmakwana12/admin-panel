import { type Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={className}>{title}</div>
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("h-8 px-2 flex items-center gap-2", className)}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      <span>{title}</span>

      {column.getIsSorted() === "asc" && <ArrowUp className="h-4 w-4" />}
      {column.getIsSorted() === "desc" && <ArrowDown className="h-4 w-4" />}
      {!column.getIsSorted() && <ChevronsUpDown className="h-4 w-4 opacity-40" />}
    </Button>
  )
}
