import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Name required"),
  description: z.string().nullable(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
