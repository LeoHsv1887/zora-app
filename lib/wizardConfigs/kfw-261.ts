import type { WizardConfig } from "./types";

const EH_STANDARDS = [
  { value: "EH 40", label: "EH 40", description: "45% Tilgungszuschuss", badge: "45%" },
  { value: "EH 55", label: "EH 55", description: "35% Tilgungszuschuss", badge: "35%" },
  { value: "EH 70", label: "EH 70", description: "20% Tilgungszuschuss", badge: "20%" },
  { value: "EH 85", label: "EH 85", description: "10% Tilgungszuschuss", badge: "10%" },
];

const EH_ZUSCHUSS: Record<string, number> = {
  "EH 40": 45,
  "EH 55": 35,
  "EH 70": 20,
  "EH 85": 10,
};

export const kfw261Config: WizardConfig = {
  id: "kfw-261",
  title: "KfW 261 Wohngebäude Kredit beantragen",
  programmName: "KfW 261 Wohngebäude Kredit",
  antragstelle: "KfW (über Hausbank)",
  antragUrl: "https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestehende-Immobilie/Foerderprodukte/Bundesfoerderung-fuer-effiziente-Gebaeude-Wohngebaeude-Kredit-(261)/",
  naechsteSchritte: [
    { text: "Termin bei Ihrer Hausbank vereinbaren und Unterlagen vorlegen" },
    { text: "Bank stellt den KfW-Antrag — NICHT direkt bei der KfW!" },
    {
      text: "KfW-Zusage abwarten, dann erst Aufträge vergeben",
    },
    { text: "Nach Fertigstellung: EEE bestätigt Effizienzhaus-Standard" },
    {
      text: "KfW zahlt Tilgungszuschuss automatisch nach Nachweis aus",
    },
  ],
  steps: [
    {
      id: "antragsteller",
      title: "Antragsteller",
      description: "Persönliche Daten und Hausbank für den Kreditantrag",
      kiHinweis:
        "Der KfW 261 wird NICHT direkt bei der KfW beantragt — sondern bei Ihrer Hausbank. Die Bank leitet den Antrag an die KfW weiter. Sprechen Sie zuerst mit Ihrer Bank!",
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
          label: "Privatadresse (Straße, PLZ, Ort)",
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
            {
              value: "Privatperson",
              label: "Privatperson",
              icon: "👤",
              description: "Natürliche Person als Eigentümer",
            },
            {
              value: "Unternehmen",
              label: "Unternehmen",
              icon: "🏢",
              description: "Wohnungsunternehmen / GmbH",
            },
            {
              value: "WEG",
              label: "Wohnungseigentümergemeinschaft",
              icon: "🏘️",
              description: "WEG mit Beschluss",
            },
            {
              value: "Kommune",
              label: "Kommune / Genossenschaft",
              icon: "🏛️",
              description: "Öffentl. Träger",
            },
          ],
        },
        {
          id: "hausbank",
          type: "text",
          label: "Hausbank (Name der Bank)",
          required: true,
          placeholder: "z.B. Sparkasse Musterstadt, Deutsche Bank",
          helperText: "Antrag wird über diese Bank bei der KfW gestellt",
        },
      ],
    },
    {
      id: "gebaeudedata",
      title: "Gebäudedaten",
      description: "Angaben zum zu sanierenden Wohngebäude",
      fields: [
        {
          id: "gebaeude_adresse",
          type: "text",
          label: "Gebäudeadresse (falls abweichend)",
          required: false,
          placeholder: "Musterstraße 14, 12345 Musterstadt",
        },
        {
          id: "gebaeudetyp",
          type: "select",
          label: "Gebäudetyp",
          required: true,
          options: [
            { value: "Einfamilienhaus", label: "Einfamilienhaus" },
            { value: "Zweifamilienhaus", label: "Zweifamilienhaus" },
            { value: "Mehrfamilienhaus", label: "Mehrfamilienhaus (3+ WE)" },
            { value: "Reihenhaus", label: "Reihen- / Doppelhaus" },
          ],
        },
        {
          id: "baujahr",
          type: "number",
          label: "Baujahr des Gebäudes",
          required: true,
          placeholder: "1975",
          min: 1800,
          max: 2019,
          helperText: "Mind. 5 Jahre alt",
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
          id: "energieklasse_aktuell",
          type: "select",
          label: "Aktuelle Energieeffizienzklasse (falls bekannt)",
          required: false,
          options: [
            { value: "unbekannt", label: "Unbekannt" },
            { value: "A+", label: "A+" },
            { value: "A", label: "A" },
            { value: "B", label: "B" },
            { value: "C", label: "C" },
            { value: "D", label: "D" },
            { value: "E", label: "E" },
            { value: "F", label: "F" },
            { value: "G", label: "G" },
            { value: "H", label: "H" },
          ],
          halfWidth: true,
        },
      ],
    },
    {
      id: "sanierungsziel",
      title: "Sanierungsziel",
      description: "Welchen KfW-Effizienzhaus-Standard möchten Sie erreichen?",
      fields: [
        {
          id: "eh_standard",
          type: "radio",
          label: "Angestrebter Effizienzhaus-Standard",
          required: true,
          options: EH_STANDARDS,
        },
        {
          id: "ee_klasse",
          type: "radio",
          label: "Erneuerbare-Energien-Klasse angestrebt?",
          required: true,
          options: [
            {
              value: "Ja",
              label: "Ja (+5% Tilgungszuschuss)",
              description:
                "≥65% EE-Anteil im Wärmenetz oder Wärmepumpe/Solarthermie",
            },
            { value: "Nein", label: "Nein" },
          ],
        },
        {
          id: "nachhaltigkeitsklasse",
          type: "radio",
          label: "Nachhaltigkeits-Klasse (NH-Klasse) angestrebt?",
          required: false,
          options: [
            {
              value: "Ja",
              label: "Ja (+5% Tilgungszuschuss)",
              description: "Nachhaltigkeitszertifikat erforderlich",
            },
            { value: "Nein", label: "Nein" },
          ],
        },
      ],
      berechnungFn: (values) => {
        const ehStandard = values.eh_standard as string;
        const basisZuschuss = EH_ZUSCHUSS[ehStandard] || 0;
        const eeBonus = values.ee_klasse === "Ja" ? 5 : 0;
        const nhBonus = values.nachhaltigkeitsklasse === "Ja" ? 5 : 0;
        const gesamtZuschuss = basisZuschuss + eeBonus + nhBonus;
        const anzahlWE = Math.max(1, Number(values.anzahl_wohneinheiten) || 1);
        const maxKredit = 150000 * anzahlWE;
        const maxZuschuss = Math.round(maxKredit * gesamtZuschuss) / 100;

        return [
          {
            label: "Basisförderung (Tilgungszuschuss)",
            value: basisZuschuss > 0 ? `${basisZuschuss}%` : "bitte Standard wählen",
          },
          {
            label: "EE-Klasse Bonus",
            value: eeBonus > 0 ? `+${eeBonus}%` : "nicht gewählt",
          },
          {
            label: "NH-Klasse Bonus",
            value: nhBonus > 0 ? `+${nhBonus}%` : "nicht gewählt",
          },
          {
            label: "Gesamter Tilgungszuschuss",
            value: `${gesamtZuschuss}%`,
            highlight: gesamtZuschuss > 0,
          },
          {
            label: "Max. Kredit",
            value: `${maxKredit.toLocaleString("de-DE")} € (${anzahlWE} WE × 150.000 €)`,
          },
          ...(gesamtZuschuss > 0 && maxKredit > 0
            ? [
                {
                  label: "Max. Tilgungszuschuss in €",
                  value: `bis zu ${maxZuschuss.toLocaleString("de-DE")} €`,
                  highlight: true as const,
                },
              ]
            : []),
        ];
      },
    },
    {
      id: "eee",
      title: "Energieeffizienz-Experte",
      description: "EEE ist Pflichtvoraussetzung für KfW 261",
      kiHinweis:
        "Für KfW 261 ist ein Energieeffizienz-Experte Pflicht. Der EEE muss den Sanierungsplan erstellen und am Ende die Fertigstellung bestätigen.",
      fields: [
        {
          id: "eee_beauftragt",
          type: "radio",
          label: "EEE bereits beauftragt?",
          required: true,
          options: [
            { value: "Ja", label: "Ja, beauftragt" },
            { value: "Nein", label: "Nein, noch nicht" },
            { value: "In Auswahl", label: "In Auswahl" },
          ],
        },
        {
          id: "eee_name",
          type: "text",
          label: "Name des EEE",
          required: false,
          placeholder: "Dipl.-Ing. Anna Beispiel",
          dependsOn: { field: "eee_beauftragt", value: "Ja" },
        },
        {
          id: "eee_bafa_nr",
          type: "text",
          label: "BAFA-Registriernummer des EEE",
          required: false,
          placeholder: "BAFA-EEE-12345",
          dependsOn: { field: "eee_beauftragt", value: "Ja" },
        },
        {
          id: "isfp_vorhanden",
          type: "radio",
          label: "Individueller Sanierungsfahrplan (iSFP) vorhanden?",
          required: false,
          options: [
            {
              value: "Ja",
              label: "Ja",
              description: "Bietet Überblick über weitere mögliche Maßnahmen",
            },
            { value: "Nein", label: "Nein" },
          ],
        },
      ],
    },
    {
      id: "massnahmen",
      title: "Geplante Maßnahmen",
      description: "Welche Sanierungsmaßnahmen sind geplant?",
      fields: [
        {
          id: "massnahmen",
          type: "checkbox",
          label: "Geplante Sanierungsmaßnahmen",
          required: true,
          options: [
            { value: "fassade", label: "Dämmung Fassade", icon: "🧱" },
            { value: "dach", label: "Dämmung Dach", icon: "🏠" },
            { value: "keller", label: "Dämmung Kellerdecke", icon: "⬇️" },
            { value: "fenster", label: "Neue Fenster & Türen", icon: "🪟" },
            { value: "heizung", label: "Heizungstausch", icon: "🔥" },
            { value: "lueftung", label: "Lüftungsanlage", icon: "💨" },
          ],
        },
        {
          id: "weitere_massnahmen",
          type: "text",
          label: "Weitere Maßnahmen (optional)",
          required: false,
          placeholder: "z.B. Solarthermie, Batteriespeicher...",
        },
        {
          id: "gesamtkosten_sanierung",
          type: "number",
          label: "Gesamtkosten der Sanierung (geschätzt)",
          required: true,
          placeholder: "80000",
          unit: "€",
          min: 5000,
        },
      ],
    },
    {
      id: "kreditbedarf",
      title: "Kreditbedarf",
      description: "Wie viel Kredit benötigen Sie?",
      fields: [
        {
          id: "kreditbetrag",
          type: "number",
          label: "Gewünschter Kreditbetrag",
          required: true,
          placeholder: "60000",
          unit: "€",
          min: 1000,
          helperText: "Max. 150.000 € × Anzahl Wohneinheiten",
        },
        {
          id: "laufzeit",
          type: "select",
          label: "Gewünschte Laufzeit",
          required: true,
          options: [
            { value: "4", label: "4 Jahre" },
            { value: "5", label: "5 Jahre" },
            { value: "10", label: "10 Jahre" },
            { value: "15", label: "15 Jahre" },
            { value: "20", label: "20 Jahre" },
            { value: "25", label: "25 Jahre" },
            { value: "30", label: "30 Jahre" },
          ],
          halfWidth: true,
        },
        {
          id: "tilgungsfreie_jahre",
          type: "radio",
          label: "Tilgungsfreie Anlaufzeit gewünscht?",
          required: false,
          options: [
            {
              value: "Ja",
              label: "Ja (bis 5 Jahre)",
              description: "Nur Zinsen in der Anlaufzeit",
            },
            { value: "Nein", label: "Nein, sofort tilgen" },
          ],
          halfWidth: true,
        },
      ],
      berechnungFn: (values) => {
        const ehStandard = values.eh_standard as string;
        const basisZuschuss = EH_ZUSCHUSS[ehStandard] || 0;
        const eeBonus = values.ee_klasse === "Ja" ? 5 : 0;
        const nhBonus = values.nachhaltigkeitsklasse === "Ja" ? 5 : 0;
        const gesamtZuschuss = basisZuschuss + eeBonus + nhBonus;
        const kreditbetrag = Number(values.kreditbetrag) || 0;
        const tilgungszuschuss = Math.round(kreditbetrag * gesamtZuschuss) / 100;
        const effektiverKredit = kreditbetrag - tilgungszuschuss;
        const anzahlWE = Math.max(1, Number(values.anzahl_wohneinheiten) || 1);
        const maxKredit = 150000 * anzahlWE;

        return [
          {
            label: "Max. Kreditbetrag",
            value: `${maxKredit.toLocaleString("de-DE")} €`,
          },
          {
            label: "Gesamter Tilgungszuschuss",
            value: `${gesamtZuschuss}%`,
          },
          ...(kreditbetrag > 0 && gesamtZuschuss > 0
            ? [
                {
                  label: "Tilgungszuschuss in €",
                  value: `${tilgungszuschuss.toLocaleString("de-DE")} €`,
                  highlight: true as const,
                },
                {
                  label: "Effektiver Kreditbetrag (nach Zuschuss)",
                  value: `${effektiverKredit.toLocaleString("de-DE")} €`,
                  highlight: true as const,
                },
              ]
            : []),
          {
            label: "Aktueller Zinssatz",
            value: "ab 1,01% eff. p.a. (Konditionen bei Hausbank anfragen)",
          },
        ];
      },
    },
    {
      id: "zusammenfassung",
      title: "Zusammenfassung & Banktermin",
      description: "Ihre vollständige Übersicht für das Bankgespräch",
      isSummary: true,
      fields: [],
    },
  ],
};
