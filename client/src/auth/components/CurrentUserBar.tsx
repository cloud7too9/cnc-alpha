import React from "react";
import { useAuth } from "../hooks/useAuth";
import { roleLabels } from "../utils/permissions";
import { LogoutButton } from "./LogoutButton";

export function CurrentUserBar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="current-user-bar">
      <span>Angemeldet als: {user.name}</span>
      <span>Rolle: {roleLabels[user.role]}</span>
      <LogoutButton />
    </div>
  );
}
