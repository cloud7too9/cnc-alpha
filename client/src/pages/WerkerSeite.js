// =============================================================
// WerkerSeite — Werkstatt-Ansicht mit Ablaufkette
// =============================================================
// Touch-freundliche Karten für Handy/Tablet.
// Aufträge sind ausklappbar — im ausgeklappten Bereich
// erscheint die Ablaufkette mit Vorgängen.
// =============================================================

import React, { useState, useEffect, useCallback } from "react";
import useSSE from "../hooks/useSSE";
import {
  fetchAuftraege,
  vorgangFertigMelden,
  vorgangBestaetigen,
  SSE_URL,
} from "../api";
import StatusBadge from "../components/StatusBadge";
import Ablaufkette from "../components/Ablaufkette";
import { CurrentUserBar } from "../auth/components/CurrentUserBar";

export default function WerkerSeite() {
  const [auftraege, setAuftraege] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchAuftraege()
      .then((data) => { setAuftraege(data); setLoading(false); })
      .catch(() => {
        showToast("Verbindung zum Server fehlgeschlagen", "error");
        setLoading(false);
      });
  }, []);

  const handleSSEMessage = useCallback((event) => {
    if (event.type === "status_change") {
      setAuftraege((prev) =>
        prev.map((a) => (a.id === event.auftrag.id ? event.auftrag : a))
      );
    }
    if (event.type === "new_order") {
      setAuftraege((prev) => [event.auftrag, ...prev]);
    }
  }, []);

  const { connected } = useSSE(SSE_URL, handleSSEMessage);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Ablaufkette: Fertigmeldung
  const handleMelden = async (auftragId, vorgangId) => {
    try {
      const updated = await vorgangFertigMelden(auftragId, vorgangId, "Werker");
      setAuftraege((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
      showToast("Vorgang gemeldet");
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  // Ablaufkette: Bestätigung
  const handleBestaetigen = async (auftragId, vorgangId, bestaetigt) => {
    try {
      const updated = await vorgangBestaetigen(
        auftragId, vorgangId, bestaetigt, "Werker"
      );
      setAuftraege((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
      if (bestaetigt) showToast("Vorgang abgeschlossen ✓");
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Offene / Fertige trennen
  const offeneAuftraege = auftraege.filter((a) => a.status !== "Fertig");
  const fertigeAuftraege = auftraege.filter((a) => a.status === "Fertig");

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
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginTop: "8px",
        }}>
          <p style={{ fontSize: "13px", color: "var(--text-dim)" }}>
            {offeneAuftraege.length} offene Aufträge
          </p>
          <div className={`connection-badge ${connected ? "online" : "offline"}`}>
            <span className="connection-dot" />
            {connected ? "Live" : "Offline"}
          </div>
        </div>
      </div>

      {/* Auftrags-Karten */}
      {loading ? (
        <p style={{ color: "var(--text-dim)", textAlign: "center", padding: "40px" }}>
          Lade Aufträge...
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {offeneAuftraege.map((a) => {
            const isExpanded = expandedId === a.id;

            return (
              <div key={a.id} style={{
                background: "var(--bg-card)",
                borderRadius: "10px",
                border: `1px solid ${isExpanded ? "var(--border-light)" : "var(--border)"}`,
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}>
                {/* Klickbarer Header */}
                <div
                  onClick={() => toggleExpand(a.id)}
                  style={{
                    padding: "14px 16px", cursor: "pointer",
                    display: "flex", flexDirection: "column", gap: 4,
                  }}
                >
                  {/* Zeile 1: Auftragsnr + Status + Pfeil */}
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        color: "var(--text-dim)", fontSize: 10,
                        transition: "transform 0.2s",
                        transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                        display: "inline-block",
                      }}>
                        ▶
                      </span>
                      <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "13px", fontWeight: 700,
                        color: "var(--text-primary)",
                      }}>
                        {a.auftragsnr}
                      </span>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>

                  {/* Zeile 2: Kunde + Beschreibung */}
                  <div style={{ paddingLeft: 22 }}>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                      {a.kunde}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>
                      {a.beschreibung}
                    </div>
                  </div>
                </div>

                {/* Ausgeklappter Bereich: Ablaufkette */}
                {isExpanded && (
                  <div style={{
                    padding: "0 16px 14px",
                    borderTop: "1px solid var(--border)",
                  }}>
                    <Ablaufkette
                      auftrag={a}
                      onMelden={handleMelden}
                      onBestaetigen={handleBestaetigen}
                      disabled={!connected}
                    />
                  </div>
                )}
              </div>
            );
          })}

          {/* Fertige Aufträge */}
          {fertigeAuftraege.length > 0 && (
            <details style={{ marginTop: "12px" }}>
              <summary style={{
                fontSize: "13px", color: "var(--text-dim)",
                cursor: "pointer", padding: "8px 0", listStyle: "none",
              }}>
                ✓ {fertigeAuftraege.length} fertige Aufträge anzeigen
              </summary>
              <div style={{
                display: "flex", flexDirection: "column",
                gap: "6px", marginTop: "8px",
              }}>
                {fertigeAuftraege.map((a) => (
                  <div key={a.id} style={{
                    padding: "10px 14px",
                    background: "var(--bg-input)", borderRadius: "8px",
                    border: "1px solid var(--status-fertig-border)",
                    opacity: 0.6,
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                    <div>
                      <span style={{
                        fontFamily: "var(--font-mono)", fontSize: "12px",
                        color: "var(--text-muted)",
                      }}>
                        {a.auftragsnr}
                      </span>
                      <span style={{
                        fontSize: "12px", color: "var(--text-dim)", marginLeft: "10px",
                      }}>
                        {a.beschreibung}
                      </span>
                    </div>
                    <StatusBadge status="Fertig" />
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
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
