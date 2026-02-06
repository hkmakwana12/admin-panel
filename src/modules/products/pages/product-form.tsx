import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { productSchema, type ProductFormData } from "../schemas";
import { useProductsStore } from "../store";
import { useCategoriesStore } from "@/modules/categories/store";

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = !!id;

  const {
    selectedProduct,
    createProduct,
    updateProduct,
  } = useProductsStore();

  const { categories, fetchCategories } = useCategoriesStore();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  /* -------------------------
     load data
  ------------------------- */
  useEffect(() => {
    fetchCategories();
  }, []);

  /* -------------------------
     preload edit
  ------------------------- */
  useEffect(() => {
    if (selectedProduct) reset(selectedProduct);
  }, [selectedProduct]);

  /* -------------------------
     submit
  ------------------------- */
  const onSubmit = async (data: ProductFormData) => {
    if (isEdit) {
      await updateProduct(Number(id), data);
    } else {
      await createProduct(data);
    }

    navigate("/products");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">
      <h1 className="text-2xl font-semibold">
        {isEdit ? "Edit Product" : "Create Product"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FieldGroup>

          <Field data-invalid={!!errors.name}>
            <FieldLabel>Name</FieldLabel>
            <Input {...register("name")} />
            <FieldError errors={[errors.name]} />
          </Field>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <Input {...register("description")} />
          </Field>

          <Field data-invalid={!!errors.price}>
            <FieldLabel>Price</FieldLabel>
            <Input type="number" step="0.01" {...register("price")} />
            <FieldError errors={[errors.price]} />
          </Field>

          <Field data-invalid={!!errors.stock}>
            <FieldLabel>Stock</FieldLabel>
            <Input type="number" {...register("stock")} />
            <FieldError errors={[errors.stock]} />
          </Field>

          <Controller
            name="category_id"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Category</FieldLabel>
                <Select
                  value={String(field.value ?? "")}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </FieldGroup>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/products")}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isEdit
                ? "Update"
                : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
}
