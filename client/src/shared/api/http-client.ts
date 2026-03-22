// =============================================================
// API Helper — Server-Anfragen für Aufträge + Vorgänge
// =============================================================

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

/** Alle Aufträge laden (inkl. Vorgänge) */
export async function fetchAuftraege() {
  const res = await fetch(`${API_BASE}/auftraege`);
  if (!res.ok) throw new Error("Fehler beim Laden der Aufträge");
  return res.json();
}

/** Neuen Auftrag erstellen (Büro) */
export async function createAuftrag({ auftragsnr, kunde, beschreibung }: { auftragsnr: string; kunde: string; beschreibung: string }) {
  const res = await fetch(`${API_BASE}/auftraege`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ auftragsnr, kunde, beschreibung }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Fehler beim Erstellen");
  }
  return res.json();
}

/** Auftragsstatus ändern (Werker — Legacy) */
export async function updateStatus(id: string, status: string) {
  const res = await fetch(`${API_BASE}/auftraege/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Fehler beim Status-Update");
  }
  return res.json();
}

/** Vorgang als fertig melden (offen → fertig_gemeldet) */
export async function vorgangFertigMelden(auftragId: string, vorgangId: string, user: string) {
  const res = await fetch(
    `${API_BASE}/auftraege/${auftragId}/vorgaenge/${vorgangId}/fertigmelden`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user }),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Fehler bei Fertigmeldung");
  }
  return res.json();
}

/** Vorgang bestätigen oder ablehnen */
export async function vorgangBestaetigen(auftragId: string, vorgangId: string, bestaetigt: boolean, user: string) {
  const res = await fetch(
    `${API_BASE}/auftraege/${auftragId}/vorgaenge/${vorgangId}/bestaetigen`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bestaetigt, user }),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Fehler bei Bestätigung");
  }
  return res.json();
}

/** SSE-URL */
export const SSE_URL = `${API_BASE}/events`;
