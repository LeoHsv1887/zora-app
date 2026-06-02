"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  Circle,
  AlertCircle,
  Clock,
  TrendingUp,
  FileText,
  ChevronRight,
  PenLine,
  Bookmark,
} from "lucide-react";
import { ALL_WIZARD_CONFIGS, WIZARD_ROUTES } from "@/lib/wizardConfigs";

// ── Saved Programs Detection ───────────────────────────────────────────────
interface SavedProgram {
  id: string;
  name: string;
  badge: string;
  maxBetrag: string;
  foerdergeber: string;
}

function useSavedPrograms(): SavedProgram[] {
  const [saved, setSaved] = useState<SavedProgram[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("zora-saved-programs");
      if (raw) setSaved(JSON.parse(raw));
    } catch {}
  }, []);
  return saved;
}

// ── Draft Wizard Detection ─────────────────────────────────────────────────
interface WizardDraft {
  programmId: string;
  programmName: string;
  updatedAt: number;
  stepCount: number;
}

function useWizardDrafts(): WizardDraft[] {
  const [drafts, setDrafts] = useState<WizardDraft[]>([]);
  useEffect(() => {
    const found: WizardDraft[] = [];
    Object.entries(ALL_WIZARD_CONFIGS).forEach(([id, config]) => {
      try {
        const raw = localStorage.getItem(`antrag_wizard_${id}`);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (!parsed.values || Object.keys(parsed.values).length === 0) return;
        found.push({
          programmId: id,
          programmName: config.programmName,
          updatedAt: parsed.updatedAt || Date.now(),
          stepCount: Object.keys(parsed.values).length,
        });
      } catch {}
    });
    found.sort((a, b) => b.updatedAt - a.updatedAt);
    setDrafts(found);
  }, []);
  return drafts;
}

// ── Animated Counter ───────────────────────────────────────────────────────
function AnimatedNumber({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 50;
    const increment = target / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      if (step >= steps) {
        setCurrent(target);
        clearInterval(timer);
      } else {
        setCurrent(Math.floor(increment * step));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {prefix}
      {current.toLocaleString("de-DE")}
      {suffix}
    </span>
  );
}

// ── Data ───────────────────────────────────────────────────────────────────
const ANTRAEGE = [
  {
    id: 1,
    name: "BEG Einzelmaßnahmen (BAFA)",
    status: "In Bearbeitung",
    statusColor: "bg-amber-100 text-amber-700",
    betrag: "18.750 €",
    eingereicht: "12.01.2025",
    frist: "31.03.2025",
    fortschritt: 60,
  },
  {
    id: 2,
    name: "KfW 270 Erneuerbare Energien",
    status: "Bewilligt",
    statusColor: "bg-green-100 text-green-700",
    betrag: "23.500 €",
    eingereicht: "05.11.2024",
    frist: "–",
    fortschritt: 100,
  },
  {
    id: 3,
    name: "Digital Jetzt (BMWK)",
    status: "Entwurf",
    statusColor: "bg-gray-100 text-gray-600",
    betrag: "5.250 €",
    eingereicht: "–",
    frist: "28.02.2025",
    fortschritt: 20,
  },
];

const TASKS = [
  { id: 1, text: "EEE für BEG-Antrag kontaktieren", done: false, urgent: false },
  { id: 2, text: "Verwendungsnachweis bis 30.06. einreichen", done: false, urgent: true },
  { id: 3, text: "3 Handwerker-Angebote einholen", done: false, urgent: false },
  { id: 4, text: "KfW 270 Banktermin vereinbaren", done: false, urgent: false },
  { id: 5, text: "Energieausweis hochladen", done: true, urgent: false },
];

const EMPFEHLUNGEN = [
  { id: "bafa-heizung", name: "BAFA Heizungsförderung", badge: "Zuschuss", betrag: "bis 35%", passung: 91 },
  { id: "nbank", name: "NBank Niedersachsen", badge: "Kredit", betrag: "ab 1,5% p.a.", passung: 83 },
  { id: "ego-start", name: "EGO.-Start NBank", badge: "Zuschuss", betrag: "bis 2.500 €", passung: 76 },
  { id: "thg-quote", name: "THG-Quote Elektrofahrzeuge", badge: "Prämie", betrag: "~400 €/Jahr", passung: 72 },
];

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Guten Morgen";
  if (hour >= 12 && hour < 17) return "Guten Mittag";
  if (hour >= 17 && hour < 22) return "Guten Abend";
  return "Gute Nacht";
}

