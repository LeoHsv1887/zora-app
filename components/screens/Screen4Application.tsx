"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Save,
  Sparkles,
  Check,
  AlertTriangle,
  X,
  ExternalLink,
  Loader2,
  FileText,
} from "lucide-react";
import { Foerderprogramm } from "@/types";

// ── Props ──────────────────────────────────────────────────────────────────
interface Props {
  displayName: string;
  bundesland: string;
  selectedIds: string[];
  programmes: Foerderprogramm[];
  onBack: () => void;
  onSuccess: () => void;
}

// ── Field / Section types ──────────────────────────────────────────────────
type FieldType = "text" | "number" | "date" | "select" | "radio" | "checkbox" | "textarea";

interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  hint?: string;
  warning?: string;
  placeholder?: string;
  min?: number;
  unit?: string;
  optional?: boolean;
}

interface SectionDef {
  title: string;
  fields: FieldDef[];
  hint?: string;
  warningHint?: string;
}

type FormData = Record<string, string | string[]>;
type GeneratedText = {
  projektbeschreibung: string;
  begruendung: string;
  energetischerNutzen: string;
  naechsteSchritte: string;
};

// ── KfW 458 Sections ──────────────────────────────────────────────────────
const KFW458_SECTIONS: SectionDef[] = [
  {
    title: "Angaben zur Immobilie",
    fields: [
      { key: "adresse", label: "Genaue Adresse des Gebäudes", type: "text", required: true, placeholder: "Musterstraße 12, 80331 München" },
      { key: "gebaeudetyp", label: "Gebäudetyp", type: "select", required: true, options: ["EFH (Einfamilienhaus)", "DHH (Doppelhaushälfte)", "RH (Reihenhaus)", "MFH (Mehrfamilienhaus)"] },
      { key: "baujahr", label: "Baujahr des Gebäudes", type: "number", required: true, placeholder: "z.B. 1978" },
      { key: "wohneinheiten", label: "Anzahl Wohneinheiten", type: "number", required: true, placeholder: "z.B. 1" },
      { key: "wohnflaeche", label: "Wohnfläche gesamt", type: "number", required: true, placeholder: "z.B. 140", unit: "m²" },
      { key: "denkmalschutz", label: "Ist das Gebäude denkmalgeschützt?", type: "radio", required: true, options: ["Ja", "Nein"] },
      { key: "nutzung", label: "Eigennutzung oder Vermietung?", type: "radio", required: true, options: ["Eigennutzung", "Vermietung", "Beides"] },
    ],
  },
  {
    title: "Bestehende Heizungsanlage",
    hint: "Beim Austausch von Öl, Kohle oder Nachtspeicher erhalten Sie automatisch +20% Klimageschwindigkeitsbonus",
    fields: [
      { key: "altHeizungArt", label: "Art der aktuellen Heizung", type: "select", required: true, options: ["Ölheizung", "Gasheizung", "Kohleheizung", "Nachtspeicher", "Sonstiges"] },
      { key: "altHeizungBaujahr", label: "Baujahr der aktuellen Heizung", type: "number", placeholder: "z.B. 2003" },
      { key: "vollstaendigerErsatz", label: "Wird die Heizung vollständig ersetzt?", type: "radio", required: true, options: ["Ja", "Nein"] },
    ],
  },
  {
    title: "Neue Heizungsanlage",
    fields: [
      { key: "neuHeizungArt", label: "Art der neuen Heizung", type: "select", required: true, options: ["Wärmepumpe", "Solarthermie", "Biomasseheizung", "Hybrid (Wärmepumpe + Gas)"] },
      { key: "hersteller", label: "Hersteller", type: "text", optional: true, placeholder: "z.B. Viessmann" },
      { key: "modell", label: "Modell", type: "text", optional: true, placeholder: "z.B. Vitocal 250-A" },
      { key: "nennleistung", label: "Nennwärmeleistung", type: "number", placeholder: "z.B. 12", unit: "kW" },
      { key: "hydraulischerAbgleich", label: "Hydraulischer Abgleich geplant?", type: "radio", required: true, options: ["Ja", "Nein"], hint: "Pflicht bei Wärmepumpe" },
    ],
  },
  {
    title: "Energieeffizienz-Experte (EEE)",
    warningHint: "PFLICHT: Ohne TPB-ID kann der Antrag nicht eingereicht werden",
    fields: [
      { key: "eeeBeauftragt", label: "EEE bereits beauftragt?", type: "radio", required: true, options: ["Ja", "Nein"] },
      { key: "eeeName", label: "Name des EEE", type: "text", placeholder: "Vor- und Nachname" },
      { key: "eeeRegistriernummer", label: "BAFA-Registriernummer", type: "text", placeholder: "z.B. EEE-123456" },
      { key: "tpbIdErhalten", label: "TPB-ID bereits erhalten?", type: "radio", required: true, options: ["Ja", "Nein", "In Bearbeitung"] },
    ],
  },
  {
    title: "Fachbetrieb & Timing",
    fields: [
      { key: "fachbetrieb", label: "Name des Fachbetriebs", type: "text", required: true, placeholder: "Müller Haustechnik GmbH" },
      { key: "liefervertrag", label: "Liefervertrag abgeschlossen?", type: "radio", options: ["Ja", "Nein"] },
      { key: "vertragsabschluss", label: "Datum Vertragsabschluss", type: "date" },
      { key: "baubeginn", label: "Geplanter Baubeginn", type: "date", required: true, warning: "Achtung: Bereits begonnene Maßnahmen werden nicht gefördert!" },
      { key: "fertigstellung", label: "Geplante Fertigstellung", type: "date" },
    ],
  },
  {
    title: "Kosten & Förderberechnung",
    fields: [
      { key: "gesamtkosten", label: "Gesamte Investitionskosten brutto", type: "number", required: true, placeholder: "z.B. 25000", unit: "€" },
      { key: "materialkosten", label: "Davon Materialkosten", type: "number", placeholder: "z.B. 15000", unit: "€" },
      { key: "arbeitskosten", label: "Davon Arbeitskosten", type: "number", placeholder: "z.B. 8000", unit: "€" },
      { key: "planungskosten", label: "Planungs- und Beratungskosten", type: "number", placeholder: "z.B. 2000", unit: "€" },
    ],
  },
];

