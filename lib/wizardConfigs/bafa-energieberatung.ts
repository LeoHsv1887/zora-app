import type { WizardConfig } from "./types";

export const bafaEnergieberatungConfig: WizardConfig = {
  id: "bafa-energieberatung",
  title: "BAFA Energieberatung (iSFP) beantragen",
  programmName: "BAFA Energieberatung für Wohngebäude",
  antragstelle: "BAFA",
  antragUrl: "https://www.bafa.de/DE/Energie/Effiziente_Gebaeude/Energieberatung_Wohngebaeude/energieberatung_wohngebaeude_node.html",
  naechsteSchritte: [
    {
      text: "Antrag bei BAFA stellen BEVOR die Beratung beginnt",
      url: "https://www.bafa.de",
    },
    { text: "Antragsnummer an Energieberater weitergeben" },
    {
      text: "Nach Beratung: Verwendungsnachweis (iSFP + Rechnung) einreichen",
    },
    {
      text: "iSFP nutzen: +5% Bonus auf alle BEG-Maßnahmen → jetzt BEG EM oder KfW 261 beantragen",
    },
  ],
  steps: [
    {
      id: "info",
      title: "Warum zuerst den iSFP?",
      isInfoOnly: true,
      infoContent: `Der individuelle Sanierungsfahrplan (iSFP) ist der wichtigste erste Schritt vor jeder Sanierung.

Er bringt Ihnen:
• +5% Förderbonus auf ALLE BEG-Maßnahmen
• Doppelte förderfähige Kosten (60.000 € statt 30.000 € pro Jahr)
• Klaren Sanierungsplan für die nächsten Jahre
• Die Beratung selbst wird zu 50% gefördert (bis 1.300 €)

Beispiel: Bei einer Fassadendämmung für 30.000 € bedeutet der iSFP-Bonus:
Ohne iSFP: 15% von 30.000 € = 4.500 € Förderung
Mit iSFP: 20% von 30.000 € = 6.000 € Förderung — plus weitere Maßnahmen mit doppelter Kostenbasis

Stellen Sie zuerst den iSFP-Antrag, dann alle anderen BEG-Anträge.`,
      fields: [],
    },
    {
      id: "antragsteller",
      title: "Antragsteller & Gebäude",
      description: "Angaben zum Antragsteller und zum Gebäude",
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
          label: "Adresse des Gebäudes",
          required: true,
          placeholder: "Musterstraße 12, 12345 Musterstadt",
        },
        {
          id: "gebaeudetyp",
          type: "radio",
          label: "Gebäudetyp",
          required: true,
          options: [
            {
              value: "Wohngebäude",
              label: "Wohngebäude",
              icon: "🏠",
              description: "Ein- oder Mehrfamilienhaus",
            },
            {
              value: "Nichtwohngebäude",
              label: "Nichtwohngebäude",
              icon: "🏢",
              description: "Gewerbe, öff. Gebäude",
            },
          ],
        },
        {
          id: "baujahr",
          type: "number",
          label: "Baujahr",
          required: true,
          placeholder: "1975",
          min: 1800,
          max: 2024,
          halfWidth: true,
        },
        {
          id: "anzahl_wohneinheiten",
          type: "number",
          label: "Anzahl Wohneinheiten",
          required: true,
          placeholder: "1",
          min: 1,
          max: 100,
          halfWidth: true,
        },
        {
          id: "heizungsart",
          type: "select",
          label: "Aktuelle Heizungsart",
          required: true,
          options: [
            { value: "Gas", label: "Gasheizung" },
            { value: "Öl", label: "Ölheizung" },
            { value: "Fernwärme", label: "Fernwärme" },
            { value: "Wärmepumpe", label: "Wärmepumpe" },
            { value: "Elektro", label: "Elektroheizung" },
            { value: "Kohle", label: "Kohle/Feststoff" },
            { value: "Sonstiges", label: "Sonstiges" },
          ],
        },
        {
          id: "geplante_massnahmen",
          type: "checkbox",
          label: "Bereits geplante Sanierungsmaßnahmen",
          required: false,
          options: [
            { value: "fassade", label: "Fassadendämmung", icon: "🧱" },
            { value: "dach", label: "Dachdämmung", icon: "🏠" },
            { value: "fenster", label: "Neue Fenster", icon: "🪟" },
            { value: "heizung", label: "Heizungstausch", icon: "🔥" },
            { value: "keller", label: "Kellerdeckendämmung", icon: "⬇️" },
            { value: "lueftung", label: "Lüftungsanlage", icon: "💨" },
          ],
        },
      ],
    },
    {
      id: "energieberater",
      title: "Energieberater auswählen",
      description: "Der Berater muss auf der BAFA-Expertenliste gelistet sein",
      kiHinweis:
        "Der Energieberater muss auf der BAFA-Expertenliste gelistet sein. Sie finden zugelassene Berater in Ihrer Nähe unter energieeffizienz-experten.de",
      fields: [
        {
          id: "berater_ausgewaehlt",
          type: "radio",
          label: "Energieberater bereits ausgewählt?",
          required: true,
          options: [
            { value: "Ja", label: "Ja, Berater steht fest" },
            { value: "Nein", label: "Nein, noch in Auswahl" },
          ],
        },
        {
          id: "berater_name",
          type: "text",
          label: "Name des Energieberaters",
          required: false,
          placeholder: "Dipl.-Ing. Anna Beispiel",
          dependsOn: { field: "berater_ausgewaehlt", value: "Ja" },
        },
        {
          id: "berater_bafa_nr",
          type: "text",
          label: "BAFA-Registriernummer des Beraters",
          required: false,
          placeholder: "BAFA-EEE-12345",
          dependsOn: { field: "berater_ausgewaehlt", value: "Ja" },
        },
        {
          id: "honorar",
          type: "number",
          label: "Honorar des Energieberaters (geschätzt)",
          required: false,
          placeholder: "2200",
          unit: "€",
          min: 100,
          dependsOn: { field: "berater_ausgewaehlt", value: "Ja" },
        },
      ],
      berechnungFn: (values) => {
        const anzahlWE = Math.max(1, Number(values.anzahl_wohneinheiten) || 1);
        const maxZuschuss = anzahlWE >= 2 ? 1700 : 1300;
        const honorar = Number(values.honorar) || 0;
        const zuschuss = Math.min(Math.round(honorar * 0.5), maxZuschuss);

        return [
          { label: "Fördersatz", value: "50% des Honorars" },
          {
            label: "Max. Förderbetrag",
            value: `${maxZuschuss.toLocaleString("de-DE")} € (${anzahlWE >= 2 ? "MFH" : "EFH"})`,
          },
          ...(honorar > 0
            ? [
                {
                  label: "Ihr voraussichtlicher Zuschuss",
                  value: `${zuschuss.toLocaleString("de-DE")} €`,
                  highlight: true as const,
                },
                {
                  label: "Ihr Eigenanteil",
                  value: `${(honorar - zuschuss).toLocaleString("de-DE")} €`,
                },
              ]
            : []),
        ];
      },
    },
    {
      id: "kosten",
      title: "Kosten & Förderberechnung",
      description: "Beratungskosten für die Förderberechnung",
      fields: [
        {
          id: "beratungshonorar",
          type: "number",
          label: "Beratungshonorar gesamt",
          required: true,
          placeholder: "2200",
          unit: "€",
          min: 100,
          helperText: "Laut Angebot oder Vereinbarung mit Berater",
        },
        {
          id: "reisekosten",
          type: "number",
          label: "Reisekosten des Beraters (optional)",
          required: false,
          placeholder: "150",
          unit: "€",
          helperText: "Werden zu 50% mitgefördert",
        },
        {
          id: "email",
          type: "text",
          label: "E-Mail für Förderbescheid",
          required: true,
          placeholder: "max@mustermann.de",
        },
      ],
      berechnungFn: (values) => {
        const anzahlWE = Math.max(1, Number(values.anzahl_wohneinheiten) || 1);
        const maxZuschuss = anzahlWE >= 2 ? 1700 : 1300;
        const honorar = Number(values.beratungshonorar) || 0;
        const reise = Number(values.reisekosten) || 0;
        const foerderfaehig = honorar + reise;
        const zuschuss = Math.min(Math.round(foerderfaehig * 0.5), maxZuschuss);
        const eigenanteil = foerderfaehig - zuschuss;

        return [
          { label: "Fördersatz", value: "50%" },
          {
            label: "Max. Förderbetrag",
            value: `${maxZuschuss.toLocaleString("de-DE")} €`,
          },
          ...(foerderfaehig > 0
            ? [
                {
                  label: "Förderfähige Gesamtkosten",
                  value: `${foerderfaehig.toLocaleString("de-DE")} €`,
                },
                {
                  label: "Ihr Förderbetrag",
                  value: `${zuschuss.toLocaleString("de-DE")} €`,
                  highlight: true as const,
                },
                {
                  label: "Ihr Eigenanteil",
                  value: `${eigenanteil.toLocaleString("de-DE")} €`,
                },
              ]
            : []),
        ];
      },
    },
    {
      id: "zusammenfassung",
      title: "Zusammenfassung & PDF",
      description: "Prüfen Sie Ihre Angaben und exportieren Sie den Antrag",
      isSummary: true,
      fields: [],
    },
  ],
};
