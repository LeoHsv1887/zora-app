"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import {
  Search, FileText, Users, BarChart3, Bell, AlertTriangle, Zap,
  TrendingUp, CheckCircle, ArrowRight, ChevronDown, Menu, X, Star,
  Clock, Shield, ChevronUp, MapPin, Building2, Home, FlaskConical,
  Hammer, ExternalLink,
} from "lucide-react";

// ── Font helper ────────────────────────────────────────────────────────────
const BG = "'Bricolage Grotesque', sans-serif";

// ── Animation Variants ─────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const cardItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// ── Scroll animation wrapper ───────────────────────────────────────────────
function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

// ── Counter hook (fixed) ───────────────────────────────────────────────────
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
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

// ── Navbar ─────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navItems = [
    { label: "Funktionen", href: "#features" },
    { label: "So funktionierts", href: "#so-funktionierts" },
    { label: "Für wen", href: "#fuer-wen" },
    { label: "Preise", href: "#preise" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(10,31,26,0.95)" : "rgba(255,255,255,0.9)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #1D9E75, #2ECC9A)" }}>
            <span className="text-white font-black text-sm">Z</span>
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ fontFamily: BG, color: scrolled ? "white" : "#0D1F1B" }}>Zora</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="relative text-sm font-medium px-4 py-2 rounded-lg transition-colors group"
              style={{ color: scrolled ? "rgba(255,255,255,0.65)" : "rgba(13,31,27,0.6)" }}
            >
              {item.label}
              <span
                className="absolute bottom-1 left-4 right-4 h-0.5 rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
                style={{ background: "#1D9E75" }}
              />
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link href="/app/dashboard" className="text-sm font-medium transition-colors" style={{ color: scrolled ? "rgba(255,255,255,0.65)" : "rgba(13,31,27,0.6)" }}>
            Anmelden
          </Link>
          <Link
            href="/app/dashboard"
            className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-px"
            style={{ background: "linear-gradient(135deg, #1D9E75, #2ECC9A)", boxShadow: "0 4px 16px rgba(29,158,117,0.35)" }}
          >
            Kostenlos starten
          </Link>
        </div>

        <button className="lg:hidden p-2 transition-colors" style={{ color: scrolled ? "white" : "#0D1F1B" }} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden"
            style={{ background: "rgba(10,31,26,0.98)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 px-3 text-sm font-medium rounded-lg"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-3 space-y-2">
                <Link href="/app/dashboard" className="block text-center py-3 px-4 text-sm font-medium rounded-xl" style={{ color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  Anmelden
                </Link>
                <Link href="/app/dashboard" className="block text-center py-3 px-4 text-sm font-semibold text-white rounded-xl" style={{ background: "linear-gradient(135deg, #1D9E75, #2ECC9A)" }}>
                  Kostenlos starten
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 700);
    return () => clearTimeout(t);
  }, []);

  const programs = [
    { name: "BEG Einzelmaßnahmen (BAFA)", match: 96, amount: "24.500 €" },
    { name: "KfW 270 Erneuerbare Energien", match: 88, amount: "15.000 €" },
    { name: "BAFA Heizungsförderung", match: 82, amount: "8.000 €" },
    { name: "Landesförderung Bayern (LfA)", match: 71, amount: "5.000 €" },
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-16">
      {/* Floating card top right */}
      <motion.div
        initial={{ opacity: 0, x: 30, rotate: 3 }}
        animate={{ opacity: 1, x: 0, rotate: 3 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="absolute -top-6 right-0 sm:right-4 z-20 rounded-2xl px-4 py-3 w-52"
        style={{ background: "#1D9E75", boxShadow: "0 16px 48px rgba(29,158,117,0.5)" }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <CheckCircle size={12} style={{ color: "rgba(255,255,255,0.8)" }} />
          <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>BEG Antrag bewilligt ✓</span>
        </div>
        <p className="text-lg font-bold text-white">24.500 €</p>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>BAFA · Sofortprogramm</p>
      </motion.div>

      {/* Floating card bottom left */}
      <motion.div
        initial={{ opacity: 0, x: -30, rotate: -2 }}
        animate={{ opacity: 1, x: 0, rotate: -2 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute -bottom-6 left-0 sm:left-4 z-20 rounded-2xl px-4 py-3 w-52"
        style={{ background: "rgba(13,31,27,0.95)", border: "1px solid rgba(29,158,117,0.35)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full pulse-green" style={{ background: "#2ECC9A" }} />
          <span className="text-xs font-semibold" style={{ color: "#2ECC9A" }}>KI-Analyse: 96% Passung</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: mounted ? "96%" : "0%",
              transition: "width 1.5s ease-out",
              background: "linear-gradient(90deg, #1D9E75, #2ECC9A)",
            }}
          />
        </div>
      </motion.div>

      {/* Browser frame */}
      <div
        className="dashboard-float rounded-2xl overflow-hidden"
        style={{
          background: "#0D1F1B",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {/* Browser bar */}
        <div className="px-4 py-3 flex items-center gap-3" style={{ background: "#0A1810", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
          </div>
          <div
            className="flex-1 rounded-md px-3 py-1.5 text-xs flex items-center gap-2 max-w-xs mx-auto"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)" }}
          >
            <Shield size={9} style={{ color: "#1D9E75" }} />
            app.zora.de/dashboard
          </div>
          <div className="hidden sm:flex gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }} />
            ))}
          </div>
        </div>

        {/* App layout */}
        <div className="flex" style={{ height: "400px" }}>
          {/* Sidebar */}
          <div
            className="w-48 flex-col py-5 px-3 gap-1 hidden sm:flex flex-shrink-0"
            style={{ background: "linear-gradient(180deg, #1D9E75 0%, #0F6E56 100%)" }}
          >
            <div className="flex items-center gap-2.5 px-3 py-2 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
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
              <div
                key={label}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer"
                style={{ background: active ? "rgba(255,255,255,0.2)" : "transparent" }}
              >
                <Icon size={14} style={{ color: active ? "white" : "rgba(255,255,255,0.65)" }} />
                <span className="text-sm font-medium" style={{ color: active ? "white" : "rgba(255,255,255,0.65)" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 p-5 overflow-hidden" style={{ background: "#0D201C" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>Guten Morgen,</p>
                <p className="text-sm font-bold text-white">Max Mustermann 👋</p>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(29,158,117,0.25)" }}>
                <span className="text-xs font-bold" style={{ color: "#2ECC9A" }}>MM</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: "Förderpotenzial", value: "47.500 €", accent: true },
                { label: "Aktive Anträge", value: "3", accent: false },
                { label: "Abgeschlossen", value: "2", accent: false },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-xl p-3"
                  style={{
                    background: kpi.accent ? "rgba(29,158,117,0.18)" : "rgba(255,255,255,0.04)",
                    border: kpi.accent ? "1px solid rgba(29,158,117,0.3)" : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <p className="text-[8px] mb-1 leading-tight" style={{ color: "rgba(255,255,255,0.4)" }}>{kpi.label}</p>
                  <p className="text-sm font-bold" style={{ color: kpi.accent ? "#2ECC9A" : "white" }}>{kpi.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-1.5 mb-2.5">
                <Zap size={9} style={{ color: "#2ECC9A" }} />
                <p className="text-[9px] font-semibold" style={{ color: "#2ECC9A" }}>KI-Matching · 12 Treffer gefunden</p>
              </div>
              <div className="space-y-2">
                {programs.map((item, idx) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="text-[8px] font-bold w-8 text-right flex-shrink-0 tabular-nums" style={{ color: "#2ECC9A" }}>
                      {item.match}%
                    </span>
                    <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: mounted ? `${item.match}%` : "0%",
                          transition: `width ${1.2 + idx * 0.15}s ease-out ${0.7 + idx * 0.1}s`,
                          background: "linear-gradient(90deg, #1D9E75, #2ECC9A)",
                        }}
                      />
                    </div>
                    <span className="text-[8px] flex-shrink-0 w-14 text-right" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Activity Ticker ────────────────────────────────────────────────────────
const AKTIVITAETEN = [
  { text: "Klaus M. aus Hamburg hat gerade 14.500 € BEG-Förderung gefunden", zeit: "vor 2 Min." },
  { text: "SHK-Betrieb Müller hat 3 Anträge für Kunden vorbereitet", zeit: "vor 5 Min." },
  { text: "Sandra K. aus München hat 21.000 € Heizungsförderung beantragt", zeit: "vor 8 Min." },
  { text: "Elektro Schneider GmbH hat KfW 270 für 5 Kunden gefunden", zeit: "vor 12 Min." },
  { text: "Familie Weber aus Berlin hat 18.400 € Förderpotenzial entdeckt", zeit: "vor 15 Min." },
  { text: "Thomas B. aus Stuttgart hat 9.200 € PV-Förderung gefunden", zeit: "vor 28 Min." },
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
      style={{ height: "36px", background: "rgba(29,158,117,0.12)", borderBottom: "1px solid rgba(29,158,117,0.2)" }}
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
              <span className="font-bold flex-shrink-0" style={{ color: "#2ECC9A" }}>✓</span>
              <span className="truncate" style={{ color: "rgba(255,255,255,0.6)" }}>{item.text}</span>
            </span>
            <span className="flex-shrink-0 hidden sm:block whitespace-nowrap" style={{ color: "rgba(255,255,255,0.35)" }}>
              {item.zeit}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Förderrechner ──────────────────────────────────────────────────────────
const VORHABEN_CARDS = [
  { id: "heizung", emoji: "🔥", title: "Heizung tauschen", sub: "Wärmepumpe, Pellet, Solar" },
  { id: "pv", emoji: "☀️", title: "PV-Anlage", sub: "Photovoltaik + Speicher" },
  { id: "daemmung", emoji: "🏠", title: "Dämmung & Fenster", sub: "Fassade, Dach, Fenster" },
  { id: "kombination", emoji: "⚡", title: "Mehreres kombinieren", sub: "Maximale Förderung" },
] as const;

type VorhabenId = (typeof VORHABEN_CARDS)[number]["id"];

function calcFoerderung(vorhaben: VorhabenId, investition: number) {
  switch (vorhaben) {
    case "heizung": {
      const grund = Math.min(investition * 0.3, 30000);
      const klima = Math.min(investition * 0.2, 12000);
      return { total: Math.min(grund + klima, 30000), grundFoerderung: grund, klimaBonus: klima, kombinationsBonus: 0, foerdersatz: "30–70%" };
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
      return { total: Math.min(heizGrund + klimaBonus + komboBonus, 42000), grundFoerderung: heizGrund, klimaBonus, kombinationsBonus: komboBonus, foerdersatz: "bis zu 70% auf einzelne Maßnahmen" };
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
      const diff = targetAmount - displayRef.current;
      if (Math.abs(diff) < 1) { displayRef.current = targetAmount; setDisplayAmount(targetAmount); return; }
      displayRef.current += diff * 0.12;
      setDisplayAmount(Math.round(displayRef.current));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [targetAmount]);

  const fmt = (n: number) => Math.round(n).toLocaleString("de-DE") + " €";
  const sliderPct = ((investition - 5000) / 95000) * 100;

  return (
    <section className="py-24 px-4 sm:px-6 relative" style={{ background: "#0A1F1A" }}>
      <div className="absolute inset-0 hero-grid opacity-40 pointer-events-none" />
      <div className="max-w-[800px] mx-auto relative">
        <AnimatedSection className="text-center mb-12">
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#2ECC9A" }}>
            Förderrechner
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-5xl font-black text-white mb-4 leading-tight" style={{ fontFamily: BG }}>
            Was könnte dir Zora bringen?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg" style={{ color: "rgba(255,255,255,0.6)" }}>
            Berechne in Sekunden dein persönliches Förderpotenzial — ohne Anmeldung.
          </motion.p>
        </AnimatedSection>

        <AnimatedSection>
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest mb-5" style={{ color: "#2ECC9A" }}>
            Schritt 1 — Vorhaben wählen
          </motion.p>
          <motion.div variants={stagger} className="grid grid-cols-2 gap-3 sm:gap-4">
            {VORHABEN_CARDS.map((v) => (
              <motion.button
                key={v.id}
                variants={cardItem}
                onClick={() => setSelected(selected === v.id ? null : v.id)}
                className="relative flex flex-col items-start gap-2 p-5 rounded-2xl text-left transition-all duration-200"
                style={{
                  background: selected === v.id ? "rgba(29,158,117,0.2)" : "rgba(255,255,255,0.05)",
                  border: `2px solid ${selected === v.id ? "rgba(29,158,117,0.5)" : "rgba(255,255,255,0.08)"}`,
                  boxShadow: selected === v.id ? "0 8px 32px rgba(29,158,117,0.2)" : "none",
                }}
              >
                {selected === v.id && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#1D9E75" }}>
                    <CheckCircle size={12} className="text-white" />
                  </span>
                )}
                <span className="text-2xl">{v.emoji}</span>
                <div>
                  <p className="font-bold text-sm sm:text-base" style={{ color: selected === v.id ? "#2ECC9A" : "white" }}>{v.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{v.sub}</p>
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
              <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#2ECC9A" }}>
                Schritt 2 — Investitionssumme
              </p>
              <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-2xl font-black text-white mb-5 text-center" style={{ fontFamily: BG }}>
                  Investition: {investition.toLocaleString("de-DE")} €
                </p>
                <input
                  type="range" min={5000} max={100000} step={1000} value={investition}
                  onChange={(e) => setInvestition(Number(e.target.value))}
                  className="w-full h-2 appearance-none rounded-full cursor-pointer"
                  style={{ accentColor: "#1D9E75", background: `linear-gradient(to right, #1D9E75 ${sliderPct}%, rgba(255,255,255,0.12) ${sliderPct}%)` }}
                />
                <div className="flex justify-between text-xs mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                  <span>5.000 €</span><span>100.000 €</span>
                </div>
              </div>

              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-5 rounded-2xl p-7"
                  style={{ background: "rgba(29,158,117,0.15)", border: "2px solid rgba(29,158,117,0.3)" }}
                >
                  <p className="text-sm font-semibold mb-3 text-center" style={{ color: "#2ECC9A" }}>Ihr möglicher Förderbetrag:</p>
                  <p className="text-center font-black mb-6 gradient-text" style={{ fontSize: "3rem", lineHeight: 1.1, fontFamily: BG }}>
                    {fmt(displayAmount)}
                  </p>
                  <div className="space-y-2.5 pt-4" style={{ borderTop: "1px solid rgba(29,158,117,0.2)" }}>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "rgba(255,255,255,0.6)" }}>Grundförderung:</span>
                      <span className="font-semibold text-white">{fmt(result.grundFoerderung)}</span>
                    </div>
                    {result.klimaBonus > 0 && (
                      <div className="flex justify-between text-sm">
                        <span style={{ color: "rgba(255,255,255,0.6)" }}>{selected === "pv" ? "BAFA Speicherförderung:" : "Klimabonus:"}</span>
                        <span className="font-semibold text-white">{fmt(result.klimaBonus)}</span>
                      </div>
                    )}
                    {result.kombinationsBonus > 0 && (
                      <div className="flex justify-between text-sm">
                        <span style={{ color: "rgba(255,255,255,0.6)" }}>{selected === "daemmung" ? "iSFP Bonus:" : "Kombinationsbonus:"}</span>
                        <span className="font-semibold text-white">{fmt(result.kombinationsBonus)}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-3" style={{ borderTop: "1px solid rgba(29,158,117,0.2)" }}>
                    <p className="text-sm text-center font-semibold" style={{ color: "#2ECC9A" }}>Fördersatz: {result.foerdersatz}</p>
                  </div>
                </motion.div>
              )}

              <div className="mt-6 text-center">
                <Link
                  href="/app/foerderungen"
                  className="inline-flex items-center gap-2 text-base font-bold text-white px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #1D9E75, #2ECC9A)", boxShadow: "0 8px 32px rgba(29,158,117,0.4)" }}
                >
                  Meine genaue Förderung berechnen <ArrowRight size={18} />
                </Link>
                <p className="text-sm mt-3" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Kostenlos · Keine Anmeldung nötig · In 5 Minuten
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ── Solution Tab Mockups ───────────────────────────────────────────────────
const SOLUTION_TABS = [
  {
    title: "KI-Fördermatching",
    icon: Search,
    desc: "Beschreibe dein Vorhaben in eigenen Worten. Zoras KI durchsucht alle 2.500+ Programme und liefert eine priorisierte Liste mit Passung, Betrag und Frist in Sekunden.",
    mockup: "matching",
  },
  {
    title: "Antragsgenerator",
    icon: FileText,
    desc: "Zora füllt den Antrag automatisch vor. Die KI schreibt die Projektbeschreibung auf Basis deines Profils. Ein Klick — fertig als PDF zum Einreichen.",
    mockup: "antrag",
  },
  {
    title: "Partner-Vermittlung",
    icon: Users,
    desc: "Zugelassene Energieeffizienz-Experten und qualifizierte Handwerksbetriebe in deiner Nähe — mit Bewertungen und direkter Kontaktmöglichkeit.",
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
  if (type === "matching") {
    const items = [
      { name: "BEG Einzelmaßnahmen (BAFA)", match: 96, amount: "24.500 €" },
      { name: "KfW 270 Erneuerbare Energien", match: 88, amount: "15.000 €" },
      { name: "BAFA Heizungsförderung", match: 82, amount: "8.000 €" },
      { name: "Landesförderung Bayern", match: 71, amount: "5.000 €" },
    ];
    return (
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={12} className="text-[#1D9E75]" />
          <span className="text-xs font-semibold text-[#1D9E75]">KI-Analyse · 12 Treffer</span>
        </div>
        {items.map((item, idx) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.3 }}
            className="bg-white rounded-xl border border-[#e5e7eb] p-3 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-[#1D9E75]">{item.match}%</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-[#1a1a1a] truncate">{item.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-[#e5e7eb] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#1D9E75] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.match}%` }}
                    transition={{ delay: 0.2 + idx * 0.08, duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <span className="text-[9px] font-semibold text-[#1D9E75]">{item.amount}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "antrag") {
    return (
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-[#1a1a1a]">Antrag generieren</span>
          <span className="text-[9px] bg-[#E1F5EE] text-[#1D9E75] px-2 py-1 rounded-full font-semibold">KI-gestützt</span>
        </div>
        {["Projektbeschreibung", "Kostenaufstellung", "Firmenangaben", "Technische Details", "Unterschrift"].map((field, i) => (
          <motion.div
            key={field}
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${i < 4 ? "bg-[#1D9E75]" : "bg-[#e5e7eb]"}`}>
              {i < 4 ? <CheckCircle size={11} className="text-white" /> : <span className="w-2 h-2 rounded-full bg-[#9ca3af]" />}
            </div>
            <div className={`flex-1 h-2.5 rounded-lg ${i < 4 ? "bg-[#E1F5EE]" : "bg-[#e5e7eb]"}`} />
            <span className={`text-[9px] font-medium ${i < 4 ? "text-[#1D9E75]" : "text-[#9ca3af]"}`}>{i < 4 ? "Fertig" : "Ausstehend"}</span>
          </motion.div>
        ))}
        <button
          className="w-full mt-3 text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #1D9E75, #2ECC9A)" }}
        >
          <FileText size={12} /> Als PDF exportieren
        </button>
      </div>
    );
  }

  if (type === "partner") {
    return (
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={12} className="text-[#1D9E75]" />
          <span className="text-xs font-semibold text-[#1a1a1a]">Partner in deiner Nähe</span>
        </div>
        {[
          { name: "Energieberatung Schmidt", type: "Zugelassener EEE", dist: "2,3 km", stars: 5 },
          { name: "ThermoTech GmbH", type: "SHK-Betrieb", dist: "4,1 km", stars: 5 },
          { name: "Solar & Wärme Müller", type: "Installateur", dist: "7,8 km", stars: 4 },
        ].map((p, idx) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="bg-white border border-[#e5e7eb] rounded-xl p-3 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-full bg-[#E1F5EE] flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#1D9E75]">
              {p.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-[#1a1a1a] truncate">{p.name}</p>
              <p className="text-[9px] text-[#6b7280]">{p.type} · {p.dist}</p>
              <div className="flex gap-0.5 mt-0.5">
                {[...Array(p.stars)].map((_, i) => <Star key={i} size={8} className="text-amber-400 fill-amber-400" />)}
              </div>
            </div>
            <button className="text-[9px] font-semibold text-[#1D9E75] border border-[#1D9E75]/30 px-2 py-1 rounded-lg flex-shrink-0">
              Anfragen
            </button>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-5 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={12} className="text-[#1D9E75]" />
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
            <p className={`text-[11px] font-medium ${step.done ? "text-[#1a1a1a]" : "text-[#9ca3af]"}`}>{step.label}</p>
            <p className="text-[9px] text-[#9ca3af]">{step.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── FAQ ────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: "Ist Zora wirklich kostenlos?", a: "Ja, für Privatpersonen entstehen keine Kosten im Voraus. Du zahlst nur 1,5–2% der tatsächlich bewilligten Fördersumme — nur wenn du Erfolg hast. Kein Risiko, keine versteckten Gebühren." },
  { q: "Welche Förderprogramme deckt Zora ab?", a: "Aktuell alle wichtigen Programme im Bereich Erneuerbare Energien und Handwerk — BEG, BAFA, KfW 270 und mehr. Laufend werden neue Programme hinzugefügt." },
  { q: "Muss ich Fachkenntnisse haben?", a: "Nein. Zora erklärt dir auf verständlichem Deutsch was du tun musst, wann du es tun musst und warum. Kein Fachwissen nötig." },
  { q: "Kann Zora den Antrag direkt einreichen?", a: "Bei BAFA-Programmen (BEG) ja — direkt über das BAFA-Portal. Bei KfW-Programmen bereitet Zora alle Unterlagen vor die du bei deiner Hausbank einreichst." },
  { q: "Brauche ich einen Energieeffizienz-Experten?", a: "Für BEG und BAFA Heizungsförderung ja — das ist gesetzlich vorgeschrieben. Zora vermittelt dir direkt zugelassene EEEs in deiner Nähe." },
  { q: "Wie sicher sind meine Daten?", a: "Alle Daten werden DSGVO-konform auf deutschen Servern gespeichert. Wir geben keine Daten an Dritte weiter und haben keinen Zugriff auf deine Antragsdaten." },
  { q: "Was kostet ein Fördermittelberater im Vergleich?", a: "Klassische Berater kosten zwischen 2.000 und 10.000 Euro pro Auftrag — unabhängig vom Erfolg. Zora ist kostenlos oder arbeitet erfolgsbasiert. Kein Risiko für dich." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #E2EAE8" }}>
      <button className="w-full flex items-center justify-between py-5 text-left gap-4" onClick={() => setOpen(!open)}>
        <span className="font-semibold text-sm sm:text-base" style={{ color: "#0D1F1B" }}>{q}</span>
        <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#F8FAFB", border: "1px solid #E2EAE8" }}>
          {open ? <ChevronUp size={13} style={{ color: "#6B7F7A" }} /> : <ChevronDown size={13} style={{ color: "#6B7F7A" }} />}
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
            <p className="text-sm leading-relaxed pb-5" style={{ color: "#6B7F7A" }}>{a}</p>
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
    <footer style={{ background: "#0A1F1A" }}>
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #1D9E75, #2ECC9A, #1D9E75, transparent)" }} />
      <div className="relative pt-16 pb-8 px-4 sm:px-6">
        <div className="absolute inset-0 hero-grid opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 mb-14">
            <div className="col-span-2 sm:col-span-3 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1D9E75, #2ECC9A)" }}>
                  <span className="text-white font-black text-sm">Z</span>
                </div>
                <span className="font-bold text-white text-lg" style={{ fontFamily: BG }}>Zora</span>
              </Link>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
                Die erste KI-Plattform die dich von der Fördersuche bis zur Auszahlung begleitet.
              </p>
              <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.3)" }}>Made with ♥ in Deutschland 🇩🇪</p>
              <div className="flex gap-3">
                {[ExternalLink, ExternalLink, ExternalLink].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[#1D9E75]"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    <Icon size={14} style={{ color: "rgba(255,255,255,0.55)" }} />
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
                      <a
                        href="#"
                        className="text-sm transition-colors hover:text-white"
                        style={{ color: "rgba(255,255,255,0.4)" }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>© 2026 Zora GmbH. Alle Rechte vorbehalten.</p>
            <div className="flex gap-5">
              {["DSGVO", "Impressum", "AGB"].map((item) => (
                <a key={item} href="#" className="text-xs transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {item}
                </a>
              ))}
            </div>
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

  const logos = ["Müller SHK GmbH", "Bauer Elektro", "Schmidt Dach", "TechBau GmbH", "Grün & Partner", "Energiebau Nord"];

  const PROBLEMS = [
    { icon: BarChart3, title: "Unüberschaubare Komplexität", text: "Über 2.500 Förderprogramme auf EU-, Bundes- und Länderebene — jedes mit eigenen Bedingungen, Fristen und Formularen. Ohne Fachkenntnis ist es nahezu unmöglich das richtige Programm zu finden.", stat: "~40% der Fördergelder bleiben ungenutzt" },
    { icon: AlertTriangle, title: "Beratung ist teuer und langsam", text: "Ein professioneller Fördermittelberater kostet zwischen 2.000 und 10.000 Euro pro Antrag und braucht oft Wochen. Für KMU und Privatpersonen ist das schlicht nicht erschwinglich.", stat: "Ø 6 Wochen Bearbeitungszeit beim Berater" },
    { icon: Clock, title: "Kritische Fehler kosten alles", text: "Wer die Maßnahme vor dem Bescheid startet, verliert die gesamte Förderung. Wer den falschen EEE beauftragt oder Fristen verpasst, scheitert. Diese Regeln kennt kaum jemand.", stat: "Häufigster Ablehnungsgrund: falsches Timing" },
  ];

  const AUDIENCES = [
    { icon: Hammer, title: "Handwerk & Erneuerbare Energien", phase: "Phase 1 · Jetzt verfügbar", text: "SHK-Betriebe, Elektriker, Dachdecker — Zora findet BEG, BAFA und KfW-Programme für dein nächstes Installationsprojekt.", programs: ["BEG Einzelmaßnahmen", "BAFA Heizungsförderung", "KfW 270"], accent: "#1D9E75" },
    { icon: Building2, title: "KMU & Unternehmen", phase: "Phase 2 · Demnächst", text: "Digitalisierung, Ausbildung, Investitionen — über 3,5 Mio. KMU in Deutschland haben Anspruch auf Förderungen die sie nie beantragen.", programs: ["Digital Jetzt", "KfW Unternehmerkredit", "BAFA Beratungsförderung"], accent: "#2563eb" },
    { icon: Home, title: "Privatpersonen & Bauen", phase: "Phase 3 · In Planung", text: "Eigenheim sanieren, Wärmepumpe einbauen, PV-Anlage installieren — Zora erklärt dir welche Förderungen du bekommst und was du tun musst.", programs: ["BEG Wohngebäude", "KfW 261", "Klimabonus"], accent: "#d97706" },
    { icon: FlaskConical, title: "Forschung & Innovation", phase: "Phase 4 · In Planung", text: "ZIM, Forschungszulage, Horizon Europe — Zora bereitet auch komplexe Forschungsförderungen vor und begleitet dich durch den Prozess.", programs: ["ZIM", "Forschungszulage", "Horizon Europe"], accent: "#7c3aed" },
  ];

  const TIMELINE_STEPS = [
    { num: 1, title: "Firmenprofil anlegen", text: "Gib Branche, Rechtsform, Standort und dein Vorhaben ein. Zora speichert alle Daten für zukünftige Anträge — einmalig anlegen, immer davon profitieren." },
    { num: 2, title: "KI-Matching in Sekunden", text: "Zoras KI analysiert dein Profil und durchsucht alle 2.500+ Programme. Du bekommst eine priorisierte Liste mit Passung, Betrag und Frist — in unter 10 Sekunden." },
    { num: 3, title: "Partner finden", text: "Für BEG-Anträge brauchst du einen zugelassenen Energieeffizienz-Experten. Zora zeigt dir geprüfte Partner in deiner Nähe — mit Bewertungen und direkter Kontaktmöglichkeit." },
    { num: 4, title: "Antrag vorbereiten & einreichen", text: "Zora füllt alle Formulare vor, schreibt die Projektbeschreibung und exportiert alles als PDF. Du prüfst, unterschreibst und reichst ein — in weniger als 20 Minuten." },
    { num: 5, title: "Tracking bis zur Auszahlung", text: "Nach der Einreichung begleitet Zora dich: Bescheid-Datum, Freigabe für Maßnahmenbeginn, Verwendungsnachweis-Frist. Alles automatisch, nichts vergessen." },
  ];

  const TESTIMONIALS = [
    { initials: "KM", name: "Klaus M.", role: "Inhaber, Müller Haustechnik GmbH", text: "Als SHK-Betrieb haben wir jahrelang Fördermittel liegen gelassen weil der Prozess zu komplex war. Mit Zora haben wir in einer Stunde drei BEG-Anträge für unsere Kunden vorbereitet. Das hat unser Angebot komplett verändert.", accent: "#1D9E75" },
    { initials: "SK", name: "Sandra K.", role: "Eigenheimbesitzerin", text: "Ich hatte keine Ahnung dass ich für meine Wärmepumpe bis zu 70% Förderung bekommen kann. Zora hat mir in 5 Minuten erklärt welche Programme passen. Der Antrag war nach 20 Minuten fertig — bewilligt in 4 Wochen.", accent: "#d97706" },
    { initials: "ML", name: "Maria L.", role: "Gründerin, TechStart GmbH", text: "Als Gründerin hatte ich keine Zeit mich durch Förderdatenbanken zu wühlen. Zora hat für mein IT-Startup die passenden Programme gefunden und den Digital-Jetzt-Antrag komplett vorbereitet. Bewilligt in 6 Wochen — ohne einen einzigen Berater.", accent: "#7c3aed" },
  ];

  const c1 = useCounter(100, 2000);
  const c2 = useCounter(2500, 2000);
  const c3 = useCounter(5, 1500);
  const c4 = useCounter(8400, 2000);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "white" }}>
      <Navbar />

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-32 px-4 sm:px-6 overflow-hidden"
        style={{ background: "#FFFFFF" }}
      >

        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative text-center max-w-[900px] mx-auto w-full">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-8"
            style={{ background: "rgba(29,158,117,0.15)", border: "1px solid rgba(29,158,117,0.3)" }}
          >
            <span className="w-2 h-2 rounded-full pulse-green" style={{ background: "#2ECC9A" }} />
            <span className="text-sm font-semibold" style={{ color: "#1D9E75" }}>
              ✦ KI-gestützte Förderplattform · Jetzt live
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-black leading-[1.05] mb-6 tracking-tight"
            style={{ fontFamily: BG, fontSize: "clamp(48px, 7vw, 84px)" }}
          >
            <span className="block" style={{ color: "#0D1F1B" }}>Fördermittel.</span>
            <span className="block" style={{ color: "#0D1F1B" }}>Endlich einfach.</span>
            <span className="block gradient-text">Mit Zora.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg max-w-[520px] mx-auto mb-10 leading-relaxed"
            style={{ color: "#6B7F7A" }}
          >
            Zora findet die passenden Förderprogramme für dich — und bereitet den Antrag vollständig vor.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link
              href="/app/dashboard"
              className="flex items-center gap-2 text-base font-bold text-white px-8 py-4 rounded-xl transition-all hover:-translate-y-px w-full sm:w-auto justify-center"
              style={{ background: "linear-gradient(135deg, #1D9E75, #2ECC9A)", boxShadow: "0 8px 32px rgba(29,158,117,0.4)" }}
            >
              Jetzt kostenlos starten <ArrowRight size={18} />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 text-base font-semibold px-8 py-4 rounded-xl transition-all hover:bg-black/5 w-full sm:w-auto justify-center"
              style={{ color: "#0D1F1B", border: "1px solid rgba(13,31,27,0.2)" }}
            >
              Mehr erfahren
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center gap-4 mb-16 text-sm flex-wrap"
          >
            <span className="flex items-center gap-1.5" style={{ color: "#6B7F7A" }}>
              <span className="text-amber-400">★★★★★</span> 4,9 / 5 Sterne
            </span>
            <span style={{ color: "rgba(29,158,117,0.5)" }}>|</span>
            <span style={{ color: "#6B7F7A" }}>2.500+ Förderprogramme</span>
            <span style={{ color: "rgba(29,158,117,0.5)" }}>|</span>
            <span style={{ color: "#6B7F7A" }}>5 Min. bis zum Antrag</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            <HeroDashboardMockup />
          </motion.div>
        </motion.div>
      </section>

      {/* ── 2. SOCIAL PROOF ─────────────────────────────────────────────── */}
      <div style={{ background: "#0A1F1A" }}>
        <ActivityTicker />
      </div>
      <section className="py-14 px-4 sm:px-6" style={{ background: "#F8FAFB", borderBottom: "1px solid #E2EAE8" }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm font-medium mb-8" style={{ color: "#6B7F7A" }}>
            Vertraut von über 10.000 Betrieben und Privatpersonen
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            {logos.map((name) => (
              <div
                key={name}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                style={{ background: "white", border: "1px solid #E2EAE8", color: "#C4C9D4", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. PROBLEM ──────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6" style={{ background: "white" }}>
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#1D9E75" }}>Das Problem</p>
              <h2 className="text-3xl sm:text-5xl font-black mb-5 leading-tight" style={{ color: "#0D1F1B", fontFamily: BG }}>
                Fördermittel sind da.<br />Der Zugang nicht.
              </h2>
              <p className="text-lg max-w-xl mx-auto" style={{ color: "#6B7F7A" }}>
                Jedes Jahr verfallen Milliarden Euro an Fördergeldern — nicht weil kein Bedarf da ist, sondern weil der Prozess zu komplex ist.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PROBLEMS.map((card) => (
                <motion.div
                  key={card.title}
                  variants={cardItem}
                  className="rounded-2xl p-8 relative overflow-hidden"
                  style={{ background: "white", border: "1px solid #E2EAE8", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", transition: "all 0.2s" }}
                  whileHover={{ y: -2, boxShadow: "0 8px 32px rgba(29,158,117,0.12)" }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
                    <card.icon size={22} style={{ color: "#EF4444" }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: "#0D1F1B", fontFamily: BG }}>{card.title}</h3>
                  <p className="leading-relaxed mb-6 text-sm" style={{ color: "#6B7F7A" }}>{card.text}</p>
                  <div className="pt-5" style={{ borderTop: "1px solid #F1F5F4" }}>
                    <p className="text-sm font-bold" style={{ color: "#0D1F1B" }}>{card.stat}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 4. SOLUTION TABS ────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4 sm:px-6" style={{ background: "#F8FAFB" }}>
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#1D9E75" }}>Die Lösung</p>
              <h2 className="text-3xl sm:text-5xl font-black mb-5" style={{ color: "#0D1F1B", fontFamily: BG }}>Zora löst das — vollständig.</h2>
              <p className="text-lg max-w-xl mx-auto" style={{ color: "#6B7F7A" }}>Von der ersten Suche bis zur Auszahlung. Alles in einer App.</p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="rounded-3xl overflow-hidden"
              style={{ background: "white", border: "1px solid #E2EAE8", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
            >
              <div className="flex flex-col lg:flex-row">
                <div
                  className="flex p-3 gap-1 overflow-x-auto lg:flex-col lg:w-72 lg:overflow-x-visible"
                  style={{ borderBottom: "1px solid #E2EAE8" }}
                >
                  {SOLUTION_TABS.map((tab, i) => (
                    <button
                      key={tab.title}
                      onClick={() => setActiveTab(i)}
                      className="flex items-start gap-3 p-4 rounded-xl text-left transition-all flex-shrink-0 lg:flex-shrink w-44 lg:w-auto"
                      style={{
                        background: activeTab === i ? "#E1F5EE" : "transparent",
                        border: `1px solid ${activeTab === i ? "rgba(29,158,117,0.25)" : "transparent"}`,
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
                        style={{ background: activeTab === i ? "#1D9E75" : "#F1F5F4" }}
                      >
                        <tab.icon size={14} style={{ color: activeTab === i ? "white" : "#6B7F7A" }} />
                      </div>
                      <p className="text-sm font-semibold leading-tight" style={{ color: activeTab === i ? "#1D9E75" : "#0D1F1B" }}>
                        {tab.title}
                      </p>
                    </button>
                  ))}
                </div>

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
                          {(() => { const Icon = SOLUTION_TABS[activeTab].icon; return <Icon size={18} style={{ color: "#1D9E75" }} />; })()}
                          <span className="text-sm font-semibold" style={{ color: "#1D9E75" }}>{SOLUTION_TABS[activeTab].title}</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-4" style={{ color: "#0D1F1B", fontFamily: BG }}>{SOLUTION_TABS[activeTab].title}</h3>
                        <p className="leading-relaxed mb-6" style={{ color: "#6B7F7A" }}>{SOLUTION_TABS[activeTab].desc}</p>
                        <Link href="/app/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3" style={{ color: "#1D9E75" }}>
                          Jetzt ausprobieren <ArrowRight size={15} />
                        </Link>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="w-full lg:w-72" style={{ background: "#F8FAFB", borderTop: "1px solid #E2EAE8" }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
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

      {/* ── 5. FÖRDERRECHNER ────────────────────────────────────────────── */}
      <FoerderRechner />

      {/* ── 6. TIMELINE ─────────────────────────────────────────────────── */}
      <section id="so-funktionierts" className="py-24 px-4 sm:px-6" style={{ background: "white" }}>
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#1D9E75" }}>So funktioniert&apos;s</p>
              <h2 className="text-3xl sm:text-5xl font-black mb-5" style={{ color: "#0D1F1B", fontFamily: BG }}>In 5 Schritten zur Förderung</h2>
              <p className="text-lg" style={{ color: "#6B7F7A" }}>Durchschnittlich 5 Minuten von der ersten Eingabe bis zum fertigen Antrag.</p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {TIMELINE_STEPS.map((step, i) => (
                <motion.div key={step.num} variants={cardItem} className="relative flex gap-6 sm:gap-10 pb-10 last:pb-0">
                  {i < TIMELINE_STEPS.length - 1 && (
                    <div className="absolute left-6 sm:left-8 top-16 bottom-0 w-0.5" style={{ background: "#E2EAE8" }} />
                  )}
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center z-10 relative"
                      style={{ background: "white", border: "2px solid rgba(29,158,117,0.25)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
                    >
                      <span className="text-xl sm:text-2xl font-black" style={{ color: "#1D9E75", fontFamily: BG }}>{step.num}</span>
                    </div>
                  </div>
                  <div className="flex-1 pt-2 sm:pt-3">
                    <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ color: "#0D1F1B", fontFamily: BG }}>{step.title}</h3>
                    <p className="leading-relaxed text-sm sm:text-base" style={{ color: "#6B7F7A" }}>{step.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} className="text-center mt-14">
              <Link
                href="/app/dashboard"
                className="inline-flex items-center gap-2 text-base font-bold text-white px-8 py-4 rounded-xl transition-all hover:-translate-y-px"
                style={{ background: "linear-gradient(135deg, #1D9E75, #2ECC9A)", boxShadow: "0 8px 32px rgba(29,158,117,0.35)" }}
              >
                Jetzt loslegen <ArrowRight size={18} />
              </Link>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 7. ZAHLEN ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 relative overflow-hidden" style={{ background: "#0A1F1A" }}>
        <div className="absolute inset-0 hero-grid opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-3" style={{ fontFamily: BG }}>Zahlen die für sich sprechen</h2>
              <p className="text-lg" style={{ color: "rgba(255,255,255,0.5)" }}>Der Markt für Fördermittel in Deutschland ist riesig — und kaum genutzt.</p>
            </motion.div>
            <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
              {[
                { counterData: c1, suffix: " Mrd. €+", label: "Jährliches Fördervolumen" },
                { counterData: c2, suffix: "+", label: "Aktive Förderprogramme abgedeckt" },
                { counterData: c3, suffix: " Min.", label: "Ø Zeit bis zum fertigen Antrag" },
                { counterData: c4, suffix: " €", label: "Ø vermittelte Fördersumme pro Nutzer" },
              ].map((stat, i) => (
                <motion.div key={i} variants={cardItem} ref={stat.counterData.ref} className="text-center">
                  <p className="text-4xl sm:text-5xl font-black text-white mb-2 tabular-nums" style={{ fontFamily: BG }}>
                    {stat.counterData.count >= 1000 ? stat.counterData.count.toLocaleString("de") : stat.counterData.count}
                    {stat.suffix}
                  </p>
                  <p className="text-sm font-medium max-w-[160px] mx-auto leading-snug" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 8. FÜR WEN ──────────────────────────────────────────────────── */}
      <section id="fuer-wen" className="py-24 px-4 sm:px-6" style={{ background: "#F8FAFB" }}>
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#1D9E75" }}>Für wen</p>
              <h2 className="text-3xl sm:text-5xl font-black mb-5 leading-tight" style={{ color: "#0D1F1B", fontFamily: BG }}>Zora ist für jeden da</h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: "#6B7F7A" }}>
                Egal ob Handwerker, Unternehmer oder Eigenheimbesitzer — Zora kennt deine Förderungen.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {AUDIENCES.map((a) => (
                <motion.div
                  key={a.title}
                  variants={cardItem}
                  className="rounded-2xl p-8"
                  style={{ background: "white", border: "1px solid #E2EAE8", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", transition: "all 0.2s" }}
                  whileHover={{ y: -2, boxShadow: `0 8px 32px ${a.accent}22` }}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: a.accent }}>
                      <a.icon size={22} className="text-white" />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: `${a.accent}18`, color: a.accent }}>
                      {a.phase}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: "#0D1F1B", fontFamily: BG }}>{a.title}</h3>
                  <p className="leading-relaxed mb-5 text-sm" style={{ color: "#6B7F7A" }}>{a.text}</p>
                  <ul className="space-y-2 mb-6">
                    {a.programs.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm font-medium" style={{ color: "#0D1F1B" }}>
                        <CheckCircle size={14} style={{ color: a.accent, flexShrink: 0 }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/app/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-opacity hover:opacity-90"
                    style={{ background: a.accent }}
                  >
                    Jetzt starten <ArrowRight size={14} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 9. TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6" style={{ background: "white" }}>
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#1D9E75" }}>Stimmen unserer Nutzer</p>
              <h2 className="text-3xl sm:text-5xl font-black mb-5" style={{ color: "#0D1F1B", fontFamily: BG }}>Was unsere Nutzer sagen</h2>
              <p className="text-lg" style={{ color: "#6B7F7A" }}>Über 10.000 Betriebe und Privatpersonen nutzen Zora bereits.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t) => (
                <motion.div
                  key={t.name}
                  variants={cardItem}
                  className="rounded-2xl p-8 relative"
                  style={{ background: "white", border: "1px solid #E2EAE8", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
                  whileHover={{ y: -2, boxShadow: "0 8px 32px rgba(29,158,117,0.1)" }}
                >
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={15} className="text-amber-400 fill-amber-400" />)}
                  </div>
                  <p className="leading-relaxed mb-7 text-sm" style={{ color: "#6B7F7A" }}>&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-white"
                      style={{ background: t.accent }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "#0D1F1B" }}>{t.name}</p>
                      <p className="text-xs" style={{ color: "#6B7F7A" }}>{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 10. PRICING ─────────────────────────────────────────────────── */}
      <section id="preise" className="py-24 px-4 sm:px-6" style={{ background: "#F8FAFB" }}>
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#1D9E75" }}>Preise</p>
              <h2 className="text-3xl sm:text-5xl font-black mb-4" style={{ color: "#0D1F1B", fontFamily: BG }}>
                Zora ist kostenlos —<br />du zahlst nur bei Erfolg.
              </h2>
              <p className="text-lg" style={{ color: "#6B7F7A" }}>Keine versteckten Kosten. Kein Risiko.</p>
            </motion.div>

            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Privatpersonen */}
              <motion.div variants={cardItem} className="rounded-2xl p-8 flex flex-col" style={{ background: "white", border: "2px solid #E2EAE8" }}>
                <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-5 w-fit" style={{ background: "#F1F5F4", color: "#6B7F7A" }}>
                  Für Privatpersonen
                </span>
                <div className="mb-2">
                  <span className="text-4xl font-black" style={{ color: "#0D1F1B", fontFamily: BG }}>Kostenlos</span>
                </div>
                <p className="text-sm mb-7" style={{ color: "#6B7F7A" }}>
                  Du zahlst nur 1,5–2% der bewilligten Fördersumme — nur wenn du Erfolg hast.
                </p>
                <ul className="space-y-3 flex-1 mb-8">
                  {["Unbegrenztes Matching", "Antrag vorbereiten", "PDF-Export", "Status-Tracking"].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle size={15} style={{ color: "#1D9E75", marginTop: "2px", flexShrink: 0 }} />
                      <span style={{ color: "#0D1F1B" }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/app/dashboard"
                  className="block text-center py-3 rounded-xl text-sm font-semibold transition-colors hover:bg-[#E1F5EE]"
                  style={{ border: "2px solid #1D9E75", color: "#1D9E75" }}
                >
                  Kostenlos starten
                </Link>
                <p className="text-center text-xs mt-3" style={{ color: "#9ca3af" }}>Keine versteckten Kosten · Kein Risiko</p>
              </motion.div>

              {/* Handwerk — highlighted */}
              <motion.div
                variants={cardItem}
                className="rounded-2xl p-8 flex flex-col relative"
                style={{ background: "white", border: "2px solid #1D9E75", boxShadow: "0 16px 48px rgba(29,158,117,0.2)" }}
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span
                    className="text-white text-xs font-bold px-4 py-2 rounded-full"
                    style={{ background: "linear-gradient(135deg, #1D9E75, #2ECC9A)", boxShadow: "0 4px 12px rgba(29,158,117,0.4)" }}
                  >
                    Beliebt ★ Für Handwerksbetriebe
                  </span>
                </div>
                <div className="mt-5">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-black" style={{ color: "#0D1F1B", fontFamily: BG }}>99 €</span>
                    <span className="text-sm" style={{ color: "#9ca3af" }}>/Monat</span>
                  </div>
                  <p className="text-sm mb-7" style={{ color: "#6B7F7A" }}>+ 1% Success Fee bei Anträgen über 10.000 €</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {["Alle Privatpersonen-Features", "Unbegrenzte Kunden-Anträge", "Partner-Vermittlung", "Prioritäts-Support", "Kombinationsvorschläge"].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle size={15} style={{ color: "#1D9E75", marginTop: "2px", flexShrink: 0 }} />
                      <span style={{ color: "#0D1F1B" }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/app/dashboard"
                  className="block text-center py-3 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: "linear-gradient(135deg, #1D9E75, #2ECC9A)", boxShadow: "0 4px 16px rgba(29,158,117,0.35)" }}
                >
                  14 Tage kostenlos testen
                </Link>
              </motion.div>

              {/* KMU */}
              <motion.div variants={cardItem} className="rounded-2xl p-8 flex flex-col" style={{ background: "#0D1F1B", border: "2px solid rgba(255,255,255,0.08)" }}>
                <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-5 w-fit" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)" }}>
                  Für KMU & Unternehmen
                </span>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black text-white" style={{ fontFamily: BG }}>249 €</span>
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>/Monat</span>
                </div>
                <p className="text-sm mb-7" style={{ color: "rgba(255,255,255,0.5)" }}>+ 1–1,5% Success Fee</p>
                <ul className="space-y-3 flex-1 mb-8">
                  {["Alle Handwerk-Features", "Bis zu 10 Nutzer", "API-Zugang", "White-Label PDF", "Dedizierter Support"].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle size={15} style={{ color: "#2ECC9A", marginTop: "2px", flexShrink: 0 }} />
                      <span style={{ color: "rgba(255,255,255,0.75)" }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/app/dashboard"
                  className="block text-center py-3 rounded-xl text-sm font-semibold transition-colors hover:bg-white/15"
                  style={{ background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  Kontakt aufnehmen
                </Link>
              </motion.div>
            </motion.div>

            <motion.p variants={fadeUp} className="text-center text-sm mt-8" style={{ color: "#9ca3af" }}>
              Alle Preise zzgl. MwSt. · Jederzeit kündbar · Keine Einrichtungsgebühr
            </motion.p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 11. FAQ ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6" style={{ background: "white" }}>
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#1D9E75" }}>FAQ</p>
              <h2 className="text-3xl sm:text-4xl font-black mb-5" style={{ color: "#0D1F1B", fontFamily: BG }}>Häufig gestellte Fragen</h2>
            </motion.div>
            <motion.div
              variants={fadeUp}
              className="rounded-2xl px-6 sm:px-8"
              style={{ background: "white", border: "1px solid #E2EAE8", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
            >
              {FAQS.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 12. CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 relative overflow-hidden" style={{ background: "#0A1F1A" }}>
        <div className="absolute inset-0 hero-grid opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full blur-3xl pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(29,158,117,0.12) 0%, transparent 70%)" }} />
        <div className="max-w-6xl mx-auto relative">
          <AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div variants={fadeUp}>
                <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 leading-tight" style={{ fontFamily: BG }}>
                  Starte jetzt —<br />kostenlos und ohne Risiko.
                </h2>
                <p className="text-lg mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                  In 5 Minuten weißt du welche Fördermittel dir zustehen. Kein Berater nötig, kein Fachwissen vorausgesetzt.
                </p>
                <ul className="space-y-3">
                  {["Keine Kreditkarte erforderlich", "Kostenlos für Privatpersonen", "Jederzeit kündbar"].map((item) => (
                    <li key={item} className="flex items-center gap-3 font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(29,158,117,0.3)" }}>
                        <CheckCircle size={12} style={{ color: "#2ECC9A" }} />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={fadeUp}>
                <div
                  className="rounded-2xl p-8"
                  style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 32px 64px rgba(0,0,0,0.4)" }}
                >
                  <h3 className="text-xl font-bold text-white mb-6" style={{ fontFamily: BG }}>Kostenlos registrieren</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>Name</label>
                      <input
                        type="text"
                        placeholder="Max Mustermann"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-4 py-3 text-sm rounded-xl outline-none"
                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "white", transition: "border-color 0.15s" }}
                        onFocus={(e) => (e.target.style.borderColor = "#1D9E75")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>E-Mail</label>
                      <input
                        type="email"
                        placeholder="max@muster-gmbh.de"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        className="w-full px-4 py-3 text-sm rounded-xl outline-none"
                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "white", transition: "border-color 0.15s" }}
                        onFocus={(e) => (e.target.style.borderColor = "#1D9E75")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                      />
                    </div>
                    <Link
                      href="/app/dashboard"
                      className="block w-full text-center text-base font-bold text-white px-6 py-4 rounded-xl transition-all hover:-translate-y-px"
                      style={{ background: "linear-gradient(135deg, #1D9E75, #2ECC9A)", boxShadow: "0 8px 32px rgba(29,158,117,0.4)" }}
                    >
                      Kostenlos starten →
                    </Link>
                  </div>
                  <p className="text-xs mt-4 text-center" style={{ color: "rgba(255,255,255,0.35)" }}>
                    Mit der Registrierung stimmst du unserer{" "}
                    <a href="#" className="underline" style={{ color: "rgba(255,255,255,0.5)" }}>Datenschutzerklärung</a> zu.
                  </p>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 13. FOOTER ──────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
