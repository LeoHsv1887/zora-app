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
  Loader2,
} from "lucide-react";
import { ALL_WIZARD_CONFIGS, WIZARD_ROUTES } from "@/lib/wizardConfigs";
import { useAuth, supabase } from "@/contexts/AuthContext";
import { isSupabaseConfigured } from "@/lib/supabase";

// ── Types ──────────────────────────────────────────────────────────────────
interface SavedProgram {
  id: string;
  name: string;
  badge: string;
  maxBetrag: string;
  foerdergeber: string;
}

interface DbAntrag {
  id: string;
  programm_name: string;
  status: string;
  foerderbetrag_beantragt: number | null;
  created_at: string;
  updated_at: string;
}

interface WizardDraft {
  programmId: string;
  programmName: string;
  updatedAt: number;
  stepCount: number;
}

// ── Wizard Drafts (localStorage) ───────────────────────────────────────────
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

// ── Skeleton ───────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[#E2EAE8] rounded ${className}`} />;
}

// ── Animated Counter ───────────────────────────────────────────────────────
function AnimatedNumber({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const steps = 50;
    const increment = target / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      if (step >= steps) { setCurrent(target); clearInterval(timer); }
      else setCurrent(Math.floor(increment * step));
    }, 1200 / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{prefix}{current.toLocaleString("de-DE")}{suffix}</span>;
}

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Guten Morgen";
  if (h >= 12 && h < 17) return "Guten Mittag";
  if (h >= 17 && h < 22) return "Guten Abend";
  return "Gute Nacht";
}

