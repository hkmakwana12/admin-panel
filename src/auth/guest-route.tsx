import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

import { AuthContext } from "@/auth/auth-context";

export default function GuestRoute() {
  const { user, loading } = useContext(AuthContext);

  // wait until auth check finishes
  if (loading) {
    return <Spinner />;
  }

  // 🔥 already logged in → dashboard
  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
}
