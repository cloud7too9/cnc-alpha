// =============================================================
// Routes: /api/auftraege — CRUD + Status-Advance für Orders
// =============================================================

const express = require("express");
const crypto = require("crypto");
const pool = require("../db/pool");
const { broadcast } = require("../sse/manager");
const { createHistoryEntry, getHistoryByOrderId } = require("../modules/orders/orderHistoryService");

const router = express.Router();

// ---- Hilfsfunktionen ----

function nowIso() {
  return new Date().toISOString();
}

const statusTransitions = {
  open:           { status: "sawn",              currentStep: "machining" },
  sawn:           { status: "machining_done",    currentStep: "packing" },
  machining_done: { status: "ready_for_shipping", currentStep: null },
};

function getNextTransition(currentStatus) {
  return statusTransitions[currentStatus] || null;
}

// ---- Row → JSON-Objekt ----

function rowToOrder(row) {
  return {
    id: row.id,
    article: row.article,
    orderNumber: row.order_number,
    customer: row.customer,
    material: row.material,
    dimensions: row.dimensions,
    quantity: row.quantity,
    deliveryDate: row.delivery_date,
    notes: row.notes,
    status: row.status,
    currentStep: row.current_step,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastChangedBy: row.last_changed_by,
  };
}

// ---- GET / — Alle Orders ----

router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM orders ORDER BY delivery_date ASC, created_at DESC"
    );
    res.json(rows.map(rowToOrder));
  } catch (err) {
    console.error("GET /api/auftraege error:", err.message);
    res.status(500).json({ error: "Fehler beim Laden der Aufträge" });
  }
});

// ---- GET /:id — Einzelne Order ----

router.get("/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM orders WHERE id = $1",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Auftrag nicht gefunden" });
    }

    res.json(rowToOrder(rows[0]));
  } catch (err) {
    console.error("GET /api/auftraege/:id error:", err.message);
    res.status(500).json({ error: "Fehler beim Laden des Auftrags" });
  }
});

// ---- POST / — Neuen Auftrag erstellen ----

router.post("/", async (req, res) => {
  try {
    const { article, material, dimensions, quantity, deliveryDate, orderNumber, customer, notes } = req.body;

    if (!article || !material || !dimensions || !quantity || !deliveryDate) {
      return res.status(400).json({
        error: "Pflichtfelder: article, material, dimensions, quantity, deliveryDate",
      });
    }

    const id = crypto.randomUUID();
    const now = nowIso();

    const { rows } = await pool.query(
      `INSERT INTO orders
        (id, article, order_number, customer, material, dimensions, quantity,
         delivery_date, notes, status, current_step, created_at, updated_at, last_changed_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        id, article, orderNumber || null, customer || null,
        material, dimensions, quantity, deliveryDate,
        notes || null, "open", "sawing", now, now, null,
      ]
    );

    const order = rowToOrder(rows[0]);
    createHistoryEntry({
      orderId: order.id,
      userId: req.body.userId ?? "system",
      userRole: req.body.userRole ?? "unknown",
      action: "order_created",
      oldValue: null,
      newValue: order.id,
    });
    broadcast("new_order", { order });
    res.status(201).json(order);
  } catch (err) {
    console.error("POST /api/auftraege error:", err.message);
    res.status(500).json({ error: "Fehler beim Erstellen des Auftrags" });
  }
});

// ---- PUT /:id — Auftrag aktualisieren ----

router.put("/:id", async (req, res) => {
  try {
    const {
      article, orderNumber, customer, material,
      dimensions, quantity, deliveryDate, notes, lastChangedBy,
    } = req.body;

    const now = nowIso();

    const { rows } = await pool.query(
      `UPDATE orders SET
        article = COALESCE($1, article),
        order_number = $2,
        customer = $3,
        material = COALESCE($4, material),
        dimensions = COALESCE($5, dimensions),
        quantity = COALESCE($6, quantity),
        delivery_date = COALESCE($7, delivery_date),
        notes = $8,
        last_changed_by = $9,
        updated_at = $10
       WHERE id = $11
       RETURNING *`,
      [
        article, orderNumber ?? null, customer ?? null,
        material, dimensions, quantity, deliveryDate,
        notes ?? null, lastChangedBy ?? null, now, req.params.id,
      ]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Auftrag nicht gefunden" });
    }

    const order = rowToOrder(rows[0]);
    broadcast("order_updated", { order });
    res.json(order);
  } catch (err) {
    console.error("PUT /api/auftraege/:id error:", err.message);
    res.status(500).json({ error: "Fehler beim Aktualisieren des Auftrags" });
  }
});

// ---- PATCH /:id/status — Status weitersetzen ----

router.patch("/:id/status", async (req, res) => {
  try {
    const { rows: current } = await pool.query(
      "SELECT * FROM orders WHERE id = $1",
      [req.params.id]
    );

    if (current.length === 0) {
      return res.status(404).json({ error: "Auftrag nicht gefunden" });
    }

    const transition = getNextTransition(current[0].status);

    if (!transition) {
      return res.status(400).json({ error: "Kein weiterer Statuswechsel möglich" });
    }

    const now = nowIso();
    const changedBy = req.body.changedBy ?? null;

    const { rows } = await pool.query(
      `UPDATE orders SET
        status = $1, current_step = $2,
        last_changed_by = $3, updated_at = $4
       WHERE id = $5
       RETURNING *`,
      [transition.status, transition.currentStep, changedBy, now, req.params.id]
    );

    const order = rowToOrder(rows[0]);
    createHistoryEntry({
      orderId: order.id,
      userId: changedBy ?? "system",
      userRole: req.body.userRole ?? "unknown",
      action: "status_advanced",
      oldValue: current[0].status,
      newValue: order.status,
    });
    broadcast("status_change", { order });
    res.json(order);
  } catch (err) {
    console.error("PATCH /api/auftraege/:id/status error:", err.message);
    res.status(500).json({ error: "Fehler beim Statuswechsel" });
  }
});

// ---- GET /:id/history — Auftragshistorie ----

router.get("/:id/history", async (req, res) => {
  try {
    const history = getHistoryByOrderId(req.params.id);
    res.json(history);
  } catch (err) {
    console.error("GET /api/auftraege/:id/history error:", err.message);
    res.status(500).json({ error: "Fehler beim Laden der Historie" });
  }
});

module.exports = router;