// ── BEG EM Sections ───────────────────────────────────────────────────────
const BEG_EM_SECTIONS: SectionDef[] = [
  {
    title: "Gebäude & Eigentümer",
    fields: [
      { key: "adresse", label: "Vollständige Adresse", type: "text", required: true, placeholder: "Musterstraße 12, 80331 München" },
      { key: "gebaeudetyp", label: "Gebäudetyp", type: "select", required: true, options: ["Einfamilienhaus", "Mehrfamilienhaus", "Nichtwohngebäude"] },
      { key: "baujahr", label: "Baujahr des Gebäudes", type: "number", required: true, placeholder: "z.B. 1985" },
      { key: "eigentuemerRolle", label: "Eigentümer oder Bevollmächtigter?", type: "radio", required: true, options: ["Eigentümer", "Bevollmächtigter"] },
      { key: "vollmacht", label: "Vollmacht vorhanden?", type: "radio", options: ["Ja", "Nein"] },
    ],
  },
  {
    title: "Geplante Maßnahmen",
    hint: "Mit iSFP-Nachweis erhalten Sie automatisch +5% Förderbonus auf alle Maßnahmen",
    fields: [
      {
        key: "massnahmen",
        label: "Maßnahmenauswahl (Mehrfachauswahl möglich)",
        type: "checkbox",
        required: true,
        options: [
          "Wärmedämmung Fassade",
          "Wärmedämmung Dach",
          "Wärmedämmung Kellerdecke",
          "Neue Fenster & Außentüren",
          "Lüftungsanlage",
          "Heizungsoptimierung / hydraulischer Abgleich",
          "Sommerlicher Wärmeschutz",
        ],
      },
      { key: "isfp", label: "iSFP vorhanden?", type: "radio", options: ["Ja", "Nein"], hint: "+5% Bonus bei vorhandenem iSFP" },
    ],
  },
  {
    title: "Fachunternehmen",
    fields: [
      { key: "fachbetrieb", label: "Name des Fachbetriebs", type: "text", required: true, placeholder: "Müller Bau GmbH" },
      { key: "fachbetriebAdresse", label: "Adresse des Fachbetriebs", type: "text", placeholder: "Straße, PLZ, Ort" },
      { key: "handwerksrolle", label: "In Handwerksrolle eingetragen?", type: "radio", required: true, options: ["Ja", "Nein"] },
      { key: "angebotVorhanden", label: "Angebot liegt vor?", type: "radio", options: ["Ja", "Nein"] },
      { key: "angebotsDatum", label: "Datum des Angebots", type: "date" },
    ],
  },
  {
    title: "Kosten je Maßnahme",
    fields: [
      { key: "kostenFassade", label: "Kosten Wärmedämmung Fassade", type: "number", placeholder: "z.B. 12000", unit: "€" },
      { key: "kostenDach", label: "Kosten Wärmedämmung Dach", type: "number", placeholder: "z.B. 8000", unit: "€" },
      { key: "kostenKellerdecke", label: "Kosten Wärmedämmung Kellerdecke", type: "number", placeholder: "z.B. 3000", unit: "€" },
      { key: "kostenFenster", label: "Kosten Fenster & Außentüren", type: "number", placeholder: "z.B. 15000", unit: "€" },
      { key: "kostenLueftung", label: "Kosten Lüftungsanlage", type: "number", placeholder: "z.B. 6000", unit: "€" },
      { key: "kostenHeizung", label: "Kosten Heizungsoptimierung", type: "number", placeholder: "z.B. 2000", unit: "€" },
      { key: "kostenWaermeschutz", label: "Kosten Sommerlicher Wärmeschutz", type: "number", placeholder: "z.B. 1500", unit: "€" },
    ],
  },
];

