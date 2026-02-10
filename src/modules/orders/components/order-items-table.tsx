import { Controller, type Control, type UseFormRegister, type UseFormSetValue } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Plus, Trash } from "lucide-react"

import type { OrderFormData } from "../schemas"
import type { Product } from "@/modules/products/types"

interface Props {
  control: Control<OrderFormData>
  register: UseFormRegister<OrderFormData>
  fields: any[]
  append: any
  remove: any
  products: Product[]
  setValue: UseFormSetValue<OrderFormData>
}

export default function OrderItemsTable({
  control,
  register,
  fields,
  append,
  remove,
  products,
  setValue
}: Props) {
  return (
    <div className="space-y-4">

      <div className="flex justify-between">
        <h2 className="font-semibold">Items</h2>

        <Button
          type="button"
          size="sm"
          onClick={() =>
            append({ product_id: 0, quantity: 1, unit_price: 0 })
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {fields.map((f, index) => (
        <div key={f.id} className="grid grid-cols-12 gap-3 items-end">

          <Controller
            control={control}
            name={`items.${index}.product_id`}
            render={({ field }) => (
              <div className="col-span-5">
                <FieldLabel>Product</FieldLabel>

                <Select
                  value={String(field.value)}
                  onValueChange={(v) => {
                    const id = Number(v)

                    field.onChange(id)

                    // ⭐ AUTO SET PRICE
                    const product = products.find(p => p.id === id)

                    if (product) {
                      setValue(
                        `items.${index}.unit_price`,
                        product.price
                      )
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>

                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <div className="col-span-2">
            <FieldLabel>Qty</FieldLabel>
            <Input type="number" {...register(`items.${index}.quantity`)} />
          </div>

          <div className="col-span-3">
            <FieldLabel>Unit Price</FieldLabel>
            <Input type="number" step="0.01" {...register(`items.${index}.unit_price`)} />
          </div>

          <Button
            type="button"
            variant="destructive"
            className="col-span-2"
            onClick={() => remove(index)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
