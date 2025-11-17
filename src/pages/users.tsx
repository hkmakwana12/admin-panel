"use client";

import * as React from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type VisibilityState,
  type PaginationState,
} from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { DataTable } from "@/components/data-table";
import { DataTableViewOptions } from "@/components/data-table-view-options";
import { userColumns } from "@/pages/users/columns";
import { useUserStore } from "@/store/useUserStore";

export default function UsersPage() {
  const { users, total, lastPage, loading, error, fetchUsers } = useUserStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL is the single source of truth
  const page = Number(searchParams.get("page") ?? "1");
  const perPage = Number(searchParams.get("per_page") ?? "10");
  const q = searchParams.get("q") ?? "";
  const status = searchParams.get("status") ?? "all";
  const role = searchParams.get("role") ?? "all";
  const sortBy = searchParams.get("sort_by");
  const sortDir =
    (searchParams.get("sort_dir") as "asc" | "desc" | null) ?? "asc";

  const [sorting, setSorting] = React.useState<SortingState>(
    sortBy
      ? [
          {
            id: sortBy,
            desc: sortDir === "desc",
          },
        ]
      : [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Fetch whenever params change
  React.useEffect(() => {
    fetchUsers({
      page,
      perPage,
      q,
      status,
      role,
      sortBy: sortBy ?? null,
      sortDir,
    });
  }, [page, perPage, q, status, role, sortBy, sortDir]);

  const paginationState: PaginationState = {
    pageIndex: page - 1,
    pageSize: perPage,
  };

  const table = useReactTable({
    data: users,
    columns: userColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    manualPagination: true,
    pageCount: lastPage,
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(paginationState) : updater;

      const params = new URLSearchParams(searchParams);
      params.set("page", String(next.pageIndex + 1));
      params.set("per_page", String(next.pageSize));

      setSearchParams(params);
    },

    manualSorting: true,
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;

      setSorting(next);

      const sort = next[0];
      const params = new URLSearchParams(searchParams);

      if (sort) {
        const dir = sort.desc ? "desc" : "asc";
        params.set("sort_by", sort.id);
        params.set("sort_dir", dir);
        params.set("page", "1"); // reset to first page when sorting changes
      } else {
        params.delete("sort_by");
        params.delete("sort_dir");
      }

      setSearchParams(params);
    },

    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination: paginationState,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  // Handlers for filters/search that only update URL
  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set("q", value);
    else params.delete("q");
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") params.delete("status");
    else params.set("status", value);
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleRoleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") params.delete("role");
    else params.set("role", value);
    params.set("page", "1");
    setSearchParams(params);
  };

  return (
    <div>
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <Button asChild>
          <Link to="/users/create">
            <PlusCircle className="me-2" /> Add New User
          </Link>
        </Button>
      </div>

      {/* Toolbar */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search name or email..."
          value={q}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-xs"
        />

        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>

        <Select value={role} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>

        <DataTableViewOptions table={table} />
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {/* Table + inline skeleton */}
      <div className="mt-4">
        {loading ? (
          <div className="overflow-hidden rounded-md border">
            {/* Header skeleton */}
            <div className="flex items-center gap-4 border-b bg-muted/40 px-4 py-3">
              <Skeleton className="h-4 w-4 rounded" /> {/* checkbox */}
              <Skeleton className="h-4 w-24" /> {/* name */}
              <Skeleton className="h-4 w-32" /> {/* email */}
              <Skeleton className="h-4 w-20" /> {/* role */}
              <Skeleton className="h-4 w-20" /> {/* status */}
              <Skeleton className="h-4 w-16" /> {/* orders */}
              <Skeleton className="ml-auto h-4 w-10" /> {/* actions */}
            </div>

            {/* Row skeletons */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b px-4 py-3"
              >
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-52" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="ml-auto h-4 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <DataTable table={table} />
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Page {page} of {lastPage} — {total} records
        </span>
      </div>
    </div>
  );
}
