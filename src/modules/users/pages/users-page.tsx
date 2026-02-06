import { useState } from "react";
import { Plus } from "lucide-react";

import UsersTable from "../components/users-table";
import { useUsersStore } from "../store";

import { Button } from "@/components/ui/button";
import UserFormDialog from "../components/user-form-dialog";

export default function Users() {
  const [open, setOpen] = useState(false);
  const { setSelectedUser } = useUsersStore();

  const handleAdd = () => {
    setSelectedUser(null); // create mode
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Users
        </h1>

        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Table */}
      <UsersTable />

      {/* Create/Edit Dialog */}
      <UserFormDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
