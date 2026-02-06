import type { UseFormSetError } from "react-hook-form";

export function setFormErrors(
  errors: Record<string, string[]>,
  setError: UseFormSetError<any>,
) {
  Object.entries(errors).forEach(([field, messages]) => {
    setError(field as any, {
      type: "server",
      message: messages[0],
    });
  });
}
