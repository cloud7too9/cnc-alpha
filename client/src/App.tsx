import React from "react";
import { AuthProvider } from "./auth/context/AuthContext";
import { AppRouter } from "./app/routes/AppRouter";
import "./styles/global.css";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
