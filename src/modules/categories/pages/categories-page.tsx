import { useState } from "react";
import { Plus } from "lucide-react";

import CategoriesTable from "../components/categories-table";
import CategoryFormDialog from "../components/category-form-dialog";
import { useCategoriesStore } from "../store";

import { Button } from "@/components/ui/button";

export default function Categories() {
  const [open, setOpen] = useState(false);
  const { setSelectedCategory } = useCategoriesStore();

  const handleAdd = () => {
    setSelectedCategory(null); // create mode
    setOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Categories
        </h1>

        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Table */}
      <CategoriesTable />

      {/* Create/Edit Dialog */}
      <CategoryFormDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
