import type { WizardConfig } from "./types";

export const kfw270Config: WizardConfig = {
  id: "kfw-270",
  title: "KfW 270 Erneuerbare Energien beantragen",
  programmName: "KfW 270 Erneuerbare Energien Standard",
  antragstelle: "KfW (über Hausbank)",
  antragUrl: "https://www.kfw.de/inlandsfoerderung/Privatpersonen/Neubau-und-Kauf/Foerderprodukte/Erneuerbare-Energien-Standard-(270)/",
  naechsteSchritte: [
    { text: "Termin bei Ihrer Hausbank vereinbaren und Unterlagen vorlegen" },
    { text: "Bank stellt den KfW-270-Antrag — NICHT direkt bei der KfW!" },
    { text: "Kreditangebot der KfW über Bank annehmen" },
    { text: "Erst dann Installateur beauftragen und Anlage errichten" },
    {
      text: "Nach Fertigstellung: Verwendungsnachweis einreichen und Anlage in Betrieb nehmen",
    },
  ],
  steps: [
    {
      id: "antragsteller",
      title: "Antragsteller",
      description: "Wer stellt den Antrag?",
      kiHinweis:
        "Wie beim KfW 261 läuft dieser Kredit über Ihre Hausbank — nicht direkt bei der KfW. Sprechen Sie zuerst mit Ihrer Bank und bringen Sie diese Unterlagen mit.",
      fields: [
        {
          id: "vorname",
          type: "text",
          label: "Vorname",
          required: true,
          placeholder: "Max",
          halfWidth: true,
        },
        {
          id: "nachname",
          type: "text",
          label: "Nachname",
          required: true,
          placeholder: "Mustermann",
          halfWidth: true,
        },
        {
          id: "adresse",
          type: "text",
          label: "Adresse",
          required: true,
          placeholder: "Musterstraße 12, 12345 Musterstadt",
        },
        {
          id: "email",
          type: "text",
          label: "E-Mail",
          required: true,
          placeholder: "max@mustermann.de",
          halfWidth: true,
        },
        {
          id: "telefon",
          type: "text",
          label: "Telefon",
          required: false,
          placeholder: "+49 123 4567890",
          halfWidth: true,
        },
        {
          id: "antragsteller_art",
          type: "radio",
          label: "Antragsteller-Art",
          required: true,
          options: [
            { value: "Privatperson", label: "Privatperson", icon: "👤" },
            {
              value: "Unternehmen",
              label: "Unternehmen",
              icon: "🏢",
              description: "GmbH, GbR, etc.",
            },
            {
              value: "Landwirt",
              label: "Landwirt",
              icon: "🌾",
              description: "Land-/Forstwirtschaft",
            },
            {
              value: "Gemeinde",
              label: "Gemeinde / Verband",
              icon: "🏛️",
              description: "Öffentl. Körperschaft",
            },
          ],
        },
        {
          id: "hausbank",
          type: "text",
          label: "Hausbank",
          required: true,
          placeholder: "z.B. Volksbank Musterstadt eG",
          helperText: "Antrag wird über diese Bank gestellt",
        },
      ],
    },
    {
      id: "anlagentyp",
      title: "Anlagentyp",
      description: "Welche Art der erneuerbaren Energie soll gefördert werden?",
      fields: [
        {
          id: "anlagentyp",
          type: "radio",
          label: "Anlagentyp",
          required: true,
          options: [
            {
              value: "PV",
              label: "Photovoltaikanlage",
              icon: "☀️",
              description: "Häufigste Wahl — Strom aus Sonnenlicht",
            },
            {
              value: "Solarthermie",
              label: "Solarthermieanlage",
              icon: "🌡️",
              description: "Wärme aus Sonnenlicht",
            },
            {
              value: "Wind",
              label: "Windkraftanlage (Kleinanlage)",
              icon: "💨",
              description: "Kleine Windräder",
            },
            {
              value: "Biogas",
              label: "Biogasanlage",
              icon: "🌿",
              description: "Strom und Wärme aus Biomasse",
            },
            {
              value: "Speicher",
              label: "Batteriespeicher",
              icon: "🔋",
              description: "In Kombination mit PV-Anlage",
            },
            {
              value: "Wasser",
              label: "Wasserkraftanlage",
              icon: "💧",
              description: "Kleine Wasserkraft",
            },
          ],
        },
      ],
    },
    {
      id: "anlagendaten",
      title: "Anlagendaten",
      description: "Technische Angaben zur geplanten Anlage",
      kiHinweis:
        "Eine PV-Anlage mit 10 kWp amortisiert sich bei aktuellen Strompreisen in etwa 8–12 Jahren. Der KfW 270 Kredit läuft meist länger — Sie haben also bereits positive Cashflows während der Rückzahlung.",
      fields: [
        {
          id: "standort",
          type: "text",
          label: "Standort der Anlage (Adresse)",
          required: true,
          placeholder: "Musterstraße 12, 12345 Musterstadt",
        },
        // PV-spezifische Felder
        {
          id: "pv_leistung",
          type: "number",
          label: "Geplante Anlagenleistung",
          required: false,
          placeholder: "10",
          unit: "kWp",
          min: 1,
          max: 10000,
          dependsOn: { field: "anlagentyp", values: ["PV", "Speicher"] },
        },
        {
          id: "pv_dachflaeche",
          type: "number",
          label: "Verfügbare Dachfläche",
          required: false,
          placeholder: "80",
          unit: "m²",
          min: 5,
          dependsOn: { field: "anlagentyp", value: "PV" },
        },
        {
          id: "pv_ausrichtung",
          type: "select",
          label: "Ausrichtung der Dachfläche",
          required: false,
          options: [
            { value: "Süd", label: "Süd (optimal)" },
            { value: "Südost", label: "Südost" },
            { value: "Südwest", label: "Südwest" },
            { value: "Ost-West", label: "Ost-West (Doppelanlage)" },
          ],
          dependsOn: { field: "anlagentyp", value: "PV" },
        },
        {
          id: "pv_betriebsart",
          type: "radio",
          label: "Nutzungsart des erzeugten Stroms",
          required: false,
          options: [
            {
              value: "Eigenverbrauch",
              label: "Eigenverbrauch + Einspeisung",
              description: "Typisch für private PV-Anlagen",
            },
            {
              value: "Volleinspeisung",
              label: "Volleinspeisung",
              description: "Kompletter Strom ins Netz",
            },
          ],
          dependsOn: { field: "anlagentyp", value: "PV" },
        },
        {
          id: "pv_speicher",
          type: "radio",
          label: "Batteriespeicher mitgeplant?",
          required: false,
          options: [
            { value: "Ja", label: "Ja, Speicher inklusive" },
            { value: "Nein", label: "Nein" },
          ],
          dependsOn: { field: "anlagentyp", value: "PV" },
        },
        {
          id: "speicher_kapazitaet",
          type: "number",
          label: "Speicherkapazität",
          required: false,
          placeholder: "10",
          unit: "kWh",
          min: 1,
          dependsOn: { field: "anlagentyp", values: ["Speicher"] },
        },
        {
          id: "speicher_pv_vorhanden",
          type: "radio",
          label: "Bestehende PV-Anlage vorhanden?",
          required: false,
          options: [
            { value: "Ja", label: "Ja, PV-Anlage läuft bereits" },
            { value: "Nein", label: "Nein, PV und Speicher neu" },
          ],
          dependsOn: { field: "anlagentyp", value: "Speicher" },
        },
        // Solarthermie
        {
          id: "st_flaeche",
          type: "number",
          label: "Kollektorfläche",
          required: false,
          placeholder: "8",
          unit: "m²",
          min: 1,
          dependsOn: { field: "anlagentyp", value: "Solarthermie" },
        },
        // Allgemein
        {
          id: "anlagen_leistung_kwh",
          type: "number",
          label: "Erwarteter Jahresertrag",
          required: false,
          placeholder: "9000",
          unit: "kWh/Jahr",
          min: 100,
          dependsOn: {
            field: "anlagentyp",
            values: ["Wind", "Biogas", "Wasser"],
          },
        },
      ],
    },
    {
      id: "kosten",
      title: "Kosten & Kreditbedarf",
      description: "Investitionskosten und gewünschter Kreditrahmen",
      fields: [
        {
          id: "gesamtkosten",
          type: "number",
          label: "Gesamte Investitionskosten",
          required: true,
          placeholder: "25000",
          unit: "€",
          min: 1000,
        },
        {
          id: "anlagekosten",
          type: "number",
          label: "Davon Anlagekosten (Technik/Material)",
          required: false,
          placeholder: "18000",
          unit: "€",
          halfWidth: true,
        },
        {
          id: "installationskosten",
          type: "number",
          label: "Davon Installationskosten",
          required: false,
          placeholder: "5000",
          unit: "€",
          halfWidth: true,
        },
        {
          id: "planungskosten",
          type: "number",
          label: "Davon Planungskosten",
          required: false,
          placeholder: "2000",
          unit: "€",
        },
        {
          id: "kreditbetrag",
          type: "number",
          label: "Gewünschter Kreditbetrag",
          required: true,
          placeholder: "25000",
          unit: "€",
          min: 1000,
          helperText: "Maximal: Gesamte Investitionskosten",
        },
        {
          id: "laufzeit",
          type: "select",
          label: "Gewünschte Laufzeit",
          required: true,
          options: [
            { value: "5", label: "5 Jahre" },
            { value: "10", label: "10 Jahre" },
            { value: "15", label: "15 Jahre" },
            { value: "20", label: "20 Jahre" },
            { value: "25", label: "25 Jahre" },
            { value: "30", label: "30 Jahre" },
          ],
        },
      ],
      berechnungFn: (values) => {
        const kreditbetrag = Number(values.kreditbetrag) || 0;
        const laufzeit = Number(values.laufzeit) || 10;
        const zinssatz = 0.0457; // ab 4,57% eff. p.a.
        const pvLeistung = Number(values.pv_leistung) || 0;

        const results: import("./types").BerechnungEntry[] = [
          {
            label: "Zinssatz",
            value: "ab 4,57% eff. p.a. (aktuell, über Hausbank)",
          },
          { label: "Laufzeit", value: laufzeit > 0 ? `${laufzeit} Jahre` : "–" },
        ];

        if (kreditbetrag > 0 && laufzeit > 0) {
          const monatszins = zinssatz / 12;
          const monate = laufzeit * 12;
          const monatsrate =
            (kreditbetrag * monatszins * Math.pow(1 + monatszins, monate)) /
            (Math.pow(1 + monatszins, monate) - 1);
          results.push({
            label: "Geschätzte Monatsrate",
            value: `${Math.round(monatsrate).toLocaleString("de-DE")} €/Monat`,
            highlight: true,
          });
          results.push({
            label: "Gesamtkosten Kredit",
            value: `${Math.round(monatsrate * monate).toLocaleString("de-DE")} €`,
          });
        }

        if (pvLeistung > 0) {
          const jahresertrag = pvLeistung * 950; // kWh/kWp Durchschnitt
          const erloes = jahresertrag * 0.082; // ca. 8,2 Ct/kWh Einspeisevergütung
          results.push({
            label: "Geschätzter Jahresertrag PV",
            value: `ca. ${Math.round(jahresertrag).toLocaleString("de-DE")} kWh`,
          });
          results.push({
            label: "Geschätzte Einspeisevergütung p.a.",
            value: `ca. ${Math.round(erloes).toLocaleString("de-DE")} €/Jahr`,
          });
        }

        return results;
      },
    },
    {
      id: "banktermin",
      title: "Banktermin-Vorbereitung",
      description: "Welche Unterlagen haben Sie bereits?",
      kiHinweis:
        "Für das Bankgespräch brauchen Sie: Angebot des Installateurbetriebs, Standortdaten der Anlage, Ihre Bonitätsunterlagen. Zora erstellt Ihnen eine vollständige Checkliste als PDF.",
      fields: [
        {
          id: "angebot_vorhanden",
          type: "radio",
          label: "Angebot vom Installationsbetrieb vorhanden?",
          required: true,
          options: [
            { value: "Ja", label: "Ja, liegt vor" },
            { value: "Nein", label: "Nein, noch nicht" },
          ],
        },
        {
          id: "einspeisevertrag",
          type: "radio",
          label: "Einspeisevergütungsvertrag mit Netzbetreiber?",
          required: false,
          options: [
            { value: "Ja", label: "Ja, liegt vor" },
            { value: "Nein", label: "Nein / nicht geplant" },
            { value: "In Beantragung", label: "In Beantragung" },
          ],
        },
        {
          id: "installationstermin",
          type: "date",
          label: "Geplanter Installationstermin",
          required: false,
        },
      ],
    },
    {
      id: "zusammenfassung",
      title: "Zusammenfassung & Banktermin-PDF",
      description: "Alle Angaben für Ihr Bankgespräch auf einen Blick",
      isSummary: true,
      fields: [],
    },
  ],
};