function getTodayFormatted() {
  return new Date().toLocaleDateString("de-DE", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function getStatusStyle(status: string) {
  switch (status) {
    case "bewilligt": return { background: "#E1F5EE", color: "#0F6E56" };
    case "in_bearbeitung": return { background: "#FAEEDA", color: "#854F0B" };
    case "eingereicht": return { background: "#E6F1FB", color: "#185FA5" };
    case "abgelehnt": return { background: "#FCEBEB", color: "#A32D2D" };
    default: return { background: "#F1F5F4", color: "#6B7F7A" };
  }
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    entwurf: "Entwurf",
    in_bearbeitung: "In Bearbeitung",
    eingereicht: "Eingereicht",
    bewilligt: "Bewilligt",
    abgelehnt: "Abgelehnt",
  };
  return map[status] ?? status;
}

const STATIC_TASKS = [
  { id: 1, text: "EEE für BEG-Antrag kontaktieren", done: false, urgent: false },
  { id: 2, text: "Verwendungsnachweis bis 30.06. einreichen", done: false, urgent: true },
  { id: 3, text: "3 Handwerker-Angebote einholen", done: false, urgent: false },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const wizardDrafts = useWizardDrafts();

  const [antraege, setAntraege] = useState<DbAntrag[]>([]);
  const [savedPrograms, setSavedPrograms] = useState<SavedProgram[]>([]);
  const [loadingAntraege, setLoadingAntraege] = useState(true);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [tasks, setTasks] = useState(STATIC_TASKS);

  const displayName = user?.user_metadata?.vorname
    ? user.user_metadata.vorname
    : user?.email?.split("@")[0] ?? "dort";

  useEffect(() => {
    if (!user || !isSupabaseConfigured) {
      setLoadingAntraege(false);
      setLoadingSaved(false);
      return;
    }

    // Load Anträge
    supabase
      .from("antraege")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        setAntraege(data ?? []);
        setLoadingAntraege(false);
      });

    // Load saved programs
    supabase
      .from("gespeicherte_programme")
      .select("programm_id, programm_name, programm_data")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const mapped: SavedProgram[] = (data ?? []).map((row) => ({
          id: row.programm_id,
          name: row.programm_name,
          badge: (row.programm_data as Record<string, string>)?.badge ?? "",
          maxBetrag: (row.programm_data as Record<string, string>)?.maxBetrag ?? "",
          foerdergeber: (row.programm_data as Record<string, string>)?.foerdergeber ?? "",
        }));
        setSavedPrograms(mapped);
        setLoadingSaved(false);
      });
  }, [user]);

  const activeCount = antraege.filter((a) => ["in_bearbeitung", "eingereicht"].includes(a.status)).length;
  const approvedCount = antraege.filter((a) => a.status === "bewilligt").length;
  const totalPotential = antraege
    .filter((a) => a.foerderbetrag_beantragt)
    .reduce((sum, a) => sum + (a.foerderbetrag_beantragt ?? 0), 0);

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-6xl mx-auto space-y-6">
      {/* Greeting */}
      <motion.div variants={fadeUp}>
        <h2 className="text-2xl font-bold" style={{ color: "#0D1F1B", fontFamily: "'Bricolage Grotesque', sans-serif" }}>
          {getGreeting()}, {displayName}!
        </h2>
        <p className="mt-1" style={{ color: "#6B7F7A" }}>
          {getTodayFormatted()} &middot;{" "}
          {loadingAntraege ? (
            <span className="inline-block"><Skeleton className="inline-block w-32 h-4" /></span>
          ) : activeCount > 0 ? (
            <>Du hast <span className="text-[#f59e0b] font-semibold">{activeCount} offene{activeCount !== 1 && "n"} Antrag{activeCount !== 1 && "strang"}</span> und {" "}
            <span className="text-[#1D9E75] font-semibold">{savedPrograms.length} gespeicherte Förderung{savedPrograms.length !== 1 && "en"}</span>.</>
          ) : (
            <>Starte jetzt deine erste Fördersuche.</>
          )}
        </p>
      </motion.div>

      {/* KPIs */}
      <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Potenzielle Förderung",
            value: loadingAntraege ? null : (totalPotential || 0),
            prefix: "", suffix: " €",
            numColor: "#0F6E56", icon: TrendingUp, iconBg: "bg-[#E1F5EE]", iconColor: "text-[#1D9E75]",
          },
          {
            label: "Aktive Anträge",
            value: loadingAntraege ? null : activeCount,
            prefix: "", suffix: "",
            numColor: "#0D1F1B", icon: FileText, iconBg: "bg-blue-50", iconColor: "text-blue-500",
          },
          {
            label: "Bewilligte Anträge",
            value: loadingAntraege ? null : approvedCount,
            prefix: "", suffix: "",
            numColor: "#0D1F1B", icon: CheckCircle, iconBg: "bg-[#E1F5EE]", iconColor: "text-[#1D9E75]",
          },
          {
            label: "Gesparte Honorare",
            value: loadingAntraege ? null : (antraege.length * 800),
            prefix: "~", suffix: " €",
            numColor: "#0D1F1B", icon: TrendingUp, iconBg: "bg-amber-50", iconColor: "text-amber-500",
          },
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
            {kpi.value === null ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-[28px] font-bold" style={{ color: kpi.numColor, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                <AnimatedNumber target={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} />
              </p>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Search */}
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
            <p className="text-sm font-semibold text-[#1a1a1a] leading-tight">Direkt nach einem Programm suchen</p>
            <p className="text-xs text-[#9ca3af] mt-0.5">KfW 458, BEG EM, Digital Jetzt und 100+ weitere Programme</p>
          </div>
          <ChevronRight size={16} className="text-[#9ca3af] group-hover:text-[#1D9E75] transition-colors flex-shrink-0" />
        </Link>
      </motion.div>

      {/* Anträge + Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Anträge */}
        <motion.div variants={fadeUp} className="lg:col-span-2 bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #E2EAE8", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #E2EAE8" }}>
            <h3 className="font-bold text-[#0D1F1B]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Meine Anträge</h3>
            <Link href="/app/antraege" className="text-xs text-[#1D9E75] font-medium hover:underline flex items-center gap-1">
              Alle anzeigen <ChevronRight size={12} />
            </Link>
          </div>
          {loadingAntraege ? (
            <div className="px-6 py-5 space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-1.5 w-full" />
                </div>
              ))}
            </div>
          ) : antraege.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <FileText size={32} className="text-[#d1d5db] mx-auto mb-3" />
              <p className="text-sm font-medium text-[#6b7280]">Noch keine Anträge</p>
              <Link href="/app/foerderungen" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#1D9E75] hover:underline">
                Jetzt Förderung finden <ArrowRight size={11} />
              </Link>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "#F1F5F4" }}>
              {antraege.map((a) => {
                const fortschritt = a.status === "bewilligt" ? 100 : a.status === "eingereicht" ? 70 : a.status === "in_bearbeitung" ? 45 : 20;
                return (
                  <div key={a.id} className="px-6 py-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#0D1F1B" }}>{a.programm_name}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#6B7F7A" }}>
                          {new Date(a.created_at).toLocaleDateString("de-DE")}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={getStatusStyle(a.status)}>
                          {getStatusLabel(a.status)}
                        </span>
                        {a.foerderbetrag_beantragt && (
                          <span className="text-sm font-bold" style={{ color: "#0D1F1B" }}>
                            {a.foerderbetrag_beantragt.toLocaleString("de-DE")} €
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#F1F5F4" }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${fortschritt}%`,
                          background: fortschritt === 100 ? "linear-gradient(90deg, #1D9E75, #2ECC9A)" : fortschritt >= 50 ? "#F59E0B" : "#D1D5DB",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
                onClick={() => setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)))}
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
                    {draft.stepCount} Felder ausgefüllt &middot; Zuletzt {new Date(draft.updatedAt).toLocaleDateString("de-DE")}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#F1F5F4", color: "#6B7F7A" }}>Entwurf</span>
                  <Link href={`/app/antrag/${draft.programmId}`} className="text-xs font-semibold text-[#1D9E75] hover:text-[#0F6E56] flex items-center gap-1 transition-colors">
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
          {!loadingSaved && (
            <span className="text-xs" style={{ color: "#6B7F7A" }}>{savedPrograms.length} gespeichert</span>
          )}
        </div>
        {loadingSaved ? (
          <div className="px-6 py-5 space-y-3">
            {[1, 2].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : savedPrograms.length === 0 ? (
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
                      {prog.badge && <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={badgeStyle}>{prog.badge}</span>}
                    </div>
                    <p className="text-xs" style={{ color: "#6B7F7A" }}>{prog.foerdergeber}{prog.maxBetrag && ` · Max. ${prog.maxBetrag}`}</p>
                  </div>
                  {wizardRoute ? (
                    <Link href={wizardRoute} className="text-xs font-semibold text-[#1D9E75] hover:text-[#0F6E56] flex items-center gap-1 transition-colors flex-shrink-0">
                      Antrag starten <ArrowRight size={12} />
                    </Link>
                  ) : (
                    <Link href="/app/foerderungen" className="text-xs font-semibold text-[#6b7280] hover:text-[#1a1a1a] flex items-center gap-1 transition-colors flex-shrink-0">
                      Details <ChevronRight size={12} />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
