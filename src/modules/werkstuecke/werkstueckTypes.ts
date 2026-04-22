// =============================================================
// Werkstueck Types — Definition / Fertigungsvorlage
// =============================================================

import type { ArbeitsgangPlan } from "../arbeitsgaenge/arbeitsgangTypes";

export type Werkstueck = {
  id: string;
  bezeichnung: string;
  werkstoff: string;
  rohmaterialTyp: string;
  fertigmass: string;
  saegemass: string;
  arbeitsgaenge: ArbeitsgangPlan[];
  zeichnung: string | null;
};
