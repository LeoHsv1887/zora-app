"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ZoraLogo } from "@/components/ZoraLogo";
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import {
  Search,
  FileText,
  Users,
  BarChart3,
  Bell,
  AlertTriangle,
  Zap,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  Star,
  Clock,
  Shield,
  Play,
  ChevronUp,
  MapPin,
  Building2,
  Home,
  FlaskConical,
  Hammer,
  ExternalLink,
} from "lucide-react";

// ── Animation Variants ─────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.45, ease: "easeOut" } },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

// ── Counter Hook ───────────────────────────────────────────────────────────
function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return { count, ref };
}

// ── Topbar ─────────────────────────────────────────────────────────────────
function Topbar() {
  return (
    <div className="bg-[#E1F5EE] border-b border-[#1D9E75]/20 h-9 flex items-center px-4 sm:px-6">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <a href="#" className="text-xs sm:text-sm text-[#1D9E75] font-semibold hover:underline flex items-center gap-1 truncate">
          <span className="hidden sm:inline">Neu: Zora unterstützt jetzt auch Privatpersonen bei BEG-Anträgen</span>
          <span className="sm:hidden">Neu: BEG für Privatpersonen</span>
          <ArrowRight size={13} />
        </a>
        <div className="flex items-center gap-4 flex-shrink-0">
          <span />
          <Link href="/app/dashboard" className="text-xs font-semibold text-white bg-[#1D9E75] hover:bg-[#0F6E56] transition-colors px-3 py-1 rounded-md">
            Kostenlos testen
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Mega Dropdown ──────────────────────────────────────────────────────────
const FEATURES_DROPDOWN = [
  { icon: Search, title: "KI-Fördermatching", desc: "2.500+ Programme in Sekunden" },
  { icon: FileText, title: "Antragsgenerator", desc: "KI schreibt den Antrag vor" },
  { icon: Users, title: "Partner-Vermittlung", desc: "EEE & Handwerker in der Nähe" },
  { icon: BarChart3, title: "Programm-Steckbriefe", desc: "Alle Details auf einen Blick" },
  { icon: Bell, title: "Status-Tracking", desc: "Bis zur Auszahlung begleitet" },
  { icon: TrendingUp, title: "Profil & Dokumente", desc: "Alles gespeichert und archiviert" },
];
const AUDIENCE_DROPDOWN = [
  { icon: Hammer, title: "Handwerk & Energie", desc: "SHK, Elektro, Dach, Solar", color: "text-[#1D9E75]" },
  { icon: Building2, title: "KMU & Unternehmen", desc: "Digitalisierung & Investitionen", color: "text-blue-600" },
  { icon: Home, title: "Privatpersonen", desc: "Sanierung & Wärmepumpe", color: "text-amber-600" },
  { icon: FlaskConical, title: "Forschung & Innovation", desc: "ZIM, Horizon Europe", color: "text-purple-600" },
];

function DropdownMenu({ items, type }: { items: typeof FEATURES_DROPDOWN; type: "features" | "audience" }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white border border-[#e5e7eb] rounded-2xl shadow-2xl shadow-black/10 p-5 z-50 w-[520px]">
      <div className={`grid ${type === "features" ? "grid-cols-2" : "grid-cols-2"} gap-2`}>
        {items.map((item) => (
          <a key={item.title} href="#" className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#f9fafb] transition-colors group">
            <div className={`w-9 h-9 rounded-lg bg-[#E1F5EE] flex items-center justify-center flex-shrink-0 group-hover:bg-[#1D9E75] transition-colors`}>
              <item.icon size={16} className={`${"color" in item ? item.color : "text-[#1D9E75]"} group-hover:text-white transition-colors`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1a1a1a]">{item.title}</p>
              <p className="text-xs text-[#6b7280]">{"desc" in item ? item.desc : ""}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navItems = [
    { label: "Funktionen", href: "#features", dropdown: "features" },
    { label: "So funktionierts", href: "#so-funktionierts", dropdown: null },
    { label: "Für wen", href: "#fuer-wen", dropdown: "audience" },
    { label: "Neuigkeiten", href: "/app/neuigkeiten", dropdown: null },
    { label: "Preise", href: "#preise", dropdown: null },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[#e5e7eb]" : "bg-white border-b border-[#e5e7eb]"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <ZoraLogo href="/" />

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.dropdown && setActiveDropdown(item.dropdown)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a
                href={item.href}
                className="flex items-center gap-1 text-sm font-medium text-[#6b7280] hover:text-[#1a1a1a] transition-colors px-3 py-2 rounded-lg hover:bg-[#f9fafb]"
              >
                {item.label}
                {item.dropdown && <ChevronDown size={13} className={`transition-transform ${activeDropdown === item.dropdown ? "rotate-180" : ""}`} />}
              </a>
              {item.dropdown === "features" && activeDropdown === "features" && (
                <DropdownMenu items={FEATURES_DROPDOWN} type="features" />
              )}
              {item.dropdown === "audience" && activeDropdown === "audience" && (
                <DropdownMenu items={AUDIENCE_DROPDOWN} type="audience" />
              )}
            </div>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/app/dashboard" className="text-sm font-medium text-[#6b7280] hover:text-[#1a1a1a] transition-colors px-3 py-2">
            Anmelden
          </Link>
          <Link href="/app/dashboard" className="text-sm font-semibold text-white bg-[#1D9E75] hover:bg-[#0F6E56] transition-colors px-4 py-2 rounded-lg shadow-sm shadow-[#1D9E75]/25">
            14 Tage kostenlos testen
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden p-2 rounded-lg hover:bg-[#f9fafb]" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-[#e5e7eb] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} className="block py-2.5 px-3 text-sm font-medium text-[#6b7280] hover:text-[#1a1a1a] hover:bg-[#f9fafb] rounded-lg transition-colors">
                  {item.label}
                </a>
              ))}
              <div className="pt-3 space-y-2">
                <Link href="/app/dashboard" className="block text-center py-2.5 px-4 text-sm font-medium text-[#6b7280] border border-[#e5e7eb] rounded-lg">
                  Anmelden
                </Link>
                <Link href="/app/dashboard" className="block text-center py-2.5 px-4 text-sm font-semibold text-white bg-[#1D9E75] rounded-lg">
                  14 Tage kostenlos testen
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ── Hero Dashboard Mockup ──────────────────────────────────────────────────
function HeroDashboardMockup() {
  return (
    <div className="relative w-full max-w-4xl mx-auto mt-16">
      {/* Floating card top right */}
      <motion.div
        initial={{ opacity: 0, x: 30, rotate: 3 }}
        animate={{ opacity: 1, x: 0, rotate: 3 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute -top-5 -right-4 sm:right-4 z-20 bg-[#1D9E75] text-white rounded-2xl shadow-xl px-4 py-3 text-left w-52"
      >
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle size={14} className="text-[#E1F5EE]" />
          <span className="text-xs font-semibold text-[#E1F5EE]">Antrag bewilligt</span>
        </div>
        <p className="text-lg font-bold">24.500 €</p>
        <p className="text-xs text-[#E1F5EE]">BEG Einzelmaßnahmen · BAFA</p>
      </motion.div>

      {/* Floating card bottom left */}
      <motion.div
        initial={{ opacity: 0, x: -30, rotate: -2 }}
        animate={{ opacity: 1, x: 0, rotate: -2 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="absolute -bottom-5 -left-4 sm:left-4 z-20 bg-white border border-[#e5e7eb] rounded-2xl shadow-xl px-4 py-3 text-left w-48"
      >
        <p className="text-xs font-semibold text-[#6b7280] mb-2">Passung gefunden</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
            <div className="h-full w-[96%] bg-[#1D9E75] rounded-full" />
          </div>
          <span className="text-sm font-bold text-[#1D9E75]">96%</span>
        </div>
        <p className="text-xs text-[#6b7280] mt-1">KfW 270 Erneuerbare Energien</p>
      </motion.div>

      {/* Browser frame */}
      <div className="bg-white rounded-2xl shadow-2xl border border-[#e5e7eb] overflow-hidden">
        {/* Browser bar */}
        <div className="bg-[#f9fafb] border-b border-[#e5e7eb] px-4 py-3 flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 bg-white border border-[#e5e7eb] rounded-md px-3 py-1.5 text-xs text-[#9ca3af] flex items-center gap-2">
            <Shield size={10} className="text-[#1D9E75]" />
            app.zora.de/dashboard
          </div>
          <div className="hidden sm:flex gap-1">
            {[1, 2, 3].map((i) => <div key={i} className="w-8 h-2 bg-[#e5e7eb] rounded-full" />)}
          </div>
        </div>

        {/* App layout */}
        <div className="flex" style={{ height: "420px" }}>
          {/* Sidebar */}
          <div className="w-52 bg-[#1D9E75] flex flex-col py-5 px-3 gap-1 hidden sm:flex flex-shrink-0">
            <div className="flex items-center gap-2.5 px-3 py-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-white" />
              </div>
              <span className="text-white font-bold text-base">Zora</span>
            </div>
            {[
              { icon: BarChart3, label: "Dashboard", active: true },
              { icon: Search, label: "Förderungen" },
              { icon: FileText, label: "Anträge" },
              { icon: Users, label: "Partner" },
              { icon: Bell, label: "Dokumente" },
            ].map(({ icon: Icon, label, active }) => (
              <div key={label} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors ${active ? "bg-white/20" : "hover:bg-white/10"}`}>
                <Icon size={15} className="text-white/90" />
                <span className={`text-sm font-medium ${active ? "text-white" : "text-white/70"}`}>{label}</span>
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 bg-[#f9fafb] p-5 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-[#6b7280]">Guten Morgen,</p>
                <p className="text-sm font-bold text-[#1a1a1a]">Max Mustermann 👋</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E1F5EE] flex items-center justify-center">
                  <span className="text-xs font-bold text-[#1D9E75]">MM</span>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {[
                { label: "Potenzielle Förderung", value: "47.500 €", color: "text-[#1D9E75]", bg: "bg-[#E1F5EE]" },
                { label: "Aktive Anträge", value: "3", color: "text-[#1a1a1a]", bg: "bg-white" },
                { label: "Abgeschlossen", value: "2", color: "text-[#1a1a1a]", bg: "bg-white" },
              ].map((kpi) => (
                <div key={kpi.label} className={`${kpi.bg} rounded-xl p-3 border border-[#e5e7eb]`}>
                  <p className="text-[9px] text-[#6b7280] mb-1 leading-tight">{kpi.label}</p>
                  <p className={`text-base font-bold ${kpi.color}`}>{kpi.value}</p>
                </div>
              ))}
            </div>

            {/* Programs */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-3 mb-3">
              <p className="text-[10px] font-semibold text-[#1a1a1a] mb-2.5">Aktuelle Förderprogramme</p>
              <div className="space-y-2">
                {[
                  { name: "BEG Einzelmaßnahmen (BAFA)", amount: "24.500 €", status: "Bewilligt", badge: "bg-[#E1F5EE] text-[#1D9E75]" },
                  { name: "KfW 270 Erneuerbare Energien", amount: "15.000 €", status: "In Bearbeitung", badge: "bg-amber-50 text-amber-700" },
                  { name: "BAFA Heizungsförderung", amount: "8.000 €", status: "Neu", badge: "bg-blue-50 text-blue-700" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between py-1.5 border-b border-[#f3f4f6] last:border-0">
                    <div>
                      <p className="text-[9px] font-medium text-[#1a1a1a] leading-tight">{item.name}</p>
                      <p className="text-[9px] text-[#6b7280]">{item.amount}</p>
                    </div>
                    <span className={`text-[8px] font-semibold px-2 py-0.5 rounded-full ${item.badge}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Match result */}
            <div className="bg-white rounded-xl border border-[#1D9E75]/30 p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Zap size={10} className="text-[#1D9E75]" />
                <p className="text-[9px] font-semibold text-[#1D9E75]">KI-Matching Ergebnis</p>
              </div>
              <p className="text-[9px] text-[#6b7280]">12 passende Programme gefunden · Höchste Passung: 96%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Förder-Rechner ─────────────────────────────────────────────────────────

const VORHABEN_CARDS = [
  { id: "heizung", emoji: "🔥", title: "Heizung tauschen", sub: "Wärmepumpe, Pellet, Solar" },
  { id: "pv", emoji: "☀️", title: "PV-Anlage", sub: "Photovoltaik + Speicher" },
  { id: "daemmung", emoji: "🏠", title: "Dämmung & Fenster", sub: "Fassade, Dach, Fenster" },
  { id: "kombination", emoji: "⚡", title: "Mehreres kombinieren", sub: "Maximale Förderung" },
] as const;

type VorhabenId = (typeof VORHABEN_CARDS)[number]["id"];

interface FoerderResult {
  total: number;
  grundFoerderung: number;
  klimaBonus: number;
  kombinationsBonus: number;
  foerdersatz: string;
}

function calcFoerderung(vorhaben: VorhabenId, investition: number): FoerderResult {
  switch (vorhaben) {
    case "heizung": {
      const grund = Math.min(investition * 0.3, 30000);
      const klima = Math.min(investition * 0.2, 12000);
      const total = Math.min(grund + klima, 30000);
      return { total, grundFoerderung: grund, klimaBonus: klima, kombinationsBonus: 0, foerdersatz: "30–70%" };
    }
    case "pv": {
      const kredit = Math.min(investition, 75000);
      const speicher = investition * 0.1;
      return { total: kredit + speicher, grundFoerderung: kredit, klimaBonus: speicher, kombinationsBonus: 0, foerdersatz: "Günstiger Kredit + Einspeisevergütung" };
    }
    case "daemmung": {
      const foerderfaehig = Math.min(investition, 60000);
      const grund = foerderfaehig * 0.15;
      const isfp = foerderfaehig * 0.05;
      return { total: grund + isfp, grundFoerderung: grund, klimaBonus: 0, kombinationsBonus: isfp, foerdersatz: "15–20%" };
    }
    case "kombination": {
      const heizGrund = Math.min(investition * 0.35, 25000);
      const klimaBonus = Math.min(investition * 0.15, 12000);
      const komboBonus = Math.min(investition * 0.05, 5000);
      const total = Math.min(heizGrund + klimaBonus + komboBonus, 42000);
      return { total, grundFoerderung: heizGrund, klimaBonus, kombinationsBonus: komboBonus, foerdersatz: "bis zu 70% auf einzelne Maßnahmen" };
    }
  }
}

function FoerderRechner() {
  const [selected, setSelected] = useState<VorhabenId | null>(null);
  const [investition, setInvestition] = useState(35000);
  const [displayAmount, setDisplayAmount] = useState(0);
  const displayRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const result = selected ? calcFoerderung(selected, investition) : null;
  const targetAmount = result?.total ?? 0;

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    displayRef.current = 0;
    setDisplayAmount(0);
  }, [selected]);

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
      const next = current + diff * 0.12;
      displayRef.current = next;
      setDisplayAmount(Math.round(next));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [targetAmount]);

  const fmt = (n: number) => Math.round(n).toLocaleString("de-DE") + " €";
  const sliderPct = ((investition - 5000) / 95000) * 100;

  return (
    <section className="py-20 px-4 sm:px-6 bg-[#f9fafb]">
      <div className="max-w-[800px] mx-auto">
        <AnimatedSection className="text-center mb-10">
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black text-[#1a1a1a] mb-3">
            Was könnte dir Zora bringen?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#6b7280] text-lg">
            Berechne in Sekunden dein persönliches Förderpotenzial — ohne Anmeldung.
          </motion.p>
        </AnimatedSection>

        <AnimatedSection>
          <motion.p variants={fadeUp} className="text-sm font-semibold text-[#1D9E75] uppercase tracking-widest mb-4">
            Schritt 1 — Vorhaben wählen
          </motion.p>
          <motion.div variants={stagger} className="grid grid-cols-2 gap-3 sm:gap-4">
            {VORHABEN_CARDS.map((v) => (
              <motion.button
                key={v.id}
                variants={fadeUp}
                onClick={() => setSelected(selected === v.id ? null : v.id)}
                className={`relative flex flex-col items-start gap-2 p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                  selected === v.id
                    ? "border-[#1D9E75] bg-[#E1F5EE] shadow-md shadow-[#1D9E75]/10"
                    : "border-[#e5e7eb] bg-white hover:border-[#1D9E75]/40"
                }`}
              >
                {selected === v.id && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#1D9E75] flex items-center justify-center">
                    <CheckCircle size={12} className="text-white" />
                  </span>
                )}
                <span className="text-2xl">{v.emoji}</span>
                <div>
                  <p className={`font-bold text-sm sm:text-base ${selected === v.id ? "text-[#1D9E75]" : "text-[#1a1a1a]"}`}>{v.title}</p>
                  <p className="text-xs text-[#6b7280] mt-0.5">{v.sub}</p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </AnimatedSection>

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35 }}
              className="mt-8"
            >
              <p className="text-sm font-semibold text-[#1D9E75] uppercase tracking-widest mb-4">
                Schritt 2 — Investitionssumme
              </p>
              <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-sm">
                <p className="text-2xl font-black text-[#1a1a1a] mb-5 text-center">
                  Investition: {investition.toLocaleString("de-DE")} €
                </p>
                <input
                  type="range"
                  min={5000}
                  max={100000}
                  step={1000}
                  value={investition}
                  onChange={(e) => setInvestition(Number(e.target.value))}
                  className="w-full h-2 appearance-none rounded-full cursor-pointer"
                  style={{
                    accentColor: "#1D9E75",
                    background: `linear-gradient(to right, #1D9E75 ${sliderPct}%, #e5e7eb ${sliderPct}%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-[#9ca3af] mt-2">
                  <span>5.000 €</span>
                  <span>100.000 €</span>
                </div>
              </div>

              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-5 bg-[#E1F5EE] border-2 border-[#1D9E75]/30 rounded-2xl p-7"
                >
                  <p className="text-[#1D9E75] font-semibold text-sm mb-3 text-center">Ihr möglicher Förderbetrag:</p>
                  <p className="text-center font-black text-[#1D9E75] mb-6" style={{ fontSize: "3rem", lineHeight: 1.1 }}>
                    {fmt(displayAmount)}
                  </p>
                  <div className="space-y-2.5 border-t border-[#1D9E75]/20 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#374151]">Grundförderung:</span>
                      <span className="font-semibold text-[#1a1a1a]">{fmt(result.grundFoerderung)}</span>
                    </div>
                    {result.klimaBonus > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#374151]">
                          {selected === "pv" ? "BAFA Speicherförderung:" : "Klimabonus:"}
                        </span>
                        <span className="font-semibold text-[#1a1a1a]">{fmt(result.klimaBonus)}</span>
                      </div>
                    )}
                    {result.kombinationsBonus > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#374151]">
                          {selected === "daemmung" ? "iSFP Bonus:" : "Kombinationsbonus:"}
                        </span>
                        <span className="font-semibold text-[#1a1a1a]">{fmt(result.kombinationsBonus)}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#1D9E75]/20">
                    <p className="text-sm text-center text-[#1D9E75] font-semibold">
                      Fördersatz: {result.foerdersatz}
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="mt-6 text-center">
                <Link
                  href="/app/foerderungen"
                  className="inline-flex items-center gap-2 text-base font-bold text-white bg-[#1D9E75] hover:bg-[#0F6E56] transition-all px-8 py-4 rounded-xl shadow-lg shadow-[#1D9E75]/25 hover:-translate-y-0.5"
                >
                  Meine genaue Förderung berechnen <ArrowRight size={18} />
                </Link>
                <p className="text-sm text-[#9ca3af] mt-3">Kostenlos · Keine Anmeldung nötig · In 5 Minuten</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ── Activity Ticker ────────────────────────────────────────────────────────
const AKTIVITAETEN = [
  { text: "Klaus M. aus Hamburg hat gerade 14.500 € BEG-Förderung gefunden", zeit: "vor 2 Min." },
  { text: "SHK-Betrieb Müller hat 3 Anträge für Kunden vorbereitet", zeit: "vor 5 Min." },
  { text: "Sandra K. aus München hat 21.000 € Heizungsförderung beantragt", zeit: "vor 8 Min." },
  { text: "Elektro Schneider GmbH hat KfW 270 für 5 Kunden gefunden", zeit: "vor 12 Min." },
  { text: "Familie Weber aus Berlin hat 18.400 € Förderpotenzial entdeckt", zeit: "vor 15 Min." },
  { text: "Dachdeckerei Hoffmann nutzt Zora jetzt für alle Kundenprojekte", zeit: "vor 19 Min." },
  { text: "Maria L. aus Köln hat Digital Jetzt Antrag in 8 Minuten vorbereitet", zeit: "vor 23 Min." },
  { text: "Thomas B. aus Stuttgart hat 9.200 € PV-Förderung gefunden", zeit: "vor 28 Min." },
  { text: "Heizungsbau Krause empfiehlt Zora jetzt allen seinen Kunden", zeit: "vor 31 Min." },
  { text: "Anna S. aus Frankfurt hat BEG Antrag ohne Berater gestellt", zeit: "vor 35 Min." },
];

function ActivityTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % AKTIVITAETEN.length), 4000);
    return () => clearInterval(t);
  }, []);
  const item = AKTIVITAETEN[idx];
  return (
    <div
      className="flex items-center px-4 sm:px-6 overflow-hidden"
      style={{ height: "36px", background: "#F0FBF7", borderBottom: "1px solid #C8EFE0" }}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between w-full gap-4 text-[13px] min-w-0"
          >
            <span className="flex items-center gap-2 min-w-0">
              <span className="text-[#1D9E75] font-bold flex-shrink-0">✓</span>
              <span className="text-[#6b7280] truncate">{item.text}</span>
            </span>
            <span className="text-[#9ca3af] flex-shrink-0 hidden sm:block whitespace-nowrap">{item.zeit}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Social Proof Stats ─────────────────────────────────────────────────────
function SozialproofStats() {
  const s1 = useCounter(8420, 2000);
  const s2 = useCounter(142, 2000);
  const s3 = useCounter(49, 2000);
  const s4 = useCounter(5, 1200);
  return (
    <section className="py-16 px-4 sm:px-6 bg-[#1D9E75]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          <div ref={s1.ref} className="text-center">
            <p className="text-4xl sm:text-5xl font-black text-white mb-2 tabular-nums">
              {s1.count.toLocaleString("de-DE")}+
            </p>
            <p className="text-[#E1F5EE] text-sm font-medium max-w-[160px] mx-auto leading-snug">Aktive Nutzer</p>
          </div>
          <div ref={s2.ref} className="text-center">
            <p className="text-4xl sm:text-5xl font-black text-white mb-2 tabular-nums">
              {s2.count} Mio. €
            </p>
            <p className="text-[#E1F5EE] text-sm font-medium max-w-[160px] mx-auto leading-snug">Vermittelte Fördergelder</p>
          </div>
          <div ref={s3.ref} className="text-center">
            <p className="text-4xl sm:text-5xl font-black text-white mb-2 tabular-nums">
              {(s3.count / 10).toFixed(1).replace(".", ",")}/5
            </p>
            <p className="text-[#E1F5EE] text-sm font-medium max-w-[160px] mx-auto leading-snug">Sterne Bewertung</p>
          </div>
          <div ref={s4.ref} className="text-center">
            <p className="text-4xl sm:text-5xl font-black text-white mb-2 tabular-nums">
              {"< "}{s4.count} Min.
            </p>
            <p className="text-[#E1F5EE] text-sm font-medium max-w-[160px] mx-auto leading-snug">Bis zum fertigen Antrag</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 2: Logo Strip ──────────────────────────────────────────────────
function LogoStrip() {
  const logos = ["Müller SHK GmbH", "Bauer Elektro", "Schmidt Dach", "TechBau GmbH", "Grün & Partner", "Energiebau Nord"];
  return (
    <section className="py-12 bg-[#f9fafb] border-y border-[#e5e7eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="text-center text-sm font-medium text-[#9ca3af] mb-8">Vertraut von über 10.000 Betrieben und Privatpersonen</p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          {logos.map((name) => (
            <div key={name} className="px-5 py-2.5 bg-white border border-[#e5e7eb] rounded-xl text-sm font-semibold text-[#c4c9d4] hover:text-[#9ca3af] transition-colors cursor-pointer shadow-sm">
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 3: Problem ─────────────────────────────────────────────────────
const PROBLEMS = [
  {
    icon: BarChart3,
    title: "Unüberschaubare Komplexität",
    text: "Über 2.500 Förderprogramme auf EU-, Bundes- und Länderebene — jedes mit eigenen Bedingungen, Fristen und Formularen. Ohne Fachkenntnis ist es nahezu unmöglich das richtige Programm zu finden.",
    stat: "~40% der Fördergelder bleiben ungenutzt",
  },
  {
    icon: AlertTriangle,
    title: "Beratung ist teuer und langsam",
    text: "Ein professioneller Fördermittelberater kostet zwischen 2.000 und 10.000 Euro pro Antrag und braucht oft Wochen. Für KMU und Privatpersonen ist das schlicht nicht erschwinglich.",
    stat: "Ø 6 Wochen Bearbeitungszeit beim Berater",
  },
  {
    icon: Clock,
    title: "Kritische Fehler kosten alles",
    text: "Wer die Maßnahme vor dem Bescheid startet, verliert die gesamte Förderung. Wer den falschen EEE beauftragt oder Fristen verpasst, scheitert. Diese Regeln kennt kaum jemand.",
    stat: "Häufigster Ablehnungsgrund: falsches Timing",
  },
];

// ── Section 4: Solution Tabs ───────────────────────────────────────────────
const SOLUTION_TABS = [
  {
    title: "KI-Fördermatching",
    icon: Search,
    desc: "Beschreibe dein Vorhaben in eigenen Worten. Zoras KI durchsucht alle 2.500+ Programme und liefert eine priorisierte Liste mit Passung, Betrag und Frist in Sekunden.",
    mockup: "matching",
  },
  {
    title: "Programm-Steckbriefe",
    icon: FileText,
    desc: "Jedes Förderprogramm hat eigene Regeln. Zora weiß wann du was tun musst — EEE, Handwerker, Fristen, Dokumente. Alles programmspezifisch aufbereitet.",
    mockup: "steckbrief",
  },
  {
    title: "KI-Antragsgenerator",
    icon: Zap,
    desc: "Zora füllt den Antrag automatisch vor. Die KI schreibt die Projektbeschreibung auf Basis deines Profils. Ein Klick — fertig als PDF zum Einreichen.",
    mockup: "antrag",
  },
  {
    title: "Partner-Vermittlung",
    icon: Users,
    desc: "Zugelassene Energieeffizienz-Experten und qualifizierte Handwerksbetriebe in deiner Nähe — mit Bewertungen, Verfügbarkeit und direkter Kontaktmöglichkeit.",
    mockup: "partner",
  },
  {
    title: "Tracking bis Auszahlung",
    icon: TrendingUp,
    desc: "Zora begleitet dich bis das Geld auf dem Konto ist. Fristen, Verwendungsnachweise, Erinnerungen — alles automatisch, nichts vergessen.",
    mockup: "tracking",
  },
];

function SolutionMockup({ type }: { type: string }) {
  if (type === "matching") return (
    <div className="p-6 space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={14} className="text-[#1D9E75]" />
        <span className="text-xs font-semibold text-[#1D9E75]">KI-Analyse abgeschlossen · 12 Treffer</span>
      </div>
      {[
        { name: "BEG Einzelmaßnahmen (BAFA)", match: 96, amount: "bis 24.500 €", badge: "bg-[#E1F5EE] text-[#1D9E75]" },
        { name: "KfW 270 Erneuerbare Energien", match: 88, amount: "bis 15.000 €", badge: "bg-[#E1F5EE] text-[#1D9E75]" },
        { name: "BAFA Heizungsförderung", match: 82, amount: "bis 8.000 €", badge: "bg-amber-50 text-amber-700" },
        { name: "Landesförderung Bayern (LfA)", match: 71, amount: "bis 5.000 €", badge: "bg-blue-50 text-blue-700" },
      ].map((item) => (
        <div key={item.name} className="bg-white rounded-xl border border-[#e5e7eb] p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-[#1D9E75]">{item.match}%</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#1a1a1a] truncate">{item.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 bg-[#e5e7eb] rounded-full overflow-hidden">
                <div className="h-full bg-[#1D9E75] rounded-full" style={{ width: `${item.match}%` }} />
              </div>
              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${item.badge}`}>{item.amount}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (type === "antrag") return (
    <div className="p-6 space-y-3">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-[#1a1a1a]">Antrag generieren</span>
        <span className="text-[9px] bg-[#E1F5EE] text-[#1D9E75] px-2 py-1 rounded-full font-semibold">KI-gestützt</span>
      </div>
      {["Projektbeschreibung", "Kostenaufstellung", "Firmenangaben", "Technische Details", "Unterschrift"].map((field, i) => (
        <div key={field} className="flex items-center gap-3">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${i < 4 ? "bg-[#1D9E75]" : "bg-[#e5e7eb]"}`}>
            {i < 4 ? <CheckCircle size={11} className="text-white" /> : <span className="w-2 h-2 rounded-full bg-[#9ca3af]" />}
          </div>
          <div className={`flex-1 h-2.5 rounded-lg ${i < 4 ? "bg-[#E1F5EE]" : "bg-[#e5e7eb]"}`} />
          <span className={`text-[9px] font-medium ${i < 4 ? "text-[#1D9E75]" : "text-[#9ca3af]"}`}>{i < 4 ? "Fertig" : "Ausstehend"}</span>
        </div>
      ))}
      <button className="w-full mt-4 bg-[#1D9E75] text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2">
        <FileText size={12} /> Als PDF exportieren
      </button>
    </div>
  );

  if (type === "partner") return (
    <div className="p-6 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <MapPin size={12} className="text-[#1D9E75]" />
        <span className="text-xs font-semibold text-[#1a1a1a]">Partner in deiner Nähe</span>
      </div>
      {[
        { name: "Energieberatung Schmidt", type: "Zugelassener EEE", dist: "2,3 km", stars: 5 },
        { name: "ThermoTech GmbH", type: "SHK-Betrieb", dist: "4,1 km", stars: 5 },
        { name: "Solar & Wärme Müller", type: "Installateur", dist: "7,8 km", stars: 4 },
      ].map((p) => (
        <div key={p.name} className="bg-white border border-[#e5e7eb] rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#E1F5EE] flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#1D9E75]">
            {p.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#1a1a1a] truncate">{p.name}</p>
            <p className="text-[9px] text-[#6b7280]">{p.type} · {p.dist}</p>
            <div className="flex gap-0.5 mt-0.5">
              {[...Array(p.stars)].map((_, i) => <Star key={i} size={8} className="text-amber-400 fill-amber-400" />)}
            </div>
          </div>
          <button className="text-[9px] font-semibold text-[#1D9E75] border border-[#1D9E75]/30 px-2 py-1 rounded-lg hover:bg-[#E1F5EE] transition-colors flex-shrink-0">Anfragen</button>
        </div>
      ))}
    </div>
  );

  // Default mockup for tracking / steckbrief
  return (
    <div className="p-6 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={14} className="text-[#1D9E75]" />
        <span className="text-xs font-semibold text-[#1a1a1a]">BEG Antrag · Status-Tracking</span>
      </div>
      {[
        { label: "Antrag eingereicht", date: "12.02.2025", done: true },
        { label: "Bestätigung BAFA", date: "15.02.2025", done: true },
        { label: "Maßnahme freigegeben", date: "18.02.2025", done: true },
        { label: "Verwendungsnachweis fällig", date: "30.06.2025", done: false },
        { label: "Auszahlung erwartet", date: "15.07.2025", done: false },
      ].map((step, i) => (
        <div key={step.label} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? "bg-[#1D9E75]" : "bg-[#e5e7eb]"}`}>
              {step.done ? <CheckCircle size={11} className="text-white" /> : <span className="w-2 h-2 rounded-full bg-[#9ca3af]" />}
            </div>
            {i < 4 && <div className={`w-0.5 h-5 mt-0.5 ${step.done ? "bg-[#1D9E75]" : "bg-[#e5e7eb]"}`} />}
          </div>
          <div className="pb-2">
            <p className={`text-xs font-medium ${step.done ? "text-[#1a1a1a]" : "text-[#9ca3af]"}`}>{step.label}</p>
            <p className="text-[9px] text-[#9ca3af]">{step.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Counter Component ──────────────────────────────────────────────────────
function CounterCard({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { count, ref } = useCounter(target);
  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl sm:text-5xl font-black text-white mb-2">
        {target >= 1000 ? count.toLocaleString("de") : count}{suffix}
      </p>
      <p className="text-[#E1F5EE] text-sm font-medium max-w-[160px] mx-auto leading-snug">{label}</p>
    </div>
  );
}

// ── Section 7: Audiences ───────────────────────────────────────────────────
const AUDIENCES = [
  {
    icon: Hammer,
    bg: "bg-[#E1F5EE]",
    border: "border-[#1D9E75]/30",
    badge: "bg-[#1D9E75] text-white",
    iconBg: "bg-[#1D9E75]",
    title: "Handwerk & Erneuerbare Energien",
    phase: "Phase 1 · Jetzt verfügbar",
    text: "SHK-Betriebe, Elektriker, Dachdecker — Zora findet BEG, BAFA und KfW-Programme für dein nächstes Installationsprojekt.",
    programs: ["BEG Einzelmaßnahmen", "BAFA Heizungsförderung", "KfW 270"],
    btnLabel: "Jetzt starten →",
    btnClass: "bg-[#1D9E75] text-white hover:bg-[#0F6E56]",
  },
  {
    icon: Building2,
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    iconBg: "bg-blue-600",
    title: "KMU & Unternehmen",
    phase: "Phase 2 · Demnächst",
    text: "Digitalisierung, Ausbildung, Investitionen — über 3,5 Mio. KMU in Deutschland haben Anspruch auf Förderungen die sie nie beantragen.",
    programs: ["Digital Jetzt", "KfW Unternehmerkredit", "BAFA Beratungsförderung"],
    btnLabel: "Mehr erfahren →",
    btnClass: "bg-blue-600 text-white hover:bg-blue-700",
  },
  {
    icon: Home,
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    iconBg: "bg-amber-500",
    title: "Privatpersonen & Bauen",
    phase: "Phase 3 · In Planung",
    text: "Eigenheim sanieren, Wärmepumpe einbauen, PV-Anlage installieren — Zora erklärt dir welche Förderungen du bekommst und was du tun musst.",
    programs: ["BEG Wohngebäude", "KfW 261", "Klimabonus"],
    btnLabel: "Vormerken →",
    btnClass: "bg-amber-500 text-white hover:bg-amber-600",
  },
  {
    icon: FlaskConical,
    bg: "bg-purple-50",
    border: "border-purple-200",
    badge: "bg-purple-100 text-purple-700",
    iconBg: "bg-purple-600",
    title: "Forschung & Innovation",
    phase: "Phase 4 · In Planung",
    text: "ZIM, Forschungszulage, Horizon Europe — Zora bereitet auch komplexe Forschungsförderungen vor und begleitet dich durch den Prozess.",
    programs: ["ZIM", "Forschungszulage", "Horizon Europe"],
    btnLabel: "Vormerken →",
    btnClass: "bg-purple-600 text-white hover:bg-purple-700",
  },
];

// ── Section 8: Timeline Steps ──────────────────────────────────────────────
const TIMELINE_STEPS = [
  {
    num: 1,
    title: "Firmenprofil anlegen",
    text: "Gib Branche, Rechtsform, Standort und dein Vorhaben ein. Zora speichert alle Daten für zukünftige Anträge automatisch — einmalig anlegen, immer davon profitieren.",
  },
  {
    num: 2,
    title: "KI-Matching in Sekunden",
    text: "Zoras KI analysiert dein Profil und durchsucht alle 2.500+ Programme. Du bekommst eine priorisierte Liste mit Passung, Betrag und Frist — in unter 10 Sekunden.",
  },
  {
    num: 3,
    title: "Partner finden",
    text: "Für BEG-Anträge brauchst du einen zugelassenen Energieeffizienz-Experten. Zora zeigt dir geprüfte Partner in deiner Nähe — mit Bewertungen und direkter Kontaktmöglichkeit.",
  },
  {
    num: 4,
    title: "Antrag vorbereiten & einreichen",
    text: "Zora füllt alle Formulare vor, schreibt die Projektbeschreibung und exportiert alles als PDF. Du prüfst, unterschreibst und reichst ein — in weniger als 20 Minuten.",
  },
  {
    num: 5,
    title: "Tracking bis zur Auszahlung",
    text: "Nach der Einreichung begleitet Zora dich: Bescheid-Datum, Freigabe für Maßnahmenbeginn, Verwendungsnachweis-Frist. Alles automatisch, nichts vergessen.",
  },
];

// ── Section 9: Testimonials ────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    initials: "KM",
    color: "bg-[#E1F5EE] text-[#1D9E75]",
    name: "Klaus M.",
    role: "Inhaber",
    company: "Müller Haustechnik GmbH",
    text: "Als SHK-Betrieb haben wir jahrelang Fördermittel liegen gelassen weil der Prozess zu komplex war. Mit Zora haben wir in einer Stunde drei BEG-Anträge für unsere Kunden vorbereitet. Das hat unser Angebot komplett verändert — die Kunden fragen jetzt aktiv nach.",
  },
  {
    initials: "SK",
    color: "bg-amber-100 text-amber-700",
    name: "Sandra K.",
    role: "Eigenheimbesitzerin",
    company: "",
    text: "Ich hatte keine Ahnung dass ich für meine Wärmepumpe bis zu 70% Förderung bekommen kann. Zora hat mir in 5 Minuten erklärt welche Programme passen und was ich tun muss. Der Antrag war nach 20 Minuten fertig — bewilligt in 4 Wochen.",
  },
  {
    initials: "ML",
    color: "bg-purple-100 text-purple-700",
    name: "Maria L.",
    role: "Gründerin",
    company: "TechStart GmbH",
    text: "Als Gründerin hatte ich keine Zeit mich durch Förderdatenbanken zu wühlen. Zora hat für mein IT-Startup die passenden Programme gefunden und den Digital-Jetzt-Antrag komplett vorbereitet. Bewilligt in 6 Wochen — ohne einen einzigen Berater.",
  },
];

// ── Section 10: FAQ ────────────────────────────────────────────────────────
const FAQS = [
  { q: "Ist Zora wirklich kostenlos?", a: "Ja, du kannst bis zu 3 Förderanträge kostenlos vorbereiten. Für unbegrenzte Nutzung und erweiterte Features gibt es unsere Pro- und Business-Pläne." },
  { q: "Welche Förderprogramme deckt Zora ab?", a: "Aktuell alle wichtigen Programme im Bereich Erneuerbare Energien und Handwerk — BEG, BAFA, KfW 270 und mehr. Laufend werden neue Programme hinzugefügt." },
  { q: "Muss ich Fachkenntnisse haben?", a: "Nein. Zora erklärt dir auf verständlichem Deutsch was du tun musst, wann du es tun musst und warum. Kein Fachwissen nötig." },
  { q: "Kann Zora den Antrag direkt einreichen?", a: "Bei BAFA-Programmen (BEG) ja — direkt über das BAFA-Portal. Bei KfW-Programmen bereitet Zora alle Unterlagen vor die du bei deiner Hausbank einreichst." },
  { q: "Brauche ich einen Energieeffizienz-Experten?", a: "Für BEG und BAFA Heizungsförderung ja — das ist gesetzlich vorgeschrieben. Zora vermittelt dir direkt zugelassene EEEs in deiner Nähe." },
  { q: "Wie sicher sind meine Daten?", a: "Alle Daten werden DSGVO-konform auf deutschen Servern gespeichert. Wir geben keine Daten an Dritte weiter und haben keinen Zugriff auf deine Antragsdaten." },
  { q: "Was kostet ein Fördermittelberater im Vergleich?", a: "Klassische Berater kosten zwischen 2.000 und 10.000 Euro pro Auftrag. Zora Pro kostet ab 49 Euro im Monat — ohne Erfolgsabhängigkeit und ohne Wartezeit." },
  { q: "Für wen ist Zora geeignet?", a: "Für Handwerksbetriebe, KMU, Privatpersonen die sanieren möchten, und Unternehmen die in Digitalisierung oder Innovation investieren." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#e5e7eb]">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-[#1a1a1a] text-sm sm:text-base">{q}</span>
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-center">
          {open ? <ChevronUp size={13} className="text-[#6b7280]" /> : <ChevronDown size={13} className="text-[#6b7280]" />}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-[#6b7280] leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
  const FOOTER_COLS = [
    { title: "Produkt", links: ["Dashboard", "Förderungen finden", "Anträge erstellen", "Partner finden", "Dokumente", "Status-Tracking"] },
    { title: "Förderthemen", links: ["BEG / BAFA", "KfW Programme", "Heizungsförderung", "Landesförderungen", "Digitalisierung", "Innovation & Forschung"] },
    { title: "Für wen", links: ["Handwerk & Energie", "KMU & Unternehmen", "Privatpersonen", "Forschung & Innovation", "Startups", "Kommunen"] },
    { title: "Unternehmen", links: ["Über uns", "Blog & News", "Karriere", "Presse", "Partner werden", "Kontakt"] },
    { title: "Rechtliches", links: ["Datenschutzerklärung", "Impressum", "AGB", "Cookie-Einstellungen", "Sicherheit"] },
  ];

  return (
    <footer className="bg-[#1a1a1a] pt-16 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 mb-14">
          {/* Brand col */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="mb-4">
              <ZoraLogo href="/" variant="light" />
            </div>
            <p className="text-sm text-[#6b7280] leading-relaxed mb-5">
              Die erste KI-Plattform die dich von der Fördersuche bis zur Auszahlung begleitet.
            </p>
            <div className="flex gap-3">
              {([ExternalLink, ExternalLink, ExternalLink] as const).map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#1D9E75] flex items-center justify-center transition-colors">
                  <Icon size={14} className="text-white/70" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-white mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-[#6b7280] hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#6b7280]">© 2026 Zora GmbH. Alle Rechte vorbehalten.</p>
          <p className="text-sm text-[#6b7280]">Made with ♥ in Deutschland 🇩🇪</p>
          <div className="flex gap-5">
            {["DSGVO", "Impressum", "AGB"].map((item) => (
              <a key={item} href="#" className="text-xs text-[#6b7280] hover:text-white transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navbar + Activity Ticker */}
      <div className="sticky top-0 z-50">
        <Navbar />
        <ActivityTicker />
      </div>

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-16 pb-24 px-4 sm:px-6 bg-white overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#E1F5EE] rounded-full opacity-40 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#E1F5EE] rounded-full opacity-30 blur-3xl" />
        </div>

        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative text-center max-w-5xl mx-auto w-full">
          {/* Badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-[#E1F5EE] border border-[#1D9E75]/30 text-[#1D9E75] text-sm font-semibold px-5 py-2 rounded-full mb-8 shadow-sm">
            <span className="text-base">✦</span>
            KI-gestützte Förderplattform
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-[44px] sm:text-[60px] lg:text-[72px] font-extrabold leading-[1.1] mb-6 tracking-tight"
          >
            <span className="block text-[#1a1a1a]">Fördermittel.</span>
            <span className="block text-[#1a1a1a]">Endlich einfach.</span>
            <span className="block text-[#1D9E75]">Mit Zora.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p variants={fadeUp} className="text-[18px] text-[#6b7280] max-w-[520px] mx-auto mb-10 leading-relaxed">
            Zora findet die passenden Förderprogramme für dich — und bereitet den Antrag vollständig vor.
          </motion.p>

          {/* Button group */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link
              href="/app/dashboard"
              className="flex items-center gap-2 text-base font-bold text-white bg-[#1D9E75] hover:bg-[#0F6E56] transition-all px-8 py-[14px] rounded-xl shadow-lg shadow-[#1D9E75]/30 hover:shadow-xl hover:shadow-[#1D9E75]/35 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
            >
              Jetzt kostenlos starten <ArrowRight size={18} />
            </Link>
            <Link href="/app/foerderungen" className="flex items-center gap-2 text-base font-semibold text-[#1a1a1a] bg-white border border-[#e5e7eb] hover:border-[#1D9E75]/40 hover:bg-[#f9fafb] transition-all px-8 py-[14px] rounded-xl w-full sm:w-auto justify-center">
              <span className="w-7 h-7 rounded-full bg-[#E1F5EE] flex items-center justify-center">
                <Play size={11} className="text-[#1D9E75] ml-0.5" fill="#1D9E75" />
              </span>
              Demo ansehen
            </Link>
          </motion.div>

          {/* Trust strip */}
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 mb-10 text-[13px] text-[#9ca3af]">
            <span className="flex items-center gap-1.5">
              <span className="text-amber-400">★★★★★</span> 4,9 / 5 Sterne
            </span>
            <span className="text-[#e5e7eb]">|</span>
            <span>2.500+ Förderprogramme</span>
            <span className="text-[#e5e7eb]">|</span>
            <span>5 Min. bis zum Antrag</span>
          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div variants={fadeUp}>
            <HeroDashboardMockup />
          </motion.div>
        </motion.div>
      </section>

      {/* ── 2. FÖRDER-RECHNER ───────────────────────────────────────────── */}
      <FoerderRechner />

      {/* ── 2b. SOCIAL PROOF STATS ──────────────────────────────────────── */}
      <SozialproofStats />

      {/* ── 3. LOGO STRIP ───────────────────────────────────────────────── */}
      <LogoStrip />

      {/* ── 3. PROBLEM ──────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-sm font-semibold text-[#1D9E75] uppercase tracking-widest mb-3">Das Problem</p>
              <h2 className="text-3xl sm:text-5xl font-black text-[#1a1a1a] mb-5 leading-tight">
                Fördermittel sind da.<br />Der Zugang nicht.
              </h2>
              <p className="text-lg text-[#6b7280] max-w-xl mx-auto">
                Jedes Jahr verfallen Milliarden Euro an Fördergeldern — nicht weil kein Bedarf da ist, sondern weil der Prozess zu komplex ist.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PROBLEMS.map((card) => (
                <motion.div key={card.title} variants={fadeUp} className="bg-white border border-[#e5e7eb] rounded-2xl p-8 hover:shadow-lg transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mb-6">
                      <card.icon size={22} className="text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">{card.title}</h3>
                    <p className="text-[#6b7280] leading-relaxed mb-6 text-sm">{card.text}</p>
                    <div className="pt-5 border-t border-[#f3f4f6]">
                      <p className="text-sm font-bold text-[#1a1a1a]">{card.stat}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 4. SOLUTION TABS ────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4 sm:px-6 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-sm font-semibold text-[#1D9E75] uppercase tracking-widest mb-3">Die Lösung</p>
              <h2 className="text-3xl sm:text-5xl font-black text-[#1a1a1a] mb-5">Zora löst das — vollständig.</h2>
              <p className="text-lg text-[#6b7280] max-w-xl mx-auto">Von der ersten Suche bis zur Auszahlung. Alles in einer App.</p>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white rounded-3xl border border-[#e5e7eb] shadow-xl overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                {/* Tab list */}
                <div className="lg:w-80 border-b lg:border-b-0 lg:border-r border-[#e5e7eb] p-3 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
                  {SOLUTION_TABS.map((tab, i) => (
                    <button
                      key={tab.title}
                      onClick={() => setActiveTab(i)}
                      className={`flex items-start gap-3 p-4 rounded-xl text-left transition-all flex-shrink-0 lg:flex-shrink w-48 lg:w-auto ${activeTab === i ? "bg-[#E1F5EE] border border-[#1D9E75]/20" : "hover:bg-[#f9fafb]"}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${activeTab === i ? "bg-[#1D9E75]" : "bg-[#f3f4f6]"}`}>
                        <tab.icon size={15} className={activeTab === i ? "text-white" : "text-[#6b7280]"} />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold leading-tight ${activeTab === i ? "text-[#1D9E75]" : "text-[#1a1a1a]"}`}>{tab.title}</p>
                        {activeTab === i && (
                          <p className="text-xs text-[#6b7280] mt-1 leading-snug hidden lg:block">{tab.desc.slice(0, 60)}…</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="flex-1 flex flex-col lg:flex-row">
                  <div className="flex-1 p-8 flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center gap-2 mb-4">
                          {(() => { const Icon = SOLUTION_TABS[activeTab].icon; return <Icon size={20} className="text-[#1D9E75]" />; })()}
                          <span className="text-sm font-semibold text-[#1D9E75]">{SOLUTION_TABS[activeTab].title}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">{SOLUTION_TABS[activeTab].title}</h3>
                        <p className="text-[#6b7280] leading-relaxed mb-6">{SOLUTION_TABS[activeTab].desc}</p>
                        <Link href="/app/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1D9E75] hover:gap-3 transition-all">
                          Jetzt ausprobieren <ArrowRight size={15} />
                        </Link>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Mockup panel */}
                  <div className="w-full lg:w-80 bg-[#f9fafb] border-t lg:border-t-0 lg:border-l border-[#e5e7eb]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <SolutionMockup type={SOLUTION_TABS[activeTab].mockup} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 5. STATS (GREEN) ────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-[#1D9E75]">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">Zahlen die für sich sprechen</h2>
              <p className="text-[#E1F5EE] text-lg">Der Markt für Fördermittel in Deutschland ist riesig — und kaum genutzt.</p>
            </motion.div>
            <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
              <motion.div variants={fadeUp}><CounterCard target={100} suffix=" Mrd. €+" label="Jährliches Fördervolumen in Deutschland" /></motion.div>
              <motion.div variants={fadeUp}><CounterCard target={2500} suffix="+" label="Aktive Förderprogramme abgedeckt" /></motion.div>
              <motion.div variants={fadeUp}><CounterCard target={5} suffix=" Min." label="Durchschnittliche Zeit bis zum fertigen Antrag" /></motion.div>
              <motion.div variants={fadeUp}><CounterCard target={8400} suffix=" €" label="Durchschnittlich vermittelte Fördersumme pro Nutzer" /></motion.div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 6. AUDIENCES ────────────────────────────────────────────────── */}
      <section id="fuer-wen" className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-sm font-semibold text-[#1D9E75] uppercase tracking-widest mb-3">Für wen</p>
              <h2 className="text-3xl sm:text-5xl font-black text-[#1a1a1a] mb-5 leading-tight">
                Zora ist für jeden da
              </h2>
              <p className="text-lg text-[#6b7280] max-w-2xl mx-auto">
                Egal ob Handwerker, Unternehmer oder Eigenheimbesitzer — Zora kennt deine Förderungen.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {AUDIENCES.map((a) => (
                <motion.div key={a.title} variants={fadeUp} className={`${a.bg} border ${a.border} rounded-2xl p-8`}>
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl ${a.iconBg} flex items-center justify-center`}>
                      <a.icon size={22} className="text-white" />
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${a.badge}`}>{a.phase}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">{a.title}</h3>
                  <p className="text-[#6b7280] leading-relaxed mb-5 text-sm">{a.text}</p>
                  <ul className="space-y-2 mb-6">
                    {a.programs.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-[#1a1a1a] font-medium">
                        <CheckCircle size={14} className="text-[#1D9E75] flex-shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <Link href="/app/dashboard" className={`inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors ${a.btnClass}`}>
                    {a.btnLabel}
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 7. TIMELINE ─────────────────────────────────────────────────── */}
      <section id="so-funktionierts" className="py-24 px-4 sm:px-6 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-sm font-semibold text-[#1D9E75] uppercase tracking-widest mb-3">So funktioniert&apos;s</p>
              <h2 className="text-3xl sm:text-5xl font-black text-[#1a1a1a] mb-5">In 5 Schritten zur Förderung</h2>
              <p className="text-lg text-[#6b7280]">Durchschnittlich 5 Minuten von der ersten Eingabe bis zum fertigen Antrag.</p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {TIMELINE_STEPS.map((step, i) => (
                <motion.div key={step.num} variants={fadeUp} className="relative flex gap-6 sm:gap-10 pb-10 last:pb-0">
                  {/* Line */}
                  {i < TIMELINE_STEPS.length - 1 && (
                    <div className="absolute left-6 sm:left-8 top-16 bottom-0 w-0.5 bg-[#e5e7eb]" />
                  )}
                  {/* Number badge */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white border-2 border-[#1D9E75]/20 flex items-center justify-center shadow-sm z-10 relative">
                      <span className="text-xl sm:text-2xl font-black text-[#1D9E75]">{step.num}</span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 pt-2 sm:pt-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#1a1a1a] mb-2">{step.title}</h3>
                    <p className="text-[#6b7280] leading-relaxed text-sm sm:text-base">{step.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} className="text-center mt-14">
              <Link href="/app/dashboard" className="inline-flex items-center gap-2 text-base font-bold text-white bg-[#1D9E75] hover:bg-[#0F6E56] transition-colors px-8 py-4 rounded-xl shadow-lg shadow-[#1D9E75]/25">
                Jetzt loslegen <ArrowRight size={18} />
              </Link>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 8. TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-sm font-semibold text-[#1D9E75] uppercase tracking-widest mb-3">Stimmen unserer Nutzer</p>
              <h2 className="text-3xl sm:text-5xl font-black text-[#1a1a1a] mb-5">Was unsere Nutzer sagen</h2>
              <p className="text-lg text-[#6b7280]">Über 10.000 Betriebe und Privatpersonen nutzen Zora bereits.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t) => (
                <motion.div key={t.name} variants={fadeUp} className="bg-white border border-[#e5e7eb] rounded-2xl p-8 hover:shadow-lg transition-all relative">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={15} className="text-amber-400 fill-amber-400" />)}
                  </div>
                  <p className="text-[#6b7280] leading-relaxed mb-7 text-sm">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${t.color}`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1a1a1a] text-sm">{t.name}</p>
                      <p className="text-xs text-[#6b7280]">{t.role}{t.company ? `, ${t.company}` : ""}</p>
                    </div>
                  </div>
                  {/* Zora badge */}
                  <div className="absolute bottom-6 right-6 flex items-center gap-1">
                    <span className="w-4 h-4 rounded bg-[#1D9E75] flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>
                    <span className="text-[10px] font-bold text-[#1D9E75]">Zora</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 9. PRICING ──────────────────────────────────────────────────── */}
      <section id="preise" className="py-24 px-4 sm:px-6 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-sm font-semibold text-[#1D9E75] uppercase tracking-widest mb-3">Preise</p>
              <h2 className="text-3xl sm:text-5xl font-black text-[#1a1a1a] mb-4">
                Transparente Preise. Kein verstecktes Kleingedrucktes.
              </h2>
              <p className="text-lg text-[#6b7280]">Starte kostenlos und upgrade wenn du mehr brauchst.</p>
            </motion.div>

            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Free */}
              <motion.div variants={fadeUp} className="bg-white border-2 border-[#e5e7eb] rounded-2xl p-8 flex flex-col">
                <div className="mb-6">
                  <span className="inline-block text-xs font-semibold text-[#6b7280] bg-[#f3f4f6] px-3 py-1 rounded-full mb-4">Kostenlos</span>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-black text-[#1a1a1a]">0 €</span>
                    <span className="text-[#9ca3af] text-sm">/ Monat</span>
                  </div>
                  <p className="text-sm text-[#6b7280]">Perfekt zum Ausprobieren</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {[
                    { text: "KI-Matching (3 Suchen / Monat)", check: true },
                    { text: "Förderdatenbank (100+ Programme)", check: true },
                    { text: "Antrag vorbereiten (1 Antrag)", check: true },
                    { text: "PDF-Export", check: true },
                    { text: "Unbegrenzte Anträge", check: false },
                    { text: "Status-Tracking", check: false },
                    { text: "Partner-Vermittlung", check: false },
                  ].map((f) => (
                    <li key={f.text} className="flex items-start gap-2.5 text-sm">
                      <span className={`mt-0.5 flex-shrink-0 ${f.check ? "text-[#1D9E75]" : "text-[#d1d5db]"}`}>
                        {f.check ? <CheckCircle size={15} /> : <span className="block w-3.5 h-3.5 rounded-full border-2 border-[#d1d5db] mt-0.5" />}
                      </span>
                      <span className={f.check ? "text-[#1a1a1a]" : "text-[#9ca3af]"}>{f.text}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/app/dashboard" className="block text-center py-3 rounded-xl text-sm font-semibold border-2 border-[#1D9E75] text-[#1D9E75] hover:bg-[#E1F5EE] transition-colors">
                  Kostenlos starten
                </Link>
              </motion.div>

              {/* Pro (highlighted) */}
              <motion.div variants={fadeUp} className="bg-white border-2 border-[#1D9E75] rounded-2xl p-8 flex flex-col relative shadow-lg shadow-[#1D9E75]/10">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-[#1D9E75] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">Beliebt ★</span>
                </div>
                <div className="mb-6 mt-2">
                  <span className="inline-block text-xs font-semibold text-[#1D9E75] bg-[#E1F5EE] px-3 py-1 rounded-full mb-4">Pro</span>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-black text-[#1a1a1a]">49 €</span>
                    <span className="text-[#9ca3af] text-sm">/ Monat</span>
                  </div>
                  <p className="text-sm text-[#6b7280]">Für Privatpersonen und kleine Betriebe</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {[
                    { text: "Unbegrenzte KI-Suchen", check: true },
                    { text: "Unbegrenzte Anträge", check: true },
                    { text: "PDF-Export (professionell)", check: true },
                    { text: "Status-Tracking", check: true },
                    { text: "Partner-Vermittlung", check: true },
                    { text: "Kombinationsvorschläge", check: true },
                    { text: "Prioritäts-Support", check: true },
                    { text: "API-Zugang", check: false },
                    { text: "Mehrere Nutzer", check: false },
                  ].map((f) => (
                    <li key={f.text} className="flex items-start gap-2.5 text-sm">
                      <span className={`mt-0.5 flex-shrink-0 ${f.check ? "text-[#1D9E75]" : "text-[#d1d5db]"}`}>
                        {f.check ? <CheckCircle size={15} /> : <span className="block w-3.5 h-3.5 rounded-full border-2 border-[#d1d5db] mt-0.5" />}
                      </span>
                      <span className={f.check ? "text-[#1a1a1a]" : "text-[#9ca3af]"}>{f.text}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/app/dashboard" className="block text-center py-3 rounded-xl text-sm font-semibold bg-[#1D9E75] text-white hover:bg-[#0F6E56] transition-colors shadow-sm shadow-[#1D9E75]/25 mb-2">
                  Pro starten
                </Link>
                <p className="text-center text-xs text-[#9ca3af]">14 Tage kostenlos testen</p>
              </motion.div>

              {/* Business */}
              <motion.div variants={fadeUp} className="bg-white border-2 border-[#1a1a1a] rounded-2xl p-8 flex flex-col">
                <div className="mb-6">
                  <span className="inline-block text-xs font-semibold text-white bg-[#1a1a1a] px-3 py-1 rounded-full mb-4">Für Betriebe</span>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-black text-[#1a1a1a]">199 €</span>
                    <span className="text-[#9ca3af] text-sm">/ Monat</span>
                  </div>
                  <p className="text-sm text-[#6b7280]">Für Handwerksbetriebe und KMU</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {[
                    "Alles aus Pro",
                    "Bis zu 10 Nutzer",
                    "Kundenanträge verwalten",
                    "API-Zugang",
                    "White-Label PDF",
                    "Dedizierter Support",
                    "Onboarding-Session",
                    "Monatliche Förder-Updates",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle size={15} className="text-[#1D9E75] mt-0.5 flex-shrink-0" />
                      <span className="text-[#1a1a1a]">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/app/dashboard" className="block text-center py-3 rounded-xl text-sm font-semibold bg-[#1a1a1a] text-white hover:bg-[#333] transition-colors">
                  Business starten
                </Link>
              </motion.div>
            </motion.div>

            <motion.p variants={fadeUp} className="text-center text-sm text-[#9ca3af] mt-8">
              Alle Preise zzgl. MwSt. · Jederzeit kündbar · Keine Einrichtungsgebühr
            </motion.p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 10. FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-sm font-semibold text-[#1D9E75] uppercase tracking-widest mb-3">FAQ</p>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1a1a1a] mb-5">Häufig gestellte Fragen</h2>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm px-6 sm:px-8">
              {FAQS.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 10. CTA SECTION ─────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-[#1D9E75]">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <motion.div variants={fadeUp}>
                <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 leading-tight">
                  Starte jetzt — kostenlos und ohne Risiko.
                </h2>
                <p className="text-[#E1F5EE] text-lg mb-8 leading-relaxed">
                  In 5 Minuten weißt du welche Fördermittel dir zustehen. Kein Berater nötig, kein Fachwissen vorausgesetzt.
                </p>
                <ul className="space-y-3">
                  {["Keine Kreditkarte erforderlich", "3 Anträge kostenlos vorbereiten", "Jederzeit kündbar"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-[#E1F5EE] font-medium">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={12} className="text-white" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Right: form */}
              <motion.div variants={fadeUp}>
                <div className="bg-white rounded-2xl p-8 shadow-2xl shadow-black/20">
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-6">Kostenlos registrieren</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Name</label>
                      <input
                        type="text"
                        placeholder="Max Mustermann"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full border border-[#e5e7eb] rounded-xl px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">E-Mail</label>
                      <input
                        type="email"
                        placeholder="max@muster-gmbh.de"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        className="w-full border border-[#e5e7eb] rounded-xl px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75] transition-colors"
                      />
                    </div>
                    <Link
                      href="/app/dashboard"
                      className="block w-full text-center text-base font-bold text-white bg-[#1D9E75] hover:bg-[#0F6E56] transition-colors px-6 py-3.5 rounded-xl shadow-md shadow-[#1D9E75]/30"
                    >
                      Kostenlos starten →
                    </Link>
                  </div>
                  <p className="text-xs text-[#9ca3af] mt-4 text-center">
                    Mit der Registrierung stimmst du unserer{" "}
                    <a href="#" className="underline hover:text-[#1D9E75]">Datenschutzerklärung</a> zu.
                  </p>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