function getTodayFormatted() {
  return new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState(TASKS);
  const wizardDrafts = useWizardDrafts();
  const savedPrograms = useSavedPrograms();

  const toggleTask = (id: number) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-6xl mx-auto space-y-6">
      {/* Greeting */}
      <motion.div variants={fadeUp}>
        <h2 className="text-2xl font-bold" style={{ color: "#0D1F1B", fontFamily: "'Bricolage Grotesque', sans-serif" }}>{getGreeting()}, Leonard!</h2>
        <p className="mt-1" style={{ color: "#6B7F7A" }}>
          {getTodayFormatted()} &middot; Du hast{" "}
          <span className="text-[#f59e0b] font-semibold">2 offene Anträge</span> und{" "}
          <span className="text-[#1D9E75] font-semibold">3 neue Fördermöglichkeiten</span>.
        </p>
      </motion.div>

      {/* KPIs */}
      <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Potenzielle Förderung", value: 47500, prefix: "", suffix: " €", numColor: "#0F6E56", icon: TrendingUp, iconBg: "bg-[#E1F5EE]", iconColor: "text-[#1D9E75]" },
          { label: "Aktive Anträge", value: 2, prefix: "", suffix: "", numColor: "#0D1F1B", icon: FileText, iconBg: "bg-blue-50", iconColor: "text-blue-500" },
          { label: "Bewilligte Anträge", value: 1, prefix: "", suffix: "", numColor: "#0D1F1B", icon: CheckCircle, iconBg: "bg-[#E1F5EE]", iconColor: "text-[#1D9E75]" },
          { label: "Gesparte Honorare", value: 3200, prefix: "~", suffix: " €", numColor: "#0D1F1B", icon: TrendingUp, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
        ].map((kpi) => (
          <motion.div
            key={kpi.label}
            variants={fadeUp}
            className="bg-white rounded-xl p-5 transition-all duration-200 cursor-default"
            style={{ border: "1px solid #E2EAE8", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(29,158,117,0.12)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-[13px] font-medium" style={{ color: "#6B7F7A" }}>{kpi.label}</p>
              <div className={`w-8 h-8 rounded-lg ${kpi.iconBg} flex items-center justify-center`}>
                <kpi.icon size={15} className={kpi.iconColor} />
              </div>
            </div>
            <p className="text-[28px] font-bold" style={{ color: kpi.numColor, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              <AnimatedNumber target={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} />
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Search Entry */}
      <motion.div variants={fadeUp}>
        <Link
          href="/app/foerderungen/suche"
          className="flex items-center gap-3 bg-white rounded-xl px-5 py-3.5 transition-all group"
          style={{ border: "1px solid #E2EAE8", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px rgba(29,158,117,0.12)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
        >
          <div className="w-8 h-8 rounded-lg bg-[#E1F5EE] flex items-center justify-center flex-shrink-0 group-hover:bg-[#1D9E75]/10 transition-colors">
            <svg className="w-4 h-4 text-[#1D9E75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#1a1a1a] leading-tight">
              Direkt nach einem Programm suchen
            </p>
            <p className="text-xs text-[#9ca3af] mt-0.5">
              KfW 458, BEG EM, Digital Jetzt und 100+ weitere Programme
            </p>
          </div>
          <ChevronRight size={16} className="text-[#9ca3af] group-hover:text-[#1D9E75] transition-colors flex-shrink-0" />
        </Link>
      </motion.div>

      {/* Two col */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Anträge */}
        <motion.div variants={fadeUp} className="lg:col-span-2 bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #E2EAE8", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #E2EAE8" }}>
            <h3 className="font-bold text-[#0D1F1B]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Meine Anträge</h3>
            <Link href="/app/antraege" className="text-xs text-[#1D9E75] font-medium hover:underline flex items-center gap-1">
              Alle anzeigen <ChevronRight size={12} />
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: "#F1F5F4" }}>
            {ANTRAEGE.map((a) => (
              <div key={a.id} className="px-6 py-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#0D1F1B" }}>{a.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#6B7F7A" }}>
                      {a.eingereicht !== "–" ? `Eingereicht: ${a.eingereicht}` : "Noch nicht eingereicht"}
                      {a.frist !== "–" && ` · Frist: ${a.frist}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={
                      a.status === "Bewilligt" ? { background: "#E1F5EE", color: "#0F6E56" } :
                      a.status === "In Bearbeitung" ? { background: "#FAEEDA", color: "#854F0B" } :
                      { background: "#F1F5F4", color: "#6B7F7A" }
                    }>
                      {a.status}
                    </span>
                    <span className="text-sm font-bold" style={{ color: "#0D1F1B" }}>{a.betrag}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#F1F5F4" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${a.fortschritt}%`,
                      background: a.fortschritt === 100 ? "linear-gradient(90deg, #1D9E75, #2ECC9A)" : a.fortschritt >= 50 ? "#F59E0B" : "#D1D5DB",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tasks */}
        <motion.div variants={fadeUp} className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #E2EAE8", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
          <div className="px-5 py-4" style={{ borderBottom: "1px solid #E2EAE8" }}>
            <h3 className="font-bold" style={{ color: "#0D1F1B", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Nächste Schritte</h3>
          </div>
          <div className="px-5 py-3 space-y-1">
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="w-full flex items-start gap-3 py-2.5 text-left group"
              >
                {task.done ? (
                  <CheckCircle size={17} className="text-[#1D9E75] flex-shrink-0 mt-0.5" />
                ) : task.urgent ? (
                  <AlertCircle size={17} className="text-red-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle size={17} className="text-[#d1d5db] flex-shrink-0 mt-0.5 group-hover:text-[#9ca3af] transition-colors" />
                )}
                <span className={`text-sm leading-snug ${task.done ? "line-through text-[#9ca3af]" : task.urgent ? "text-red-600 font-medium" : "text-[#1a1a1a]"}`}>
                  {task.text}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Wizard Drafts */}
      {wizardDrafts.length > 0 && (
        <motion.div variants={fadeUp} className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #E2EAE8", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #E2EAE8" }}>
            <div className="flex items-center gap-2">
              <PenLine size={16} className="text-[#1D9E75]" />
              <h3 className="font-bold" style={{ color: "#0D1F1B", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Angefangene Anträge</h3>
            </div>
            <span className="text-xs" style={{ color: "#6B7F7A" }}>{wizardDrafts.length} Entwurf{wizardDrafts.length !== 1 ? "e" : ""}</span>
          </div>
          <div className="divide-y" style={{ borderColor: "#F1F5F4" }}>
            {wizardDrafts.map((draft) => (
              <div key={draft.programmId} className="px-6 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#0D1F1B" }}>{draft.programmName}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#6B7F7A" }}>
                    {draft.stepCount} Felder ausgefüllt &middot; Zuletzt geändert {new Date(draft.updatedAt).toLocaleDateString("de-DE")}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#F1F5F4", color: "#6B7F7A" }}>Entwurf</span>
                  <Link
                    href={`/app/antrag/${draft.programmId}`}
                    className="text-xs font-semibold text-[#1D9E75] hover:text-[#0F6E56] flex items-center gap-1 transition-colors"
                  >
                    Weiter ausfüllen <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Gespeicherte Förderungen */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #E2EAE8", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #E2EAE8" }}>
          <div className="flex items-center gap-2">
            <Bookmark size={16} className="text-[#1D9E75]" />
            <h3 className="font-bold" style={{ color: "#0D1F1B", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Gespeicherte Förderungen</h3>
          </div>
          <span className="text-xs" style={{ color: "#6B7F7A" }}>{savedPrograms.length} gespeichert</span>
        </div>
        {savedPrograms.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-sm" style={{ color: "#6B7F7A" }}>Noch keine Förderungen gespeichert</p>
            <Link href="/app/foerderungen" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#1D9E75] hover:underline">
              Jetzt Suche starten <ArrowRight size={11} />
            </Link>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "#F1F5F4" }}>
            {savedPrograms.map((prog) => {
              const badgeStyles: Record<string, React.CSSProperties> = {
                Zuschuss: { background: "#E1F5EE", color: "#0F6E56" },
                Kredit: { background: "#E6F1FB", color: "#185FA5" },
              };
              const badgeStyle = badgeStyles[prog.badge] ?? { background: "#F1F5F4", color: "#6B7F7A" };
              const wizardRoute = WIZARD_ROUTES[prog.id];
              return (
                <div key={prog.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold" style={{ color: "#0D1F1B" }}>{prog.name}</p>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={badgeStyle}>{prog.badge}</span>
                    </div>
                    <p className="text-xs" style={{ color: "#6B7F7A" }}>{prog.foerdergeber} · Max. {prog.maxBetrag}</p>
                  </div>
                  {wizardRoute ? (
                    <Link
                      href={wizardRoute}
                      className="text-xs font-semibold text-[#1D9E75] hover:text-[#0F6E56] flex items-center gap-1 transition-colors flex-shrink-0"
                    >
                      Antrag starten <ArrowRight size={12} />
                    </Link>
                  ) : (
                    <Link
                      href="/app/foerderungen"
                      className="text-xs font-semibold text-[#6b7280] hover:text-[#1a1a1a] flex items-center gap-1 transition-colors flex-shrink-0"
                    >
                      Details <ChevronRight size={12} />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Empfehlungen */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #E2EAE8", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #E2EAE8" }}>
          <div>
            <h3 className="font-bold" style={{ color: "#0D1F1B", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Empfohlene Förderungen</h3>
            <p className="text-xs mt-0.5" style={{ color: "#6B7F7A" }}>Basierend auf deinem Profil</p>
          </div>
          <Link href="/app/foerderungen" className="text-xs text-[#1D9E75] font-medium hover:underline flex items-center gap-1">
            Alle finden <ChevronRight size={12} />
          </Link>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {EMPFEHLUNGEN.map((p) => (
              <div key={p.id} className="rounded-xl p-4 transition-all duration-200" style={{ border: "1px solid #E2EAE8", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(29,158,117,0.12)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#F1F5F4", color: "#6B7F7A" }}>
                    {p.badge}
                  </span>
                  <span className="text-xs font-bold text-[#1D9E75]">{p.passung}%</span>
                </div>
                <p className="text-sm font-semibold mb-1 leading-tight" style={{ color: "#0D1F1B" }}>{p.name}</p>
                <p className="text-sm mb-4" style={{ color: "#6B7F7A" }}>{p.betrag}</p>
                <div className="h-1 rounded-full mb-3" style={{ background: "#F1F5F4" }}>
                  <div className="h-full rounded-full" style={{ width: `${p.passung}%`, background: "linear-gradient(90deg, #1D9E75, #2ECC9A)" }} />
                </div>
                <Link
                  href="/app/foerderungen"
                  className="text-xs font-semibold text-[#1D9E75] hover:underline flex items-center gap-1"
                >
                  Jetzt beantragen <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
