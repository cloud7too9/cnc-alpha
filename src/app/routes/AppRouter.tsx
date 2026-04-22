import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { LoginScreen } from "../../auth/components/LoginScreen";
import { ProtectedRoute } from "../guards/ProtectedRoute";
import WerkerSeite from "../../pages/WerkerSeite";
import BueroSeite from "../../pages/BueroSeite";
import { UnauthorizedPage } from "../../pages/UnauthorizedPage";
import { NotFoundPage } from "../../pages/NotFoundPage";

function AppRoutes() {
  const { isAuthReady, isAuthenticated, getDefaultRoute } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          !isAuthReady ? (
            <div className="auth-loading">Lade...</div>
          ) : isAuthenticated ? (
            <Navigate to={getDefaultRoute()} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/login"
        element={
          !isAuthReady ? (
            <div className="auth-loading">Lade...</div>
          ) : isAuthenticated ? (
            <Navigate to={getDefaultRoute()} replace />
          ) : (
            <LoginScreen />
          )
        }
      />

      <Route
        path="/worker"
        element={
          <ProtectedRoute requiredPermission="canViewWorkerOverview">
            <WerkerSeite />
          </ProtectedRoute>
        }
      />

      <Route
        path="/office"
        element={
          <ProtectedRoute requiredPermission="canViewOfficeOverview">
            <BueroSeite />
          </ProtectedRoute>
        }
      />

      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
