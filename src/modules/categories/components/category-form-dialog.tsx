import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { categorySchema, type CategoryFormData } from "../schemas";
import { useCategoriesStore } from "../store";
import { setFormErrors } from "@/utils/setFormErrors";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { DialogDescription } from "../../../components/ui/dialog";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CategoryFormDialog({ open, onClose }: Props) {
  const {
    selectedCategory,
    createCategory,
    updateCategory,
    setSelectedCategory,
  } = useCategoriesStore();

  const isEdit = !!selectedCategory;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  // preload edit values
  useEffect(() => {
    if (selectedCategory) {
      reset({
        name: selectedCategory.name,
        description: selectedCategory.description,
      });
    } else {
      reset({
        name: "",
        description: "",
      });
    }
  }, [selectedCategory, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
      };

      if (isEdit && selectedCategory) {
        await updateCategory(selectedCategory.id, payload);
      } else {
        await createCategory(payload);
      }

      handleClose();
    } catch (err: any) {
      const serverErrors = err.response?.data?.errors;

      if (serverErrors) setFormErrors(serverErrors, setError);
    }
  };

  const handleClose = () => {
    setSelectedCategory(null);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Category" : "Create Category"}
          </DialogTitle>
          <DialogDescription>
            Category Information
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">
                Name
              </FieldLabel>
              <Input
                {...register("name")}
                id="name"
                aria-invalid={!!errors.name}
              />
              {!!errors.name && (
                <FieldError errors={[errors.name]} />
              )}
            </Field>

            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="description">
                Description
              </FieldLabel>
              <Textarea rows={3}
                {...register("description")}
                id="description"
                aria-invalid={!!errors.description}
              />
              {!!errors.description && (
                <FieldError errors={[errors.description]} />
              )}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
            >
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
