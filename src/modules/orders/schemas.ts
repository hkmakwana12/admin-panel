import { z } from "zod";

export const orderSchema = z.object({
  user_id: z.coerce.number("User required").min(1, "User required"),

  status: z.string("Status required").min(1, "Status required"),
  payment_status: z
    .string("Payment status required")
    .min(1, "Payment status required"),

  items: z
    .array(
      z.object({
        product_id: z.coerce.number().min(1, "Product required"),
        quantity: z.coerce.number().int().min(1),
        unit_price: z.coerce.number().min(0),
      }),
    )
    .min(1, "Add at least one item"),

  total_amount: z.coerce.number().min(0),
});

export type OrderFormData = z.infer<typeof orderSchema>;
