"use client"

import * as React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUserStore } from "@/store/useUserStore"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"

// 🧠 Validation schema
const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  // `z.enum` in TSX only takes the values array, so we don't pass `required_error` here
  role: z.enum(["admin", "user"]),
  status: z.enum(["active", "inactive", "blocked"]),
  // Password fields – actual validation is handled in onSubmit so we can make it conditional
  password: z.string().optional(),
  password_confirmation: z.string().optional(),
})

type UserFormValues = z.infer<typeof userFormSchema>

export default function UserFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const {
    currentUser,
    fetchUser,
    createUser,
    updateUser,
    loading,
    error,
  } = useUserStore()

  const [submitting, setSubmitting] = React.useState<boolean>(false)
  const [formError, setFormError] = React.useState<string | null>(null)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      status: "active",
      password: "",
      password_confirmation: "",
    },
  })

  // Fetch user data when editing
  React.useEffect(() => {
    if (isEdit && id) {
      fetchUser(id)
    }
  }, [isEdit, id])

  // Fill form once currentUser is loaded
  React.useEffect(() => {
    if (isEdit && currentUser) {
      form.reset({
        name: currentUser.name ?? "",
        email: currentUser.email ?? "",
        role: (currentUser.role as UserFormValues["role"]) ?? "user",
        status: (currentUser.status as UserFormValues["status"]) ?? "active",
        // password fields stay blank on edit
        password: "",
        password_confirmation: "",
      })
    }
  }, [isEdit, currentUser, form])

  const onSubmit = async (values: UserFormValues) => {
    setSubmitting(true)
    setFormError(null)

    // 🌟 Password validation (only strict on create)
    if (!isEdit) {
      // CREATE mode: password is required
      if (!values.password) {
        form.setError("password", {
          type: "manual",
          message: "Password is required.",
        })
        setSubmitting(false)
        return
      }

      if (values.password.length < 8) {
        form.setError("password", {
          type: "manual",
          message: "Password must be at least 8 characters.",
        })
        setSubmitting(false)
        return
      }

      if (!values.password_confirmation) {
        form.setError("password_confirmation", {
          type: "manual",
          message: "Please confirm your password.",
        })
        setSubmitting(false)
        return
      }

      if (values.password !== values.password_confirmation) {
        form.setError("password_confirmation", {
          type: "manual",
          message: "Passwords do not match.",
        })
        setSubmitting(false)
        return
      }
    } else {
      // EDIT mode: password is optional, but if user enters it, validate it
      const hasPasswordInput =
        (values.password && values.password.length > 0) ||
        (values.password_confirmation && values.password_confirmation.length > 0)

      if (hasPasswordInput) {
        if (!values.password || values.password.length < 8) {
          form.setError("password", {
            type: "manual",
            message: "Password must be at least 8 characters.",
          })
          setSubmitting(false)
          return
        }

        if (values.password !== values.password_confirmation) {
          form.setError("password_confirmation", {
            type: "manual",
            message: "Passwords do not match.",
          })
          setSubmitting(false)
          return
        }
      }
    }

    try {
      if (isEdit && id) {
        const updated = await updateUser(id, values)
        if (updated) navigate("/users")
      } else {
        const created = await createUser(values)
        if (created) navigate("/users")
      }
    } catch (err: any) {
      // 🔴 Handle server-side (422) validation errors
      if (err?.type === "validation" && err.errors) {
        const serverErrors = err.errors as Record<string, string[]>

        Object.entries(serverErrors).forEach(([field, messages]) => {
          const msg = messages[0]
          if (!msg) return

          // Only map known fields into RHF
          if (field in userFormSchema.shape) {
            form.setError(field as keyof UserFormValues, {
              type: "server",
              message: msg,
            })
          } else {
            // For unknown fields, show a generic form-level error
            setFormError((prev) =>
              prev ? `${prev}\n${msg}` : msg
            )
          }
        })
      } else {
        setFormError("Something went wrong. Please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  const title = isEdit ? "Edit User" : "Create User"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => navigate("/users")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      </div>

      {/* Generic store error (non-validation) */}
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      {/* Generic form-level error */}
      {formError && (
        <p className="text-sm text-red-500 whitespace-pre-line">
          {formError}
        </p>
      )}

      {/* Loading placeholder while fetching edit data */}
      {isEdit && loading && !currentUser ? (
        <div className="rounded-md border bg-muted/40 p-4 text-sm text-muted-foreground">
          Loading user data...
        </div>
      ) : (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-2xl space-y-5"
        >
          {/* Card with fields */}
          <Card className="w-full">
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="name">
                        Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="name"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter full name"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email">
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="user@example.com"
                        autoComplete="email"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="role"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="role">
                        Role
                      </FieldLabel>
                      <Select
                        onValueChange={(value) =>
                          form.setValue("role", value as UserFormValues["role"], {
                            shouldValidate: true,
                          })
                        }
                        value={field.value}
                        defaultValue="user"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="status"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="status">
                        Status
                      </FieldLabel>
                      <Select
                        onValueChange={(value) =>
                          form.setValue("status", value as UserFormValues["status"], {
                            shouldValidate: true,
                          })
                        }
                        value={field.value}
                        defaultValue="active"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Password */}
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="password">
                        Password{" "}
                        {isEdit && (
                          <span className="ml-1 text-xs text-muted-foreground">
                            (leave blank to keep current)
                          </span>
                        )}
                      </FieldLabel>
                      <Input
                        {...field}
                        id="password"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder={
                          isEdit
                            ? "Leave blank to keep existing password"
                            : "Enter password"
                        }
                        autoComplete="new-password"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Confirm Password */}
                <Controller
                  name="password_confirmation"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="password_confirmation">
                        Confirm Password
                      </FieldLabel>
                      <Input
                        {...field}
                        id="password_confirmation"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Re-enter password"
                        autoComplete="new-password"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Buttons outside the card */}
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={submitting}>
              {submitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEdit ? "Update User" : "Create User"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/users")}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
