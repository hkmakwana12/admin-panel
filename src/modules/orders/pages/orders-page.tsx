import { Plus } from "lucide-react";

import OrdersTable from "../components/orders-table";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Orders
        </h1>

        <Button className="gap-2" onClick={() => navigate("/orders/create")}>
          <Plus className="h-4 w-4" />
          Add Order
        </Button>
      </div>

      {/* Table */}
      <OrdersTable />
    </div>
  );
}
