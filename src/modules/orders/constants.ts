/* ---------------- ORDER STATUS ---------------- */

export const ORDER_STATUSES = [
  {
    value: "pending",
    label: "Pending",
    color:
      "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  },
  {
    value: "processing",
    label: "Processing",
    color: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    value: "shipped",
    label: "Shipped",
    color: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
] as const;

/* ---------------- PAYMENT STATUS ---------------- */

export const PAYMENT_STATUSES = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
  {
    value: "failed",
    label: "Failed",
    color:
      "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  },
  {
    value: "paid",
    label: "Paid",
    color: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  {
    value: "refunded",
    label: "Refunded",
    color: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  },
] as const;

export const getOrderStatusMeta = (value: string) =>
  ORDER_STATUSES.find((s) => s.value === value);

export const getPaymentStatusMeta = (value: string) =>
  PAYMENT_STATUSES.find((s) => s.value === value);
