// =============================================================
// Arbeitsgang Types
// Beim Werkstueck als Vorlage (Ablauf/Reihenfolge),
// beim Auftrag als konkrete Ausfuehrung im Fall.
// =============================================================

export type ArbeitsgangStatus =
  | "offen"
  | "in_arbeit"
  | "fertig";

// Werkstueck-Seite: Ablauf / Reihenfolge (Vorlage)
export type ArbeitsgangPlan = {
  id: string;
  reihenfolge: number;
  bezeichnung: string;
  beschreibung: string | null;
};

// Auftrag-Seite: konkrete Ausfuehrung im Fall
export type ArbeitsgangAusfuehrung = {
  id: string;
  arbeitsgangPlanId: string;
  reihenfolge: number;
  bezeichnung: string;
  status: ArbeitsgangStatus;
  bearbeiter: string | null;
  startZeit: string | null;
  endZeit: string | null;
  stueckzahlBearbeitet: number;
};
