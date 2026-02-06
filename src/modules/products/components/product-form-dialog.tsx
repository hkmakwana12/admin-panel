import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { productSchema, type ProductFormData } from "../schemas";
import { useProductsStore } from "../store";
import { setFormErrors } from "@/utils/setFormErrors";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategoriesStore } from "@/modules/categories/store";
import type { Category } from "@/modules/categories/types";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ProductFormDialog({ open, onClose }: Props) {
  const {
    selectedProduct,
    createProduct,
    updateProduct,
    setSelectedProduct,
  } = useProductsStore();

  const { categories, fetchCategories } = useCategoriesStore();

  useEffect(() => {
    fetchCategories();
  }, [open]);

  const isEdit = !!selectedProduct;

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  /* --------------------------
     preload edit values
  -------------------------- */
  useEffect(() => {
    if (selectedProduct) {
      reset(selectedProduct);
    } else {
      reset();
    }
  }, [selectedProduct, reset]);

  /* --------------------------
     submit
  -------------------------- */
  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEdit && selectedProduct) {
        await updateProduct(selectedProduct.id, data);
      } else {
        await createProduct(data);
      }

      handleClose();
    } catch (err: any) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) setFormErrors(serverErrors, setError);
    }
  };

  const handleClose = () => {
    setSelectedProduct(null);
    reset();
    onClose();
  };

  /* --------------------------
     UI
  -------------------------- */
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Product" : "Create Product"}
          </DialogTitle>
          <DialogDescription>
            Product Information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FieldGroup>

            {/* Name */}
            <Field data-invalid={!!errors.name}>
              <FieldLabel>Name</FieldLabel>
              <Input {...register("name")} />
              <FieldError errors={[errors.name]} />
            </Field>

            {/* Description */}
            <Field data-invalid={!!errors.description}>
              <FieldLabel>Description</FieldLabel>
              <Input {...register("description")} />
              <FieldError errors={[errors.description]} />
            </Field>

            {/* Price */}
            <Field data-invalid={!!errors.price}>
              <FieldLabel>Price</FieldLabel>
              <Input type="number" step="0.01" {...register("price")} />
              <FieldError errors={[errors.price]} />
            </Field>

            {/* Stock */}
            <Field data-invalid={!!errors.stock}>
              <FieldLabel>Stock</FieldLabel>
              <Input type="number" {...register("stock")} />
              <FieldError errors={[errors.stock]} />
            </Field>

            {/* Category */}
            <Controller
              name="category_id"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Category</FieldLabel>

                  <Select
                    value={String(field.value ?? "")}
                    onValueChange={(value: Number) => field.onChange(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>

                    <SelectContent>
                      {categories.map((cat: Category) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
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

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                  ? "Update"
                  : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
