import { z } from "zod";

/* ---------------------------------
   ENUMS
---------------------------------- */

export const roleEnum = z.enum(["admin", "moderator", "user"]);
export const statusEnum = z.enum(["active", "inactive", "suspended"]);

/* ---------------------------------
   BASE FIELDS (shared)
---------------------------------- */

const baseFields = {
  name: z.string().min(1, "Name is required"),

  email: z.string().min(1, "Email is required").email("Invalid email address"),

  role: roleEnum,
  status: statusEnum,
};

/* ---------------------------------
   CREATE SCHEMA
   password REQUIRED
---------------------------------- */

export const createUserSchema = z
  .object({
    ...baseFields,

    password: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

/* ---------------------------------
   UPDATE SCHEMA
   password OPTIONAL
---------------------------------- */

export const updateUserSchema = z
  .object({
    ...baseFields,

    password: z.string().min(6).optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      // if password empty → ignore
      if (!data.password) return true;

      return data.password === data.confirmPassword;
    },
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    },
  );

/* ---------------------------------
   TYPES
---------------------------------- */

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
