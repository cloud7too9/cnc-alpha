import type { OrderStatus } from "../../modules/orders/orderTypes";
import { orderStatusLabels } from "../../modules/orders/orderStatus";

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span className={`status-badge status-${status}`}>
      {orderStatusLabels[status]}
    </span>
  );
}
