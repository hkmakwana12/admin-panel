import { useContext, type JSX } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "@/auth/auth-context";
import { Spinner } from "@/components/ui/spinner";

export default function ProtectedRoute(): JSX.Element {
  const { user, loading } = useContext(AuthContext);

  // 🔥 WAIT here
  if (loading) {
    return <Spinner />;
  }

  if (!user) return <Navigate to="/auth/login" replace />;

  return <Outlet />;
}
