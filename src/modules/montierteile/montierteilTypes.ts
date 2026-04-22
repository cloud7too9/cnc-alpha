// =============================================================
// Montierteil Types — Baugruppe (Strukturebene)
// Gruppierung mehrerer Werkstuecke. Keine Fertigungsdetails.
// =============================================================

export type MontierteilPosition = {
  werkstueckId: string;
  stueckzahl: number;
};

export type Montierteil = {
  id: string;
  bezeichnung: string;
  positionen: MontierteilPosition[];
  zeichnung: string | null;
};
