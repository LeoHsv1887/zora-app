"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ChevronDown, ChevronUp, ExternalLink, FileText } from "lucide-react";

type Status = "In Bearbeitung" | "Bewilligt" | "Abgelehnt" | "Entwurf";

interface Antrag {
  id: number;
  programm: string;
  foerderstelle: string;
  betrag: string;
  status: Status;
  eingereicht: string;
  frist: string;
  fortschritt: number;
  zeitstrahl: { label: string; date: string; done: boolean }[];
}

const ANTRAEGE: Antrag[] = [
  {
    id: 1,
    programm: "BEG Einzelmaßnahmen (BAFA)",
    foerderstelle: "BAFA",
    betrag: "18.750 €",
    status: "In Bearbeitung",
    eingereicht: "12.01.2025",
    frist: "31.03.2025",
    fortschritt: 60,
    zeitstrahl: [
      { label: "Antrag eingereicht", date: "12.01.2025", done: true },
      { label: "Eingangsbestätigung", date: "15.01.2025", done: true },
      { label: "Technische Prüfung", date: "laufend", done: false },
      { label: "Bewilligungsbescheid", date: "erwartet: März 2025", done: false },
      { label: "Auszahlung", date: "nach Fertigstellung", done: false },
    ],
  },
  {
    id: 2,
    programm: "KfW 270 Erneuerbare Energien",
    foerderstelle: "KfW",
    betrag: "23.500 €",
    status: "Bewilligt",
    eingereicht: "05.11.2024",
    frist: "–",
    fortschritt: 100,
    zeitstrahl: [
      { label: "Antrag eingereicht", date: "05.11.2024", done: true },
      { label: "Bankgespräch", date: "10.11.2024", done: true },
      { label: "KfW-Prüfung", date: "18.11.2024", done: true },
      { label: "Bewilligungsbescheid", date: "22.11.2024", done: true },
      { label: "Auszahlung", date: "15.12.2024", done: true },
    ],
  },
  {
    id: 3,
    programm: "Digital Jetzt (BMWK)",
    foerderstelle: "BMWK",
    betrag: "5.250 €",
    status: "Entwurf",
    eingereicht: "–",
    frist: "28.02.2025",
    fortschritt: 20,
    zeitstrahl: [
      { label: "Antrag erstellt", date: "10.01.2025", done: true },
      { label: "Antrag einreichen", date: "ausstehend", done: false },
      { label: "Prüfung", date: "–", done: false },
      { label: "Bewilligungsbescheid", date: "–", done: false },
      { label: "Auszahlung", date: "–", done: false },
    ],
  },
  {
    id: 4,
    programm: "BAFA Heizungsförderung",
    foerderstelle: "BAFA",
    betrag: "12.300 €",
    status: "Abgelehnt",
    eingereicht: "03.09.2024",
    frist: "–",
    fortschritt: 0,
    zeitstrahl: [
      { label: "Antrag eingereicht", date: "03.09.2024", done: true },
      { label: "Prüfung", date: "15.09.2024", done: true },
      { label: "Ablehnungsbescheid", date: "01.10.2024", done: true },
      { label: "Widerspruch möglich bis", date: "01.11.2024", done: false },
    ],
  },
  {
    id: 5,
    programm: "NBank Niedersachsen Gewerbekredit",
    foerderstelle: "NBank",
    betrag: "75.000 €",
    status: "In Bearbeitung",
    eingereicht: "20.01.2025",
    frist: "–",
    fortschritt: 35,
    zeitstrahl: [
      { label: "Antrag eingereicht", date: "20.01.2025", done: true },
      { label: "Bankprüfung", date: "laufend", done: false },
      { label: "NBank-Entscheidung", date: "erwartet: Feb. 2025", done: false },
      { label: "Kreditauszahlung", date: "–", done: false },
    ],
  },
];

const STATUS_STYLES: Record<Status, React.CSSProperties> = {
  "In Bearbeitung": { background: "#FAEEDA", color: "#854F0B" },
  Bewilligt: { background: "#E1F5EE", color: "#0F6E56" },
  Abgelehnt: { background: "#FEE2E2", color: "#991B1B" },
  Entwurf: { background: "#F1F5F4", color: "#6B7F7A" },
};

