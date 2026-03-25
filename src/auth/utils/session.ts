import type { SessionData } from "../types";

export function createSession(
  userId: string,
  name: string,
  role: string,
  durationHours: number = 12
): SessionData {
  const loginAt = Date.now();
  const expiresAt = loginAt + durationHours * 60 * 60 * 1000;

  return {
    userId,
    name,
    role: role as SessionData["role"],
    loginAt,
    expiresAt,
  };
}

export function isSessionExpired(session: SessionData): boolean {
  return Date.now() > session.expiresAt;
}

export function isSessionValid(
  session: SessionData | null | undefined
): boolean {
  if (!session) return false;
  if (isSessionExpired(session)) return false;
  return true;
}
