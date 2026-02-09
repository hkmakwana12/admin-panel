/* ---------------- ORDER STATUS ---------------- */

export const ORDER_STATUSES = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "processing",
    label: "Processing",
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "shipped",
    label: "Shipped",
    color: "bg-green-100 text-green-700",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-green-100 text-green-700",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
  },
] as const;

/* ---------------- PAYMENT STATUS ---------------- */

export const PAYMENT_STATUSES = [
  {
    value: "pending",
    label: "pending",
    color: "bg-red-100 text-red-700",
  },
  {
    value: "failed",
    label: "failed",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "paid",
    label: "Paid",
    color: "bg-green-100 text-green-700",
  },
  {
    value: "refunded",
    label: "Refunded",
    color: "bg-gray-100 text-gray-700",
  },
] as const;

export const getOrderStatusMeta = (value: string) =>
  ORDER_STATUSES.find((s) => s.value === value);

export const getPaymentStatusMeta = (value: string) =>
  PAYMENT_STATUSES.find((s) => s.value === value);
