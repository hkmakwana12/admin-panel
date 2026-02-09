import type { Product } from "@/modules/products/types";
import type { User } from "@/modules/users/types";
import type { ORDER_STATUSES, PAYMENT_STATUSES } from "./constants";

export type OrderStatus = (typeof ORDER_STATUSES)[number]["value"];

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]["value"];

export interface OrderItem {
  product_id: number;
  quantity: number;
  unit_price: number;
  product?: Product;
}

export interface Order {
  id: number;
  order_number: String;
  user_id: number;
  user: User;

  status: OrderStatus;
  payment_status: PaymentStatus;

  total_amount: Number;

  items: OrderItem[];
}

/* payload */
export interface OrderPayload {
  user_id: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  items: OrderItem[];
  total_amount: Number;
}
