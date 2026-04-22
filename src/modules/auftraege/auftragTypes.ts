// =============================================================
// Auftrag Types — konkreter Fertigungsfall
// =============================================================

import type { ArbeitsgangAusfuehrung } from "../arbeitsgaenge/arbeitsgangTypes";

export type AuftragBearbeitungsstatus =
  | "offen"
  | "in_arbeit"
  | "fertig";

export type Auftrag = {
  id: string;
  kunde: string;
  bestellNr: string | null;
  bestellDatum: string | null;
  artikelBezeichnung: string;
  stueckzahlBestellt: number;
  liefertermin: string;
  arbeitsgaenge: ArbeitsgangAusfuehrung[];
  stueckzahlBearbeitet: number;
  fertigstellungDatum: string | null;
  zusatzinformation: string | null;
  werkstueckId: string;
  bearbeiter: string | null;
  bearbeitungsstatus: AuftragBearbeitungsstatus;
};
