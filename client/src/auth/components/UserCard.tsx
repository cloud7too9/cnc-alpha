import React from "react";
import type { User } from "../types";

type UserCardProps = {
  user: User;
  roleLabel: string;
  onLogin: (userId: string) => void;
  isRemembered?: boolean;
};

export function UserCard({ user, roleLabel, onLogin, isRemembered }: UserCardProps) {
  return (
    <div className="user-card">
      <div className="user-card-info">
        <span className="user-card-name">{user.name}</span>
        <span className="user-card-role">{roleLabel}</span>
        {isRemembered && <span className="user-card-remembered">Zuletzt verwendet</span>}
      </div>
      <button className="user-card-button" onClick={() => onLogin(user.id)}>
        Anmelden
      </button>
    </div>
  );
}
