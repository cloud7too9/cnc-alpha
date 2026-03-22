// =============================================================
// BueroSeite — Auftragsübersicht fürs Büro
// =============================================================
// Aufträge werden als ausklappbare Zeilen angezeigt.
// Im ausgeklappten Bereich erscheint die Ablaufkette
// mit Vorgangs-Status und Bestätigungsflow.
// =============================================================

import React, { useState, useEffect, useCallback } from "react";
import useSSE from "../hooks/useSSE";
import {
  fetchAuftraege,
  createAuftrag,
  vorgangFertigMelden,
  vorgangBestaetigen,
  SSE_URL,
} from "../api";
import StatusBadge from "../components/StatusBadge";
import Ablaufkette from "../components/Ablaufkette";
import { CurrentUserBar } from "../auth/components/CurrentUserBar";

export default function BueroSeite() {
  const [auftraege, setAuftraege] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flashId, setFlashId] = useState(null);
  const [toast, setToast] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // Formular-State
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    auftragsnr: "",
    kunde: "",
    beschreibung: "",
  });

  // Aufträge laden
  useEffect(() => {
    fetchAuftraege()
      .then((data) => { setAuftraege(data); setLoading(false); })
      .catch((err) => {
        console.error(err);
        showToast("Fehler beim Laden der Aufträge", "error");
        setLoading(false);
      });
  }, []);

  // SSE: Live-Updates
  const handleSSEMessage = useCallback((event) => {
    if (event.type === "status_change") {
      setAuftraege((prev) =>
        prev.map((a) => (a.id === event.auftrag.id ? event.auftrag : a))
      );
      setFlashId(event.auftrag.id);
      setTimeout(() => setFlashId(null), 1500);
    }
    if (event.type === "new_order") {
      setAuftraege((prev) => [event.auftrag, ...prev]);
      setFlashId(event.auftrag.id);
      setTimeout(() => setFlashId(null), 1500);
    }
  }, []);

  const { connected } = useSSE(SSE_URL, handleSSEMessage);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Formular absenden
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAuftrag(form);
      setForm({ auftragsnr: "", kunde: "", beschreibung: "" });
      setFormOpen(false);
      showToast("Auftrag erstellt");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Ablaufkette: Fertigmeldung
  const handleMelden = async (auftragId, vorgangId) => {
    try {
      const updated = await vorgangFertigMelden(auftragId, vorgangId, "Büro");
      setAuftraege((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
    } catch (err) {
      showToast(err.message, "error");
      throw err; // damit die Ablaufkette-Komponente den Fehler mitbekommt
    }
  };

  // Ablaufkette: Bestätigung
  const handleBestaetigen = async (auftragId, vorgangId, bestaetigt) => {
    try {
      const updated = await vorgangBestaetigen(
        auftragId, vorgangId, bestaetigt, "Büro"
      );
      setAuftraege((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
      if (bestaetigt) showToast("Vorgang bestätigt");
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  // Zeitformat
  const formatTime = (ts) => {
    if (!ts) return "—";
    return new Date(ts).toLocaleString("de-DE", {
      day: "2-digit", month: "2-digit",
      hour: "2-digit", minute: "2-digit",
    });
  };

  // Toggle expand
  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

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
            Auftragsübersicht
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-dim)", marginTop: 4 }}>
            Büro-Ansicht — {auftraege.length} Aufträge
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div className={`connection-badge ${connected ? "online" : "offline"}`}>
            <span className="connection-dot" />
            {connected ? "Live" : "Offline"}
          </div>
          <button
            onClick={() => setFormOpen(!formOpen)}
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
            {formOpen ? "Abbrechen" : "+ Neuer Auftrag"}
          </button>
        </div>
      </div>

      {/* Formular */}
      {formOpen && (
        <div className="card" style={{ marginBottom: "20px" }}>
          <div className="card-header"><h2>Neuen Auftrag anlegen</h2></div>
          <div className="card-body">
            <div onSubmit={handleSubmit} style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {[
                { key: "auftragsnr", label: "Auftragsnr.", placeholder: "z.B. 2024-0153", width: "160px" },
                { key: "kunde", label: "Kunde", placeholder: "z.B. Müller GmbH", width: "200px" },
                { key: "beschreibung", label: "Beschreibung", placeholder: "z.B. Welle Ø45×280", width: "240px" },
              ].map((field) => (
                <div key={field.key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={{
                    fontSize: "11px", color: "var(--text-dim)",
                    textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600,
                  }}>
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={form[field.key]}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    style={{
                      width: field.width, padding: "9px 12px",
                      background: "var(--bg-input)", border: "1px solid var(--border)",
                      borderRadius: "6px", color: "var(--text-secondary)",
                      fontSize: "13px", fontFamily: "var(--font-main)", outline: "none",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--accent-amber)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                  />
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button
                  onClick={handleSubmit}
                  disabled={!form.auftragsnr || !form.kunde || !form.beschreibung}
                  style={{
                    padding: "9px 22px",
                    background: form.auftragsnr && form.kunde && form.beschreibung
                      ? "linear-gradient(135deg, var(--accent-amber), var(--accent-amber-dark))"
                      : "var(--bg-hover)",
                    border: "none", borderRadius: "6px",
                    color: form.auftragsnr && form.kunde && form.beschreibung
                      ? "#0f1117" : "var(--text-dim)",
                    fontSize: "13px", fontWeight: 700,
                    cursor: form.auftragsnr && form.kunde && form.beschreibung
                      ? "pointer" : "not-allowed",
                    fontFamily: "var(--font-main)",
                  }}
                >
                  Anlegen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auftrags-Liste (ausklappbar) */}
      <div className="card">
        {/* Tabellen-Header */}
        <div className="auftrag-header-row">
          <span style={{ width: 32 }} />
          <span style={{ flex: "0 0 120px" }}>Auftrag</span>
          <span style={{ flex: "0 0 150px" }}>Kunde</span>
          <span style={{ flex: 1 }}>Beschreibung</span>
          <span style={{ flex: "0 0 120px" }}>Status</span>
          <span style={{ flex: "0 0 110px" }}>Aktualisiert</span>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-dim)" }}>
            Lade Aufträge...
          </div>
        ) : auftraege.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-dim)" }}>
            Keine Aufträge vorhanden — erstelle den ersten!
          </div>
        ) : (
          auftraege.map((a) => {
            const isExpanded = expandedId === a.id;
            const isFlashing = flashId === a.id;

            return (
              <div key={a.id}>
                {/* Klickbare Zeile */}
                <div
                  className={`auftrag-row ${isFlashing ? "row-flash" : ""} ${isExpanded ? "expanded" : ""}`}
                  onClick={() => toggleExpand(a.id)}
                >
                  {/* Pfeil */}
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
                    {a.auftragsnr}
                  </span>

                  <span style={{ flex: "0 0 150px", color: "var(--text-muted)", fontSize: 13 }}>
                    {a.kunde}
                  </span>

                  <span style={{ flex: 1, color: "var(--text-muted)", fontSize: 13 }}>
                    {a.beschreibung}
                  </span>

                  <span style={{ flex: "0 0 120px" }}>
                    <StatusBadge status={a.status} />
                  </span>

                  <span style={{
                    flex: "0 0 110px", color: "var(--text-dim)", fontSize: 12,
                  }}>
                    {formatTime(a.aktualisiert_am)}
                  </span>
                </div>

                {/* Ausgeklappter Bereich: Ablaufkette */}
                {isExpanded && (
                  <div className="auftrag-expand">
                    <Ablaufkette
                      auftrag={a}
                      onMelden={handleMelden}
                      onBestaetigen={handleBestaetigen}
                      disabled={!connected}
                      readOnly
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "✗"} {toast.msg}
        </div>
      )}
    </div>
  );
}
