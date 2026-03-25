import type { Role, Permissions } from "../types";

export const permissionsByRole: Record<Role, Permissions> = {
  worker: {
    canViewWorkerOverview: true,
    canViewOfficeOverview: false,
    canCompleteWorkStep: true,
    canViewCustomer: true,
    canViewOrderNumber: true,
    canCreateOrder: false,
    canEditOrder: false,
    canViewLogs: false,
    canViewReports: false,
    canManageUsers: false,
    canManageSystem: false,
  },
  office: {
    canViewWorkerOverview: false,
    canViewOfficeOverview: true,
    canCompleteWorkStep: false,
    canViewCustomer: true,
    canViewOrderNumber: true,
    canCreateOrder: true,
    canEditOrder: true,
    canViewLogs: false,
    canViewReports: false,
    canManageUsers: false,
    canManageSystem: false,
  },
  chief: {
    canViewWorkerOverview: true,
    canViewOfficeOverview: true,
    canCompleteWorkStep: true,
    canViewCustomer: true,
    canViewOrderNumber: true,
    canCreateOrder: true,
    canEditOrder: true,
    canViewLogs: true,
    canViewReports: true,
    canManageUsers: false,
    canManageSystem: false,
  },
};

export const roleLabels: Record<Role, string> = {
  worker: "Werker",
  office: "Büro",
  chief: "Chef",
};
