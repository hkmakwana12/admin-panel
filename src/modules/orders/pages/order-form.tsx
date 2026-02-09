import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  useForm,
  Controller,
  useFieldArray,
  useWatch,
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import Loader from "@/components/loader"

import { orderSchema, type OrderFormData } from "../schemas"
import { useOrdersStore } from "../store"
import { useProductsStore } from "@/modules/products/store"

import { ArrowLeft } from "lucide-react"
import { useUsersStore } from "@/modules/users/store"
import type { User } from "@/modules/users/types"
import { ORDER_STATUSES, PAYMENT_STATUSES } from "../constants"
import { setFormErrors } from "@/utils/setFormErrors"
import OrderItemsTable from "../components/order-items-table"

export default function OrderForm() {

  const navigate = useNavigate()
  const { id } = useParams()

  const isEdit = !!id

  const {
    loading,
    createOrder,
    updateOrder,
    fetchOrderById,
  } = useOrdersStore()


  const { users, fetchUsers } = useUsersStore()

  const { products, fetchProducts } = useProductsStore()

  /* ---------------- FORM ---------------- */
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    setError
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      status: 'pending',
      payment_status: 'pending',
      items: [],
      total_amount: 0,
    },
  })

  /* ---------------- FIELD ARRAY ---------------- */
  const { fields, append, remove } =
    useFieldArray({
      control,
      name: "items",
    })

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    fetchProducts();
    fetchUsers();

    if (!isEdit) return

    const load = async () => {
      const order = await fetchOrderById(Number(id))
      if (order) reset(order)
    }

    load()
  }, [id])

  /* ---------------- TOTAL ---------------- */
  const items = useWatch({
    control,
    name: "items",
  })

  useEffect(() => {
    const total =
      items?.reduce(
        (sum, item) =>
          sum + item.quantity * item.unit_price,
        0
      ) ?? 0

    setValue("total_amount", total, {
      shouldValidate: true,
    })
  }, [items, setValue])

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async (data: OrderFormData) => {
    try {
      if (isEdit) {
        await updateOrder(Number(id), data);
      } else {
        await createOrder(data);
      }

      navigate("/orders");
    } catch (err: any) {
      const serverErrors = err.response?.data?.errors;

      if (serverErrors) setFormErrors(serverErrors, setError);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (isEdit && loading) {
    return <Loader />
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Header */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => navigate("/orders")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <h1 className="text-2xl font-semibold tracking-tight">
            {isEdit ? "Edit Order" : "Create Order"}
          </h1>
        </div>

        {/* ---------------- ORDER INFO ---------------- */}
        <Card>
          <CardContent>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* User */}
              <Controller
                name="user_id"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>User</FieldLabel>

                    <Select
                      value={String(field.value ?? "")}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>

                      <SelectContent>
                        {users.map((user: User) => (
                          <SelectItem
                            key={user.id}
                            value={String(user.id)}
                          >
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Status */}
              <Controller
                name="status"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Status</FieldLabel>

                    <Select
                      value={String(field.value ?? "")}
                      onValueChange={(v) => field.onChange(v)}
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>

                      <SelectContent>
                        {ORDER_STATUSES.map((status) => (
                          <SelectItem
                            key={status.value}
                            value={String(status.value)}
                          >
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Payment Status */}
              <Controller
                name="payment_status"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Payment Status</FieldLabel>

                    <Select
                      value={String(field.value ?? "")}
                      onValueChange={(v) => field.onChange(v)}
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select Payment Status" />
                      </SelectTrigger>

                      <SelectContent>
                        {PAYMENT_STATUSES.map((status) => (
                          <SelectItem
                            key={status.value}
                            value={String(status.value)}
                          >
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        {/* ---------------- ITEMS ---------------- */}
        <Card>
          <CardContent className="space-y-4">

            <OrderItemsTable
              control={control}
              register={register}
              fields={fields}
              append={append}
              remove={remove}
              products={products}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <FieldGroup>
              <Field data-invalid={!!errors.total_amount}>
                <FieldLabel htmlFor="total_amount">
                  Total Amount
                </FieldLabel>
                <Input
                  {...register("total_amount")}
                  id="total_amount"
                  readOnly
                  aria-invalid={!!errors.total_amount}
                />
                {!!errors.total_amount && (
                  <FieldError errors={[errors.total_amount]} />
                )}
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/orders")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
