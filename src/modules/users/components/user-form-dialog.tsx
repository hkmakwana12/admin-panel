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

import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormData,
  type UpdateUserFormData,
} from "../schemas";

import { useUsersStore } from "../store";
import { setFormErrors } from "@/utils/setFormErrors";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function UserFormDialog({ open, onClose }: Props) {
  const {
    selectedUser,
    createUser,
    updateUser,
    setSelectedUser,
  } = useUsersStore();

  const isEdit = !!selectedUser;

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema),
  });

  /* ---------------------------------
     preload edit values
  ---------------------------------- */
  useEffect(() => {
    if (selectedUser) {
      reset({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        status: selectedUser.status,
        password: "",
        confirmPassword: "",
      });
    } else {
      reset();
    }
  }, [selectedUser, reset]);

  /* ---------------------------------
     submit
  ---------------------------------- */
  const onSubmit = async (data: any) => {
    try {
      const payload: any = {
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status,
      };

      if (data.password) {
        payload.password = data.password;
        payload.password_confirmation = data.confirmPassword;
      }

      if (isEdit && selectedUser) {
        await updateUser(selectedUser.id, payload);
      } else {
        await createUser(payload);
      }

      handleClose();
    } catch (err: any) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) setFormErrors(serverErrors, setError);
    }
  };

  const handleClose = () => {
    setSelectedUser(null);
    reset();
    onClose();
  };

  /* ---------------------------------
     UI
  ---------------------------------- */
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit User" : "Create User"}
          </DialogTitle>
          <DialogDescription>
            User Information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FieldGroup>

            {/* Name */}
            <Field data-invalid={!!errors.name}>
              <FieldLabel>Name</FieldLabel>
              <Input {...register("name")} aria-invalid={!!errors.name} />
              <FieldError errors={[errors.name]} />
            </Field>

            {/* Email */}
            <Field data-invalid={!!errors.email}>
              <FieldLabel>Email</FieldLabel>
              <Input type="email" {...register("email")} aria-invalid={!!errors.email} />
              <FieldError errors={[errors.email]} />
            </Field>

            {/* Password */}
            <Field data-invalid={!!errors.password}>
              <FieldLabel>
                {isEdit ? "New Password (optional)" : "Password"}
              </FieldLabel>
              <Input type="password" {...register("password")} aria-invalid={!!errors.password} />
              <FieldError errors={[errors.password]} />
            </Field>

            {/* Confirm */}
            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel>Confirm Password</FieldLabel>
              <Input type="password" {...register("confirmPassword")} aria-invalid={!!errors.confirmPassword} />
              <FieldError errors={[errors.confirmPassword]} />
            </Field>

            {/* Role */}
            <Controller
              name="role"
              control={control}
              defaultValue="admin"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="role">Role</FieldLabel>

                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="role" aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="user">User</SelectItem>
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
              defaultValue="active"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="status">Status</FieldLabel>

                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="status" aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
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
