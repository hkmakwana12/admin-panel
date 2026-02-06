import { useContext, type JSX } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "../components/ui/field";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { loginSchema, type LoginFormData } from "../validations/authSchemas";
import { AuthContext } from "@/auth/auth-context";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);

      navigate("/");
    } catch (err: any) {
      console.log(err);
      setError("root", {
        message: err.response?.data?.message || "Login failed",
      });
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errors.root && <div className="text-red-600 mb-6">{errors.root.message}</div>}

              <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Field data-invalid={!!errors.email}>
                    <FieldLabel htmlFor="email">
                      Email
                    </FieldLabel>
                    <Input
                      {...register("email")}
                      id="email"
                      aria-invalid={!!errors.email}
                    />
                    {!!errors.email && (
                      <FieldError errors={[errors.email]} />
                    )}
                  </Field>

                  <Field data-invalid={!!errors.password}>
                    <FieldLabel htmlFor="password">
                      Password
                    </FieldLabel>
                    <Input
                      {...register("password")}
                      type="password"
                      id="password"
                      aria-invalid={!!errors.password}
                    />
                    {!!errors.password && (
                      <FieldError errors={[errors.password]} />
                    )}
                  </Field>

                  <Field>
                    <Button type="submit" disabled={isSubmitting}>Login</Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
