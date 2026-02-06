import { useState } from "react";
import { Plus } from "lucide-react";

import ProductsTable from "../components/products-table";
import { useProductsStore } from "../store";

import { Button } from "@/components/ui/button";
import ProductFormDialog from "../components/product-form-dialog";

export default function Products() {
  const [open, setOpen] = useState(false);
  const { setSelectedProduct } = useProductsStore();

  const handleAdd = () => {
    setSelectedProduct(null); // create mode
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Products
        </h1>

        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Table */}
      <ProductsTable />

      {/* Create/Edit Dialog */}
      <ProductFormDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
