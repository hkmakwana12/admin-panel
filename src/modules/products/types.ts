import type { Category } from "@/modules/categories/types";

export interface Product {
  id: number;

  name: string;
  description: string | null;

  price: number;
  stock: number;

  category: Category;
}

export interface ProductPayload {
  name: string;
  description?: string;

  price: number;
  stock: number;

  category_id: number;
}
