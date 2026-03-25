import { useState } from "react";
import type { Order } from "../../modules/orders/orderTypes";
import { isOrderAdvanceable, getAdvanceButtonLabel } from "../../modules/orders/orderStatus";
import { advanceOrderStatus } from "../../modules/orders/orderApi";

type AdvanceStatusButtonProps = {
  order: Order;
  changedBy?: string | null;
  onSuccess?: (updatedOrder: Order) => void;
  onError?: (message: string) => void;
};

export function AdvanceStatusButton({ order, changedBy, onSuccess, onError }: AdvanceStatusButtonProps) {
  const [loading, setLoading] = useState(false);

  if (!isOrderAdvanceable(order.status)) {
    return null;
  }

  const label = getAdvanceButtonLabel(order.status);

  const handleClick = async () => {
    const confirmed = window.confirm("Arbeitsschritt wirklich abschließen?");
    if (!confirmed) return;

    setLoading(true);
    try {
      const updatedOrder = await advanceOrderStatus(order.id, changedBy ?? null);
      onSuccess?.(updatedOrder);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Status konnte nicht aktualisiert werden";
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="advance-status-button"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? "Speichere..." : label}
    </button>
  );
}
