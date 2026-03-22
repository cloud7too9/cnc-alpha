// =============================================================
// Ablaufkette — Vorgangskette innerhalb eines Auftrags
// =============================================================
// Zeigt die 3 Fertigungsschritte als horizontale Kette an.
// Jeder Vorgang hat einen Button "✓ Abgeschlossen", der eine
// inline Bestätigungsanzeige öffnet ("Status ändern?").
//
// Props:
//   auftrag   — Das Auftragsobjekt inkl. vorgaenge[]
//   onMelden  — (auftragId, vorgangId) => Promise  — Fertigmeldung
//   onBestaetigen — (auftragId, vorgangId, bool) => Promise — Bestätigung
//   disabled  — true wenn offline / gerade speichernd
// =============================================================

import React, { useState } from "react";

// --- Labels ---
const TYP_LABEL = {
  zuschneiden: "Zuschneiden",
  weiterverarbeitung: "Weiterverarbeitung",
  verpacken: "Verpacken",
};

const TYP_ICON = {
  zuschneiden: "◎",
  weiterverarbeitung: "⚙",
  verpacken: "▤",
};

const STATUS_LABEL = {
  offen: "Offen",
  fertig_gemeldet: "Gemeldet",
  abgeschlossen: "Fertig",
  uebersprungen: "Übersprungen",
};

