// =============================================================
// Auftrag Types — konkreter Fertigungsfall
// Ziel: entweder ein Werkstueck (Einzelteil) oder ein Montierteil (Baugruppe).
// =============================================================

import type { ArbeitsgangAusfuehrung } from "../arbeitsgaenge/arbeitsgangTypes";

export type AuftragBearbeitungsstatus =
  | "offen"
  | "in_arbeit"
  | "fertig";

export type AuftragZiel =
  | { typ: "werkstueck"; werkstueckId: string }
  | { typ: "montierteil"; montierteilId: string };

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
  ziel: AuftragZiel;
  bearbeiter: string | null;
  bearbeitungsstatus: AuftragBearbeitungsstatus;
};
