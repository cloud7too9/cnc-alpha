import type { User } from "../types";

export const testUsers: User[] = [
  {
    id: "user_worker_01",
    name: "Werker",
    role: "worker",
    active: true,
    defaultRoute: "/worker",
  },
  {
    id: "user_office_01",
    name: "Büro",
    role: "office",
    active: true,
    defaultRoute: "/office",
  },
  {
    id: "user_chief_01",
    name: "Chef 1",
    role: "chief",
    active: true,
    defaultRoute: "/worker",
  },
  {
    id: "user_chief_02",
    name: "Chef 2",
    role: "chief",
    active: true,
    defaultRoute: "/worker",
  },
];
