import type { WizardConfig } from "./types";

const KFW_KLIMA_HEIZUNGEN = ["Ölheizung", "Kohle", "Nachtspeicher"];

export const kfw458Config: WizardConfig = {
  id: "kfw-458",
  title: "KfW 458 Heizungsförderung beantragen",
  programmName: "KfW 458 Heizungsförderung",
  antragstelle: "KfW",
  antragUrl: "https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestehende-Immobilie/Foerderprodukte/Bundesfoerderung-fuer-effiziente-Gebaeude-Einzelmassnahmen-Heizung-(458)/",
  naechsteSchritte: [
    {
      text: "Antrag im KfW-Förderportal online einreichen (nach EEE-Bestätigung)",
      url: "https://www.kfw.de",
    },
    { text: "Maßnahme erst nach Erhalt der Förderzusage beginnen" },
    { text: "Fachbetrieb mit Durchführung beauftragen" },
    {
      text: "Nach Fertigstellung: Verwendungsnachweis über KfW-Portal einreichen",
    },
  ],
  steps: [
    {
      id: "antragsteller",
      title: "Antragsteller",
      description: "Persönliche Daten und Eigentümerverhältnis",
      kiHinweis:
        "Als Selbstnutzer mit Haushaltseinkommen unter 40.000 € können Sie zusätzlich den Einkommensbonus (+30%) beantragen.",
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
          id: "strasse",
          type: "text",
          label: "Straße und Hausnummer des Gebäudes",
          required: true,
          placeholder: "Musterstraße 12",
        },
        {
          id: "plz",
          type: "text",
          label: "PLZ",
          required: true,
          placeholder: "12345",
          halfWidth: true,
        },
        {
          id: "ort",
          type: "text",
          label: "Ort",
          required: true,
          placeholder: "Musterstadt",
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
          id: "email",
          type: "text",
          label: "E-Mail",
          required: true,
          placeholder: "max@mustermann.de",
          halfWidth: true,
        },
        {
          id: "eigentuemerart",
          type: "radio",
          label: "Eigentümerart",
          required: true,
          options: [
            {
              value: "Selbstnutzer",
              label: "Selbstnutzer",
              icon: "🏠",
              description: "Ich wohne selbst im Gebäude",
            },
            {
              value: "Vermieter",
              label: "Vermieter",
              icon: "🏢",
              description: "Das Gebäude ist vermietet",
            },
            {
              value: "WEG",
              label: "Wohnungseigentümergemeinschaft",
              icon: "🏘️",
              description: "Mehrere Eigentümer",
            },
          ],
        },
      ],
    },
    {
      id: "gebaeudedata",
      title: "Gebäudedaten",
      description: "Angaben zum Gebäude, das saniert werden soll",
      fields: [
        {
          id: "gebaeudetyp",
          type: "radio",
          label: "Gebäudetyp",
          required: true,
          options: [
            {
              value: "Einfamilienhaus",
              label: "Einfamilienhaus",
              icon: "🏡",
            },
            { value: "Doppelhaus", label: "Doppelhaus", icon: "🏠" },
            { value: "Reihenhaus", label: "Reihenhaus", icon: "🏘️" },
            {
              value: "Mehrfamilienhaus",
              label: "Mehrfamilienhaus",
              icon: "🏢",
            },
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
          id: "wohnflaeche",
          type: "number",
          label: "Wohnfläche",
          required: true,
          placeholder: "150",
          unit: "m²",
          min: 20,
          halfWidth: true,
        },
        {
          id: "denkmalgeschuetzt",
          type: "radio",
          label: "Denkmalgeschützt?",
          required: true,
          options: [
            { value: "Ja", label: "Ja" },
            { value: "Nein", label: "Nein" },
          ],
        },
      ],
    },
    {
      id: "bestehende_heizung",
      title: "Bestehende Heizung",
      description: "Angaben zur aktuellen Heizungsanlage",
      kiHinweis:
        "Wichtig: Beim Austausch einer Öl-, Kohle- oder Nachtspeicherheizung erhalten Sie automatisch den Klimageschwindigkeitsbonus (+20%). Das erhöht Ihre Förderquote auf bis zu 70%!",
      fields: [
        {
          id: "aktuelle_heizungsart",
          type: "radio",
          label: "Aktuelle Heizungsart",
          required: true,
          options: [
            { value: "Ölheizung", label: "Ölheizung", icon: "🛢️" },
            { value: "Gasheizung", label: "Gasheizung", icon: "🔥" },
            {
              value: "Nachtspeicher",
              label: "Nachtspeicherheizung",
              icon: "⚡",
            },
            { value: "Kohle", label: "Kohleheizung", icon: "⛏️" },
            { value: "Wärmepumpe", label: "Wärmepumpe (alt)", icon: "♻️" },
          ],
        },
        {
          id: "baujahr_heizung",
          type: "number",
          label: "Baujahr der aktuellen Heizung",
          required: true,
          placeholder: "2001",
          min: 1950,
          max: 2024,
        },
        {
          id: "vollstaendiger_ersatz",
          type: "radio",
          label: "Wird die Heizung vollständig ersetzt?",
          required: true,
          options: [
            { value: "Ja", label: "Ja, vollständig" },
            { value: "Nein", label: "Nein, teilweise" },
          ],
        },
      ],
      berechnungFn: (values) => {
        const heizungsart = values.aktuelle_heizungsart as string;
        const hatKlimabonus = KFW_KLIMA_HEIZUNGEN.includes(heizungsart);
        const foerderquote = 30 + (hatKlimabonus ? 20 : 0);
        return [
          {
            label: "Klimageschwindigkeitsbonus",
            value: hatKlimabonus ? "✅ Ja (+20%)" : "❌ Nein",
            highlight: hatKlimabonus,
          },
          {
            label: "Voraussichtliche Mindest-Förderquote",
            value: `${foerderquote}%`,
            highlight: true,
          },
        ];
      },
    },
    {
      id: "neue_heizung",
      title: "Neue Heizungsanlage",
      description: "Angaben zur geplanten neuen Heizung",
      kiHinweis:
        "Der hydraulische Abgleich ist bei Wärmepumpen Pflicht und muss vom Fachbetrieb bestätigt werden. Ohne diesen Nachweis wird der Antrag abgelehnt.",
      fields: [
        {
          id: "neue_heizungsart",
          type: "radio",
          label: "Neue Heizungsart",
          required: true,
          options: [
            { value: "Wärmepumpe", label: "Wärmepumpe", icon: "♻️", description: "Luft/Wasser oder Sole/Wasser" },
            { value: "Solarthermie", label: "Solarthermie", icon: "☀️", description: "Thermische Solaranlage" },
            { value: "Biomasseheizung", label: "Biomasseheizung", icon: "🌿", description: "Pellets, Hackschnitzel, Scheitholz" },
            { value: "Hybridheizung", label: "Wärmepumpen-Hybridheizung", icon: "🔄", description: "Wärmepumpe + Gas/Öl Backup" },
          ],
        },
        {
          id: "hersteller_modell",
          type: "text",
          label: "Hersteller und Modell (optional)",
          required: false,
          placeholder: "z.B. Viessmann Vitocal 250-A",
        },
        {
          id: "nennwaermeleistung",
          type: "number",
          label: "Geplante Nennwärmeleistung",
          required: true,
          placeholder: "12",
          unit: "kW",
          min: 1,
          max: 500,
        },
        {
          id: "hydraulischer_abgleich",
          type: "radio",
          label: "Hydraulischer Abgleich wird durchgeführt?",
          required: true,
          options: [
            { value: "Ja", label: "Ja, wird durchgeführt" },
            { value: "Nein", label: "Nein" },
          ],
        },
      ],
    },
    {
      id: "eee",
      title: "Energieeffizienz-Experte",
      description: "Der EEE ist Pflichtvoraussetzung für den KfW 458",
      kiHinweis:
        "PFLICHT: Ohne beauftragten Energieeffizienz-Experten kann der KfW-458-Antrag nicht gestellt werden. Der EEE muss die Technische Projektbeschreibung (TPB) erstellen BEVOR Sie den Antrag einreichen.",
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
          label: "Name des Energieeffizienz-Experten",
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
          id: "tpb_vorhanden",
          type: "radio",
          label: "Technische Projektbeschreibung (TPB) liegt vor?",
          required: true,
          options: [
            { value: "Ja", label: "Ja, TPB liegt vor" },
            { value: "Nein", label: "Nein, noch nicht" },
          ],
        },
      ],
    },
    {
      id: "liefervertrag",
      title: "Liefervertrag & Timing",
      description: "Angaben zum Vertrag mit dem Fachbetrieb",
      kiHinweis:
        "KRITISCH: Seit 2024 müssen Sie einen Liefervertrag mit dem Fachbetrieb abschließen BEVOR Sie den Antrag stellen. Ein bereits begonnenes Projekt wird nicht gefördert!",
      fields: [
        {
          id: "liefervertrag_abgeschlossen",
          type: "radio",
          label: "Lieferungs- oder Leistungsvertrag mit Fachbetrieb abgeschlossen?",
          required: true,
          options: [
            { value: "Ja", label: "Ja, Vertrag liegt vor" },
            { value: "Nein", label: "Nein, noch nicht" },
          ],
        },
        {
          id: "fachbetrieb_name",
          type: "text",
          label: "Name des Fachbetriebs",
          required: true,
          placeholder: "Heizung Mustermann GmbH",
        },
        {
          id: "vertragsdatum",
          type: "date",
          label: "Datum des Vertragsabschlusses",
          required: false,
          dependsOn: { field: "liefervertrag_abgeschlossen", value: "Ja" },
        },
        {
          id: "baubeginn",
          type: "date",
          label: "Geplanter Umsetzungsbeginn",
          required: true,
        },
        {
          id: "fertigstellung",
          type: "date",
          label: "Geplantes Fertigstellungsdatum",
          required: true,
        },
      ],
    },
    {
      id: "kosten",
      title: "Kosten & Förderberechnung",
      description: "Geben Sie die voraussichtlichen Investitionskosten ein",
      fields: [
        {
          id: "gesamtkosten",
          type: "number",
          label: "Gesamte Investitionskosten inkl. MwSt.",
          required: true,
          placeholder: "25000",
          unit: "€",
          min: 1000,
        },
        {
          id: "materialkosten",
          type: "number",
          label: "Davon Materialkosten",
          required: false,
          placeholder: "15000",
          unit: "€",
          halfWidth: true,
        },
        {
          id: "arbeitskosten",
          type: "number",
          label: "Davon Arbeitskosten",
          required: false,
          placeholder: "8000",
          unit: "€",
          halfWidth: true,
        },
        {
          id: "nebenkosten",
          type: "number",
          label: "Nebenkosten (Planung, Baubegleitung)",
          required: false,
          placeholder: "2000",
          unit: "€",
        },
      ],
      berechnungFn: (values) => {
        const heizungsart = values.aktuelle_heizungsart as string;
        const hatKlimabonus = KFW_KLIMA_HEIZUNGEN.includes(heizungsart);
        const eigentuemerart = values.eigentuemerart as string;
        const foerderquote = 30 + (hatKlimabonus ? 20 : 0);
        const gesamtkosten = Number(values.gesamtkosten) || 0;
        const anzahlWE = Math.max(1, Number(values.anzahl_wohneinheiten) || 1);
        const maxBetrag = 30000 * anzahlWE;
        const foerderbetrag = Math.min(
          Math.round(gesamtkosten * foerderquote) / 100,
          maxBetrag
        );

        const results: import("./types").BerechnungEntry[] = [
          { label: "Grundförderung", value: "30%" },
          {
            label: "Klimageschwindigkeitsbonus",
            value: hatKlimabonus ? "+20% ✅" : "nicht zutreffend",
          },
          {
            label: "Gesamtförderquote",
            value: `${foerderquote}%`,
            highlight: true,
          },
          {
            label: "Max. förderfähiger Betrag",
            value: `${maxBetrag.toLocaleString("de-DE")} € (${anzahlWE} WE × 30.000 €)`,
          },
        ];
        if (gesamtkosten > 0) {
          results.push({
            label: "Voraussichtlicher Förderbetrag",
            value: `${foerderbetrag.toLocaleString("de-DE")} €`,
            highlight: true,
          });
        }
        if (eigentuemerart === "Selbstnutzer") {
          results.push({
            label: "Einkommensbonus möglich",
            value: "+30% bei Haushaltseinkommen < 40.000 € / Jahr",
            highlight: false,
          });
        }
        return results;
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
