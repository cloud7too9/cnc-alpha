import React from "react";
import type { Order } from "../../modules/orders/orderTypes";
import { WorkerOrderCard } from "./WorkerOrderCard";

type WorkerOrderListProps = {
  orders: Order[];
  changedBy?: string | null;
  onOrderUpdated?: (updatedOrder: Order) => void;
};

export function WorkerOrderList({ orders, changedBy, onOrderUpdated }: WorkerOrderListProps) {
  if (orders.length === 0) {
    return <div className="worker-order-list-empty">Keine Aufträge vorhanden</div>;
  }

  return (
    <div className="worker-order-list">
      {orders.map((order) => (
        <WorkerOrderCard
          key={order.id}
          order={order}
          changedBy={changedBy}
          onOrderUpdated={onOrderUpdated}
        />
      ))}
    </div>
  );
}
