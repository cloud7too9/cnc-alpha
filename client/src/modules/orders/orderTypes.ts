export type OrderStatus =
  | "open"
  | "sawn"
  | "machining_done"
  | "ready_for_shipping";

export type OrderStep =
  | "sawing"
  | "machining"
  | "packing"
  | null;

export type Order = {
  id: string;
  article: string;
  orderNumber: string | null;
  customer: string | null;
  material: string;
  dimensions: string;
  quantity: number;
  deliveryDate: string;
  notes: string | null;
  status: OrderStatus;
  currentStep: OrderStep;
  createdAt: string;
  updatedAt: string;
  lastChangedBy: string | null;
};
