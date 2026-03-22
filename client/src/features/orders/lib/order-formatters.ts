import type { Order, OrderStatus } from "../../../modules/orders/orderTypes";

export type OrderStatusFilter = "all" | OrderStatus;

export type OrderSortMode =
  | "deliveryDateAsc"
  | "deliveryDateDesc"
  | "updatedAtDesc";

export type ApplyOrderViewOptions = {
  statusFilter: OrderStatusFilter;
  searchTerm?: string;
  sortMode: OrderSortMode;
};

export function filterOrdersByStatus(orders: Order[], statusFilter: OrderStatusFilter): Order[] {
  if (statusFilter === "all") return orders;
  return orders.filter((order) => order.status === statusFilter);
}

export function filterOrdersBySearch(orders: Order[], searchTerm: string = ""): Order[] {
  const trimmed = searchTerm.trim().toLowerCase();
  if (!trimmed) return orders;

  return orders.filter((order) => {
    const fields = [
      order.article,
      order.customer,
      order.orderNumber,
      order.material,
    ];
    return fields.some((field) => field?.toLowerCase().includes(trimmed));
  });
}

export function sortOrders(orders: Order[], sortMode: OrderSortMode): Order[] {
  const sorted = [...orders];

  switch (sortMode) {
    case "deliveryDateAsc":
      sorted.sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate));
      break;
    case "deliveryDateDesc":
      sorted.sort((a, b) => b.deliveryDate.localeCompare(a.deliveryDate));
      break;
    case "updatedAtDesc":
      sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      break;
  }

  return sorted;
}

export function applyOrderView(orders: Order[], options: ApplyOrderViewOptions): Order[] {
  const filtered = filterOrdersByStatus(orders, options.statusFilter);
  const searched = filterOrdersBySearch(filtered, options.searchTerm);
  return sortOrders(searched, options.sortMode);
}
