import React, { useState } from "react";
import type { Order } from "../../modules/orders/orderTypes";
import { orderStatusLabels, orderStepLabels } from "../../modules/orders/orderStatus";
import { AdvanceStatusButton } from "./AdvanceStatusButton";

type WorkerOrderCardProps = {
  order: Order;
  changedBy?: string | null;
  onOrderUpdated?: (updatedOrder: Order) => void;
};

export function WorkerOrderCard({ order, changedBy, onOrderUpdated }: WorkerOrderCardProps) {
  const [showExtraInfo, setShowExtraInfo] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  return (
    <div className="worker-order-card">
      <div className="worker-order-card-header">
        <span className="worker-order-card-article">{order.article}</span>
        <span className="worker-order-card-status">
          {orderStatusLabels[order.status]}
        </span>
      </div>

      <div className="worker-order-card-details">
        <div>Lieferdatum: {order.deliveryDate}</div>
        <div>Material: {order.material}</div>
        <div>Maße: {order.dimensions}</div>
        <div>Stückzahl: {order.quantity}</div>
      </div>

      {order.currentStep && (
        <div className="worker-order-card-step">
          Nächster Schritt: {orderStepLabels[order.currentStep]}
        </div>
      )}

      {order.notes && (
        <div className="worker-order-card-notes">
          Hinweis: {order.notes}
        </div>
      )}

      <AdvanceStatusButton
        order={order}
        changedBy={changedBy}
        onSuccess={(updatedOrder) => {
          setActionError(null);
          onOrderUpdated?.(updatedOrder);
        }}
        onError={(message) => setActionError(message)}
      />

      {actionError && (
        <div className="worker-order-card-error">{actionError}</div>
      )}

      <button
        className="worker-order-card-toggle"
        onClick={() => setShowExtraInfo((prev) => !prev)}
      >
        {showExtraInfo ? "Weniger Infos" : "Mehr Infos"}
      </button>

      {showExtraInfo && (
        <div className="worker-order-card-extra">
          {order.customer && <div>Kunde: {order.customer}</div>}
          {order.orderNumber && <div>Bestellnummer: {order.orderNumber}</div>}
        </div>
      )}
    </div>
  );
}
