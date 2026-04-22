import { useState } from "react";
import type { Order } from "../../modules/orders/orderTypes";
import { OrderStatusBadge } from "./OrderStatusBadge";

type OfficeOrderTableProps = {
  orders: Order[];
  onEditOrder?: (order: Order) => void;
};

function formatTime(ts: string | null): string {
  if (!ts) return "\u2014";
  return new Date(ts).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OfficeOrderTable({ orders, onEditOrder }: OfficeOrderTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (orders.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--text-dim)" }}>
        Keine Aufträge vorhanden
      </div>
    );
  }

  return (
    <div className="card">
      {/* Tabellen-Header */}
      <div className="auftrag-header-row">
        <span style={{ width: 32 }} />
        <span style={{ flex: "0 0 120px" }}>Artikel</span>
        <span style={{ flex: "0 0 150px" }}>Material</span>
        <span style={{ flex: 1 }}>Maße</span>
        <span style={{ flex: "0 0 80px" }}>Menge</span>
        <span style={{ flex: "0 0 120px" }}>Status</span>
        <span style={{ flex: "0 0 110px" }}>Aktualisiert</span>
      </div>

      {orders.map((order) => {
        const isExpanded = expandedId === order.id;

        return (
          <div key={order.id}>
            <div
              className={`auftrag-row ${isExpanded ? "expanded" : ""}`}
              onClick={() => toggleExpand(order.id)}
            >
              <span style={{
                width: 32, display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0,
                color: "var(--text-dim)", fontSize: 11,
                transition: "transform 0.2s",
                transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
              }}>
                ▶
              </span>

              <span style={{
                flex: "0 0 120px", fontWeight: 600,
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)", fontSize: 12,
              }}>
                {order.article}
              </span>

              <span style={{ flex: "0 0 150px", color: "var(--text-muted)", fontSize: 13 }}>
                {order.material}
              </span>

              <span style={{ flex: 1, color: "var(--text-muted)", fontSize: 13 }}>
                {order.dimensions}
              </span>

              <span style={{ flex: "0 0 80px", color: "var(--text-muted)", fontSize: 13 }}>
                {order.quantity}
              </span>

              <span style={{ flex: "0 0 120px" }}>
                <OrderStatusBadge status={order.status} />
              </span>

              <span style={{ flex: "0 0 110px", color: "var(--text-dim)", fontSize: 12 }}>
                {formatTime(order.updatedAt)}
              </span>
            </div>

            {isExpanded && (
              <div className="auftrag-expand" style={{ padding: "12px 16px" }}>
                <div style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: 4 }}>
                  {order.customer && <div>Kunde: {order.customer}</div>}
                  {order.orderNumber && <div>Bestellnr.: {order.orderNumber}</div>}
                  <div>Lieferdatum: {order.deliveryDate}</div>
                  {order.notes && <div>Hinweise: {order.notes}</div>}
                </div>
                {onEditOrder && (
                  <button
                    className="edit-order-button"
                    style={{ marginTop: 8 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditOrder(order);
                    }}
                  >
                    Bearbeiten
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
