// =============================================================
// BueroSeite — Auftragsübersicht fürs Büro (Phase 2)
// =============================================================
// Aufträge werden als Tabelle angezeigt.
// Neuen Auftrag anlegen oder bestehenden bearbeiten.
// Nutzt das neue Orders-Modul.
// =============================================================

import React, { useState, useEffect, useCallback } from "react";
import type { Order } from "../modules/orders/orderTypes";
import { fetchOrders, createOrder, updateOrder } from "../modules/orders/orderApi";
import type { CreateOrderInput, UpdateOrderInput } from "../modules/orders/orderApi";
import { CurrentUserBar } from "../auth/components/CurrentUserBar";
import { OfficeOrderTable } from "../components/orders/OfficeOrderTable";
import { OrderFilterBar } from "../components/orders/OrderFilterBar";
import { applyOrderView } from "../modules/orders/orderHelpers";
import type { OrderStatusFilter, OrderSortMode } from "../modules/orders/orderHelpers";
// @ts-ignore
import useSSE from "../hooks/useSSE";

const SSE_URL = "/api/events";

type OrderFormState = {
  article: string;
  material: string;
  dimensions: string;
  quantity: string;
  deliveryDate: string;
  orderNumber: string;
  customer: string;
  notes: string;
};

const emptyForm: OrderFormState = {
  article: "",
  material: "",
  dimensions: "",
  quantity: "",
  deliveryDate: "",
  orderNumber: "",
  customer: "",
  notes: "",
};

type Toast = {
  msg: string;
  type: "success" | "error";
};

