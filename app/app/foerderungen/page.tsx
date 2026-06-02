"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, supabase } from "@/contexts/AuthContext";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  MapPin,
  Star,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle,
  Loader2,
  Award,
  Wrench,
  Zap,
  Home,
  Copy,
  AlertTriangle,
  Clock,
  X,
  Flame,
  Sun,
  Battery,
  Wind,
  Accessibility,
  Construction,
  Clipboard,
  Truck,
  Factory,
  Laptop,
  Users,
  Handshake,
  Recycle,
  BrickWall,
  Microscope,
  TrendingUp,
  Plus,
  Heart,
  Lightbulb,
  Building2,
  DoorOpen,
  ArrowUpRight,
} from "lucide-react";
import { Foerderprogramm } from "@/types";
import { foerderprogramme, type FoerderprogrammDB } from "@/lib/foerderprogramme";
import { programmFristen } from "@/lib/fristen";
import { FristBadgeForId } from "@/components/FristBadge";
import { WIZARD_ROUTES } from "@/lib/wizardConfigs";
import Screen4Application from "@/components/screens/Screen4Application";

// ── Types ──────────────────────────────────────────────────────────────────
type Nutzertyp = "" | "privatperson" | "handwerker" | "kmu";
type FlowScreen = "nutzertyp" | "profile" | "loading" | "results" | "partner" | "application" | "success";
type Profil = Record<string, string | string[]>;
type FilterType = "alle" | "zuschuss" | "kredit" | "unter10k" | "ueber10k";
type SavedProgram = { id: string; name: string; badge: string; maxBetrag: string; foerdergeber: string };

// ── Static data ────────────────────────────────────────────────────────────
const FALLBACK_PROGRAMME: Foerderprogramm[] = [
  { id: "beg-em", name: "BEG Einzelmaßnahmen (BAFA)", badge: "Zuschuss", foerdergeber: "BAFA", maxBetrag: "bis 70%", frist: "laufend", beschreibung: "Bundesförderung für effiziente Gebäude — Einzelmaßnahmen an der Gebäudehülle, Anlagentechnik und Heizungsoptimierung.", passung: 96 },
  { id: "kfw-270", name: "KfW 270 Erneuerbare Energien", badge: "Kredit", foerdergeber: "KfW", maxBetrag: "150.000 €", frist: "laufend", beschreibung: "Günstige Finanzierung für Photovoltaik-, Solarthermie-, Windkraft- und Wasserkraftanlagen.", passung: 89 },
  { id: "kfw-458", name: "KfW 458 Heizungsförderung", badge: "Zuschuss", foerdergeber: "KfW", maxBetrag: "bis 70%", frist: "laufend", beschreibung: "Förderung für den Austausch alter Heizungsanlagen durch erneuerbare Energien.", passung: 84 },
  { id: "bafa-energieberatung", name: "BAFA Energieberatung (iSFP)", badge: "Zuschuss", foerdergeber: "BAFA", maxBetrag: "1.300 €", frist: "laufend", beschreibung: "Förderung eines individuellen Sanierungsfahrplans mit bis zu 50% Zuschuss.", passung: 78 },
  { id: "kfw-261", name: "KfW 261 Wohngebäude Kredit", badge: "Kredit", foerdergeber: "KfW", maxBetrag: "150.000 €", frist: "laufend", beschreibung: "Zinsgünstige Vollfinanzierung für energetische Sanierung zum Effizienzhaus-Standard.", passung: 72 },
];

const BUNDESLAENDER = ["Baden-Württemberg","Bayern","Berlin","Brandenburg","Bremen","Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen","Sachsen-Anhalt","Schleswig-Holstein","Thüringen"];

const EEE_PARTNER = [
  { id: 1, name: "EnergieProfi GmbH", role: "Energieeffizienz-Experte (EEE)", bewertung: 4.9, distanz: "2,3 km", tags: ["BEG", "BAFA", "Wärmepumpe"], telefon: "+49 511 12345-0", email: "info@energieprofi.de" },
  { id: 2, name: "SolarBerater Hannover", role: "Energieberater (BAFA-listiert)", bewertung: 4.7, distanz: "4,8 km", tags: ["PV", "KfW 270", "BEG"], telefon: "+49 511 98765-0", email: "beratung@solar-hannover.de" },
  { id: 3, name: "Klimaexperten Nord", role: "Zertifizierter Energieberater", bewertung: 4.6, distanz: "7,1 km", tags: ["Heizung", "Dämmung", "BAFA"], telefon: "+49 511 55544-0", email: "info@klimaexperten-nord.de" },
];
const HANDWERKER = [
  { id: 4, name: "SHK Meister Müller", role: "Sanitär, Heizung, Klima", bewertung: 4.8, distanz: "1,5 km", tags: ["Wärmepumpe", "Heizungstausch", "BEG"], telefon: "+49 511 11223-0", email: "kontakt@shk-mueller.de" },
  { id: 5, name: "Elektro Schmidt GmbH", role: "Elektrotechnik & PV", bewertung: 4.6, distanz: "3,2 km", tags: ["PV-Anlage", "Wallbox", "KfW"], telefon: "+49 511 33445-0", email: "info@elektro-schmidt.de" },
  { id: 6, name: "Dach & Solar Bauer KG", role: "Dachdecker & Solartechnik", bewertung: 4.7, distanz: "5,9 km", tags: ["Dachsanierung", "Solarthermie", "BEG"], telefon: "+49 511 66778-0", email: "buero@dach-solar-bauer.de" },
];

// ── Partner-Screen Data ────────────────────────────────────────────────────
interface SimulierterPartner {
  name: string;
  rolle: string;
  bewertung: number;
  entfernung: string;
  zertifikat: string;
  telefon: string;
}

const SIMULIERTE_PARTNER: Record<string, SimulierterPartner[]> = {
  eee: [
    { name: "Thomas Bergmann", rolle: "Energieberater", bewertung: 4.8, entfernung: "3,2 km", zertifikat: "BAFA-zertifiziert", telefon: "089 / 123 456 78" },
    { name: "Sandra Mayer", rolle: "Energieberaterin", bewertung: 4.9, entfernung: "5,1 km", zertifikat: "BAFA-zertifiziert", telefon: "089 / 987 654 32" },
    { name: "Klaus Fischer", rolle: "Dipl.-Ing. Energietechnik", bewertung: 4.7, entfernung: "7,8 km", zertifikat: "BAFA-zertifiziert", telefon: "089 / 456 789 01" },
  ],
  shk: [
    { name: "Müller Haustechnik GmbH", rolle: "SHK-Fachbetrieb", bewertung: 4.6, entfernung: "1,8 km", zertifikat: "Meisterbetrieb", telefon: "089 / 111 222 33" },
    { name: "Heizung & Sanitär Weber", rolle: "SHK-Fachbetrieb", bewertung: 4.8, entfernung: "4,3 km", zertifikat: "Meisterbetrieb", telefon: "089 / 444 555 66" },
    { name: "Schmidt Haustechnik", rolle: "SHK-Fachbetrieb", bewertung: 4.5, entfernung: "6,2 km", zertifikat: "Wärmepumpen-Spezialist", telefon: "089 / 777 888 99" },
  ],
  elektro: [
    { name: "Elektro Schneider GmbH", rolle: "Elektrofachbetrieb", bewertung: 4.7, entfernung: "2,1 km", zertifikat: "PV-Spezialist", telefon: "089 / 222 333 44" },
    { name: "Solar & Elektro Braun", rolle: "Elektrofachbetrieb", bewertung: 4.9, entfernung: "3,8 km", zertifikat: "Meisterbetrieb", telefon: "089 / 555 666 77" },
  ],
  dach: [
    { name: "Dachdeckerei Hoffmann", rolle: "Dachdeckermeister", bewertung: 4.6, entfernung: "4,5 km", zertifikat: "Meisterbetrieb", telefon: "089 / 333 444 55" },
    { name: "Zimmerei & Dach Kraus", rolle: "Zimmerermeister", bewertung: 4.8, entfernung: "8,2 km", zertifikat: "Meisterbetrieb", telefon: "089 / 666 777 88" },
  ],
};

type PartnerKey = "eee" | "shk" | "elektro" | "dach";
type NeedMap = Record<PartnerKey, boolean>;

function getNeedMap(programmes: Foerderprogramm[]): NeedMap {
  return {
    eee: programmes.some((p) => PROG_DB[p.id]?.eeeErforderlich === true),
    shk: programmes.some((p) => {
      const db = PROG_DB[p.id];
      return db?.themen?.includes("Heizung") || p.id === "kfw-458" || p.id === "bafa-heizung";
    }),
    elektro: programmes.some((p) => {
      const db = PROG_DB[p.id];
      return db?.themen?.includes("Solar") || p.id === "kfw-270";
    }),
    dach: programmes.some((p) => {
      const db = PROG_DB[p.id];
      return db?.themen?.includes("Dämmung") || db?.themen?.includes("Dach") || p.id === "beg-em";
    }),
  };
}

function getBenoetigtFuer(key: PartnerKey, programmes: Foerderprogramm[]): string {
  const matching = programmes.filter((p) => {
    const db = PROG_DB[p.id];
    if (key === "eee") return db?.eeeErforderlich;
    if (key === "shk") return db?.themen?.includes("Heizung") || p.id === "kfw-458" || p.id === "bafa-heizung";
    if (key === "elektro") return db?.themen?.includes("Solar") || p.id === "kfw-270";
    if (key === "dach") return db?.themen?.includes("Dämmung") || db?.themen?.includes("Dach") || p.id === "beg-em";
    return false;
  });
  return matching
    .map((p) => p.name.replace(/\(.*?\)/g, "").trim())
    .slice(0, 3)
    .join(", ");
}

function makeEmail(name: string, rolle: string): string {
  const parts = name.toLowerCase().replace(/[äöüß]/g, (c) => ({ ä: "ae", ö: "oe", ü: "ue", ß: "ss" }[c] || c)).split(/\s+/);
  const domain = rolle.toLowerCase()
    .replace(/[äöüß]/g, (c) => ({ ä: "ae", ö: "oe", ü: "ue", ß: "ss" }[c] || c))
    .replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").substring(0, 18);
  return `${parts[0]}.${parts[parts.length - 1]}@${domain}.de`;
}

// ── Stepper ────────────────────────────────────────────────────────────────
const FLOW_STEPS = ["Nutzertyp", "Profil", "Ergebnisse", "Antrag"];
const STEP_MAP: Record<FlowScreen, number> = {
  nutzertyp: 1, profile: 2, loading: 2, results: 3, partner: 3, application: 4, success: 5,
};

function FlowStepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {FLOW_STEPS.map((label, idx) => {
        const step = idx + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${done ? "bg-[#1D9E75] text-white" : active ? "bg-[#E1F5EE] text-[#1D9E75] ring-2 ring-[#1D9E75]" : "bg-[#f3f4f6] text-[#9ca3af]"}`}>
                {done ? <Check size={14} /> : step}
              </div>
              <span className={`text-[10px] mt-1 hidden sm:block font-medium ${active ? "text-[#1D9E75]" : done ? "text-[#1D9E75]" : "text-[#9ca3af]"}`}>{label}</span>
            </div>
            {idx < FLOW_STEPS.length - 1 && (
              <div className={`h-px w-8 sm:w-14 mx-1 mb-4 ${done ? "bg-[#1D9E75]" : "bg-[#e5e7eb]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Shared Field Helpers ───────────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1">{msg}</p>;
}

function KiHinweis({ text }: { text: string }) {
  return (
    <div className="rounded-xl bg-[#E1F5EE] border border-[#1D9E75]/20 p-4 flex gap-3">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1D9E75] flex items-center justify-center mt-0.5">
        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-sm text-[#0F6E56] leading-relaxed">{text}</p>
    </div>
  );
}

function RadioCards({ label, options, value, onChange, error, cols = 2 }: {
  label: string; options: { value: string; label: string; description?: string; icon?: React.ReactNode }[];
  value: string; onChange: (v: string) => void; error?: string; cols?: number;
}) {
  const gridClass = cols === 3 ? "grid-cols-1 sm:grid-cols-3" : cols === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2";
  return (
    <div>
      <label className="block text-sm font-medium text-[#1a1a1a] mb-2">{label}</label>
      <div className={`grid ${gridClass} gap-2`}>
        {options.map((opt) => (
          <button key={opt.value} type="button" onClick={() => onChange(opt.value)}
            className={`text-left p-3 rounded-xl border-2 transition-all ${value === opt.value ? "border-[#1D9E75] bg-[#E1F5EE]" : "border-[#e5e7eb] bg-white hover:border-[#1D9E75]/40"}`}>
            {opt.icon && <div className="text-xl mb-1">{opt.icon}</div>}
            <div className="text-sm font-semibold text-[#1a1a1a]">{opt.label}</div>
            {opt.description && <div className="text-xs text-[#6b7280] mt-0.5 leading-tight">{opt.description}</div>}
          </button>
        ))}
      </div>
      <FieldError msg={error} />
    </div>
  );
}

function CheckboxCards({ label, options, value, onChange }: {
  label: string; options: { value: string; label: string; icon?: React.ReactNode }[];
  value: string[]; onChange: (v: string[]) => void;
}) {
  const toggle = (v: string) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  return (
    <div>
      <label className="block text-sm font-medium text-[#1a1a1a] mb-2">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => {
          const sel = value.includes(opt.value);
          return (
            <button key={opt.value} type="button" onClick={() => toggle(opt.value)}
              className={`text-left p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${sel ? "border-[#1D9E75] bg-[#E1F5EE]" : "border-[#e5e7eb] bg-white hover:border-[#1D9E75]/40"}`}>
              <div className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-all ${sel ? "bg-[#1D9E75] border-[#1D9E75]" : "border-[#d1d5db]"}`}>
                {sel && <Check size={11} className="text-white" />}
              </div>
              {opt.icon && <span className="text-base">{opt.icon}</span>}
              <span className="text-sm font-medium text-[#1a1a1a]">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BadgePill({ type }: { type: string }) {
  const colors: Record<string, string> = {
    Zuschuss: "bg-[#E1F5EE] text-[#0F6E56]",
    Kredit: "bg-[#E6F1FB] text-[#185FA5]",
    Bürgschaft: "bg-[#EEEDFE] text-[#534AB7]",
    BAFA: "bg-gray-100 text-gray-600",
    KfW: "bg-gray-100 text-gray-600",
    Bundesland: "bg-amber-100 text-amber-700",
    befristet: "bg-amber-100 text-amber-700",
    Prämie: "bg-purple-100 text-purple-700",
  };
  return <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${colors[type] ?? "bg-gray-100 text-gray-600"}`}>{type}</span>;
}

// ── Screen 2 helpers ──────────────────────────────────────────────────────────
const PROG_DB: Record<string, FoerderprogrammDB> = Object.fromEntries(
  foerderprogramme.map((p) => [p.id, p])
);

function getBarColor(score: number): string {
  if (score >= 85) return "#1D9E75";
  if (score >= 70) return "#EF9F27";
  return "#E24B4A";
}

function parseMaxBetragAmount(maxBetrag: string): number | null {
  if (!maxBetrag.includes("€")) return null;
  const nums = maxBetrag.replace(/\./g, "").match(/\d+/g);
  if (!nums) return null;
  return Math.max(...nums.map(Number));
}

function getNaechsteSchritte(db: FoerderprogrammDB): string[] {
  const steps: string[] = [];
  if (db.eeeErforderlich) steps.push("Energieeffizienz-Experten (EEE) beauftragen");
  if (db.antragVorMassnahme)
    steps.push(`Antrag vor Baubeginn bei ${db.antragsstelle} stellen`);
  else steps.push(`Antrag bei ${db.antragsstelle} stellen`);
  steps.push("Angebot von qualifiziertem Fachbetrieb einholen");
  if (db.kombinierbarMit.length > 0)
    steps.push(`Kombinierbarkeit mit ${db.kombinierbarMit.slice(0, 2).join(", ")} prüfen`);
  return steps.slice(0, 4);
}

// ── Screen 0: Nutzertyp ────────────────────────────────────────────────────
function Screen0({ nutzertyp, onSelect, onNext }: { nutzertyp: Nutzertyp; onSelect: (t: Nutzertyp) => void; onNext: () => void }) {
  const cards: { type: Nutzertyp; icon: React.ReactNode; title: string; desc: string; tags: string[] }[] = [
    {
      type: "privatperson",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
      title: "Privatperson",
      desc: "Eigenheim sanieren, Heizung tauschen, PV-Anlage installieren oder bauen",
      tags: ["Wärmepumpe", "Dämmung", "Solar", "Neubau"],
    },
    {
      type: "handwerker",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
        </svg>
      ),
      title: "Handwerker & Betrieb",
      desc: "SHK, Elektro, Dach, Bau — Förderungen für deinen Betrieb und deine Kunden",
      tags: ["Betriebsförderung", "Kundenprojekte", "Digitalisierung"],
    },
    {
      type: "kmu",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      ),
      title: "KMU & Unternehmen",
      desc: "Investitionen, Digitalisierung, Innovation und Wachstum für dein Unternehmen",
      tags: ["Digital Jetzt", "KfW-Kredit", "Innovationsförderung"],
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1" style={{ color: "#0D1F1B", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Für wen suchst du Förderungen?</h2>
      <p className="text-[#6b7280] mb-8">Je nach deiner Situation zeigen wir dir die passenden Programme und Fragen.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => {
          const active = nutzertyp === c.type;
          return (
            <button key={c.type} type="button" onClick={() => onSelect(c.type)}
              className={`text-left p-5 rounded-xl border-2 transition-all ${active ? "border-[#1D9E75] bg-[#E1F5EE]/60 shadow-sm" : "border-[#e5e7eb] bg-white hover:border-[#1D9E75]/40 hover:shadow-sm"}`}>
              <div className={`mb-3 ${active ? "text-[#1D9E75]" : "text-[#9ca3af]"}`}>{c.icon}</div>
              <div className="font-semibold text-[#1a1a1a] mb-1">{c.title}</div>
              <p className="text-xs text-[#6b7280] leading-relaxed mb-3">{c.desc}</p>
              <div className="flex flex-wrap gap-1">
                {c.tags.map((tag) => (
                  <span key={tag} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${active ? "bg-[#1D9E75]/10 text-[#0F6E56]" : "bg-[#f3f4f6] text-[#6b7280]"}`}>{tag}</span>
                ))}
              </div>
              {active && (
                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#1D9E75]">
                  <Check size={12} /> Ausgewählt
                </div>
              )}
            </button>
          );
        })}
      </div>
      <button onClick={onNext} disabled={!nutzertyp}
        className="zora-btn-primary w-full flex items-center justify-center gap-2 text-base px-6 py-3.5">
        Weiter <ChevronRight size={18} />
      </button>
    </div>
  );
}

// ── Screen 1A: Privatperson ────────────────────────────────────────────────
function Screen1A({ profil, onChange, errors, onBack, onNext }: { profil: Profil; onChange: (k: string, v: string | string[]) => void; errors: Record<string, string>; onBack: () => void; onNext: () => void }) {
  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onChange(k, e.target.value);
  const descLen = ((profil.vorhabenBeschreibung as string) || "").length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <button onClick={onBack} className="text-[#6b7280] hover:text-[#1a1a1a] transition-colors"><ChevronLeft size={20} /></button>
        <h2 className="text-2xl font-bold" style={{ color: "#0D1F1B", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Erzähl uns von deinem Vorhaben</h2>
      </div>
      <p className="text-[#6b7280] mb-6 ml-8">Je genauer deine Angaben, desto besser das Matching.</p>

      <div className="space-y-6">
        {/* Persönliche Daten */}
        <div>
          <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-3">Persönliche Daten</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Vorname <span className="text-red-500">*</span></label>
              <input className={`zora-input w-full ${errors.vorname ? "border-red-400" : ""}`} placeholder="Max" value={(profil.vorname as string) || ""} onChange={s("vorname")} />
              <FieldError msg={errors.vorname} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">PLZ / Ort <span className="text-red-500">*</span></label>
              <input className={`zora-input w-full ${errors.plz ? "border-red-400" : ""}`} placeholder="12345 Musterstadt" value={(profil.plz as string) || ""} onChange={s("plz")} />
              <FieldError msg={errors.plz} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Bundesland <span className="text-red-500">*</span></label>
              <select className={`zora-input w-full bg-white ${errors.bundesland ? "border-red-400" : ""}`} value={(profil.bundesland as string) || ""} onChange={s("bundesland")}>
                <option value="">Bitte wählen…</option>
                {BUNDESLAENDER.map((b) => <option key={b}>{b}</option>)}
              </select>
              <FieldError msg={errors.bundesland} />
            </div>
          </div>
        </div>

        {/* Gebäudedaten */}
        <div>
          <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-3">Gebäudedaten</p>
          <div className="space-y-4">
            <RadioCards label="Gebäudetyp *" value={(profil.gebaeudetyp as string) || ""} onChange={(v) => onChange("gebaeudetyp", v)} error={errors.gebaeudetyp} cols={4}
              options={[
                { value: "Einfamilienhaus", label: "Einfamilienhaus", icon: <Home size={20} /> },
                { value: "Doppelhaus / Reihenhaus", label: "Doppelhaus / Reihenhaus", icon: <Home size={20} /> },
                { value: "Mehrfamilienhaus", label: "Mehrfamilienhaus (2–6 WE)", icon: <Building2 size={20} /> },
                { value: "Eigentumswohnung", label: "Eigentumswohnung", icon: <DoorOpen size={20} /> },
              ]} />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Baujahr</label>
                <input type="number" className="zora-input w-full" placeholder="1975" min={1850} max={2024} value={(profil.baujahr as string) || ""} onChange={s("baujahr")} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Wohnfläche (optional)</label>
                <div className="relative">
                  <input type="number" className="zora-input w-full pr-10" placeholder="150" value={(profil.wohnflaeche as string) || ""} onChange={s("wohnflaeche")} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9ca3af]">m²</span>
                </div>
              </div>
            </div>
            <RadioCards label="Eigentümer oder Mieter? *" value={(profil.eigentuemerOderMieter as string) || ""} onChange={(v) => onChange("eigentuemerOderMieter", v)} error={errors.eigentuemerOderMieter}
              options={[
                { value: "Eigentümer", label: "Eigentümer" },
                { value: "Mieter", label: "Mieter" },
              ]} />
            {profil.eigentuemerOderMieter === "Mieter" && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                Viele Förderungen sind nur für Eigentümer. Wir zeigen dir trotzdem was möglich ist.
              </div>
            )}
            {profil.eigentuemerOderMieter === "Eigentümer" && (
              <RadioCards label="Selbst bewohnt oder vermietet?" value={(profil.selbstbewohnt as string) || ""} onChange={(v) => onChange("selbstbewohnt", v)} cols={3}
                options={[
                  { value: "Selbst bewohnt", label: "Selbst bewohnt" },
                  { value: "Vermietet", label: "Vermietet" },
                  { value: "Teils vermietet", label: "Teils vermietet" },
                ]} />
            )}
          </div>
        </div>

        {/* Haushalt */}
        <div>
          <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-3">Haushalt</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Personen im Haushalt</label>
                <select className="zora-input w-full bg-white" value={(profil.anzahlPersonen as string) || ""} onChange={s("anzahlPersonen")}>
                  <option value="">Bitte wählen…</option>
                  {["1", "2", "3", "4", "5", "6+"].map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Jährl. Haushaltseinkommen</label>
                <select className="zora-input w-full bg-white" value={(profil.haushaltseinkommen as string) || ""} onChange={s("haushaltseinkommen")}>
                  <option value="">Bitte wählen…</option>
                  {["Unter 40.000 €", "40.000 – 80.000 €", "Über 80.000 €", "Keine Angabe"].map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <KiHinweis text="Das Einkommen wird nur für die Berechnung des Einkommensbonus (+30% bei KfW 458) verwendet. Wir speichern diese Information nicht." />
          </div>
        </div>

        {/* Vorhaben */}
        <div>
          <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-3">Geplantes Vorhaben</p>
          <div className="space-y-4">
            <CheckboxCards label="Was planst du? (Mehrfachauswahl möglich)"
              value={(profil.vorhabenCheckboxes as string[]) || []}
              onChange={(v) => onChange("vorhabenCheckboxes", v)}
              options={[
                { value: "Heizung tauschen", label: "Heizung tauschen", icon: <Flame size={16} /> },
                { value: "Dach / Fassade / Fenster dämmen", label: "Dach / Fassade / Fenster", icon: <Home size={16} /> },
                { value: "PV-Anlage installieren", label: "PV-Anlage installieren", icon: <Sun size={16} /> },
                { value: "Batteriespeicher", label: "Batteriespeicher", icon: <Battery size={16} /> },
                { value: "Lüftungsanlage einbauen", label: "Lüftungsanlage", icon: <Wind size={16} /> },
                { value: "Barrierefrei umbauen", label: "Barrierefrei umbauen", icon: <Accessibility size={16} /> },
                { value: "Neubau / Kauf", label: "Neubau / Kauf", icon: <Construction size={16} /> },
                { value: "Ladestation (Wallbox)", label: "Ladestation (Wallbox)", icon: <Zap size={16} /> },
                { value: "Energieberatung / Sanierungsfahrplan", label: "Energieberatung", icon: <Clipboard size={16} /> },
                { value: "Sonstiges", label: "Sonstiges", icon: <Plus size={16} /> },
              ]} />
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Beschreibe dein Vorhaben <span className="text-red-500">*</span></label>
              <textarea className={`zora-textarea w-full ${errors.vorhabenBeschreibung ? "border-red-400" : ""}`} rows={4}
                placeholder="z.B. Ich möchte meine alte Ölheizung durch eine Wärmepumpe ersetzen und gleichzeitig die Fassade dämmen lassen. Das Haus wurde 1978 gebaut."
                value={(profil.vorhabenBeschreibung as string) || ""} onChange={s("vorhabenBeschreibung")} />
              <div className="flex justify-between mt-1">
                <FieldError msg={errors.vorhabenBeschreibung} />
                <span className={`text-xs ml-auto ${descLen >= 50 ? "text-[#1D9E75]" : "text-[#9ca3af]"}`}>{descLen} / 50 Zeichen</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Geschätzte Investition</label>
                <select className="zora-input w-full bg-white" value={(profil.investitionssumme as string) || ""} onChange={s("investitionssumme")}>
                  <option value="">Bitte wählen…</option>
                  {["Unter 5.000 €", "5.000 – 15.000 €", "15.000 – 30.000 €", "30.000 – 60.000 €", "Über 60.000 €", "Noch unbekannt"].map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Geplanter Zeitraum</label>
                <select className="zora-input w-full bg-white" value={(profil.zeitraum as string) || ""} onChange={s("zeitraum")}>
                  <option value="">Bitte wählen…</option>
                  {["In den nächsten 3 Monaten", "In 3–6 Monaten", "In 6–12 Monaten", "In mehr als 12 Monaten"].map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <RadioCards label="Bereits Angebote eingeholt?" value={(profil.angebotseingeholt as string) || ""} onChange={(v) => onChange("angebotseingeholt", v)}
              options={[{ value: "Ja", label: "Ja" }, { value: "Nein", label: "Nein" }, { value: "In Planung", label: "In Planung" }]} cols={3} />
          </div>
        </div>
      </div>

      <button onClick={onNext} className="zora-btn-primary mt-8 w-full flex items-center justify-center gap-2 text-base px-6 py-3.5">
        KI-Matching starten <ChevronRight size={18} />
      </button>
    </div>
  );
}

// ── Screen 1B: Handwerker ──────────────────────────────────────────────────
function Screen1B({ profil, onChange, errors, onBack, onNext }: { profil: Profil; onChange: (k: string, v: string | string[]) => void; errors: Record<string, string>; onBack: () => void; onNext: () => void }) {
  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onChange(k, e.target.value);
  const foerderungFuer = (profil.foerderungFuer as string) || "";
  const showBetrieb = foerderungFuer === "betrieb" || foerderungFuer === "beides";
  const showKunden = foerderungFuer === "kunden" || foerderungFuer === "beides";

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <button onClick={onBack} className="text-[#6b7280] hover:text-[#1a1a1a] transition-colors"><ChevronLeft size={20} /></button>
        <h2 className="text-2xl font-bold" style={{ color: "#0D1F1B", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Erzähl uns von deinem Betrieb</h2>
      </div>
      <p className="text-[#6b7280] mb-6 ml-8">Wir finden passende Förderungen für deinen Betrieb und deine Kundenprojekte.</p>

      <div className="space-y-6">
        {/* Betriebsdaten */}
        <div>
          <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-3">Betriebsdaten</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Firmenname <span className="text-red-500">*</span></label>
              <input className={`zora-input w-full ${errors.firmenname ? "border-red-400" : ""}`} placeholder="Mustermann Sanitär GmbH" value={(profil.firmenname as string) || ""} onChange={s("firmenname")} />
              <FieldError msg={errors.firmenname} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">PLZ / Ort <span className="text-red-500">*</span></label>
              <input className={`zora-input w-full ${errors.plz ? "border-red-400" : ""}`} placeholder="12345 Musterstadt" value={(profil.plz as string) || ""} onChange={s("plz")} />
              <FieldError msg={errors.plz} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Bundesland <span className="text-red-500">*</span></label>
              <select className={`zora-input w-full bg-white ${errors.bundesland ? "border-red-400" : ""}`} value={(profil.bundesland as string) || ""} onChange={s("bundesland")}>
                <option value="">Bitte wählen…</option>
                {BUNDESLAENDER.map((b) => <option key={b}>{b}</option>)}
              </select>
              <FieldError msg={errors.bundesland} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Branche <span className="text-red-500">*</span></label>
              <select className={`zora-input w-full bg-white ${errors.branche ? "border-red-400" : ""}`} value={(profil.branche as string) || ""} onChange={s("branche")}>
                <option value="">Bitte wählen…</option>
                {["Sanitär, Heizung, Klima (SHK)", "Elektrotechnik", "Dachdeckerei", "Baugewerbe / Maurerhandwerk", "Zimmerei / Holzbau", "Maler / Lackierer", "Kälte- und Klimatechnik", "Sonstiges Handwerk"].map((v) => <option key={v}>{v}</option>)}
              </select>
              <FieldError msg={errors.branche} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Rechtsform <span className="text-red-500">*</span></label>
              <select className={`zora-input w-full bg-white ${errors.rechtsform ? "border-red-400" : ""}`} value={(profil.rechtsform as string) || ""} onChange={s("rechtsform")}>
                <option value="">Bitte wählen…</option>
                {["Einzelunternehmen", "GbR", "GmbH", "UG", "GmbH & Co. KG", "Sonstiges"].map((v) => <option key={v}>{v}</option>)}
              </select>
              <FieldError msg={errors.rechtsform} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Mitarbeiter <span className="text-red-500">*</span></label>
              <select className={`zora-input w-full bg-white ${errors.mitarbeiter ? "border-red-400" : ""}`} value={(profil.mitarbeiter as string) || ""} onChange={s("mitarbeiter")}>
                <option value="">Bitte wählen…</option>
                {["1", "2–5", "6–10", "11–25", "26–50", "Mehr als 50"].map((v) => <option key={v}>{v}</option>)}
              </select>
              <FieldError msg={errors.mitarbeiter} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Jahresumsatz</label>
              <select className="zora-input w-full bg-white" value={(profil.jahresumsatz as string) || ""} onChange={s("jahresumsatz")}>
                <option value="">Bitte wählen…</option>
                {["Unter 500k", "500k–2 Mio.", "2–10 Mio.", "Über 10 Mio."].map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Gegründet</label>
              <input type="number" className="zora-input w-full" placeholder="2005" min={1900} max={2025} value={(profil.gegruendet as string) || ""} onChange={s("gegruendet")} />
            </div>
          </div>
        </div>

        {/* Wofür */}
        <div>
          <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-3">Wofür suchst du Förderung?</p>
          <RadioCards label="" value={foerderungFuer} onChange={(v) => onChange("foerderungFuer", v)} error={errors.foerderungFuer} cols={3}
            options={[
              { value: "betrieb", label: "Für meinen Betrieb", description: "Investitionen, Digitalisierung, Fahrzeuge, Ausstattung" },
              { value: "kunden", label: "Für meine Kunden", description: "Ich installiere bei Kunden und helfe bei der Förderung" },
              { value: "beides", label: "Beides", description: "Sowohl betriebliche als auch Kundenprojekte" },
            ]} />
        </div>

        {/* Betrieb-Vorhaben */}
        {showBetrieb && (
          <div>
            <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-3">Betriebliches Vorhaben</p>
            <div className="space-y-4">
              <CheckboxCards label="Was planst du?" value={(profil.betriebVorhaben as string[]) || []} onChange={(v) => onChange("betriebVorhaben", v)}
                options={[
                  { value: "Neue Maschinen / Fahrzeuge", label: "Maschinen / Fahrzeuge", icon: <Truck size={16} /> },
                  { value: "Betriebsgebäude / PV-Anlage", label: "Betriebsgebäude / PV", icon: <Factory size={16} /> },
                  { value: "Digitalisierung", label: "Digitalisierung", icon: <Laptop size={16} /> },
                  { value: "Mitarbeiter ausbilden / einstellen", label: "Mitarbeiter", icon: <Users size={16} /> },
                  { value: "Betrieb gründen / übernehmen", label: "Gründung / Nachfolge", icon: <Handshake size={16} /> },
                  { value: "Sonstiges", label: "Sonstiges", icon: <Plus size={16} /> },
                ]} />
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Beschreibung des Vorhabens <span className="text-red-500">*</span></label>
                <textarea className={`zora-textarea w-full ${errors.betriebBeschreibung ? "border-red-400" : ""}`} rows={3}
                  placeholder="z.B. Wir möchten 3 neue Elektro-Servicefahrzeuge anschaffen und die Werkstatt mit Wallboxen ausstatten."
                  value={(profil.betriebBeschreibung as string) || ""} onChange={s("betriebBeschreibung")} />
                <FieldError msg={errors.betriebBeschreibung} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Investitionssumme</label>
                <select className="zora-input w-full bg-white" value={(profil.betriebInvestition as string) || ""} onChange={s("betriebInvestition")}>
                  <option value="">Bitte wählen…</option>
                  {["Unter 10.000 €", "10.000–50.000 €", "50.000–200.000 €", "Über 200.000 €"].map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Kunden-Vorhaben */}
        {showKunden && (
          <div>
            <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-3">Kundenprojekte</p>
            <div className="space-y-4">
              <CheckboxCards label="Welche Leistungen bietest du an?" value={(profil.leistungen as string[]) || []} onChange={(v) => onChange("leistungen", v)}
                options={[
                  { value: "Wärmepumpen installieren", label: "Wärmepumpen", icon: <Recycle size={16} /> },
                  { value: "PV-Anlagen installieren", label: "PV-Anlagen", icon: <Sun size={16} /> },
                  { value: "Dämmmaßnahmen", label: "Dämmmaßnahmen", icon: <BrickWall size={16} /> },
                  { value: "Hydraulischer Abgleich", label: "Hydraul. Abgleich", icon: <Wrench size={16} /> },
                  { value: "Lüftungsanlagen", label: "Lüftungsanlagen", icon: <Wind size={16} /> },
                  { value: "Wallboxen installieren", label: "Wallboxen", icon: <Zap size={16} /> },
                ]} />
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Welches Kundenprojekt möchtest du fördern lassen? <span className="text-red-500">*</span></label>
                <textarea className={`zora-textarea w-full ${errors.kundenprojektBeschreibung ? "border-red-400" : ""}`} rows={3}
                  placeholder="z.B. Wir installieren bei Kunden Wärmepumpen und möchten wissen, welche Förderanträge wir als Bevollmächtigte stellen können."
                  value={(profil.kundenprojektBeschreibung as string) || ""} onChange={s("kundenprojektBeschreibung")} />
                <FieldError msg={errors.kundenprojektBeschreibung} />
              </div>
              <KiHinweis text="Als Handwerksbetrieb kannst du deinen Kunden die Förderbeantragung abnehmen. Zora zeigt dir welche Programme du als Bevollmächtigter beantragen kannst." />
            </div>
          </div>
        )}
      </div>

      <button onClick={onNext} className="zora-btn-primary mt-8 w-full flex items-center justify-center gap-2 text-base px-6 py-3.5">
        KI-Matching starten <ChevronRight size={18} />
      </button>
    </div>
  );
}

// ── Screen 1C: KMU ─────────────────────────────────────────────────────────
function Screen1C({ profil, onChange, errors, onBack, onNext }: { profil: Profil; onChange: (k: string, v: string | string[]) => void; errors: Record<string, string>; onBack: () => void; onNext: () => void }) {
  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onChange(k, e.target.value);
  const mitarbeiter = (profil.mitarbeiter as string) || "";
  const isKleinst = mitarbeiter === "1–9";
  const isKmu = mitarbeiter === "10–49" || mitarbeiter === "50–249";
  const foerderthema = (profil.foerderthema as string) || "";
  const descLen = ((profil.kmuVorhabenBeschreibung as string) || "").length;

  const PLACEHOLDERS: Record<string, string> = {
    "Digitalisierung & IT": "z.B. Wir möchten unser ERP-System modernisieren und auf eine cloudbasierte Lösung umsteigen…",
    "Energie & Nachhaltigkeit": "z.B. Wir planen eine PV-Anlage auf unserem Betriebsgebäude und möchten auf E-Fahrzeuge umstellen…",
    "Innovation & F&E": "z.B. Wir entwickeln ein neues Softwareprodukt und suchen Förderung für die Prototypenentwicklung…",
    "Investitionen & Wachstum": "z.B. Wir möchten eine neue Produktionslinie aufbauen und dafür in Maschinen und Personal investieren…",
    "Gründung & Nachfolge": "z.B. Ich gründe in 3 Monaten ein Unternehmen im Bereich erneuerbarer Energien und suche Startförderung…",
    "Mitarbeiter & Ausbildung": "z.B. Wir möchten 5 neue Mitarbeiter einstellen und sie in digitalen Kompetenzen weiterbilden…",
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <button onClick={onBack} className="text-[#6b7280] hover:text-[#1a1a1a] transition-colors"><ChevronLeft size={20} /></button>
        <h2 className="text-2xl font-bold" style={{ color: "#0D1F1B", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Erzähl uns von deinem Unternehmen</h2>
      </div>
      <p className="text-[#6b7280] mb-6 ml-8">Wir zeigen dir passende Unternehmensförderungen.</p>

      <div className="space-y-6">
        {/* Unternehmensdaten */}
        <div>
          <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-3">Unternehmensdaten</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Firmenname <span className="text-red-500">*</span></label>
              <input className={`zora-input w-full ${errors.firmenname ? "border-red-400" : ""}`} placeholder="Muster GmbH" value={(profil.firmenname as string) || ""} onChange={s("firmenname")} />
              <FieldError msg={errors.firmenname} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">PLZ / Ort <span className="text-red-500">*</span></label>
              <input className={`zora-input w-full ${errors.plz ? "border-red-400" : ""}`} placeholder="12345 Musterstadt" value={(profil.plz as string) || ""} onChange={s("plz")} />
              <FieldError msg={errors.plz} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Bundesland <span className="text-red-500">*</span></label>
              <select className={`zora-input w-full bg-white ${errors.bundesland ? "border-red-400" : ""}`} value={(profil.bundesland as string) || ""} onChange={s("bundesland")}>
                <option value="">Bitte wählen…</option>
                {BUNDESLAENDER.map((b) => <option key={b}>{b}</option>)}
              </select>
              <FieldError msg={errors.bundesland} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Branche <span className="text-red-500">*</span></label>
              <select className={`zora-input w-full bg-white ${errors.branche ? "border-red-400" : ""}`} value={(profil.branche as string) || ""} onChange={s("branche")}>
                <option value="">Bitte wählen…</option>
                {["IT & Software", "Handel & E-Commerce", "Produktion / Industrie", "Dienstleistungen", "Gastronomie & Tourismus", "Gesundheit & Soziales", "Medien & Kreativwirtschaft", "Sonstiges"].map((v) => <option key={v}>{v}</option>)}
              </select>
              <FieldError msg={errors.branche} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Rechtsform <span className="text-red-500">*</span></label>
              <select className={`zora-input w-full bg-white ${errors.rechtsform ? "border-red-400" : ""}`} value={(profil.rechtsform as string) || ""} onChange={s("rechtsform")}>
                <option value="">Bitte wählen…</option>
                {["GmbH", "UG", "AG", "GbR", "Einzelunternehmen", "GmbH & Co. KG", "Sonstiges"].map((v) => <option key={v}>{v}</option>)}
              </select>
              <FieldError msg={errors.rechtsform} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Mitarbeiter <span className="text-red-500">*</span></label>
              <select className={`zora-input w-full bg-white ${errors.mitarbeiter ? "border-red-400" : ""}`} value={mitarbeiter} onChange={s("mitarbeiter")}>
                <option value="">Bitte wählen…</option>
                {["1–9", "10–49", "50–249", "250+"].map((v) => <option key={v}>{v}</option>)}
              </select>
              <FieldError msg={errors.mitarbeiter} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Jahresumsatz</label>
              <select className="zora-input w-full bg-white" value={(profil.jahresumsatz as string) || ""} onChange={s("jahresumsatz")}>
                <option value="">Bitte wählen…</option>
                {["Unter 2 Mio.", "2–10 Mio.", "10–50 Mio.", "Über 50 Mio."].map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Gegründet</label>
              <input type="number" className="zora-input w-full" placeholder="2010" min={1900} max={2025} value={(profil.gegruendet as string) || ""} onChange={s("gegruendet")} />
            </div>
          </div>
        </div>

        {/* Kleinstunternehmen */}
        {isKleinst && (
          <div>
            <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-3">Kleinstunternehmen</p>
            <div className="space-y-4">
              <RadioCards label="Gründer oder bestehendes Unternehmen?" value={(profil.gruenderOderBestehend as string) || ""} onChange={(v) => onChange("gruenderOderBestehend", v)}
                options={[{ value: "Gründer", label: "Gründer (< 3 Jahre)" }, { value: "Bestehendes Unternehmen", label: "Bestehendes Unternehmen" }]} />
              {profil.gruenderOderBestehend === "Gründer" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Geplantes Gründungsdatum</label>
                    <input type="date" className="zora-input w-full" value={(profil.gruendungsdatum as string) || ""} onChange={s("gruendungsdatum")} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Businessplan vorhanden?</label>
                    <select className="zora-input w-full bg-white" value={(profil.businessplanVorhanden as string) || ""} onChange={s("businessplanVorhanden")}>
                      <option value="">Bitte wählen…</option>
                      <option>Ja</option><option>In Erstellung</option><option>Nein</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* KMU */}
        {isKmu && (
          <div>
            <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-3">Förderstatus</p>
            <RadioCards label="Öffentliche Förderungen in den letzten 3 Jahren erhalten?" value={(profil.oeffentlicheForderungenErhalten as string) || ""} onChange={(v) => onChange("oeffentlicheForderungenErhalten", v)}
              options={[{ value: "Ja", label: "Ja" }, { value: "Nein", label: "Nein" }]} />
            {profil.oeffentlicheForderungenErhalten === "Ja" && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Welche? (optional)</label>
                <input className="zora-input w-full" placeholder="z.B. KfW 270, Digital Jetzt" value={(profil.welcheForderungen as string) || ""} onChange={s("welcheForderungen")} />
              </div>
            )}
          </div>
        )}

        {/* Vorhaben */}
        <div>
          <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-3">Vorhaben</p>
          <div className="space-y-4">
            <RadioCards label="Förderthema *" value={foerderthema} onChange={(v) => onChange("foerderthema", v)} error={errors.foerderthema} cols={3}
              options={[
                { value: "Digitalisierung & IT", label: "Digitalisierung & IT", icon: <Laptop size={20} /> },
                { value: "Energie & Nachhaltigkeit", label: "Energie & Nachhaltigkeit", icon: <Recycle size={20} /> },
                { value: "Innovation & F&E", label: "Innovation & F&E", icon: <Microscope size={20} /> },
                { value: "Investitionen & Wachstum", label: "Investitionen & Wachstum", icon: <TrendingUp size={20} /> },
                { value: "Gründung & Nachfolge", label: "Gründung & Nachfolge", icon: <ArrowUpRight size={20} /> },
                { value: "Mitarbeiter & Ausbildung", label: "Mitarbeiter & Ausbildung", icon: <Users size={20} /> },
              ]} />
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Beschreibung des Vorhabens <span className="text-red-500">*</span></label>
              <textarea className={`zora-textarea w-full ${errors.kmuVorhabenBeschreibung ? "border-red-400" : ""}`} rows={4}
                placeholder={PLACEHOLDERS[foerderthema] || "Beschreibe dein geplantes Vorhaben so konkret wie möglich…"}
                value={(profil.kmuVorhabenBeschreibung as string) || ""} onChange={s("kmuVorhabenBeschreibung")} />
              <div className="flex justify-between mt-1">
                <FieldError msg={errors.kmuVorhabenBeschreibung} />
                <span className={`text-xs ml-auto ${descLen >= 80 ? "text-[#1D9E75]" : "text-[#9ca3af]"}`}>{descLen} / 80 Zeichen</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Investitionssumme</label>
                <select className="zora-input w-full bg-white" value={(profil.kmuInvestitionssumme as string) || ""} onChange={s("kmuInvestitionssumme")}>
                  <option value="">Bitte wählen…</option>
                  {["Unter 25.000 €", "25.000–100.000 €", "100.000–500.000 €", "Über 500.000 €"].map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Zeitraum</label>
                <select className="zora-input w-full bg-white" value={(profil.kmuZeitraum as string) || ""} onChange={s("kmuZeitraum")}>
                  <option value="">Bitte wählen…</option>
                  {["In den nächsten 3 Monaten", "In 3–6 Monaten", "In 6–12 Monaten", "Längerfristig"].map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button onClick={onNext} className="zora-btn-primary mt-8 w-full flex items-center justify-center gap-2 text-base px-6 py-3.5">
        KI-Matching starten <ChevronRight size={18} />
      </button>
    </div>
  );
}

// ── Loading texts ──────────────────────────────────────────────────────────
// ── Screen 1b constants ────────────────────────────────────────────────────
const LOADING_TEXTS = [
  "Analysiere dein Vorhaben...",
  "Durchsuche 100+ Förderprogramme...",
  "Prüfe Kombinationsmöglichkeiten...",
  "Berechne maximalen Förderbetrag...",
  "Fast fertig...",
];

const LOADING_PROGRAMS: Record<string, Array<{ name: string; betrag: number }>> = {
  privatperson: [
    { name: "KfW 458 Heizungsförderung", betrag: 21000 },
    { name: "BEG Einzelmaßnahmen (BAFA)", betrag: 12000 },
    { name: "BAFA Energieberatung", betrag: 1300 },
  ],
  handwerker: [
    { name: "BEG Einzelmaßnahmen (BAFA)", betrag: 24500 },
    { name: "KfW 270 Erneuerbare Energien", betrag: 15000 },
    { name: "BAFA Heizungsförderung", betrag: 8000 },
  ],
  kmu: [
    { name: "KfW Unternehmerkredit", betrag: 25000 },
    { name: "Digital Jetzt (BMWK)", betrag: 12000 },
    { name: "BAFA Beratungsförderung", betrag: 4000 },
  ],
};

// Steps end at sum of respective programs: privatperson=34300, handwerker=47500, kmu=41000
const LOADING_STEPS: Record<string, number[]> = {
  privatperson: [1800, 6200, 12400, 21000, 28500, 34300],
  handwerker: [2100, 8500, 17000, 28000, 38500, 47500],
  kmu: [1900, 7200, 15000, 24000, 33000, 41000],
};

function Screen1b({ nutzertyp }: { nutzertyp: Nutzertyp; profil: Profil }) {
  const nt = nutzertyp || "privatperson";
  const programs = LOADING_PROGRAMS[nt];
  const steps = LOADING_STEPS[nt];

  const [textIdx, setTextIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(-1);
  const [targetAmount, setTargetAmount] = useState(0);
  const [displayAmount, setDisplayAmount] = useState(0);
  const [visiblePrograms, setVisiblePrograms] = useState<number[]>([]);
  const [badges, setBadges] = useState<Array<{ id: number; amount: number }>>([]);
  const displayRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const badgeIdRef = useRef(0);

  // Text cycling
  useEffect(() => {
    const t = setInterval(() => setTextIdx((i) => Math.min(i + 1, LOADING_TEXTS.length - 1)), 700);
    return () => clearInterval(t);
  }, []);

  // Kick off step progression
  useEffect(() => {
    const t = setTimeout(() => setStepIdx(0), 300);
    return () => clearTimeout(t);
  }, []);

  // Each step: update target + show badge + schedule next
  useEffect(() => {
    if (stepIdx < 0 || stepIdx >= steps.length) return;
    const newTarget = steps[stepIdx];
    const prev = stepIdx > 0 ? steps[stepIdx - 1] : 0;
    setTargetAmount(newTarget);

    const diff = newTarget - prev;
    if (diff <= 0) return;

    const id = badgeIdRef.current++;
    setBadges((b) => [...b, { id, amount: diff }]);
    const removeTimer = setTimeout(() => setBadges((b) => b.filter((x) => x.id !== id)), 1300);

    if (stepIdx < steps.length - 1) {
      const nextTimer = setTimeout(() => setStepIdx((i) => i + 1), 1600 + Math.random() * 400);
      return () => { clearTimeout(removeTimer); clearTimeout(nextTimer); };
    }
    return () => clearTimeout(removeTimer);
  }, [stepIdx, steps]);

  // Smooth counter animation (easing toward targetAmount)
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const animate = () => {
      const current = displayRef.current;
      const diff = targetAmount - current;
      if (Math.abs(diff) < 1) {
        displayRef.current = targetAmount;
        setDisplayAmount(targetAmount);
        return;
      }
      const next = current + diff * 0.1;
      displayRef.current = next;
      setDisplayAmount(Math.round(next));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [targetAmount]);

  // Program reveal every 2s
  useEffect(() => {
    const timers = programs.map((_, i) =>
      setTimeout(() => setVisiblePrograms((p) => [...p, i]), 1800 + i * 2000)
    );
    return () => timers.forEach(clearTimeout);
  }, [programs]);

  const fmt = (n: number) => Math.round(n).toLocaleString("de-DE") + " €";
  const progressPct = Math.max(5, Math.min(100, ((stepIdx + 1) / steps.length) * 100));

  return (
    <div className="flex flex-col items-center py-10 px-2">
      {/* Spinner */}
      <div className="relative mb-5">
        <Loader2 size={48} className="text-[#1D9E75] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1D9E75]" />
        </div>
      </div>

      {/* Cycling text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={textIdx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="text-[#6b7280] text-sm text-center mb-7"
        >
          {LOADING_TEXTS[textIdx]}
        </motion.p>
      </AnimatePresence>

      {/* Counter box */}
      <div className="w-full max-w-sm bg-[#f9fafb] border border-[#e5e7eb] rounded-2xl p-6 mb-5">
        <p className="text-sm font-medium text-[#6b7280] text-center mb-3">Gefundenes Förderpotenzial:</p>

        {/* Number + floating badges */}
        <div className="relative flex justify-center items-center" style={{ height: "64px" }}>
          <span className="font-bold text-[#1D9E75] tabular-nums" style={{ fontSize: "2.8rem", lineHeight: 1 }}>
            {fmt(displayAmount)}
          </span>
          <AnimatePresence>
            {badges.map((b) => (
              <motion.span
                key={b.id}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -44 }}
                exit={{}}
                transition={{ duration: 1.1, ease: "easeOut" }}
                className="absolute top-0 right-0 bg-[#1D9E75] text-white text-xs font-bold px-2.5 py-1 rounded-full pointer-events-none whitespace-nowrap"
              >
                +{fmt(b.amount)}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 bg-[#e5e7eb] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#1D9E75] rounded-full"
            initial={{ width: "5%" }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-[#9ca3af] text-center mt-2">Suche läuft...</p>
      </div>

      {/* Program list */}
      <div className="w-full max-w-sm space-y-2">
        <AnimatePresence>
          {visiblePrograms.map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between bg-white border border-[#e5e7eb] rounded-xl px-4 py-2.5"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <CheckCircle size={14} className="text-[#1D9E75] flex-shrink-0" />
                <span className="text-sm text-[#374151] truncate">{programs[i].name} gefunden</span>
              </div>
              <span className="text-sm font-bold text-[#1D9E75] flex-shrink-0 ml-3">
                +{fmt(programs[i].betrag)}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {visiblePrograms.length < programs.length && (
          <div className="flex items-center gap-2.5 px-4 py-2.5">
            <Loader2 size={14} className="text-[#9ca3af] animate-spin flex-shrink-0" />
            <span className="text-sm text-[#9ca3af]">Suche nach weiteren Programmen...</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Screen 2: Results ──────────────────────────────────────────────────────
function EmptyFilterState({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-[#f3f4f6] flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <p className="text-base font-semibold text-[#1a1a1a] mb-2">Keine passenden Förderungen gefunden</p>
      <p className="text-sm text-[#6b7280] mb-6 max-w-xs mx-auto">
        Versuche dein Vorhaben anders zu beschreiben oder wähle einen anderen Nutzertyp.
      </p>
      <button onClick={onReset} className="text-sm font-semibold text-[#1D9E75] hover:underline">
        Filter zurücksetzen
      </button>
    </div>
  );
}

function Screen2({
  programmes, nutzertyp, bundesland, savedIds, onSave, onBack, onNext,
}: {
  programmes: Foerderprogramm[];
  nutzertyp: Nutzertyp;
  bundesland: string;
  savedIds: Set<string>;
  onSave: (prog: Foerderprogramm) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [filter, setFilter] = useState<FilterType>("alle");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const NUTZERTYP_LABELS: Record<string, string> = {
    privatperson: "Privatpersonen",
    handwerker: "Handwerksbetriebe",
    kmu: "KMU & Unternehmen",
  };

  const FILTERS: { key: FilterType; label: string }[] = [
    { key: "alle", label: "Alle" },
    { key: "zuschuss", label: "Zuschüsse" },
    { key: "kredit", label: "Kredite" },
    { key: "unter10k", label: "Unter 10.000 €" },
    { key: "ueber10k", label: "Über 10.000 €" },
  ];

  const sorted = [...programmes].sort((a, b) => b.passung - a.passung);

  const filtered = sorted.filter((p) => {
    if (filter === "zuschuss") return p.badge === "Zuschuss";
    if (filter === "kredit") return p.badge === "Kredit";
    if (filter === "unter10k") {
      const amt = parseMaxBetragAmount(p.maxBetrag);
      return amt !== null && amt < 10000;
    }
    if (filter === "ueber10k") {
      const amt = parseMaxBetragAmount(p.maxBetrag);
      return amt !== null && amt >= 10000;
    }
    return true;
  });

  const topId = sorted[0]?.id;
  const nutzerLabel = NUTZERTYP_LABELS[nutzertyp] || "";

  const urgentFrist = programmes
    .map((p) => ({ id: p.id, name: p.name, frist: programmFristen[p.id] }))
    .find((p) => p.frist?.dringlichkeit === "hoch");

  return (
    <div>
      {/* Urgency banner */}
      {urgentFrist && (
        <div
          className="flex items-start justify-between gap-3 rounded-lg px-4 py-3 mb-4 text-sm"
          style={{ background: "#FAEEDA" }}
        >
          <p className="text-[#633806] leading-snug">
            <span className="font-semibold flex items-center gap-1"><AlertTriangle size={14} /> Achtung:</span>{" "}
            {urgentFrist.frist.text} bei <span className="font-semibold">{urgentFrist.name}</span>. Stelle deinen Antrag rechtzeitig!
          </p>
          <span className="text-[#854F0B] font-semibold whitespace-nowrap text-xs mt-0.5 flex-shrink-0 flex items-center gap-1">
            Mehr Info <ArrowRight size={12} />
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-1">
        <button onClick={onBack} className="text-[#6b7280] hover:text-[#1a1a1a] transition-colors mt-1">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "#0D1F1B", fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {sorted.length} passende Förderungen gefunden
          </h2>
          <p className="text-sm text-[#6b7280] mt-0.5">
            Sortiert nach Übereinstimmung
            {nutzerLabel ? ` · Für ${nutzerLabel}` : ""}
            {bundesland ? ` in ${bundesland}` : ""}
          </p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mt-4 mb-6 ml-8">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
              filter === f.key
                ? "bg-[#1D9E75] text-white border-[#1D9E75]"
                : "bg-white text-[#6b7280] border-[#e5e7eb] hover:border-[#1D9E75]/40"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <EmptyFilterState onReset={() => setFilter("alle")} />
      ) : (
        <div className="space-y-4 mb-8">
          {filtered.map((p) => {
            const isTop = p.id === topId;
            const isExpanded = expandedCards.has(p.id);
            const db = PROG_DB[p.id];
            const barColor = getBarColor(p.passung);
            const isSaved = savedIds.has(p.id);
            const wizardRoute = WIZARD_ROUTES[p.id];
            const isLandesProgramm = db && Array.isArray(db.bundeslaender);

            return (
              <div
                key={p.id}
                className={`rounded-xl overflow-hidden transition-all bg-white ${
                  isTop
                    ? "border-2 border-[#1D9E75] shadow-sm"
                    : "border border-[#e5e7eb] hover:border-[#1D9E75]/30 hover:shadow-sm"
                }`}
              >
                {/* Zora empfohlen banner */}
                {isTop && (
                  <div className="px-5 pt-3 pb-0">
                    <span
                      className="inline-block text-white text-xs font-medium px-3 py-1 rounded-full"
                      style={{ background: "#1D9E75", fontSize: 12, fontWeight: 500, borderRadius: 20, padding: "4px 12px" }}
                    >
                      <Star size={11} fill="currentColor" className="inline mr-1" /> Von Zora empfohlen
                    </span>
                  </div>
                )}

                <div className="p-5">
                  {/* Badge row */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <BadgePill type={p.badge} />
                    <BadgePill type={p.foerdergeber} />
                    {isLandesProgramm && <BadgePill type="Bundesland" />}
                  </div>

                  {/* Name & provider */}
                  <p className="text-base font-medium text-[#1a1a1a] mb-1">{p.name}</p>
                  <FristBadgeForId programmId={p.id} />
                  <p className="text-sm text-[#6b7280] mb-4 mt-1.5">
                    {p.foerdergeber} · Max. {p.maxBetrag}
                  </p>

                  {/* Passung bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-[#6b7280]">Übereinstimmung</span>
                      <span className="text-xs font-bold" style={{ color: barColor }}>
                        {p.passung}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#f3f4f6] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: animated ? `${p.passung}%` : "0%",
                          backgroundColor: barColor,
                          transition: "width 0.8s ease",
                        }}
                      />
                    </div>
                  </div>

                  {/* Passungsbegründung */}
                  {p.passungBegruendung && (
                    <p className="text-xs text-[#6b7280] leading-relaxed mb-4 line-clamp-2">
                      {p.passungBegruendung}
                    </p>
                  )}

                  {/* Action bar */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <button
                      onClick={() => onSave(p)}
                      className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                        isSaved ? "text-[#1D9E75]" : "text-[#9ca3af] hover:text-[#6b7280]"
                      }`}
                    >
                      {isSaved ? <><Heart size={12} fill="currentColor" className="inline mr-1" />Gespeichert</> : <><Heart size={12} className="inline mr-1" />Speichern</>}
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleExpand(p.id)}
                        className="text-xs text-[#6b7280] hover:text-[#1a1a1a] transition-colors"
                      >
                        {isExpanded ? "Weniger ▲" : "Mehr Details ▼"}
                      </button>
                      {wizardRoute ? (
                        <Link
                          href={wizardRoute}
                          className="zora-btn-primary inline-flex items-center gap-1 text-xs px-3 py-1.5"
                        >
                          Antrag starten <ArrowRight size={11} />
                        </Link>
                      ) : (
                        <button
                          onClick={onNext}
                          className="zora-btn-primary inline-flex items-center gap-1 text-xs px-3 py-1.5"
                        >
                          Antrag starten <ArrowRight size={11} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded detail section */}
                  <div
                    style={{
                      maxHeight: isExpanded ? "900px" : "0",
                      overflow: "hidden",
                      transition: "max-height 0.3s ease",
                    }}
                  >
                    <div className="mt-5 pt-5 border-t border-[#f3f4f6] space-y-5">
                      {/* Zora empfehlung */}
                      {p.empfehlung && (
                        <div>
                          <p className="text-xs font-semibold text-[#1D9E75] uppercase tracking-wide mb-1.5">
                            Empfehlung von Zora
                          </p>
                          <p className="text-sm text-[#374151] leading-relaxed">{p.empfehlung}</p>
                        </div>
                      )}

                      {/* Was wird gefördert */}
                      <div>
                        <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-1.5">
                          Was wird gefördert?
                        </p>
                        <p className="text-sm text-[#374151] leading-relaxed">{p.beschreibung}</p>
                      </div>

                      {/* Förderdetails */}
                      {db && (
                        <div>
                          <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-2">
                            Förderdetails
                          </p>
                          <div className="space-y-1.5 text-sm">
                            {(
                              [
                                { label: "Fördersatz", value: db.foerderquote },
                                { label: "Max. Förderbetrag", value: db.maxBetrag },
                                { label: "Antragsstelle", value: db.antragsstelle },
                                { label: "EEE erforderlich", value: db.eeeErforderlich ? <span className="flex items-center gap-0.5"><Check size={11} />Ja</span> : "Nein" },
                                { label: "Antrag vor Beginn", value: db.antragVorMassnahme ? <span className="flex items-center gap-0.5"><Check size={11} />Pflicht</span> : "Nein" },
                                ...(db.kombinierbarMit.length > 0
                                  ? [{ label: "Kombinierbar mit", value: db.kombinierbarMit.join(", ") }]
                                  : []),
                              ] as { label: string; value: React.ReactNode }[]
                            ).map((row) => (
                              <div key={row.label} className="flex items-start gap-2">
                                <span className="text-[#9ca3af] w-36 flex-shrink-0 text-xs">{row.label}:</span>
                                <span className="text-[#374151] font-medium text-xs">{row.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Voraussetzungen */}
                      {db && db.voraussetzungen.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-2">
                            Voraussetzungen
                          </p>
                          <ul className="space-y-1">
                            {db.voraussetzungen.map((v) => (
                              <li key={v} className="flex items-start gap-2 text-sm text-[#374151]">
                                <span className="text-[#1D9E75] mt-0.5 flex-shrink-0">•</span>
                                {v}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Nächste Schritte */}
                      {db && (
                        <div>
                          <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-2">
                            Nächste Schritte
                          </p>
                          <ol className="space-y-2">
                            {getNaechsteSchritte(db).map((step, i) => (
                              <li key={step} className="flex items-start gap-2.5 text-sm text-[#374151]">
                                <span className="w-5 h-5 rounded-full bg-[#E1F5EE] text-[#1D9E75] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                  {i + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {/* Expanded footer CTA */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#f3f4f6]">
                        <button
                          onClick={() => toggleExpand(p.id)}
                          className="text-xs text-[#6b7280] hover:text-[#1a1a1a] transition-colors"
                        >
                          Weniger anzeigen ▲
                        </button>
                        {wizardRoute ? (
                          <Link
                            href={wizardRoute}
                            className="zora-btn-primary inline-flex items-center gap-1.5 text-sm px-4 py-2"
                          >
                            Jetzt Antrag starten <ArrowRight size={14} />
                          </Link>
                        ) : (
                          <button
                            onClick={onNext}
                            className="zora-btn-primary inline-flex items-center gap-1.5 text-sm px-4 py-2"
                          >
                            Jetzt Antrag starten <ArrowRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="text-center mb-3">
        <Link
          href="/app/foerderungen/suche"
          className="text-xs text-[#9ca3af] hover:text-[#6b7280] transition-colors"
        >
          Das gesuchte Programm nicht dabei? <ArrowRight size={12} className="inline" /> Direktsuche
        </Link>
      </div>

      <button
        onClick={onNext}
        className="zora-btn-primary w-full flex items-center justify-center gap-2 text-base px-6 py-3.5"
      >
        Zu Partner & Antrag <ChevronRight size={18} />
      </button>
    </div>
  );
}

// ── Screen 3: Partner-Vorschlag ────────────────────────────────────────────
interface ContactModalInfo {
  name: string;
  rolle: string;
  telefon: string;
}

const PARTNER_CONFIG: Record<PartnerKey, {
  titel: string;
  beschreibung: string;
  kosten: string;
  pflicht: boolean;
  icon: React.ReactNode;
}> = {
  eee: {
    titel: "Energieeffizienz-Experte (EEE)",
    beschreibung: "Der EEE erstellt die Technische Projektbeschreibung (TPB) — ohne diese ID kann der Antrag nicht eingereicht werden. Er begleitet dein Projekt fachlich und bestätigt am Ende die korrekte Umsetzung.",
    kosten: "Ca. 500–2.000 € (wird zu 50 % gefördert)",
    pflicht: true,
    icon: <Award size={22} />,
  },
  shk: {
    titel: "SHK-Fachbetrieb (Sanitär, Heizung, Klima)",
    beschreibung: "Die Installation muss von einem eingetragenen SHK-Fachbetrieb durchgeführt werden. Der Betrieb stellt auch die Fachunternehmer-Erklärung aus, die für den Förderantrag benötigt wird.",
    kosten: "Je nach Maßnahme (Angebote einholen)",
    pflicht: true,
    icon: <Wrench size={22} />,
  },
  elektro: {
    titel: "Elektrofachbetrieb",
    beschreibung: "Installation und Abnahme muss durch einen zugelassenen Elektrofachbetrieb erfolgen. Für PV-Anlagen wird außerdem eine Anmeldung beim Netzbetreiber benötigt.",
    kosten: "Je nach Anlage (Angebote einholen)",
    pflicht: true,
    icon: <Zap size={22} />,
  },
  dach: {
    titel: "Dachdecker / Zimmerei",
    beschreibung: "Für Dämmmaßnahmen am Dach wird ein Fachbetrieb aus dem Dachdeckerhandwerk empfohlen. Bei Bedarf stellt er die Fachunternehmer-Erklärung aus.",
    kosten: "Je nach Maßnahme (Angebote einholen)",
    pflicht: false,
    icon: <Home size={22} />,
  },
};

function PartnerCard({ partnerKey, programmes, onContact }: {
  partnerKey: PartnerKey;
  programmes: Foerderprogramm[];
  onContact: (info: ContactModalInfo) => void;
}) {
  const cfg = PARTNER_CONFIG[partnerKey];
  const partners = SIMULIERTE_PARTNER[partnerKey] || [];
  const benoetigtFuer = getBenoetigtFuer(partnerKey, programmes);

  return (
    <div className={`rounded-xl border ${cfg.pflicht ? "border-red-200 bg-red-50/30" : "border-amber-200 bg-amber-50/30"} overflow-hidden`}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.pflicht ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>
            {cfg.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.pflicht ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                {cfg.pflicht ? "Pflicht" : "Empfohlen"}
              </span>
            </div>
            <p className="font-semibold text-[#1a1a1a] leading-tight">{cfg.titel}</p>
          </div>
        </div>

        {benoetigtFuer && (
          <p className="text-xs text-[#6b7280] mb-3">
            <span className="font-medium">Benötigt für:</span> {benoetigtFuer}
          </p>
        )}

        <div className="mb-3">
          <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-1">Was macht er?</p>
          <p className="text-sm text-[#374151] leading-relaxed">{cfg.beschreibung}</p>
        </div>

        <p className="text-xs text-[#6b7280] mb-4">
          <span className="font-medium">Kosten:</span> {cfg.kosten}
        </p>

        {/* Simulated partners */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[#f3f4f6] bg-[#f9fafb]">
            <p className="text-xs font-semibold text-[#6b7280]">Partner in deiner Nähe</p>
          </div>
          <div className="divide-y divide-[#f3f4f6]">
            {partners.map((p) => (
              <div key={p.name} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-[#1a1a1a] truncate">{p.name}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#9ca3af]">
                    <span className="flex items-center gap-1">
                      <Star size={10} className="text-amber-400 fill-amber-400" />
                      {p.bewertung}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={10} /> {p.entfernung}
                    </span>
                    <span className="text-[#1D9E75] font-medium">{p.zertifikat}</span>
                  </div>
                </div>
                <button
                  onClick={() => onContact({ name: p.name, rolle: p.rolle, telefon: p.telefon })}
                  className="text-xs font-semibold text-[#1D9E75] hover:text-[#0F6E56] border border-[#1D9E75]/30 hover:border-[#1D9E75] px-2.5 py-1 rounded-lg transition-all flex-shrink-0"
                >
                  Kontakt
                </button>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-[#9ca3af] mt-2">* Beispieldaten — in der finalen Version echte Betriebe aus deiner Umgebung.</p>
      </div>
    </div>
  );
}

function ContactModal({ info, onClose }: { info: ContactModalInfo; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const email = makeEmail(info.name, info.rolle);

  const copyPhone = () => {
    navigator.clipboard.writeText(info.telefon).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <button onClick={onClose} className="absolute right-4 top-4 text-[#9ca3af] hover:text-[#6b7280] transition-colors">
          <X size={18} />
        </button>

        <div className="mb-4">
          <p className="font-bold text-[#1a1a1a] text-lg">{info.name}</p>
          <p className="text-sm text-[#6b7280]">{info.rolle}</p>
        </div>

        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-xl">
            <Phone size={15} className="text-[#1D9E75] flex-shrink-0" />
            <span className="text-sm font-medium text-[#1a1a1a]">{info.telefon}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-xl">
            <Mail size={15} className="text-[#1D9E75] flex-shrink-0" />
            <span className="text-sm text-[#6b7280]">{email}</span>
          </div>
        </div>

        <div className="bg-[#E1F5EE] border border-[#1D9E75]/20 rounded-xl p-3 mb-5">
          <p className="text-xs text-[#0F6E56] leading-relaxed">
            Nenn ihnen bei der Kontaktaufnahme deinen Förderantrag (z.B. KfW 458) — so können sie dir direkt weiterhelfen.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={copyPhone}
            className={`flex-1 flex items-center justify-center gap-2 text-sm font-semibold border rounded-xl py-2.5 transition-all ${
              copied ? "bg-[#E1F5EE] text-[#1D9E75] border-[#1D9E75]/30" : "border-[#e5e7eb] text-[#6b7280] hover:border-[#1D9E75]/40"
            }`}
          >
            <Copy size={14} />
            {copied ? "Kopiert!" : "Nummer kopieren"}
          </button>
          <button
            onClick={onClose}
            className="zora-btn-primary flex-1 text-sm py-2.5 rounded-xl"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}

function Screen3({ programmes, onBack, onNext, onSkip }: {
  programmes: Foerderprogramm[];
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  const [contactModal, setContactModal] = useState<ContactModalInfo | null>(null);
  const needs = getNeedMap(programmes);

  const pflichtKeys = (Object.keys(needs) as PartnerKey[]).filter((k) => needs[k] && PARTNER_CONFIG[k].pflicht);
  const empfohlenKeys = (Object.keys(needs) as PartnerKey[]).filter((k) => needs[k] && !PARTNER_CONFIG[k].pflicht);

  return (
    <>
      {contactModal && <ContactModal info={contactModal} onClose={() => setContactModal(null)} />}

      <div>
        <div className="flex items-start gap-3 mb-1">
          <button onClick={onBack} className="text-[#6b7280] hover:text-[#1a1a1a] transition-colors mt-1">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "#0D1F1B", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Diese Partner brauchst du</h2>
            <p className="text-sm text-[#6b7280] mt-0.5">
              Manche Förderprogramme schreiben bestimmte Fachleute vor — ohne sie wird der Antrag abgelehnt.
            </p>
          </div>
        </div>

        <div className="space-y-6 mt-6 mb-6">
          {/* Pflicht-Partner */}
          {pflichtKeys.length > 0 && (
            <div>
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
                <AlertTriangle size={15} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700 font-medium">
                  Für deine Förderungen sind folgende Partner <strong>Pflicht</strong> — ohne sie wird dein Antrag abgelehnt.
                </p>
              </div>
              <div className="space-y-4">
                {pflichtKeys.map((k) => (
                  <PartnerCard key={k} partnerKey={k} programmes={programmes} onContact={setContactModal} />
                ))}
              </div>
            </div>
          )}

          {/* Empfohlene Partner */}
          {empfohlenKeys.length > 0 && (
            <div>
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
                <Lightbulb size={16} className="text-amber-500 flex-shrink-0" />
                <p className="text-sm text-amber-800 font-medium">
                  Diese Partner werden <strong>empfohlen</strong> — nicht verpflichtend, aber sinnvoll.
                </p>
              </div>
              <div className="space-y-4">
                {empfohlenKeys.map((k) => (
                  <PartnerCard key={k} partnerKey={k} programmes={programmes} onContact={setContactModal} />
                ))}
              </div>
            </div>
          )}

          {/* Timing hint */}
          <div className="bg-[#E1F5EE] border border-[#1D9E75]/30 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-[#1D9E75] flex-shrink-0" />
              <p className="font-semibold text-[#1a1a1a]">Wichtig: Die richtige Reihenfolge</p>
            </div>
            <ol className="space-y-2.5">
              {([
                <span key="s0">Zuerst: EEE beauftragen <ArrowRight size={12} className="inline" /> TPB-ID erhalten</span>,
                "Dann: Angebot vom Fachbetrieb einholen",
                "Dann: Förderantrag stellen",
                "Erst nach Förderzusage: Auftrag erteilen",
              ] as React.ReactNode[]).map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#374151]">
                  <span className="w-5 h-5 rounded-full bg-[#1D9E75] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <div className="mt-4 flex items-start gap-2 bg-white/60 rounded-lg px-3 py-2">
              <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 font-medium leading-snug">
                Wer vor dem Bescheid mit der Maßnahme beginnt, verliert die gesamte Förderung.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-[#6b7280] border border-[#e5e7eb] hover:border-[#1D9E75]/40 transition-colors px-4 py-3 rounded-xl"
          >
            <ChevronLeft size={16} /> Zurück
          </button>
          <button
            onClick={onNext}
            className="zora-btn-primary flex-1 flex items-center justify-center gap-2 text-sm px-4 py-3 rounded-xl"
          >
            Weiter zum Antrag <ChevronRight size={16} />
          </button>
        </div>
        <div className="text-center mt-3">
          <button onClick={onSkip} className="text-xs text-[#9ca3af] hover:text-[#6b7280] transition-colors">
            Später kümmern — direkt zum Antrag
          </button>
        </div>
      </div>
    </>
  );
}

// ── Screen 4: Application — delegated to Screen4Application component ──────

// ── Screen 5: Success ──────────────────────────────────────────────────────
function Screen5({ selectedIds, programmes, onRestart }: { selectedIds: string[]; programmes: Foerderprogramm[]; onRestart: () => void }) {
  const progs = programmes.filter((p) => selectedIds.includes(p.id));
  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 rounded-full bg-[#E1F5EE] flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-[#1D9E75]" />
      </div>
      <h2 className="text-2xl font-bold mb-3" style={{ color: "#0D1F1B", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Antrag erfolgreich exportiert!</h2>
      <p className="text-[#6b7280] mb-8 max-w-md mx-auto">
        Dein PDF wurde erstellt. Reiche ihn direkt bei {progs.map((p) => p.foerdergeber).join(" und ")} ein.
      </p>
      <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-6 mb-8 text-left max-w-lg mx-auto">
        <h3 className="font-semibold text-[#1a1a1a] mb-4">Nächste Schritte</h3>
        <div className="space-y-3">
          {["Antrag-PDF an Förderstelle einreichen", "EEE-Bestätigung einholen (vor Baubeginn!)", "Bankgespräch für KfW-Kredit vereinbaren", "Vorhaben starten — erst nach Bewilligung!"].map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#E1F5EE] text-[#1D9E75] text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
              <span className="text-sm text-[#6b7280]">{step}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={onRestart} className="flex items-center justify-center gap-2 text-sm font-semibold text-[#6b7280] border border-[#e5e7eb] hover:border-[#1D9E75]/40 transition-colors px-5 py-2.5 rounded-lg">
          <RotateCcw size={16} /> Neue Suche
        </button>
        <a href="/app/antraege" className="zora-btn-primary flex items-center justify-center gap-2 text-sm px-5 py-2.5">
          Zum Antrags-Tracking <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
}

// ── Validation ─────────────────────────────────────────────────────────────
function validateProfil(nutzertyp: Nutzertyp, profil: Profil): Record<string, string> {
  const errs: Record<string, string> = {};
  const req = (k: string, label: string) => { if (!profil[k]) errs[k] = `${label} ist erforderlich`; };

  if (nutzertyp === "privatperson") {
    req("vorname", "Vorname");
    req("plz", "PLZ / Ort");
    req("bundesland", "Bundesland");
    req("gebaeudetyp", "Gebäudetyp");
    req("eigentuemerOderMieter", "Eigentümer/Mieter");
    const desc = (profil.vorhabenBeschreibung as string) || "";
    if (!desc) errs.vorhabenBeschreibung = "Bitte beschreibe dein Vorhaben";
    else if (desc.length < 50) errs.vorhabenBeschreibung = `Mindestens 50 Zeichen (aktuell: ${desc.length})`;
  } else if (nutzertyp === "handwerker") {
    req("firmenname", "Firmenname");
    req("plz", "PLZ / Ort");
    req("bundesland", "Bundesland");
    req("branche", "Branche");
    req("rechtsform", "Rechtsform");
    req("mitarbeiter", "Mitarbeiterzahl");
    req("foerderungFuer", "Förderung für");
    const ff = profil.foerderungFuer as string;
    if (ff === "betrieb" || ff === "beides") {
      if (!profil.betriebBeschreibung) errs.betriebBeschreibung = "Betriebliches Vorhaben beschreiben";
    }
    if (ff === "kunden" || ff === "beides") {
      if (!profil.kundenprojektBeschreibung) errs.kundenprojektBeschreibung = "Kundenprojekt beschreiben";
    }
  } else if (nutzertyp === "kmu") {
    req("firmenname", "Firmenname");
    req("plz", "PLZ / Ort");
    req("bundesland", "Bundesland");
    req("branche", "Branche");
    req("rechtsform", "Rechtsform");
    req("mitarbeiter", "Mitarbeiterzahl");
    req("foerderthema", "Förderthema");
    const desc = (profil.kmuVorhabenBeschreibung as string) || "";
    if (!desc) errs.kmuVorhabenBeschreibung = "Bitte beschreibe dein Vorhaben";
    else if (desc.length < 80) errs.kmuVorhabenBeschreibung = `Mindestens 80 Zeichen (aktuell: ${desc.length})`;
  }
  return errs;
}

// ── Build API profil ───────────────────────────────────────────────────────
function buildApiProfil(nutzertyp: Nutzertyp, profil: Profil) {
  if (nutzertyp === "privatperson") {
    const vorhaben = [
      profil.vorhabenBeschreibung as string,
      (profil.vorhabenCheckboxes as string[])?.length ? `Geplante Maßnahmen: ${(profil.vorhabenCheckboxes as string[]).join(", ")}` : "",
      profil.gebaeudetyp ? `Gebäude: ${profil.gebaeudetyp}, Baujahr ${profil.baujahr || "unbekannt"}` : "",
      profil.haushaltseinkommen ? `Haushaltseinkommen: ${profil.haushaltseinkommen}` : "",
      profil.investitionssumme ? `Investition: ${profil.investitionssumme}` : "",
      profil.eigentuemerOderMieter === "Eigentümer" ? "Eigentümer" : "Mieter",
    ].filter(Boolean).join(". ");
    return { nutzertyp: "Privatperson", firmenname: (profil.vorname as string) || "Privatperson", rechtsform: "Privatperson", branche: "Privathaushalt", mitarbeiterzahl: "Privatperson", bundesland: (profil.bundesland as string) || "", jahresumsatz: "Privatperson", vorhaben };
  } else if (nutzertyp === "handwerker") {
    const ff = profil.foerderungFuer as string;
    const vorhaben = [
      ff === "kunden" || ff === "beides" ? (profil.kundenprojektBeschreibung as string) : "",
      ff === "betrieb" || ff === "beides" ? (profil.betriebBeschreibung as string) : "",
      (profil.leistungen as string[])?.length ? `Leistungen: ${(profil.leistungen as string[]).join(", ")}` : "",
      (profil.betriebVorhaben as string[])?.length ? `Betrieb: ${(profil.betriebVorhaben as string[]).join(", ")}` : "",
      profil.foerderungFuer ? `Förderung für: ${profil.foerderungFuer}` : "",
    ].filter(Boolean).join(". ");
    return { nutzertyp: "Handwerksbetrieb", firmenname: (profil.firmenname as string) || "", rechtsform: (profil.rechtsform as string) || "", branche: (profil.branche as string) || "", mitarbeiterzahl: (profil.mitarbeiter as string) || "", bundesland: (profil.bundesland as string) || "", jahresumsatz: (profil.jahresumsatz as string) || "", vorhaben };
  } else {
    const vorhaben = [
      profil.kmuVorhabenBeschreibung as string,
      profil.foerderthema ? `Förderthema: ${profil.foerderthema}` : "",
      profil.kmuInvestitionssumme ? `Investition: ${profil.kmuInvestitionssumme}` : "",
    ].filter(Boolean).join(". ");
    return { nutzertyp: "KMU/Unternehmen", firmenname: (profil.firmenname as string) || "", rechtsform: (profil.rechtsform as string) || "", branche: (profil.branche as string) || "", mitarbeiterzahl: (profil.mitarbeiter as string) || "", bundesland: (profil.bundesland as string) || "", jahresumsatz: (profil.jahresumsatz as string) || "", vorhaben };
  }
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function FoerderungenPage() {
  const [screen, setScreen] = useState<FlowScreen>("nutzertyp");
  const [nutzertyp, setNutzertyp] = useState<Nutzertyp>("");
  const [profil, setProfil] = useState<Profil>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [programmes, setProgrammes] = useState<Foerderprogramm[]>(FALLBACK_PROGRAMME);
  const [demoMode, setDemoMode] = useState(false);
  const [savedProgramsList, setSavedProgramsList] = useState<SavedProgram[]>([]);
  const [partnerShown, setPartnerShown] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // Load saved programs from Supabase on mount
  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;
    supabase
      .from("gespeicherte_programme")
      .select("programm_id, programm_name, programm_data")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (!data) return;
        setSavedProgramsList(data.map((row) => ({
          id: row.programm_id,
          name: row.programm_name,
          badge: (row.programm_data as Record<string, string>)?.badge ?? "",
          maxBetrag: (row.programm_data as Record<string, string>)?.maxBetrag ?? "",
          foerdergeber: (row.programm_data as Record<string, string>)?.foerdergeber ?? "",
        })));
      });
  }, [user]);

  const savedIds = useMemo(() => new Set(savedProgramsList.map((p) => p.id)), [savedProgramsList]);

  const toggleSave = useCallback(async (prog: Foerderprogramm) => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!isSupabaseConfigured) return;

    const exists = savedIds.has(prog.id);

    // Optimistic update
    setSavedProgramsList((prev) =>
      exists
        ? prev.filter((p) => p.id !== prog.id)
        : [...prev, { id: prog.id, name: prog.name, badge: prog.badge, maxBetrag: prog.maxBetrag, foerdergeber: prog.foerdergeber }]
    );

    if (exists) {
      await supabase
        .from("gespeicherte_programme")
        .delete()
        .eq("user_id", user.id)
        .eq("programm_id", prog.id);
    } else {
      await supabase.from("gespeicherte_programme").upsert({
        user_id: user.id,
        programm_id: prog.id,
        programm_name: prog.name,
        programm_data: { badge: prog.badge, maxBetrag: prog.maxBetrag, foerdergeber: prog.foerdergeber },
      }, { onConflict: "user_id,programm_id" });
    }
  }, [user, savedIds, router]);

  const go = useCallback((next: FlowScreen) => setScreen(next), []);
  const setField = useCallback((k: string, v: string | string[]) => {
    setProfil((p) => ({ ...p, [k]: v }));
    setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  }, []);

  useEffect(() => {
    if (screen !== "loading") return;
    const apiProfil = buildApiProfil(nutzertyp, profil);
    const minDelay = new Promise<void>((res) => setTimeout(res, 3000));
    const apiCall = fetch("/api/matching", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firmenprofil: apiProfil }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.matches?.length > 0) {
          const matches: Foerderprogramm[] = data.matches;
          setProgrammes(matches);
          setSelected(matches.map((m) => m.id));
        }
        if (data.demoMode) setDemoMode(true);
      })
      .catch(() => setDemoMode(true));

    Promise.all([minDelay, apiCall]).then(() => go("results"));
  }, [screen, go, nutzertyp, profil]);

  const handleProfileNext = () => {
    const errs = validateProfil(nutzertyp, profil);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setTimeout(() => document.querySelector("[data-field-error]")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
      return;
    }
    setErrors({});
    go("loading");
  };

  const toggleSelect = (id: string) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleResultsNext = useCallback(() => {
    const needs = getNeedMap(programmes);
    const anyNeeded = (Object.values(needs) as boolean[]).some(Boolean);
    if (anyNeeded) {
      setPartnerShown(true);
      go("partner");
    } else {
      setPartnerShown(false);
      go("application");
    }
  }, [programmes, go]);

  const displayName = nutzertyp === "privatperson" ? (profil.vorname as string) || "Privatperson" : (profil.firmenname as string) || "Antragsteller";
  const bundesland = (profil.bundesland as string) || "";

  const handleRestart = () => {
    setNutzertyp(""); setProfil({}); setErrors({}); setSelected(FALLBACK_PROGRAMME.map(p => p.id));
    setProgrammes(FALLBACK_PROGRAMME); setDemoMode(false); setPartnerShown(false);
    go("nutzertyp");
  };

  return (
    <div className="max-w-2xl mx-auto">
      {screen !== "success" && <FlowStepper current={STEP_MAP[screen]} />}

      {demoMode && screen !== "loading" && (
        <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4">
          <span className="font-semibold">Demo-Modus:</span>
          <span>Kein API-Schlüssel — Beispielergebnisse werden angezeigt.</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div key={screen} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>
            {screen === "nutzertyp" && <Screen0 nutzertyp={nutzertyp} onSelect={setNutzertyp} onNext={() => go("profile")} />}
            {screen === "profile" && nutzertyp === "privatperson" && <Screen1A profil={profil} onChange={setField} errors={errors} onBack={() => go("nutzertyp")} onNext={handleProfileNext} />}
            {screen === "profile" && nutzertyp === "handwerker" && <Screen1B profil={profil} onChange={setField} errors={errors} onBack={() => go("nutzertyp")} onNext={handleProfileNext} />}
            {screen === "profile" && nutzertyp === "kmu" && <Screen1C profil={profil} onChange={setField} errors={errors} onBack={() => go("nutzertyp")} onNext={handleProfileNext} />}
            {screen === "loading" && <Screen1b nutzertyp={nutzertyp} profil={profil} />}
            {screen === "results" && <Screen2 programmes={programmes} nutzertyp={nutzertyp} bundesland={bundesland} savedIds={savedIds} onSave={toggleSave} onBack={() => go("profile")} onNext={handleResultsNext} />}
            {screen === "partner" && <Screen3 programmes={programmes} onBack={() => go("results")} onNext={() => go("application")} onSkip={() => go("application")} />}
            {screen === "application" && <Screen4Application displayName={displayName} bundesland={bundesland} selectedIds={selected} programmes={programmes} onBack={() => go(partnerShown ? "partner" : "results")} onSuccess={() => go("success")} />}
            {screen === "success" && <Screen5 selectedIds={selected} programmes={programmes} onRestart={handleRestart} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
