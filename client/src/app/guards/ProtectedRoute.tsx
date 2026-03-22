import React from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import type { PermissionKey } from "../../auth/types";
import { useAuth } from "../../auth/hooks/useAuth";

type ProtectedRouteProps = {
  children: ReactNode;
  requiredPermission?: PermissionKey;
};

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { isAuthReady, isAuthenticated, hasPermission } = useAuth();

  if (!isAuthReady) {
    return <div className="auth-loading">Lade Auth...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
