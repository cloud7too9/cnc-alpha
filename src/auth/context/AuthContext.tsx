import { createContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { User, SessionData, PermissionKey } from "../types";
import { testUsers } from "../data/testUsers";
import { permissionsByRole } from "../utils/permissions";
import { createSession, isSessionValid } from "../utils/session";
import {
  getStoredSession,
  setStoredSession,
  clearStoredSession,
  setRememberedUserId,
  clearRememberedUserId,
} from "../utils/authStorage";

export type AuthContextValue = {
  user: User | null;
  session: SessionData | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  login: (userId: string, rememberUser?: boolean) => boolean;
  logout: () => void;
  hasPermission: (permissionKey: PermissionKey) => boolean;
  getDefaultRoute: () => string;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<SessionData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const storedSession = getStoredSession();

    if (isSessionValid(storedSession)) {
      const matchedUser = testUsers.find((u) => u.id === storedSession!.userId);

      if (matchedUser) {
        setUser(matchedUser);
        setSession(storedSession);
        setIsAuthenticated(true);
      } else {
        clearStoredSession();
      }
    } else {
      clearStoredSession();
    }

    setIsAuthReady(true);
  }, []);

  function login(userId: string, rememberUser: boolean = false): boolean {
    const matchedUser = testUsers.find((u) => u.id === userId);

    if (!matchedUser || !matchedUser.active) return false;

    const newSession = createSession(matchedUser.id, matchedUser.name, matchedUser.role);
    setStoredSession(newSession);
    setUser(matchedUser);
    setSession(newSession);
    setIsAuthenticated(true);

    if (rememberUser) {
      setRememberedUserId(userId);
    } else {
      clearRememberedUserId();
    }

    return true;
  }

  function logout(): void {
    clearStoredSession();
    setUser(null);
    setSession(null);
    setIsAuthenticated(false);
  }

  function hasPermission(permissionKey: PermissionKey): boolean {
    if (!user) return false;
    return permissionsByRole[user.role][permissionKey];
  }

  function getDefaultRoute(): string {
    if (user) return user.defaultRoute;
    return "/login";
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      isAuthenticated,
      isAuthReady,
      login,
      logout,
      hasPermission,
      getDefaultRoute,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, session, isAuthenticated, isAuthReady]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