const TABS: { key: "alle" | Status; label: string }[] = [
  { key: "alle", label: "Alle" },
  { key: "In Bearbeitung", label: "In Bearbeitung" },
  { key: "Bewilligt", label: "Bewilligt" },
  { key: "Abgelehnt", label: "Abgelehnt" },
  { key: "Entwurf", label: "Entwürfe" },
];

export default function AntraegePage() {
  const [tab, setTab] = useState<"alle" | Status>("alle");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = tab === "alle" ? ANTRAEGE : ANTRAEGE.filter((a) => a.status === tab);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: "#0D1F1B", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Deine Anträge & ihr Status</h2>
        <p className="text-sm" style={{ color: "#6B7F7A" }}>{ANTRAEGE.length} Anträge gesamt · {ANTRAEGE.filter((a) => a.status === "Bewilligt").length} bewilligt</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg w-fit" style={{ background: "#F1F5F4" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${tab === t.key ? "bg-white shadow-sm" : "hover:text-[#0D1F1B]"}`}
            style={{ color: tab === t.key ? "#0D1F1B" : "#6B7F7A" }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #E2EAE8", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b text-xs font-semibold uppercase tracking-wide" style={{ background: "#F8FAFB", borderColor: "#E2EAE8", color: "#6B7F7A" }}>
          <span>Programm</span>
          <span>Betrag</span>
          <span>Status</span>
          <span>Eingereicht</span>
          <span>Frist</span>
          <span>Aktionen</span>
        </div>

        <div className="divide-y" style={{ borderColor: "#F1F5F4" }}>
          {filtered.map((a) => (
            <div key={a.id}>
              {/* Row */}
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-3 md:gap-4 items-center">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "#0D1F1B" }}>{a.programm}</p>
                    <p className="text-xs" style={{ color: "#6B7F7A" }}>{a.foerderstelle}</p>
                  </div>
                  <span className="font-bold text-sm" style={{ color: "#0D1F1B" }}>{a.betrag}</span>
                  <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full w-fit" style={STATUS_STYLES[a.status]}>
                    {a.status}
                  </span>
                  <span className="text-sm" style={{ color: "#6B7F7A" }}>{a.eingereicht}</span>
                  <span className="text-sm" style={{ color: a.frist !== "–" && a.status !== "Bewilligt" ? "#854F0B" : "#6B7F7A", fontWeight: a.frist !== "–" && a.status !== "Bewilligt" ? 600 : 400 }}>
                    {a.frist}
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg text-[#6B7F7A] hover:text-[#1D9E75] transition-colors hover:bg-[#F1F5F4]" title="PDF herunterladen">
                      <Download size={15} />
                    </button>
                    <button
                      onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                      className="p-1.5 rounded-lg text-[#6B7F7A] hover:text-[#0D1F1B] transition-colors hover:bg-[#F1F5F4]"
                    >
                      {expanded === a.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                  </div>
                </div>

                {/* Progress */}
                {a.status !== "Abgelehnt" && (
                  <div className="mt-3 h-1 rounded-full" style={{ background: "#F1F5F4" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${a.fortschritt}%`,
                        background: a.fortschritt === 100 ? "linear-gradient(90deg, #1D9E75, #2ECC9A)" : "#F59E0B",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Expanded detail */}
              <AnimatePresence>
                {expanded === a.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 border-t" style={{ background: "#F8FAFB", borderColor: "#E2EAE8" }}>
                      <h4 className="text-sm font-bold mt-5 mb-4" style={{ color: "#0D1F1B", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Antragsverlauf</h4>
                      <div className="relative pl-5">
                        <div className="absolute left-2 top-1 bottom-1 w-px" style={{ background: "#E2EAE8" }} />
                        {a.zeitstrahl.map((z, idx) => (
                          <div key={idx} className="relative mb-4 last:mb-0">
                            <div className="absolute -left-5 top-0.5 w-3.5 h-3.5 rounded-full border-2" style={z.done ? { background: "#1D9E75", borderColor: "#1D9E75" } : { background: "white", borderColor: "#E2EAE8" }} />
                            <p className="text-sm font-medium" style={{ color: z.done ? "#0D1F1B" : "#6B7F7A" }}>{z.label}</p>
                            <p className="text-xs" style={{ color: "#6B7F7A" }}>{z.date}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
