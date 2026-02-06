import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name required"),

  description: z.string().nullable().optional(),

  price: z.coerce.number().min(0, "Price must be positive"),

  stock: z.coerce.number().int().min(0, "Stock must be 0 or more"),

  category_id: z.coerce.number().min(1, "Category required"),
});

export type ProductFormData = z.infer<typeof productSchema>;
