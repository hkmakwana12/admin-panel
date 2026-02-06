import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Edit, MoreHorizontal, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/table/data-table"

import ProductFormDialog from "./product-form-dialog"
import ConfirmDialog from "@/components/confirm-dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useProductsStore } from "../store"
import type { Product } from "../types"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/table/data-table-column-header"

export default function ProductsTable() {
  const {
    products,
    loading,
    total,

    page,
    perPage,
    sort,
    order,

    fetchProducts,
    deleteProduct,
    setSelectedProduct,
    setPagination,
    setSorting,
  } = useProductsStore()

  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  /* -------------------------------------------------
     ✅ FIXED: fetch when ANY server param changes
  ------------------------------------------------- */
  useEffect(() => {
    fetchProducts()
  }, [page, perPage, sort, order])

  const handleEdit = (row: Product) => {
    setSelectedProduct(row)
    setOpen(true)
  }

  const handleDelete = (id: number) => {
    setDeleteId(id)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    await deleteProduct(deleteId)
    setConfirmOpen(false)
  }

  const columns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
    },

    {
      accessorKey: "name",
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <span className="font-semibold">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "category_id",
      header: "Category",
      cell: ({ row }) => {

        return <span>{row.original?.category?.name ?? "-"}</span>;
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ row }) => `₹ ${row.original.price}`,
    },
    {
      accessorKey: "stock",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Stock" />
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original

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

                <DropdownMenuItem onClick={() => handleEdit(product)}>
                  <Edit /> Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => handleDelete(product.id)}
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
        data={products}
        page={page}
        perPage={perPage}
        total={total}
        loading={loading}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
      />

      <ProductFormDialog open={open} onClose={() => setOpen(false)} />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Product"
        message="This action cannot be undone. Are you sure?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  )
}
