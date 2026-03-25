import type { SessionData } from "../types";

const SESSION_KEY = "cnc_session";
const REMEMBER_USER_KEY = "cnc_remember_user";

export function getStoredSession(): SessionData | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export function setStoredSession(session: SessionData): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getRememberedUserId(): string | null {
  return localStorage.getItem(REMEMBER_USER_KEY);
}

export function setRememberedUserId(userId: string): void {
  localStorage.setItem(REMEMBER_USER_KEY, userId);
}

export function clearRememberedUserId(): void {
  localStorage.removeItem(REMEMBER_USER_KEY);
}
