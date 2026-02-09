import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Edit, MoreHorizontal, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/table/data-table"

import ConfirmDialog from "@/components/confirm-dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/table/data-table-column-header"
import { useNavigate } from "react-router-dom"
import { getOrderStatusMeta, getPaymentStatusMeta } from "../constants"
import { useOrdersStore } from "../store"
import type { Order } from "../types"

export default function OrdersTable() {
  const {
    orders,
    loading,
    total,

    page,
    perPage,
    sort,
    order,

    fetchOrders,
    deleteOrder,
    setPagination,
    setSorting,
  } = useOrdersStore()

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const navigate = useNavigate();

  /* -------------------------------------------------
     ✅ FIXED: fetch when ANY server param changes
  ------------------------------------------------- */
  useEffect(() => {
    fetchOrders()
  }, [page, perPage, sort, order])

  const handleDelete = (id: number) => {
    setDeleteId(id)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    await deleteOrder(deleteId)
    setConfirmOpen(false)
  }

  const columns: ColumnDef<Order>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: Number) =>
            table.toggleAllPageRowsSelected(!!value)
          }
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: Number) => row.toggleSelected(!!value)}
        />
      ),
    },
    {
      accessorKey: "order_number",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order #" />
      ),
      cell: ({ row }) => (
        <span className="font-semibold">#{row.original.order_number}</span>
      ),
    },
    {
      accessorKey: "user_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="User" />
      ),
      cell: ({ row }) => row.original?.user?.name,
    },
    {
      accessorKey: 'items',
      header: "Items",
      cell: ({ row }) => row.original.items.length,
    },
    {
      accessorKey: 'total',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total" />
      ),
      cell: ({ row }) => `₹ ${row.original.total_amount.toFixed(2)}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const meta = getOrderStatusMeta(row.original.status)

        return (
          <span className={`px-2 py-1 rounded text-xs ${meta?.color}`}>
            {meta?.label}
          </span>
        )
      },
    },
    {
      accessorKey: "payment_status",
      header: "Payment Status",
      cell: ({ row }) => {
        const meta = getPaymentStatusMeta(row.original.payment_status)

        return (
          <span className={`px-2 py-1 rounded text-xs ${meta?.color}`}>
            {meta?.label}
          </span>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const order = row.original

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                <DropdownMenuItem onClick={() => navigate(`/orders/${order.id}/edit`)}>
                  <Edit /> Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => handleDelete(order.id)}
                >
                  <Trash /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={orders}
        page={page}
        perPage={perPage}
        total={total}
        loading={loading}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Order"
        message="This action cannot be undone. Are you sure?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  )
}
