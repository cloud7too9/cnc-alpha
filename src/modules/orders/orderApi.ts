// =============================================================
// Order API — Mock-Layer (Welle 3)
// Alle Daten werden in localStorage gespeichert.
// In Welle 4 wird dies durch echte fetch-Calls ersetzt.
// =============================================================

import type { Order, OrderStatus, OrderStep } from "./orderTypes";
import { getNextStatus, getNextStep } from "./orderStatus";

export type CreateOrderInput = {
  article: string;
  material: string;
  dimensions: string;
  quantity: number;
  deliveryDate: string;
  orderNumber?: string | null;
  customer?: string | null;
  notes?: string | null;
};

export type UpdateOrderInput = {
  article?: string;
  material?: string;
  dimensions?: string;
  quantity?: number;
  deliveryDate?: string;
  orderNumber?: string | null;
  customer?: string | null;
  notes?: string | null;
};

const STORAGE_KEY = "cnc_orders";

// --- Interner Storage ---

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedOrders();
    return JSON.parse(raw) as Order[];
  } catch {
    return seedOrders();
  }
}

function saveOrders(orders: Order[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function generateId(): string {
  return crypto.randomUUID();
}

function now(): string {
  return new Date().toISOString();
}

// --- Seed-Daten für den Erststart ---

function seedOrders(): Order[] {
  const seed: Order[] = [
    {
      id: generateId(),
      article: "Welle Ø45×280",
      orderNumber: "B-2026-0041",
      customer: "Müller GmbH",
      material: "S355J2",
      dimensions: "Ø45×280",
      quantity: 12,
      deliveryDate: "2026-04-10",
      notes: "Toleranz h6 beachten",
      status: "open",
      currentStep: "sawing",
      createdAt: now(),
      updatedAt: now(),
      lastChangedBy: null,
    },
    {
      id: generateId(),
      article: "Flansch DN50",
      orderNumber: "B-2026-0039",
      customer: "Schneider AG",
      material: "1.4301",
      dimensions: "Ø120×25",
      quantity: 8,
      deliveryDate: "2026-04-05",
      notes: null,
      status: "sawn",
      currentStep: "machining",
      createdAt: now(),
      updatedAt: now(),
      lastChangedBy: null,
    },
    {
      id: generateId(),
      article: "Bolzen M16",
      orderNumber: null,
      customer: "Weber KG",
      material: "42CrMo4",
      dimensions: "Ø16×90",
      quantity: 50,
      deliveryDate: "2026-04-15",
      notes: "Eilauftrag",
      status: "machining_done",
      currentStep: "packing",
      createdAt: now(),
      updatedAt: now(),
      lastChangedBy: null,
    },
    {
      id: generateId(),
      article: "Buchse Ø30",
      orderNumber: "B-2026-0035",
      customer: "Müller GmbH",
      material: "C45",
      dimensions: "Ø30×60",
      quantity: 20,
      deliveryDate: "2026-03-28",
      notes: null,
      status: "ready_for_shipping",
      currentStep: null,
      createdAt: now(),
      updatedAt: now(),
      lastChangedBy: null,
    },
  ];
  saveOrders(seed);
  return seed;
}

// --- Simulierte async API ---

function delay(ms: number = 50): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchOrders(): Promise<Order[]> {
  await delay();
  return loadOrders();
}

export async function fetchOrderById(id: string): Promise<Order> {
  await delay();
  const orders = loadOrders();
  const order = orders.find((o) => o.id === id);
  if (!order) throw new Error(`Auftrag ${id} nicht gefunden`);
  return order;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  await delay();
  const orders = loadOrders();

  const newOrder: Order = {
    id: generateId(),
    article: input.article,
    material: input.material,
    dimensions: input.dimensions,
    quantity: input.quantity,
    deliveryDate: input.deliveryDate,
    orderNumber: input.orderNumber ?? null,
    customer: input.customer ?? null,
    notes: input.notes ?? null,
    status: "open" as OrderStatus,
    currentStep: "sawing" as OrderStep,
    createdAt: now(),
    updatedAt: now(),
    lastChangedBy: null,
  };

  orders.unshift(newOrder);
  saveOrders(orders);
  return newOrder;
}

export async function updateOrder(id: string, input: UpdateOrderInput): Promise<Order> {
  await delay();
  const orders = loadOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) throw new Error(`Auftrag ${id} nicht gefunden`);

  const updated: Order = {
    ...orders[index],
    ...input,
    updatedAt: now(),
  };

  orders[index] = updated;
  saveOrders(orders);
  return updated;
}

export async function advanceOrderStatus(
  id: string,
  changedBy?: string | null
): Promise<Order> {
  await delay();
  const orders = loadOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) throw new Error(`Auftrag ${id} nicht gefunden`);

  const order = orders[index];
  const nextStatus = getNextStatus(order.status);
  if (!nextStatus) throw new Error("Auftrag ist bereits im Endstatus");

  const nextStep = getNextStep(order.status);

  const updated: Order = {
    ...order,
    status: nextStatus,
    currentStep: nextStep,
    updatedAt: now(),
    lastChangedBy: changedBy ?? null,
  };

  orders[index] = updated;
  saveOrders(orders);
  return updated;
}
