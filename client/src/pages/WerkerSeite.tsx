// =============================================================
// WerkerSeite — Werkstatt-Ansicht (Phase 2)
// =============================================================
// Touch-freundliche Übersicht der Fertigungsaufträge.
// Nutzt das neue Orders-Modul und WorkerOrderList.
// =============================================================

import React, { useState, useEffect, useCallback } from "react";
import type { Order } from "../modules/orders/orderTypes";
import { fetchOrders } from "../modules/orders/orderApi";
import { applyOrderView } from "../modules/orders/orderHelpers";
import type { OrderStatusFilter, OrderSortMode } from "../modules/orders/orderHelpers";
import { WorkerOrderList } from "../components/orders/WorkerOrderList";
import { OrderFilterBar } from "../components/orders/OrderFilterBar";
import { CurrentUserBar } from "../auth/components/CurrentUserBar";
import { useAuth } from "../auth/hooks/useAuth";
// @ts-ignore
import useSSE from "../hooks/useSSE";

const SSE_URL = "/api/events";

export default function WerkerSeite() {
  const { user } = useAuth();
  const changedBy = user?.id ?? null;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("all");
  const [sortMode, setSortMode] = useState<OrderSortMode>("deliveryDateAsc");

  const visibleOrders = applyOrderView(orders, { statusFilter, sortMode });

  const loadOrders = useCallback(() => {
    fetchOrders()
      .then((data) => {
        setOrders(data);
        setLoading(false);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Verbindung zum Server fehlgeschlagen");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleSSEMessage = useCallback((event: { type?: string }) => {
    if (event?.type === "orders_updated" || event?.type === "status_change" || event?.type === "new_order") {
      loadOrders();
    }
  }, [loadOrders]);

  useSSE(SSE_URL, handleSSEMessage);

  const handleOrderUpdated = (updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
  };

  return (
    <div style={{ padding: "16px", maxWidth: "500px", margin: "0 auto" }}>
      <CurrentUserBar />

      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{
          fontSize: "20px", fontWeight: 700, color: "var(--text-primary)",
        }}>
          🔧 Werkstatt
        </h1>
        <p style={{ fontSize: "13px", color: "var(--text-dim)", marginTop: "8px" }}>
          {orders.length} Aufträge
        </p>
      </div>

      {/* Inhalt */}
      {loading ? (
        <p style={{ color: "var(--text-dim)", textAlign: "center", padding: "40px" }}>
          Lade Aufträge...
        </p>
      ) : error ? (
        <p style={{ color: "var(--status-error)", textAlign: "center", padding: "40px" }}>
          {error}
        </p>
      ) : (
        <>
          <OrderFilterBar
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortMode={sortMode}
            onSortModeChange={setSortMode}
            showSearch={false}
          />
          <WorkerOrderList
            orders={visibleOrders}
            changedBy={changedBy}
            onOrderUpdated={handleOrderUpdated}
          />
        </>
      )}
    </div>
  );
}
