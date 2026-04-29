export type Rechtsform =
  | "GmbH"
  | "Einzelunternehmen"
  | "GbR"
  | "UG"
  | "AG"
  | "e.K.";

export type Branche =
  | "Sanitär/Heizung/Klima"
  | "Elektroinstallation"
  | "Dachdeckerei"
  | "Zimmerei"
  | "Maler"
  | "Kfz-Werkstatt"
  | "Sonstiges Handwerk";

export type Mitarbeiterzahl = "1–5" | "6–20" | "21–50" | "51–250";

export type Bundesland =
  | "Baden-Württemberg"
  | "Bayern"
  | "Berlin"
  | "Brandenburg"
  | "Bremen"
  | "Hamburg"
  | "Hessen"
  | "Mecklenburg-Vorpommern"
  | "Niedersachsen"
  | "Nordrhein-Westfalen"
  | "Rheinland-Pfalz"
  | "Saarland"
  | "Sachsen"
  | "Sachsen-Anhalt"
  | "Schleswig-Holstein"
  | "Thüringen";

export type Jahresumsatz =
  | "unter 250k"
  | "250k–1Mio"
  | "1–5Mio"
  | "über 5Mio";

export interface FirmenProfil {
  firmenname: string;
  rechtsform: Rechtsform | "";
  branche: Branche | "";
  mitarbeiterzahl: Mitarbeiterzahl | "";
  bundesland: Bundesland | "";
  jahresumsatz: Jahresumsatz | "";
  vorhaben: string;
}

export type BadgeType = "Zuschuss" | "Kredit" | "befristet";

export interface Foerderprogramm {
  id: string;
  name: string;
  badge: BadgeType;
  foerdergeber: string;
  maxBetrag: string;
  frist: string;
  beschreibung: string;
  passung: number;
  passungBegruendung?: string;
  empfehlung?: string;
}

export interface AntragsData {
  investitionssumme: string;
  umsetzungsbeginn: string;
  projektbeschreibung: string;
}

export type Screen = "profile" | "loading" | "results" | "application" | "success";

export type Step = 1 | 2 | 3 | 4;