// ── Generic Sections ──────────────────────────────────────────────────────
const GENERIC_SECTIONS: SectionDef[] = [
  {
    title: "Antragsteller",
    fields: [
      { key: "name", label: "Name / Firmenname", type: "text", required: true, placeholder: "Vollständiger Name oder Firmenname" },
      { key: "adresse", label: "Adresse", type: "text", required: true, placeholder: "Straße, Hausnr., PLZ, Ort" },
      { key: "telefon", label: "Telefon", type: "text", placeholder: "+49 89 12345678" },
      { key: "email", label: "E-Mail", type: "text", placeholder: "name@example.de" },
      { key: "rolle", label: "Rolle", type: "select", required: true, options: ["Eigentümer", "Mieter", "Bevollmächtigter", "Unternehmen"] },
    ],
  },
  {
    title: "Projektbeschreibung",
    hint: "Je detaillierter deine Beschreibung, desto höher die Bewilligungswahrscheinlichkeit",
    fields: [
      { key: "projektName", label: "Projektbezeichnung", type: "text", required: true, placeholder: "Kurze prägnante Bezeichnung" },
      { key: "projektBeschreibung", label: "Ausführliche Projektbeschreibung", type: "textarea", required: true, placeholder: "Beschreibe das Projekt detailliert (mind. 150 Zeichen)", min: 150 },
      { key: "projektBeginn", label: "Geplanter Beginn", type: "date", required: true },
      { key: "projektFertigstellung", label: "Geplante Fertigstellung", type: "date" },
      { key: "gesamtinvestition", label: "Gesamtinvestition", type: "number", required: true, placeholder: "z.B. 50000", unit: "€" },
    ],
  },
  {
    title: "Förderdetails",
    fields: [
      { key: "beantragterBetrag", label: "Beantragter Förderbetrag", type: "number", required: true, placeholder: "z.B. 15000", unit: "€" },
      { key: "kofinanzierung", label: "Kofinanzierung vorhanden?", type: "radio", options: ["Ja", "Nein"] },
      { key: "andereProgramme", label: "Andere Förderprogramme beantragt?", type: "text", placeholder: "z.B. KfW 261, Landesförderung Bayern" },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────
function formatEuro(val: number): string {
  return val.toLocaleString("de-DE") + " €";
}

function parseNum(s: string | string[] | undefined): number {
  if (!s || Array.isArray(s)) return 0;
  return parseFloat(s.replace(/[^\d.,]/g, "").replace(",", ".")) || 0;
}

function isFieldFilled(field: FieldDef, data: FormData): boolean {
  const v = data[field.key];
  if (Array.isArray(v)) return v.length > 0;
  return !!v && v.trim() !== "";
}

function isDateInPast(dateStr: string): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date(new Date().toDateString());
}

// ── KI hint box ───────────────────────────────────────────────────────────
function HintBox({ text, variant = "info" }: { text: string; variant?: "info" | "warning" }) {
  const isWarning = variant === "warning";
  return (
    <div className={`rounded-xl p-4 flex gap-3 ${isWarning ? "bg-amber-50 border border-amber-200" : "bg-[#E1F5EE] border border-[#1D9E75]/20"}`}>
      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${isWarning ? "bg-amber-500" : "bg-[#1D9E75]"}`}>
        {isWarning
          ? <AlertTriangle size={11} className="text-white" />
          : <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        }
      </div>
      <p className={`text-sm leading-relaxed ${isWarning ? "text-amber-800" : "text-[#0F6E56]"}`}>{text}</p>
    </div>
  );
}

// ── Status icon ───────────────────────────────────────────────────────────
function StatusIcon({ status }: { status: "done" | "warning" | "missing" }) {
  if (status === "done") return <Check size={14} className="text-[#1D9E75] flex-shrink-0" />;
  if (status === "warning") return <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />;
  return <X size={14} className="text-red-500 flex-shrink-0" />;
}

// ── Main Component ────────────────────────────────────────────────────────
export default function Screen4Application({
  displayName,
  bundesland,
  selectedIds,
  programmes,
  onBack,
  onSuccess,
}: Props) {
  const programmId = selectedIds[0] || "generic";
  const mainProg = programmes.find((p) => p.id === selectedIds[0]) || programmes[0];

  const isKfw458 = programmId === "kfw-458";
  const isBegEm = programmId === "beg-em";
  const sections: SectionDef[] = isKfw458 ? KFW458_SECTIONS : isBegEm ? BEG_EM_SECTIONS : GENERIC_SECTIONS;

  const [formData, setFormData] = useState<FormData>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(`zora-antrag-${programmId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          return parsed.formData || {};
        }
      } catch { /* ignore */ }
    }
    return {};
  });

  const [activeSection, setActiveSection] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState<GeneratedText | null>(null);
  const [editableText, setEditableText] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [savedDraft, setSavedDraft] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Auto-save to localStorage on change
  useEffect(() => {
    const entwurf = {
      programmId,
      programmName: mainProg?.name || programmId,
      formData,
      kiText: generatedText,
      vollstaendigkeit: 0,
      gespeichertAm: new Date().toISOString(),
      status: "entwurf",
    };
    localStorage.setItem(`zora-antrag-${programmId}`, JSON.stringify(entwurf));
    // Also keep wizard-compatible key for dashboard
    localStorage.setItem(`antrag_wizard_${programmId}`, JSON.stringify({ values: formData, updatedAt: Date.now() }));
  }, [formData, generatedText, programmId, mainProg]);

  const setField = useCallback((key: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ── Completeness ────────────────────────────────────────────────────────
  const completionItems = useMemo(() => {
    const items: { label: string; status: "done" | "warning" | "missing" }[] = [];
    sections.forEach((section) => {
      const requiredFields = section.fields.filter((f) => f.required);
      const allFilled = requiredFields.every((f) => isFieldFilled(f, formData));
      const anyFilled = section.fields.some((f) => isFieldFilled(f, formData));
      if (allFilled && requiredFields.length > 0) {
        items.push({ label: section.title, status: "done" });
      } else if (anyFilled || requiredFields.length === 0) {
        items.push({ label: section.title, status: requiredFields.length > 0 ? "warning" : "done" });
      } else {
        items.push({ label: section.title, status: "missing" });
      }
    });
    // Extra items for program-specific things
    if (isKfw458) {
      const eeeOk = !!formData.tpbIdErhalten && formData.tpbIdErhalten === "Ja";
      items.push({ label: "TPB-ID vorhanden", status: eeeOk ? "done" : "missing" });
      const kostenOk = !!formData.gesamtkosten;
      items.push({ label: "Kostenkalkulation", status: kostenOk ? "done" : "missing" });
      const eeeHint = formData.eeeBeauftragt === "Ja";
      if (!eeeHint) items.push({ label: "EEE beauftragen (empfohlen)", status: "warning" });
    }
    if (isBegEm) {
      const massnahmenOk = Array.isArray(formData.massnahmen) && formData.massnahmen.length > 0;
      if (!massnahmenOk) items.push({ label: "Maßnahmen auswählen", status: "missing" });
    }
    return items;
  }, [formData, sections, isKfw458, isBegEm]);

  const completionPercentage = useMemo(() => {
    const done = completionItems.filter((i) => i.status === "done").length;
    return Math.round((done / Math.max(completionItems.length, 1)) * 100);
  }, [completionItems]);

  // ── KfW 458 Förderberechnung ────────────────────────────────────────────
  const kfwCalc = useMemo(() => {
    if (!isKfw458) return null;
    const gesamt = parseNum(formData.gesamtkosten as string);
    if (!gesamt) return null;
    const altArt = (formData.altHeizungArt as string) || "";
    const klimaBonus = ["Ölheizung", "Kohleheizung", "Nachtspeicher"].includes(altArt);
    const grundfoerderung = 0.3;
    const klimaZuschlag = klimaBonus ? 0.2 : 0;
    const gesamtSatz = grundfoerderung + klimaZuschlag;
    const foerderbetrag = Math.min(gesamt * gesamtSatz, gesamt);
    const eigenanteil = gesamt - foerderbetrag;
    return { grundfoerderung, klimaBonus, klimaZuschlag, gesamtSatz, foerderbetrag, eigenanteil, gesamt };
  }, [isKfw458, formData]);

  // ── BEG EM Förderberechnung ─────────────────────────────────────────────
  const begCalc = useMemo(() => {
    if (!isBegEm) return null;
    const isfp = formData.isfp === "Ja";
    const foerdersatz = 0.15 + (isfp ? 0.05 : 0);
    const kostenKeys = ["kostenFassade", "kostenDach", "kostenKellerdecke", "kostenFenster", "kostenLueftung", "kostenHeizung", "kostenWaermeschutz"];
    const gesamtKosten = kostenKeys.reduce((sum, k) => sum + parseNum(formData[k] as string), 0);
    const maxFoerderbar = isfp ? 60000 : 30000;
    const foerderbarKosten = Math.min(gesamtKosten, maxFoerderbar);
    const foerderbetrag = foerderbarKosten * foerdersatz;
    return { foerdersatz, isfp, gesamtKosten, foerderbarKosten, foerderbetrag };
  }, [isBegEm, formData]);

  // ── KI Text Generation ─────────────────────────────────────────────────
  const handleGenerateText = async () => {
    if (!mainProg) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/antrag-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programm: mainProg.name, programmId, values: formData }),
      });
      const data = await res.json();
      setGeneratedText(data.text);
      setEditableText(
        `${data.text.projektbeschreibung}\n\n${data.text.begruendung}\n\n${data.text.energetischerNutzen}`
      );
    } catch {
      setGeneratedText(null);
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Save Draft ─────────────────────────────────────────────────────────
  const handleSaveDraft = () => {
    const entwurf = {
      programmId,
      programmName: mainProg?.name || programmId,
      formData,
      kiText: generatedText,
      vollstaendigkeit: completionPercentage,
      gespeichertAm: new Date().toISOString(),
      status: "entwurf",
    };
    localStorage.setItem(`zora-antrag-${programmId}`, JSON.stringify(entwurf));
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 2500);
  };

  // ── PDF Export ────────────────────────────────────────────────────────
  const handleExport = async () => {
    if (!mainProg) return;
    setIsExporting(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 20;
      const cW = pageW - margin * 2;
      let y = margin;

      const green: [number, number, number] = [29, 158, 117];
      const dark: [number, number, number] = [26, 26, 26];
      const gray: [number, number, number] = [107, 114, 128];
      const lightGreen: [number, number, number] = [225, 245, 238];
      const border: [number, number, number] = [229, 231, 235];

      const addPage = () => { doc.addPage(); y = margin; };
      const checkPage = (needed: number) => { if (y + needed > pageH - 20) addPage(); };

      const sectionTitle = (title: string) => {
        checkPage(14);
        doc.setFillColor(...lightGreen);
        doc.roundedRect(margin, y, cW, 8, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...green);
        doc.text(title, margin + 4, y + 5.5);
        y += 13;
      };

      const row = (label: string, value: string) => {
        checkPage(7);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...gray);
        doc.text(label, margin + 2, y);
        doc.setTextColor(...dark);
        const wrapped = doc.splitTextToSize(value || "—", cW - 58);
        doc.text(wrapped, margin + 55, y);
        y += Math.max(6, wrapped.length * 5);
      };

      const footer = () => {
        const fy = pageH - 10;
        doc.setDrawColor(...border);
        doc.setLineWidth(0.4);
        doc.line(margin, fy - 4, pageW - margin, fy - 4);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...gray);
        const today = new Date().toLocaleDateString("de-DE");
        doc.text(`Erstellt mit Zora · zora.app · ${today}`, pageW / 2, fy, { align: "center" });
      };

      // ── Seite 1: Deckblatt ──────────────────────────────────────────
      doc.setFillColor(...green);
      doc.rect(0, 0, pageW, 40, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text("Zora", margin, 18);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("KI-Fördermittel-Assistent", margin, 27);
      y = 55;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(...dark);
      doc.text("Förderantrag", margin, y);
      y += 10;
      doc.setFontSize(14);
      doc.setTextColor(...green);
      const progLines = doc.splitTextToSize(mainProg.name, cW);
      doc.text(progLines, margin, y);
      y += progLines.length * 8 + 8;

      doc.setDrawColor(...border);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageW - margin, y);
      y += 12;

      const today = new Date().toLocaleDateString("de-DE");
      row("Erstellt am", today);
      row("Antragsteller", displayName);
      row("Bundesland", bundesland);
      row("Fördergeber", mainProg.foerdergeber);
      y += 4;

      // Förderbetrag box
      const calcBetrag = kfwCalc?.foerderbetrag || begCalc?.foerderbetrag || 0;
      if (calcBetrag > 0) {
        checkPage(20);
        doc.setFillColor(...lightGreen);
        doc.roundedRect(margin, y, cW, 18, 3, 3, "F");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...gray);
        doc.text("Berechneter Förderbetrag", margin + 4, y + 6);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(...green);
        doc.text(formatEuro(calcBetrag), margin + 4, y + 14);
        y += 24;
      }

      footer();

      // ── Seite 2: Antragsteller & Formulardaten ──────────────────────
      addPage();
      sectionTitle("1. Antragsteller & Programm");
      row("Antragsteller", displayName);
      row("Bundesland", bundesland);
      row("Programm", mainProg.name);
      row("Fördergeber", mainProg.foerdergeber);
      row("Max. Förderbetrag", mainProg.maxBetrag);
      y += 4;

      sections.forEach((section, si) => {
        checkPage(16);
        sectionTitle(`${si + 2}. ${section.title}`);
        section.fields.forEach((field) => {
          const val = formData[field.key];
          if (!val) return;
          const display = Array.isArray(val) ? val.join(", ") : val;
          row(field.label, display + (field.unit ? ` ${field.unit}` : ""));
        });
        y += 4;
      });

      footer();

      // ── Seite 3: KI-generierte Projektbeschreibung ──────────────────
      if (editableText) {
        addPage();
        sectionTitle("KI-generierte Projektbeschreibung");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(...dark);
        const textLines = doc.splitTextToSize(editableText, cW - 4);
        textLines.forEach((line: string) => {
          checkPage(6);
          doc.text(line, margin + 2, y);
          y += 5.5;
        });
        footer();
      }

      // ── Seite 4: Kostenkalkulation ──────────────────────────────────
      if (kfwCalc || begCalc) {
        addPage();
        sectionTitle("Kostenkalkulation & Förderberechnung");
        if (kfwCalc) {
          row("Gesamte Investitionskosten", formatEuro(kfwCalc.gesamt));
          row("Grundförderung (30%)", formatEuro(kfwCalc.gesamt * 0.3));
          if (kfwCalc.klimaBonus) row("+ Klimageschwindigkeitsbonus (20%)", formatEuro(kfwCalc.gesamt * 0.2));
          y += 2;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(...green);
          checkPage(10);
          doc.text(`= Förderbetrag: ${formatEuro(kfwCalc.foerderbetrag)}`, margin + 2, y);
          y += 7;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(...gray);
          doc.text(`Eigenanteil: ${formatEuro(kfwCalc.eigenanteil)}`, margin + 2, y);
          y += 8;
        }
        if (begCalc) {
          row("Gesamte Investitionskosten", formatEuro(begCalc.gesamtKosten));
          row("Förderfähige Kosten (max.)", formatEuro(begCalc.foerderbarKosten));
          row(`Fördersatz${begCalc.isfp ? " (inkl. iSFP-Bonus)" : ""}`, `${Math.round(begCalc.foerdersatz * 100)}%`);
          y += 2;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(...green);
          checkPage(10);
          doc.text(`= Förderbetrag: ${formatEuro(begCalc.foerderbetrag)}`, margin + 2, y);
          y += 12;
        }
        footer();
      }

      // ── Seite 5: Einreichungsanleitung ──────────────────────────────
      addPage();
      sectionTitle("Nächste Schritte & Einreichungsanleitung");
      const steps = isKfw458
        ? [
            "TPB-ID vom EEE erhalten — Dein Energieeffizienz-Experte muss die Technische Projektbeschreibung erstellen und dir die TPB-ID mitteilen.",
            "KfW-Portal aufrufen — Gehe auf kfw.de und logge dich mit deinem KfW-Konto ein (oder erstelle eines, kostenlos).",
            "Antrag ausfüllen — Fülle das Online-Formular aus. Alle Daten aus diesem PDF kannst du direkt übertragen.",
            "Einreichen & warten — Nach dem Einreichen erhältst du innerhalb weniger Tage eine Vorgangsnummer per E-Mail.",
            "WICHTIG: Erst nach dem Zuwendungsbescheid darfst du mit der Maßnahme beginnen!",
          ]
        : isBegEm
        ? [
            "BAFA-Konto erstellen — Gehe auf fms.bafa.de und erstelle ein kostenloses Benutzerkonto.",
            "Neuen Antrag starten — Klicke auf '+ NEUER ANTRAG' und wähle 'BEG Einzelmaßnahmen (BEGPT)'.",
            "Daten übertragen — Alle Angaben aus diesem PDF in das BAFA-Formular eintragen.",
            "Antrag absenden — Du erhältst sofort eine Vorgangsnummer.",
            "WICHTIG: Erst nach Förderzusage mit der Maßnahme beginnen!",
          ]
        : [
            "Unterlagen vollständig zusammenstellen.",
            `Antrag bei ${mainProg.foerdergeber} einreichen.`,
            "Auf Bescheid warten, dann Vorhaben umsetzen.",
          ];

      steps.forEach((step, i) => {
        checkPage(14);
        doc.setFillColor(29, 158, 117, 0.1 as unknown as number);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...green);
        doc.text(`Schritt ${i + 1}`, margin + 2, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...dark);
        const wrapped = doc.splitTextToSize(step, cW - 6);
        doc.text(wrapped, margin + 2, y);
        y += wrapped.length * 5 + 5;
      });

      footer();

      const filename = `Foerderantrag_${mainProg.name.replace(/[\s/]/g, "_")}_${today.replace(/\./g, "-")}.pdf`;
      doc.save(filename);
      onSuccess();
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // ── Field Renderer ────────────────────────────────────────────────────
  const renderField = (field: FieldDef) => {
    const val = formData[field.key];
    const strVal = Array.isArray(val) ? "" : (val || "");
    const arrVal = Array.isArray(val) ? val : [];
    const isFilled = isFieldFilled(field, formData);

    const labelEl = (
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-[13px] font-medium text-[#1a1a1a]">
          {field.label}
          {field.required && <span className="text-red-500 ml-0.5">*</span>}
          {field.optional && <span className="text-[#9ca3af] text-[11px] ml-1.5 font-normal">(optional)</span>}
          {field.unit && <span className="text-[#6b7280] text-[11px] ml-1 font-normal">({field.unit})</span>}
        </label>
        {isFilled && <Check size={13} className="text-[#1D9E75] flex-shrink-0" />}
      </div>
    );

    if (field.type === "text" || field.type === "number") {
      return (
        <div key={field.key}>
          {labelEl}
          <input
            className="zora-input w-full"
            type={field.type === "number" ? "number" : "text"}
            placeholder={field.placeholder}
            value={strVal}
            min={field.type === "number" ? 0 : undefined}
            onChange={(e) => setField(field.key, e.target.value)}
          />
          {field.hint && <p className="text-[11px] text-[#1D9E75] mt-1">{field.hint}</p>}
          {field.warning && strVal && isDateInPast(strVal) && (
            <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
              <AlertTriangle size={11} /> {field.warning}
            </p>
          )}
        </div>
      );
    }

    if (field.type === "date") {
      return (
        <div key={field.key}>
          {labelEl}
          <input
            className="zora-input w-full"
            type="date"
            value={strVal}
            onChange={(e) => setField(field.key, e.target.value)}
          />
          {field.warning && strVal && isDateInPast(strVal) && (
            <div className="mt-2">
              <HintBox text={field.warning} variant="warning" />
            </div>
          )}
          {field.hint && <p className="text-[11px] text-[#1D9E75] mt-1">{field.hint}</p>}
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div key={field.key}>
          {labelEl}
          <select
            className="zora-input w-full"
            value={strVal}
            onChange={(e) => setField(field.key, e.target.value)}
          >
            <option value="">— bitte wählen —</option>
            {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      );
    }

    if (field.type === "radio") {
      return (
        <div key={field.key}>
          {labelEl}
          <div className="flex flex-wrap gap-2">
            {field.options?.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setField(field.key, o)}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  strVal === o
                    ? "border-[#1D9E75] bg-[#E1F5EE] text-[#0F6E56]"
                    : "border-[#e5e7eb] bg-white text-[#6b7280] hover:border-[#1D9E75]/40"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
          {field.hint && <p className="text-[11px] text-[#1D9E75] mt-1.5">{field.hint}</p>}
        </div>
      );
    }

    if (field.type === "checkbox") {
      return (
        <div key={field.key}>
          {labelEl}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {field.options?.map((o) => {
              const checked = arrVal.includes(o);
              return (
                <button
                  key={o}
                  type="button"
                  onClick={() => {
                    const next = checked ? arrVal.filter((x) => x !== o) : [...arrVal, o];
                    setField(field.key, next);
                  }}
                  className={`text-left px-3 py-2.5 rounded-lg border-2 text-sm flex items-center gap-3 transition-all ${
                    checked
                      ? "border-[#1D9E75] bg-[#E1F5EE] text-[#0F6E56]"
                      : "border-[#e5e7eb] bg-white text-[#6b7280] hover:border-[#1D9E75]/40"
                  }`}
                >
                  <span className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border-2 transition-all ${checked ? "bg-[#1D9E75] border-[#1D9E75]" : "border-[#d1d5db]"}`}>
                    {checked && <Check size={10} className="text-white" />}
                  </span>
                  <span className="font-medium">{o}</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (field.type === "textarea") {
      const charCount = strVal.length;
      const minChars = field.min || 0;
      return (
        <div key={field.key}>
          {labelEl}
          <textarea
            className="zora-textarea w-full"
            rows={5}
            placeholder={field.placeholder}
            value={strVal}
            onChange={(e) => setField(field.key, e.target.value)}
          />
          <div className="flex items-center justify-between mt-1">
            {field.hint && <p className="text-[11px] text-[#1D9E75]">{field.hint}</p>}
            <p className={`text-[11px] ml-auto ${charCount >= minChars ? "text-[#1D9E75]" : "text-[#9ca3af]"}`}>
              {charCount} / {minChars} Zeichen
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  const currentSection = sections[activeSection];
  const isLastSection = activeSection === sections.length - 1;
  const isFirstSection = activeSection === 0;

  // ── Summary Screen ────────────────────────────────────────────────────
  if (showSummary) {
    const calcBetrag = kfwCalc?.foerderbetrag || begCalc?.foerderbetrag || 0;
    const submissionSteps = isKfw458
      ? [
          { title: "TPB-ID vom EEE erhalten", desc: "Dein EEE muss zuerst die Technische Projektbeschreibung erstellen und dir die TPB-ID mitteilen." },
          { title: "KfW-Portal aufrufen", desc: "Gehe auf kfw.de/458 und logge dich mit deinem KfW-Konto ein (oder erstelle eines — kostenlos).", link: "https://www.kfw.de", linkLabel: "Zum KfW-Portal →" },
          { title: "Antrag ausfüllen", desc: "Fülle das Online-Formular aus. Alle Daten aus deinem Zora-PDF findest du zum Copy-Pasten." },
          { title: "Einreichen & warten", desc: "Nach dem Einreichen erhältst du innerhalb weniger Tage eine Vorgangsnummer per E-Mail." },
          { title: "Auf Bescheid warten", desc: "Erst nach dem Zuwendungsbescheid darfst du mit der Maßnahme beginnen!" },
        ]
      : isBegEm
      ? [
          { title: "BAFA-Konto erstellen", desc: "Gehe auf fms.bafa.de und erstelle ein kostenloses Benutzerkonto.", link: "https://fms.bafa.de", linkLabel: "Zum BAFA-Portal →" },
          { title: "Neuen Antrag starten", desc: "Klicke auf '+ NEUER ANTRAG' und wähle 'BEG Einzelmaßnahmen (BEGPT)'." },
          { title: "Daten übertragen", desc: "Alle Angaben aus deinem Zora-PDF in das BAFA-Formular eintragen." },
          { title: "TPB-ID eingeben", desc: "Falls EEE beteiligt: TPB-ID des EEE im Formular eingeben." },
          { title: "Absenden", desc: "Antrag elektronisch absenden — du erhältst sofort eine Vorgangsnummer." },
        ]
      : [
          { title: "Unterlagen zusammenstellen", desc: "Stelle alle benötigten Dokumente vollständig zusammen." },
          { title: `Antrag bei ${mainProg?.foerdergeber || "der Förderstelle"} einreichen`, desc: "Reiche deinen ausgefüllten Antrag ein." },
          { title: "Auf Bewilligung warten", desc: "Erst nach positivem Bescheid mit dem Vorhaben beginnen." },
        ];

    return (
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => setShowSummary(false)} className="text-[#6b7280] hover:text-[#1a1a1a] transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a1a]">Zusammenfassung</h2>
            <p className="text-[#6b7280] text-sm ml-0">
              Antrag vorbereiten — <span className="font-medium text-[#1a1a1a]">{mainProg?.name}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left: Summary card */}
          <div className="bg-[#E1F5EE] border border-[#1D9E75]/20 rounded-xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1D9E75] flex items-center justify-center flex-shrink-0">
                <Check size={16} className="text-white" />
              </div>
              <h3 className="font-semibold text-[#0F6E56] text-base">
                {completionPercentage >= 90 ? "Dein Antrag ist bereit" : `Antrag zu ${completionPercentage}% vollständig`}
              </h3>
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Programm</span>
                <span className="font-semibold text-[#1a1a1a]">{mainProg?.name}</span>
              </div>
              {calcBetrag > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Förderbetrag</span>
                  <span className="font-bold text-[#1D9E75] text-base">{formatEuro(calcBetrag)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Vollständigkeit</span>
                <span className="font-semibold text-[#1a1a1a]">{completionPercentage}%</span>
              </div>
            </div>

            {/* Vollständigkeits-Items */}
            <div className="space-y-1.5">
              {completionItems.slice(0, 5).map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  <StatusIcon status={item.status} />
                  <span className={item.status === "missing" ? "text-red-600" : item.status === "warning" ? "text-amber-700" : "text-[#0F6E56]"}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="zora-btn-primary w-full flex items-center justify-center gap-2 text-sm px-4 py-2.5 disabled:opacity-60 disabled:shadow-none disabled:translate-y-0"
              >
                {isExporting ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
                PDF herunterladen
              </button>
              <button
                onClick={handleSaveDraft}
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#1D9E75] border border-[#1D9E75]/30 hover:bg-white transition-colors px-4 py-2.5 rounded-lg"
              >
                {savedDraft ? <Check size={15} /> : <Save size={15} />}
                {savedDraft ? "Gespeichert!" : "Als Entwurf speichern"}
              </button>
            </div>
          </div>

          {/* Right: Submission guide */}
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
            <h3 className="font-semibold text-[#1a1a1a] text-base mb-4">
              So reichst du deinen Antrag ein:
            </h3>
            <div className="space-y-4">
              {submissionSteps.map((step, i) => (
                <div key={step.title} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#E1F5EE] text-[#1D9E75] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a1a]">{step.title}</p>
                    <p className="text-xs text-[#6b7280] mt-0.5 leading-relaxed">{step.desc}</p>
                    {step.link && (
                      <a
                        href={step.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#1D9E75] hover:text-[#0F6E56] mt-1"
                      >
                        {step.linkLabel} <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main form view ────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <button onClick={onBack} className="text-[#6b7280] hover:text-[#1a1a1a] transition-colors flex-shrink-0">
          <ChevronLeft size={20} />
        </button>
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-[#1a1a1a] leading-tight">
            Antrag vorbereiten
          </h2>
          <p className="text-[#6b7280] text-xs mt-0.5 truncate">
            {mainProg?.name}
          </p>
        </div>
      </div>

      <p className="text-[#6b7280] text-sm mb-5 ml-9">
        Beantworte die Fragen so genau wie möglich — das erhöht deine Bewilligungswahrscheinlichkeit.
      </p>

      {/* Completeness bar */}
      <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-[#1a1a1a]">Antrag Vollständigkeit</span>
          <span className={`text-sm font-bold ${completionPercentage >= 80 ? "text-[#1D9E75]" : completionPercentage >= 50 ? "text-amber-600" : "text-[#9ca3af]"}`}>
            {completionPercentage}%
          </span>
        </div>
        <div className="h-2 bg-[#e5e7eb] rounded-full overflow-hidden mb-3">
          <div
            className={`h-full rounded-full transition-all duration-500 ${completionPercentage >= 80 ? "bg-[#1D9E75]" : completionPercentage >= 50 ? "bg-amber-500" : "bg-[#d1d5db]"}`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {completionItems.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-[12px]">
              <StatusIcon status={item.status} />
              <span className={item.status === "missing" ? "text-red-600" : item.status === "warning" ? "text-amber-700" : "text-[#374151]"}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-5 scrollbar-hide">
        {sections.map((s, i) => {
          const sectionItems = completionItems.slice(i, i + 1);
          const status = sectionItems[0]?.status || "missing";
          return (
            <button
              key={s.title}
              type="button"
              onClick={() => setActiveSection(i)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                i === activeSection
                  ? "bg-[#1D9E75] text-white"
                  : "bg-[#f3f4f6] text-[#6b7280] hover:bg-[#e5e7eb]"
              }`}
            >
              {i === activeSection ? null : (
                status === "done" ? <Check size={10} className="text-[#1D9E75]" /> :
                status === "warning" ? <AlertTriangle size={10} className="text-amber-500" /> :
                <div className="w-2 h-2 rounded-full bg-[#d1d5db]" />
              )}
              {s.title}
            </button>
          );
        })}
      </div>

      {/* Current section */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 mb-4">
        <h3 className="text-[14px] font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#E1F5EE] text-[#1D9E75] text-[11px] font-bold flex items-center justify-center flex-shrink-0">
            {activeSection + 1}
          </span>
          {currentSection.title}
        </h3>

        {currentSection.hint && (
          <div className="mb-4">
            <HintBox text={currentSection.hint} />
          </div>
        )}
        {currentSection.warningHint && (
          <div className="mb-4">
            <HintBox text={currentSection.warningHint} variant="warning" />
          </div>
        )}

        <div className="space-y-4">
          {currentSection.fields.map((field) => renderField(field))}
        </div>

        {/* KfW 458: Live Förderberechnung in last section */}
        {isKfw458 && activeSection === 5 && kfwCalc && kfwCalc.gesamt > 0 && (
          <div className="mt-6 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-4">
            <h4 className="text-sm font-semibold text-[#1a1a1a] mb-3 flex items-center gap-2">
              <span className="text-base">🧮</span> Förderberechnung (live)
            </h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#6b7280]">
                <span>Investitionskosten</span>
                <span>{formatEuro(kfwCalc.gesamt)}</span>
              </div>
              <div className="flex justify-between text-[#6b7280]">
                <span>Grundförderung (30%)</span>
                <span>{formatEuro(kfwCalc.gesamt * 0.3)}</span>
              </div>
              {kfwCalc.klimaBonus && (
                <div className="flex justify-between text-[#1D9E75]">
                  <span>+ Klimageschwindigkeitsbonus (20%)</span>
                  <span>+ {formatEuro(kfwCalc.gesamt * 0.2)}</span>
                </div>
              )}
              <div className="border-t border-[#e5e7eb] pt-2 mt-2 flex justify-between items-center">
                <span className="font-semibold text-[#1a1a1a]">= Förderbetrag</span>
                <span className="text-xl font-bold text-[#1D9E75]">{formatEuro(kfwCalc.foerderbetrag)}</span>
              </div>
              <div className="flex justify-between text-[#9ca3af] text-xs">
                <span>Eigenanteil</span>
                <span>{formatEuro(kfwCalc.eigenanteil)}</span>
              </div>
            </div>
          </div>
        )}

        {/* BEG EM: Fördersatz display in section 2 */}
        {isBegEm && activeSection === 1 && (
          <div className="mt-4 bg-[#E1F5EE] border border-[#1D9E75]/20 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-[#0F6E56]">
              Ihr Fördersatz: 15%
              {formData.isfp === "Ja" && <span className="text-[#1D9E75]"> + 5% iSFP-Bonus = 20%</span>}
            </p>
            {begCalc && begCalc.foerderbetrag > 0 && (
              <p className="text-xs text-[#1D9E75] mt-0.5">
                Geschätzter Förderbetrag: <strong>{formatEuro(begCalc.foerderbetrag)}</strong>
              </p>
            )}
          </div>
        )}
      </div>

      {/* KI Text Generator — show on last section */}
      {isLastSection && (
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[14px] font-semibold text-[#1a1a1a]">KI-Projektbeschreibung</h3>
              <p className="text-xs text-[#6b7280] mt-0.5">Claude generiert einen professionellen Antragstext auf Basis deiner Angaben</p>
            </div>
            <button
              onClick={handleGenerateText}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1D9E75] text-white text-sm font-semibold hover:bg-[#0F6E56] transition-colors disabled:opacity-60 flex-shrink-0 ml-3"
            >
              {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {isGenerating ? "Generiert…" : "Text generieren"}
            </button>
          </div>
          {(generatedText || editableText) && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText size={13} className="text-[#1D9E75]" />
                <span className="text-xs font-medium text-[#1D9E75]">KI-generiert — bitte nach Bedarf anpassen</span>
              </div>
              <textarea
                className="zora-textarea w-full"
                rows={8}
                value={editableText}
                onChange={(e) => setEditableText(e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      {/* Section nav + Summary button */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => isFirstSection ? onBack() : setActiveSection((s) => s - 1)}
          className="flex items-center justify-center gap-1.5 px-4 h-11 rounded-lg border border-[#e5e7eb] bg-white text-[#1a1a1a] text-sm font-medium hover:bg-[#f9fafb] transition-colors"
        >
          <ChevronLeft size={16} />
          Zurück
        </button>

        {isLastSection ? (
          <button
            type="button"
            onClick={() => setShowSummary(true)}
            className="flex-1 flex items-center justify-center gap-2 h-11 rounded-lg bg-[#1D9E75] text-white text-sm font-semibold hover:bg-[#0F6E56] transition-colors"
          >
            Zur Zusammenfassung
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setActiveSection((s) => s + 1)}
            className="flex-1 flex items-center justify-center gap-2 h-11 rounded-lg bg-[#1D9E75] text-white text-sm font-semibold hover:bg-[#0F6E56] transition-colors"
          >
            Weiter
            <ChevronRight size={16} />
          </button>
        )}

        <button
          type="button"
          onClick={handleSaveDraft}
          title="Entwurf speichern"
          className="flex items-center justify-center w-11 h-11 rounded-lg border border-[#e5e7eb] bg-white text-[#6b7280] hover:text-[#1D9E75] hover:border-[#1D9E75]/30 transition-colors"
        >
          {savedDraft ? <Check size={16} className="text-[#1D9E75]" /> : <Save size={16} />}
        </button>
      </div>

      <p className="text-[11px] text-center text-[#9ca3af] mt-3">
        Schritt {activeSection + 1} von {sections.length} · Dein Fortschritt wird automatisch gespeichert
      </p>
    </div>
  );
}
