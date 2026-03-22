import type { Order } from "./orderTypes";

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

export const ORDERS_BASE_URL = "/api/auftraege";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "Unbekannter Fehler");
    throw new Error(`API-Fehler ${response.status}: ${text}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchOrders(): Promise<Order[]> {
  const response = await fetch(ORDERS_BASE_URL);
  return handleResponse<Order[]>(response);
}

export async function fetchOrderById(id: string): Promise<Order> {
  const response = await fetch(`${ORDERS_BASE_URL}/${id}`);
  return handleResponse<Order>(response);
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const response = await fetch(ORDERS_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<Order>(response);
}

export async function updateOrder(id: string, input: UpdateOrderInput): Promise<Order> {
  const response = await fetch(`${ORDERS_BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<Order>(response);
}

export async function advanceOrderStatus(
  id: string,
  changedBy?: string | null
): Promise<Order> {
  const response = await fetch(`${ORDERS_BASE_URL}/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ changedBy: changedBy ?? null }),
  });
  return handleResponse<Order>(response);
}
