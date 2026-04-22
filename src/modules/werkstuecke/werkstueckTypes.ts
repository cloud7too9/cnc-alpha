// =============================================================
// Werkstueck Types — Einzelteil (Fertigungsebene)
// =============================================================

import type { ArbeitsgangPlan } from "../arbeitsgaenge/arbeitsgangTypes";

export type Werkstueck = {
  id: string;
  bezeichnung: string;
  werkstoff: string;
  rohmaterialTyp: string;
  fertigmass: string;
  saegemass: string;
  verarbeitungskette: ArbeitsgangPlan[];
  zeichnung: string | null;
};
