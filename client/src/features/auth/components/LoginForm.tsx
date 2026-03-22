import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { testUsers } from "../data/testUsers";
import { roleLabels } from "../utils/permissions";
import { getRememberedUserId } from "../utils/authStorage";
import { useAuth } from "../hooks/useAuth";
import { UserCard } from "./UserCard";

export function LoginScreen() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [rememberUser, setRememberUser] = useState(false);
  const [rememberedUserId, setRememberedUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedId = getRememberedUserId();
    setRememberedUserId(storedId);
  }, []);

  function handleLogin(userId: string) {
    const success = login(userId, rememberUser);

    if (success) {
      const matchedUser = testUsers.find((u) => u.id === userId);
      if (matchedUser) {
        navigate(matchedUser.defaultRoute);
      }
    }
  }

  return (
    <div className="login-screen">
      <h1 className="login-title">CNC-Werkstatt</h1>
      <p className="login-subtitle">Bitte Benutzer auswählen</p>

      <div className="login-user-list">
        {testUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            roleLabel={roleLabels[user.role]}
            isRemembered={rememberedUserId === user.id}
            onLogin={handleLogin}
          />
        ))}
      </div>

      <label className="login-remember">
        <input
          type="checkbox"
          checked={rememberUser}
          onChange={(e) => setRememberUser(e.target.checked)}
        />
        Benutzer auf diesem Gerät merken
      </label>
    </div>
  );
}