export default function BueroSeite() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  // Formular-State
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [form, setForm] = useState<OrderFormState>(emptyForm);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  // Filter-State
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("all");
  const [sortMode, setSortMode] = useState<OrderSortMode>("updatedAtDesc");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const visibleOrders = applyOrderView(orders, { statusFilter, sortMode, searchTerm });

  // Aufträge laden
  const loadOrders = useCallback(() => {
    fetchOrders()
      .then((data) => {
        setOrders(data);
        setLoading(false);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Fehler beim Laden der Aufträge");
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

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Bearbeiten starten
  const handleEditOrder = (order: Order) => {
    setFormOpen(true);
    setEditingOrderId(order.id);
    setForm({
      article: order.article,
      material: order.material,
      dimensions: order.dimensions,
      quantity: String(order.quantity),
      deliveryDate: order.deliveryDate,
      orderNumber: order.orderNumber ?? "",
      customer: order.customer ?? "",
      notes: order.notes ?? "",
    });
  };

  // Abbrechen
  const handleCancel = () => {
    setFormOpen(false);
    setEditingOrderId(null);
    setForm(emptyForm);
  };

  // Formular absenden
  const handleSubmit = async () => {
    if (!isFormValid) return;
    try {
      const input: CreateOrderInput & UpdateOrderInput = {
        article: form.article,
        material: form.material,
        dimensions: form.dimensions,
        quantity: parsedQuantity,
        deliveryDate: form.deliveryDate,
        orderNumber: form.orderNumber || null,
        customer: form.customer || null,
        notes: form.notes || null,
      };

      if (editingOrderId) {
        const updated = await updateOrder(editingOrderId, input);
        setOrders((prev) =>
          prev.map((o) => (o.id === updated.id ? updated : o))
        );
        showToast("Auftrag aktualisiert");
      } else {
        const created = await createOrder(input);
        setOrders((prev) => [created, ...prev]);
        showToast("Auftrag erstellt");
      }

      setForm(emptyForm);
      setEditingOrderId(null);
      setFormOpen(false);
    } catch (err: unknown) {
      showToast(
        err instanceof Error ? err.message : "Fehler beim Speichern",
        "error"
      );
    }
  };

  const parsedQuantity = Number(form.quantity);
  const isQuantityValid = Number.isInteger(parsedQuantity) && parsedQuantity > 0;
  const isFormValid: boolean = !!(form.article && form.material && form.dimensions && isQuantityValid && form.deliveryDate);

  const isEditing = editingOrderId !== null;

  return (
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
      <CurrentUserBar />

      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "24px",
      }}>
        <div>
          <h1 style={{
            fontSize: "22px", fontWeight: 700,
            color: "var(--text-primary)", letterSpacing: "-0.3px",
          }}>
            🖥️ Auftragsübersicht
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-dim)", marginTop: 4 }}>
            Büro-Ansicht — {orders.length} Aufträge
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={handleCancel}
            style={{
              padding: "8px 18px",
              background: formOpen
                ? "var(--bg-card)"
                : "linear-gradient(135deg, var(--accent-amber), var(--accent-amber-dark))",
              border: formOpen ? "1px solid var(--border)" : "none",
              borderRadius: "8px",
              color: formOpen ? "var(--text-muted)" : "#0f1117",
              fontSize: "13px", fontWeight: 700, cursor: "pointer",
              fontFamily: "var(--font-main)",
            }}
          >
            {formOpen ? "✕ Abbrechen" : "+ Neuer Auftrag"}
          </button>
        </div>
      </div>

      {/* Formular */}
      {formOpen && (
        <div className="card" style={{ marginBottom: "20px" }}>
          <div className="card-header">
            <h2>{isEditing ? "Auftrag bearbeiten" : "Neuen Auftrag anlegen"}</h2>
          </div>
          <div className="card-body">
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {([
                { key: "article", label: "Artikel", placeholder: "z.B. Welle Ø45×280", width: "200px", type: "text" },
                { key: "material", label: "Material", placeholder: "z.B. S355J2", width: "160px", type: "text" },
                { key: "dimensions", label: "Maße", placeholder: "z.B. Ø45×280", width: "160px", type: "text" },
                { key: "quantity", label: "Stückzahl", placeholder: "z.B. 10", width: "100px", type: "number" },
                { key: "deliveryDate", label: "Lieferdatum", placeholder: "", width: "160px", type: "date" },
                { key: "orderNumber", label: "Bestellnr.", placeholder: "optional", width: "140px", type: "text" },
                { key: "customer", label: "Kunde", placeholder: "optional", width: "200px", type: "text" },
                { key: "notes", label: "Hinweise", placeholder: "optional", width: "240px", type: "text" },
              ] as { key: keyof OrderFormState; label: string; placeholder: string; width: string; type: string }[]).map((field) => (
                <div key={field.key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={{
                    fontSize: "11px", color: "var(--text-dim)",
                    textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600,
                  }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={form[field.key]}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    style={{
                      width: field.width, padding: "9px 12px",
                      background: "var(--bg-input)", border: "1px solid var(--border)",
                      borderRadius: "6px", color: "var(--text-secondary)",
                      fontSize: "13px", fontFamily: "var(--font-main)", outline: "none",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--accent-amber)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
                  />
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  style={{
                    padding: "9px 22px",
                    background: isFormValid
                      ? "linear-gradient(135deg, var(--accent-amber), var(--accent-amber-dark))"
                      : "var(--bg-hover)",
                    border: "none", borderRadius: "6px",
                    color: isFormValid ? "#0f1117" : "var(--text-dim)",
                    fontSize: "13px", fontWeight: 700,
                    cursor: isFormValid ? "pointer" : "not-allowed",
                    fontFamily: "var(--font-main)",
                  }}
                >
                  {isEditing ? "Änderungen speichern" : "Anlegen"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auftrags-Liste */}
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-dim)" }}>
          Lade Aufträge...
        </div>
      ) : error ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--status-error)" }}>
          {error}
        </div>
      ) : (
        <>
          <OrderFilterBar
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortMode={sortMode}
            onSortModeChange={setSortMode}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            showSearch={true}
          />
          <OfficeOrderTable orders={visibleOrders} onEditOrder={handleEditOrder} />
        </>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "✗"} {toast.msg}
        </div>
      )}
    </div>
  );
}
