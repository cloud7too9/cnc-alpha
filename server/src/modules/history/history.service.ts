// =============================================================
// orderHistoryService — Historieneinträge für Aufträge
// =============================================================

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const HISTORY_FILE = path.join(__dirname, "..", "..", "..", "data", "order_history.json");

function loadEntries() {
  try {
    if (!fs.existsSync(HISTORY_FILE)) return [];
    const raw = fs.readFileSync(HISTORY_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveEntries(entries: any[]) {
  const dir = path.dirname(HISTORY_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

function createHistoryEntry(data: {
  orderId: string;
  userId: string;
  userRole: string;
  action: string;
  oldValue: string | null;
  newValue: string | null;
}) {
  const entry = {
    id: crypto.randomUUID(),
    orderId: data.orderId,
    timestamp: new Date().toISOString(),
    userId: data.userId,
    userRole: data.userRole,
    action: data.action,
    oldValue: data.oldValue ?? null,
    newValue: data.newValue ?? null,
  };

  const entries = loadEntries();
  entries.push(entry);
  saveEntries(entries);

  return entry;
}

function getHistoryByOrderId(orderId: string) {
  const entries = loadEntries();
  return entries
    .filter((e: any) => e.orderId === orderId)
    .sort((a: any, b: any) => a.timestamp.localeCompare(b.timestamp));
}

module.exports = { createHistoryEntry, getHistoryByOrderId };