export default function Ablaufkette({ auftrag, onMelden, onBestaetigen, disabled, readOnly }) {
  const vorgaenge = auftrag.vorgaenge || [];
  const [bestaetigungFuer, setBestaetigungFuer] = useState(null);
  const [loading, setLoading] = useState(null); // ID des ladenden Vorgangs

  if (vorgaenge.length === 0) {
    return (
      <div style={{ padding: "12px 0", fontSize: 12, color: "var(--text-dim)" }}>
        Keine Vorgänge vorhanden
      </div>
    );
  }

  // Fortschritt
  const fertig = vorgaenge.filter(
    (v) => v.status === "abgeschlossen" || v.status === "uebersprungen"
  ).length;
  const prozent = Math.round((fertig / vorgaenge.length) * 100);

  // --- Fertig melden ---
  const handleMelden = async (vorgang) => {
    if (disabled || loading) return;
    setLoading(vorgang.id);
    try {
      await onMelden(auftrag.id, vorgang.id);
      setBestaetigungFuer(vorgang.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  // --- Bestätigen ---
  const handleBestaetigen = async (vorgang, ja) => {
    if (disabled || loading) return;
    setLoading(vorgang.id);
    try {
      await onBestaetigen(auftrag.id, vorgang.id, ja);
      setBestaetigungFuer(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ padding: "16px 0 8px" }}>
      {/* Fortschrittsbalken */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        marginBottom: 16, padding: "0 4px",
      }}>
        <div style={{
          flex: 1, height: 3, borderRadius: 2,
          background: "var(--bg-hover)", overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: `${prozent}%`,
            background: prozent === 100
              ? "var(--accent-green)"
              : "var(--accent-blue)",
            borderRadius: 2,
            transition: "width 0.4s ease",
          }} />
        </div>
        <span style={{
          fontSize: 11, color: "var(--text-dim)",
          fontFamily: "var(--font-mono)", minWidth: 32,
        }}>
          {prozent}%
        </span>
      </div>

      {/* Vorgang-Zeilen */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {vorgaenge.map((v) => {
          const istFertig = v.status === "abgeschlossen" || v.status === "uebersprungen";
          const istGemeldet = v.status === "fertig_gemeldet";
          const istOffen = v.status === "offen";

          // Kann dieser Vorgang gemeldet werden?
          const vorherigeAlleOk = !vorgaenge.some(
            (p) => p.position < v.position
              && p.status !== "abgeschlossen"
              && p.status !== "uebersprungen"
          );
          const kannMelden = istOffen && vorherigeAlleOk && !readOnly;
          const zeigtBestaetigung = bestaetigungFuer === v.id && istGemeldet && !readOnly;
          const istLadend = loading === v.id;

          // Farben je nach Status
          let dotColor = "var(--status-offen-dot)";
          let textColor = "var(--text-dim)";
          let bgColor = "transparent";
          let borderColor = "var(--border)";

          if (istFertig) {
            dotColor = "var(--status-fertig-dot)";
            textColor = "var(--status-fertig-text)";
            bgColor = "var(--status-fertig-bg)";
            borderColor = "var(--status-fertig-border)";
          } else if (istGemeldet) {
            dotColor = "var(--accent-amber)";
            textColor = "var(--accent-amber)";
            bgColor = "rgba(245, 158, 11, 0.06)";
            borderColor = "rgba(245, 158, 11, 0.2)";
          }

          return (
            <div key={v.id}>
              {/* Vorgang-Zeile */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 12px", borderRadius: 8,
                background: bgColor,
                border: `1px solid ${borderColor}`,
                transition: "all 0.2s",
              }}>
                {/* Dot */}
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: dotColor, flexShrink: 0,
                  boxShadow: istFertig ? `0 0 6px ${dotColor}` : "none",
                  transition: "all 0.3s",
                }} />

                {/* Icon + Label */}
                <span style={{ fontSize: 14, flexShrink: 0 }}>
                  {istFertig ? "✓" : TYP_ICON[v.typ]}
                </span>
                <span style={{
                  fontSize: 13, fontWeight: 600,
                  color: istFertig ? textColor : "var(--text-secondary)",
                  flex: 1,
                }}>
                  {TYP_LABEL[v.typ]}
                </span>

                {/* Status-Badge */}
                <span style={{
                  fontSize: 10, fontWeight: 600,
                  padding: "2px 8px", borderRadius: 4,
                  background: istFertig
                    ? "var(--status-fertig-bg)"
                    : istGemeldet
                      ? "rgba(245, 158, 11, 0.1)"
                      : "var(--bg-hover)",
                  color: textColor,
                  fontFamily: "var(--font-mono)",
                  border: `1px solid ${borderColor}`,
                }}>
                  {STATUS_LABEL[v.status]}
                </span>

                {/* Button: Abgeschlossen melden */}
                {kannMelden && (
                  <button
                    onClick={() => handleMelden(v)}
                    disabled={disabled || istLadend}
                    style={{
                      padding: "4px 12px", borderRadius: 6,
                      border: "1px solid var(--status-fertig-border)",
                      background: "var(--status-fertig-bg)",
                      color: "var(--status-fertig-text)",
                      fontSize: 11, fontWeight: 700,
                      cursor: disabled || istLadend ? "not-allowed" : "pointer",
                      opacity: disabled || istLadend ? 0.5 : 1,
                      fontFamily: "var(--font-main)",
                      whiteSpace: "nowrap",
                      transition: "all 0.15s",
                    }}
                  >
                    {istLadend ? "..." : "✓ Abgeschlossen"}
                  </button>
                )}

                {/* Warte-Hinweis wenn gemeldet aber Bestätigung nicht offen */}
                {istGemeldet && !zeigtBestaetigung && !readOnly && (
                  <button
                    onClick={() => setBestaetigungFuer(v.id)}
                    style={{
                      padding: "4px 12px", borderRadius: 6,
                      border: "1px solid rgba(245, 158, 11, 0.3)",
                      background: "rgba(245, 158, 11, 0.08)",
                      color: "var(--accent-amber)",
                      fontSize: 11, fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "var(--font-main)",
                      whiteSpace: "nowrap",
                      animation: "pulse 2s infinite",
                    }}
                  >
                    Bestätigen
                  </button>
                )}
              </div>

              {/* Inline-Bestätigung */}
              {zeigtBestaetigung && (
                <div className="bestaetigung-inline">
                  <div style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between", gap: 10,
                    flexWrap: "wrap",
                  }}>
                    <div>
                      <div style={{
                        fontSize: 13, fontWeight: 700,
                        color: "var(--accent-amber)",
                      }}>
                        Status ändern?
                      </div>
                      <div style={{
                        fontSize: 11, color: "var(--text-dim)", marginTop: 2,
                      }}>
                        „{TYP_LABEL[v.typ]}" als abgeschlossen markieren
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => handleBestaetigen(v, true)}
                        disabled={istLadend}
                        className="btn-bestaetigen-ja"
                      >
                        {istLadend ? "..." : "✓ Ja"}
                      </button>
                      <button
                        onClick={() => handleBestaetigen(v, false)}
                        disabled={istLadend}
                        className="btn-bestaetigen-nein"
                      >
                        Abbrechen
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
