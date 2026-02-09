import { useEffect, useState } from "react";
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
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { productSchema, type ProductFormData } from "../schemas";
import { useProductsStore } from "../store";
import { useCategoriesStore } from "@/modules/categories/store";
import Loader from "@/components/loader";
import type { Category } from "@/modules/categories/types";
import { ArrowLeft } from "lucide-react";
import CategoryFormDialog from "@/modules/categories/components/category-form-dialog";
import { setFormErrors } from "@/utils/setFormErrors";

export default function ProductForm() {
  const [openCategory, setOpenCategory] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = !!id;

  const {
    loading,
    createProduct,
    updateProduct,
    fetchProductById, // must RETURN product
  } = useProductsStore();

  const { categories, fetchCategoryOptions } = useCategoriesStore();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  /* ---------------------------------
     Load categories + product
  ---------------------------------- */
  useEffect(() => {
    fetchCategoryOptions();

    if (!isEdit) return;

    const load = async () => {
      const product = await fetchProductById(Number(id));
      if (product) reset(product);
    };

    load();
  }, [id]);

  /* ---------------------------------
     Submit
  ---------------------------------- */
  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEdit) {
        await updateProduct(Number(id), data);
      } else {
        await createProduct(data);
      }

      navigate("/products");
    } catch (err: any) {
      const serverErrors = err.response?.data?.errors;

      if (serverErrors) setFormErrors(serverErrors, setError);
    }
  };

  /* ---------------------------------
    UI
  ---------------------------------- */
  if (isEdit && loading) {
    return <Loader />
  }

  return (
    <div className="max-w-5xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex gap-3">
          <Button variant="outline" size="icon" type="button" onClick={() => navigate("/products")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? "Edit Product" : "Create Product"}</h1>
        </div>
        <Card>
          <CardContent>
            {/* ---------------- GRID ---------------- */}
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Name */}
              <Field
                className="md:col-span-2"
                data-invalid={!!errors.name}
              >
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
                <FieldError errors={[errors.name]} />
              </Field>

              {/* Description */}
              <Field className="md:col-span-2">
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Input id="description" {...register("description")} aria-invalid={!!errors.description} />
              </Field>

              {/* Price */}
              <Field data-invalid={!!errors.price}>
                <FieldLabel htmlFor="price">Price</FieldLabel>
                <Input type="number" id="price" step="0.01" {...register("price")} aria-invalid={!!errors.price} />
                <FieldError errors={[errors.price]} />
              </Field>

              {/* Stock */}
              <Field data-invalid={!!errors.stock}>
                <FieldLabel htmlFor="stock">Stock</FieldLabel>
                <Input type="number" id="stock" {...register("stock")} aria-invalid={!!errors.stock} />
                <FieldError errors={[errors.stock]} />
              </Field>

              {/* Category */}
              <Controller
                name="category_id"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className="md:col-span-2" data-invalid={fieldState.invalid}>
                    <div className="flex justify-between">
                      <FieldLabel htmlFor="category_id">Category</FieldLabel>
                      <Button
                        type="button"
                        variant="link"
                        className="py-0"
                        onClick={() => setOpenCategory(true)}
                      >
                        Add Category
                      </Button>
                    </div>
                    <Select
                      value={String(field.value ?? "")}
                      onValueChange={(v: Number) =>
                        field.onChange(Number(v))
                      }
                    >
                      <SelectTrigger className="w-full" id="category_id" aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>

                      <SelectContent>
                        {categories.map((category: Category) => (
                          <SelectItem
                            key={category.id}
                            value={String(category.id)}
                          >
                            {category.name}
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
        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isEdit
                ? "Update"
                : "Create"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/products")}
          >
            Cancel
          </Button>
        </div>
      </form>

      <CategoryFormDialog
        open={openCategory}
        onClose={(newId: Number) => {
          setOpenCategory(false);
          fetchCategoryOptions();
          if (newId) setValue("category_id", newId);
        }}
      />
    </div>
  );
}
