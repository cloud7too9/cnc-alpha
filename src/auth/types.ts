// =============================================================
// Auth Types — Rollen, Benutzer, Permissions, Session
// =============================================================

export type Role = "worker" | "office" | "chief";

export type User = {
  id: string;
  name: string;
  role: Role;
  active: boolean;
  defaultRoute: string;
};

export type PermissionKey =
  | "canViewWorkerOverview"
  | "canViewOfficeOverview"
  | "canCompleteWorkStep"
  | "canViewCustomer"
  | "canViewOrderNumber"
  | "canCreateOrder"
  | "canEditOrder"
  | "canViewLogs"
  | "canViewReports"
  | "canManageUsers"
  | "canManageSystem";

export type Permissions = Record<PermissionKey, boolean>;

export type SessionData = {
  userId: string;
  name: string;
  role: Role;
  loginAt: number;
  expiresAt: number;
};
