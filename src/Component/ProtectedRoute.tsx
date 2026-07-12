import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../auth/Authentication";

 export function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const isAuthenticated = useAuthStore((state) =>
    state.isAuthenticated()
  );

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
 export function AdminProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const isAuthenticated = useAuthStore((state) =>
    state.isAuthenticated()
  );
  const role = useAuthStore().user?.role;
  return isAuthenticated && role === "admin" ? children : <Navigate to="/login" replace />;
}
