// =============================================================
// App — Root mit AuthProvider + Router (Welle 2)
// =============================================================

import { AuthProvider } from "./auth/context/AuthContext";
import { AppRouter } from "./app/routes/AppRouter";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
