import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Edit, MoreHorizontal, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/table/data-table"

import UserFormDialog from "./user-form-dialog"
import ConfirmDialog from "@/components/confirm-dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useUsersStore } from "../store"
import type { User } from "../types"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/table/data-table-column-header"

export default function UsersTable() {
  const {
    users,
    loading,
    total,

    page,
    perPage,
    sort,
    order,

    fetchUsers,
    deleteUser,
    setSelectedUser,
    setPagination,
    setSorting,
  } = useUsersStore()

  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  /* -------------------------------------------------
     ✅ FIXED: fetch when ANY server param changes
  ------------------------------------------------- */
  useEffect(() => {
    fetchUsers()
  }, [page, perPage, sort, order])

  const handleEdit = (row: User) => {
    setSelectedUser(row)
    setOpen(true)
  }

  const handleDelete = (id: number) => {
    setDeleteId(id)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    await deleteUser(deleteId)
    setConfirmOpen(false)
  }

  const columns: ColumnDef<User>[] = [
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
      cell: ({ row }) => {
        const user = row.original

        return <span className="font-semibold">{user.name}</span>
      }
    },
    {
      accessorKey: "email",
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email Address" />
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original

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

                <DropdownMenuItem
                  onClick={() => handleEdit(user)}
                >
                  <Edit /> Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => handleDelete(user.id)}
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
        data={users}
        page={page}
        perPage={perPage}
        total={total}
        loading={loading}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
      />

      <UserFormDialog open={open} onClose={() => setOpen(false)} />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete User"
        message="This action cannot be undone. Are you sure?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  )
}
