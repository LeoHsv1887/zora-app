import type { WizardConfig } from "./types";

const MASSNAHMEN_MIT_EEE = ["fassade", "dach", "keller"];

export const begEmConfig: WizardConfig = {
  id: "beg-em",
  title: "BEG Einzelmaßnahmen bei BAFA beantragen",
  programmName: "BEG Einzelmaßnahmen (BAFA)",
  antragstelle: "BAFA",
  antragUrl: "https://www.bafa.de/DE/Energie/Effiziente_Gebaeude/Bundesfoerderung_Effiziente_Gebaeude/bundesfoerderung_effiziente_gebaeude_node.html",
  naechsteSchritte: [
    {
      text: "Antrag im BAFA-Portal online stellen (VOR Auftragserteilung!)",
      url: "https://www.bafa.de",
    },
    {
      text: "Antragsnummer notieren und an Fachbetrieb weitergeben",
    },
    { text: "Maßnahme erst nach Erhalt der Förderbestätigung beauftragen" },
    {
      text: "Nach Abschluss: Verwendungsnachweis mit Rechnungen einreichen",
    },
  ],
  steps: [
    {
      id: "antragsteller",
      title: "Antragsteller & Gebäude",
      description: "Wer stellt den Antrag und welches Gebäude wird saniert?",
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
          id: "gebäudeadresse",
          type: "text",
          label: "Gebäudeadresse (Straße, PLZ, Ort)",
          required: true,
          placeholder: "Musterstraße 12, 12345 Musterstadt",
        },
        {
          id: "eigentuemerart",
          type: "radio",
          label: "Eigentümerart",
          required: true,
          options: [
            { value: "Selbstnutzer", label: "Selbstnutzer", icon: "🏠" },
            { value: "Vermieter", label: "Vermieter", icon: "🏢" },
            { value: "Unternehmen", label: "Unternehmen", icon: "🏭" },
            { value: "Kommune", label: "Kommune / öff. Einrichtung", icon: "🏛️" },
          ],
        },
        {
          id: "gebaeudetyp",
          type: "select",
          label: "Gebäudetyp",
          required: true,
          options: [
            { value: "Einfamilienhaus", label: "Einfamilienhaus" },
            { value: "Doppelhaus", label: "Doppelhaus / Reihenhaus" },
            { value: "Mehrfamilienhaus", label: "Mehrfamilienhaus (3+ WE)" },
            { value: "Nichtwohngebäude", label: "Nichtwohngebäude" },
          ],
        },
        {
          id: "baujahr",
          type: "number",
          label: "Baujahr des Gebäudes",
          required: true,
          placeholder: "1985",
          min: 1800,
          max: 2022,
          helperText: "Mind. 2 Jahre alt (Fertigstellung vor 2023)",
        },
      ],
    },
    {
      id: "massnahmen",
      title: "Maßnahmenauswahl",
      description: "Welche Maßnahmen sollen gefördert werden?",
      kiHinweis:
        "Mit einem individuellen Sanierungsfahrplan (iSFP) erhalten Sie +5% Bonus auf alle Maßnahmen UND können doppelt so hohe Kosten abrechnen (60.000 € statt 30.000 €/Jahr).",
      fields: [
        {
          id: "massnahmen",
          type: "checkbox",
          label: "Geplante Maßnahmen (Mehrfachauswahl möglich)",
          required: true,
          options: [
            {
              value: "fassade",
              label: "Wärmedämmung Fassade",
              icon: "🧱",
              badge: "15%",
            },
            {
              value: "dach",
              label: "Wärmedämmung Dach / oberste Geschossdecke",
              icon: "🏠",
              badge: "15%",
            },
            {
              value: "keller",
              label: "Wärmedämmung Kellerdecke",
              icon: "⬇️",
              badge: "15%",
            },
            {
              value: "fenster",
              label: "Neue Fenster & Türen",
              icon: "🪟",
              badge: "15%",
            },
            {
              value: "lueftung",
              label: "Lüftungsanlage mit Wärmerückgewinnung",
              icon: "💨",
              badge: "15%",
            },
            {
              value: "heizungsoptimierung",
              label: "Heizungsoptimierung / hydraulischer Abgleich",
              icon: "🔧",
              badge: "15%",
            },
            {
              value: "sonnenschutz",
              label: "Sommerlicher Wärmeschutz",
              icon: "☀️",
              badge: "15%",
            },
          ],
        },
        {
          id: "isfp_vorhanden",
          type: "radio",
          label: "Haben Sie bereits einen individuellen Sanierungsfahrplan (iSFP)?",
          required: true,
          options: [
            {
              value: "Ja",
              label: "Ja, iSFP liegt vor",
              description: "+5% Förderbonus, doppelte Kostenbasis",
            },
            { value: "Nein", label: "Nein" },
            {
              value: "In Beantragung",
              label: "In Beantragung",
              description: "Förderantrag BAFA Energieberatung läuft",
            },
          ],
        },
      ],
    },
    {
      id: "fachunternehmen",
      title: "Fachunternehmen",
      description: "Das ausführende Unternehmen muss in der Handwerksrolle eingetragen sein",
      kiHinweis:
        "Die Maßnahme muss von einem eingetragenen Fachbetrieb durchgeführt werden. DIY-Maßnahmen werden nicht gefördert.",
      fields: [
        {
          id: "fachbetrieb_name",
          type: "text",
          label: "Name des beauftragten Fachunternehmens",
          required: true,
          placeholder: "Mustermann Bau GmbH",
        },
        {
          id: "fachbetrieb_adresse",
          type: "text",
          label: "Adresse des Unternehmens",
          required: true,
          placeholder: "Gewerbestraße 1, 12345 Musterstadt",
        },
        {
          id: "handwerksrolle",
          type: "radio",
          label: "Ist das Unternehmen in der Handwerksrolle eingetragen?",
          required: true,
          options: [
            { value: "Ja", label: "Ja" },
            { value: "Nein", label: "Nein / unbekannt" },
          ],
        },
      ],
    },
    {
      id: "eee",
      title: "Energieeffizienz-Experte",
      description: "Bei Dämmmaßnahmen ist ein EEE erforderlich",
      kiHinweis:
        "Für Wärmedämmung von Fassade, Dach und Keller ist ein Energieeffizienz-Experte (EEE) Pflicht. Der EEE erstellt die technische Projektbeschreibung.",
      condition: (values) => {
        const m = (values.massnahmen as string[]) || [];
        return m.some((x) => MASSNAHMEN_MIT_EEE.includes(x));
      },
      fields: [
        {
          id: "eee_name",
          type: "text",
          label: "Name des Energieeffizienz-Experten",
          required: true,
          placeholder: "Dipl.-Ing. Anna Beispiel",
        },
        {
          id: "eee_bafa_nr",
          type: "text",
          label: "BAFA-Registriernummer des EEE",
          required: true,
          placeholder: "BAFA-EEE-12345",
        },
      ],
    },
    {
      id: "timing",
      title: "Timing",
      description: "Anträge müssen VOR Beginn der Maßnahme gestellt werden",
      kiHinweis:
        "PFLICHT: Stellen Sie den BAFA-Antrag BEVOR Sie den Auftrag vergeben. Auch eine mündliche Auftragserteilung gilt als Maßnahmenbeginn!",
      fields: [
        {
          id: "angebote_vorhanden",
          type: "radio",
          label: "Angebote vom Fachbetrieb vorhanden?",
          required: true,
          options: [
            { value: "Ja", label: "Ja, Angebot liegt vor" },
            { value: "Nein", label: "Nein, noch nicht" },
          ],
        },
        {
          id: "angebotsdatum",
          type: "date",
          label: "Angebotsdatum",
          required: false,
          dependsOn: { field: "angebote_vorhanden", value: "Ja" },
        },
        {
          id: "baubeginn",
          type: "date",
          label: "Geplanter Maßnahmenbeginn",
          required: true,
        },
      ],
    },
    {
      id: "kosten",
      title: "Kostenberechnung",
      description: "Investitionskosten für die ausgewählten Maßnahmen",
      fields: [
        {
          id: "investitionskosten",
          type: "number",
          label: "Gesamte Investitionskosten (alle Maßnahmen)",
          required: true,
          placeholder: "20000",
          unit: "€",
          min: 500,
        },
        {
          id: "email",
          type: "text",
          label: "E-Mail-Adresse für Bescheid",
          required: true,
          placeholder: "max@mustermann.de",
        },
      ],
      berechnungFn: (values) => {
        const massnahmen = (values.massnahmen as string[]) || [];
        const isfp = values.isfp_vorhanden === "Ja";
        const foersatz = isfp ? 20 : 15;
        const maxKosten = isfp ? 60000 : 30000;
        const investition = Number(values.investitionskosten) || 0;
        const foerderfaehig = Math.min(investition, maxKosten);
        const foerderbetrag = Math.round(foerderfaehig * foersatz) / 100;

        return [
          {
            label: "Fördersatz",
            value: `${foersatz}%${isfp ? " (inkl. iSFP-Bonus)" : ""}`,
            highlight: true,
          },
          {
            label: "Max. förderfähige Kosten",
            value: `${maxKosten.toLocaleString("de-DE")} €${isfp ? " (mit iSFP)" : ""}`,
          },
          {
            label: "Anzahl ausgewählter Maßnahmen",
            value: `${massnahmen.length}`,
          },
          ...(investition > 0
            ? [
                {
                  label: "Förderfähige Kosten",
                  value: `${foerderfaehig.toLocaleString("de-DE")} €`,
                },
                {
                  label: "Voraussichtlicher Förderbetrag",
                  value: `${foerderbetrag.toLocaleString("de-DE")} €`,
                  highlight: true as const,
                },
              ]
            : []),
        ];
      },
    },
    {
      id: "zusammenfassung",
      title: "Zusammenfassung & PDF",
      description: "Prüfen Sie alle Angaben und exportieren Sie Ihre Unterlagen",
      isSummary: true,
      fields: [],
    },
  ],
};
