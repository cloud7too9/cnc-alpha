// =============================================================
// StatusBadge — Wiederverwendbare Status-Anzeige
// =============================================================

import React from "react";

const STATUS_CSS = {
  Offen: "offen",
  "In Bearbeitung": "bearbeitung",
  Fertig: "fertig",
};

export default function StatusBadge({ status }) {
  const cssClass = STATUS_CSS[status] || "offen";

  return (
    <span className={`status-badge ${cssClass}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}
