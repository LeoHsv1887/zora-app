"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  X,
  ChevronLeft,
  Star,
  ExternalLink,
  Loader2,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { foerderprogramme, type FoerderprogrammDB } from "@/lib/foerderprogramme";
import { WIZARD_ROUTES } from "@/lib/wizardConfigs";

// ── Helpers ──────────────────────────────────────────────────────────────────

function sucheInDatenbank(query: string): FoerderprogrammDB[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return foerderprogramme
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.kurzname.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.foerderstelle.toLowerCase().includes(q) ||
        p.themen.some((t) => t.toLowerCase().includes(q)) ||
        p.beschreibung.toLowerCase().includes(q)
    )
    .slice(0, 10);
}

function extractMaxRate(foerderquote: string): number {
  const nums = foerderquote.match(/\d+/g);
  if (!nums) return 30;
  return Math.max(...nums.map(Number).filter((n) => n <= 100));
}

function formatEuro(val: number): string {
  return val.toLocaleString("de-DE", { maximumFractionDigits: 0 }) + " €";
}

function typLabel(typ: string): string {
  if (typ === "kredit") return "Kredit";
  if (typ === "buergschaft") return "Bürgschaft";
  return "Zuschuss";
}

function typBadgeClass(typ: string): string {
  if (typ === "kredit") return "bg-[#E6F1FB] text-[#185FA5]";
  if (typ === "buergschaft") return "bg-[#EEEDFE] text-[#534AB7]";
  return "bg-[#E1F5EE] text-[#0F6E56]";
}

function stelleBadgeClass(_stelle: string): string {
  return "bg-gray-100 text-gray-600";
}

// ── Sub-Components ────────────────────────────────────────────────────────────

function TypBadge({ typ }: { typ: string }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${typBadgeClass(typ)}`}>
      {typLabel(typ)}
    </span>
  );
}

function StelleBadge({ stelle }: { stelle: string }) {
  const short = stelle.split(" ")[0];
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${stelleBadgeClass(stelle)}`}>
      {short}
    </span>
  );
}

// ── Fördersatz Rechner ────────────────────────────────────────────────────────

function FoerdersatzRechner({ programm }: { programm: FoerderprogrammDB }) {
  const [betrag, setBetrag] = useState("");
  const maxRate = extractMaxRate(programm.foerderquote);
  const betragNum =
    parseFloat(betrag.replace(/\./g, "").replace(",", ".")) || 0;
  const foerderbetrag = Math.round(betragNum * (maxRate / 100));

  return (
    <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-5">
      <p className="text-sm font-semibold text-[#1a1a1a] mb-4">Förderbetrag berechnen</p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-[#6b7280] mb-1.5">
            Ihre Investition (€)
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              className="zora-input w-full pr-6"
              placeholder="z.B. 25000"
              value={betrag}
              onChange={(e) =>
                setBetrag(e.target.value.replace(/[^0-9.,]/g, ""))
              }
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9ca3af]">
              €
            </span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6b7280] mb-1.5">
            Max. Fördersatz
          </label>
          <div className="zora-input w-full bg-[#f9fafb] text-[#1a1a1a] font-semibold">
            {maxRate} %
          </div>
        </div>
      </div>
      <p className="text-xs text-[#9ca3af] mb-3">
        Fördersatz laut Programm: {programm.foerderquote}
      </p>
      {betragNum > 0 && (
        <div className="bg-[#E1F5EE] border border-[#1D9E75]/20 rounded-xl p-4">
          <p className="text-xs text-[#6b7280] mb-0.5">Geschätzter Förderbetrag</p>
          <p className="text-2xl font-bold text-[#1D9E75]">{formatEuro(foerderbetrag)}</p>
          <p className="text-xs text-[#6b7280] mt-1">
            Bei {formatEuro(betragNum)} Investition × {maxRate}% max. Fördersatz
          </p>
        </div>
      )}
    </div>
  );
}

// ── KombinationsKarte ─────────────────────────────────────────────────────────

function KombinationsKarte({
  hauptProgramm,
  partnerProgramm,
  isTop,
}: {
  hauptProgramm: FoerderprogrammDB;
  partnerProgramm: FoerderprogrammDB;
  isTop: boolean;
}) {
  const [beschreibung, setBeschreibung] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const wizardRoute =
    WIZARD_ROUTES[hauptProgramm.id] || WIZARD_ROUTES[partnerProgramm.id];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setBeschreibung(null);
    fetch("/api/kombination", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        programme1: hauptProgramm,
        programme2: partnerProgramm,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setBeschreibung(data.beschreibung);
      })
      .catch(() => {
        if (!cancelled)
          setBeschreibung(
            `Die Kombination von ${hauptProgramm.kurzname} und ${partnerProgramm.kurzname} ermöglicht eine maximale Ausschöpfung aller verfügbaren Förderungen für Ihr Vorhaben.`
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hauptProgramm.id, partnerProgramm.id]);

  return (
    <div
      className={`rounded-xl border overflow-hidden ${isTop ? "border-[#1D9E75] shadow-sm" : "border-[#e5e7eb]"}`}
    >
      {isTop && (
        <div className="bg-[#1D9E75] px-4 py-1.5 flex items-center gap-1.5">
          <Star size={11} className="text-white fill-white" />
          <span className="text-white text-xs font-medium">Empfohlen</span>
        </div>
      )}
      <div className="p-4">
        <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-3">
          {isTop ? "Kombination 1" : `Kombination`}
        </p>

        {/* Programme pair */}
        <p className="text-sm font-semibold text-[#1a1a1a] mb-3">
          {hauptProgramm.kurzname} + {partnerProgramm.kurzname}
        </p>

        {/* Amounts */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6b7280] truncate mr-2">{hauptProgramm.kurzname}:</span>
            <span className="text-[#1a1a1a] font-medium flex-shrink-0">{hauptProgramm.maxBetrag}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6b7280] truncate mr-2">{partnerProgramm.kurzname}:</span>
            <span className="text-[#1a1a1a] font-medium flex-shrink-0">{partnerProgramm.maxBetrag}</span>
          </div>
          <div className="h-px bg-[#e5e7eb] my-1" />
          <p className="text-xs text-[#6b7280]">
            Gesamt: {hauptProgramm.maxBetrag} + {partnerProgramm.maxBetrag}
          </p>
        </div>

        {/* AI description */}
        <div className="bg-[#f9fafb] rounded-lg px-3 py-2.5 mb-4 min-h-[60px]">
          {loading ? (
            <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
              <Loader2 size={11} className="animate-spin" />
              KI analysiert Kombination…
            </div>
          ) : (
            <p className="text-xs text-[#374151] leading-relaxed">{beschreibung}</p>
          )}
        </div>

        {/* CTA */}
        {wizardRoute ? (
          <Link
            href={wizardRoute}
            className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-white bg-[#1D9E75] hover:bg-[#0F6E56] transition-colors px-3 py-2 rounded-lg"
          >
            Beide Programme beantragen <ArrowRight size={12} />
          </Link>
        ) : (
          <Link
            href="/app/foerderungen"
            className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-white bg-[#1D9E75] hover:bg-[#0F6E56] transition-colors px-3 py-2 rounded-lg"
          >
            Beide Programme beantragen <ArrowRight size={12} />
          </Link>
        )}
      </div>
    </div>
  );
}

// ── Detail View ───────────────────────────────────────────────────────────────

function DetailView({
  programm,
  onBack,
}: {
  programm: FoerderprogrammDB;
  onBack: () => void;
}) {
  const kombinationen = programm.kombinierbarMit
    .map((id) => foerderprogramme.find((p) => p.id === id))
    .filter((p): p is FoerderprogrammDB => Boolean(p));

  const wizardRoute = WIZARD_ROUTES[programm.id];
  const bundeslandLabel = Array.isArray(programm.bundeslaender)
    ? programm.bundeslaender.slice(0, 3).join(", ") + (programm.bundeslaender.length > 3 ? " …" : "")
    : "Bundesweit";

  const details: { label: string; value: string }[] = [
    { label: "Fördersatz", value: programm.foerderquote },
    { label: "Max. Betrag", value: programm.maxBetrag },
    { label: "Fördertyp", value: typLabel(programm.typ) },
    { label: "Antragsstelle", value: programm.antragsstelle },
    { label: "EEE erforderlich", value: programm.eeeErforderlich ? "Ja (Pflicht)" : "Nein" },
    { label: "Antrag vor Beginn", value: programm.antragVorMassnahme ? "Ja (Pflicht)" : "Nein" },
    { label: "Zielgruppe", value: programm.zielgruppe.join(", ") },
    { label: "Bundesland", value: bundeslandLabel },
  ];

  return (
    <div>
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#1a1a1a] transition-colors mb-6"
      >
        <ChevronLeft size={16} /> Zurück zur Suche
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Left column: Details ── */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <TypBadge typ={programm.typ} />
              <StelleBadge stelle={programm.foerderstelle} />
              {Array.isArray(programm.bundeslaender) && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  Bundesland
                </span>
              )}
            </div>

            {/* Name */}
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-1">{programm.name}</h2>
            <p className="text-sm text-[#6b7280] mb-5">{programm.foerderstelle}</p>

            {/* Description */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-2">
                Was wird gefördert?
              </p>
              <p className="text-sm text-[#374151] leading-relaxed">{programm.beschreibung}</p>
            </div>

            {/* Details table */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-3">
                Förderdetails
              </p>
              <div className="border border-[#e5e7eb] rounded-xl overflow-hidden">
                {details.map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex items-start px-4 py-2.5 text-sm ${i % 2 === 0 ? "bg-[#f9fafb]" : "bg-white"}`}
                  >
                    <span className="text-[#9ca3af] w-40 flex-shrink-0 text-xs">{row.label}</span>
                    <span
                      className={`font-medium text-xs ${
                        row.value.includes("Pflicht") ? "text-amber-700" : "text-[#374151]"
                      }`}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Voraussetzungen */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-3">
                Voraussetzungen
              </p>
              <ul className="space-y-2">
                {programm.voraussetzungen.map((v) => (
                  <li key={v} className="flex items-start gap-2.5 text-sm text-[#374151]">
                    <CheckCircle size={14} className="text-[#1D9E75] flex-shrink-0 mt-0.5" />
                    {v}
                  </li>
                ))}
              </ul>
            </div>

            {/* Fördersatz Rechner */}
            <FoerdersatzRechner programm={programm} />

            {/* CTAs */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              {wizardRoute && (
                <Link
                  href={wizardRoute}
                  className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#1D9E75] hover:bg-[#0F6E56] transition-colors px-5 py-2.5 rounded-xl"
                >
                  Antrag starten <ArrowRight size={14} />
                </Link>
              )}
              {programm.url && (
                <a
                  href={programm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-[#6b7280] border border-[#e5e7eb] hover:border-[#1D9E75]/40 transition-colors px-5 py-2.5 rounded-xl"
                >
                  Offizielle Website <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── Right column: Combinations ── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-base">💡</span>
              <div>
                <p className="font-semibold text-[#1a1a1a] text-sm leading-tight">
                  Maximiere deine Förderung
                </p>
                <p className="text-xs text-[#6b7280] mt-0.5">
                  Diese Programme kannst du kombinieren
                </p>
              </div>
            </div>

            {kombinationen.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-[#9ca3af]">
                  Keine Kombinationen in der Datenbank hinterlegt.
                </p>
                <Link
                  href="/app/foerderungen"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#1D9E75] hover:underline"
                >
                  KI-Matching starten <ArrowRight size={11} />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {kombinationen.map((partner, idx) => (
                  <KombinationsKarte
                    key={partner.id}
                    hauptProgramm={programm}
                    partnerProgramm={partner}
                    isTop={idx === 0}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Quick Tags ────────────────────────────────────────────────────────────────

const QUICK_TAGS: { label: string; query: string }[] = [
  { label: "BEG EM", query: "beg-em" },
  { label: "BAFA Heizung", query: "bafa-heizung" },
  { label: "KfW 270", query: "kfw-270" },
  { label: "Digital Jetzt", query: "digital-jetzt" },
  { label: "KfW 261", query: "kfw-261" },
  { label: "go-digital", query: "go-digital" },
];

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SuchePage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<FoerderprogrammDB[]>([]);
  const [selected, setSelected] = useState<FoerderprogrammDB | null>(null);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Search
  useEffect(() => {
    setResults(sucheInDatenbank(debouncedQuery));
  }, [debouncedQuery]);

  const handleSelect = useCallback((p: FoerderprogrammDB) => {
    setSelected(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBack = useCallback(() => {
    setSelected(null);
  }, []);

  const clearQuery = () => {
    setQuery("");
    setResults([]);
  };

  const hasQuery = query.length >= 2;
  const noResults = hasQuery && results.length === 0;

  // ── Render ──────────────────────────────────────────────────────────────────

  if (selected) {
    return (
      <div className="max-w-5xl mx-auto">
        <DetailView programm={selected} onBack={handleBack} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-1">
          Direkt nach einem Förderprogramm suchen
        </h2>
        <p className="text-[#6b7280]">
          Du weißt bereits welche Förderung dich interessiert? Suche direkt danach und erfahre wie du sie optimal kombinieren kannst.
        </p>
      </div>

      {/* Search input */}
      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="z.B. KfW 458, BEG Einzelmaßnahmen, Digital Jetzt..."
          className="w-full h-[52px] pl-11 pr-11 rounded-xl border border-[#e5e7eb] bg-white text-[#1a1a1a] placeholder-[#9ca3af] text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40 focus:border-[#1D9E75] transition-all shadow-sm"
          autoFocus
        />
        {query && (
          <button
            onClick={clearQuery}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Quick tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {QUICK_TAGS.map((tag) => (
          <button
            key={tag.query}
            onClick={() => setQuery(tag.query)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
              query === tag.query
                ? "bg-[#1D9E75] text-white border-[#1D9E75]"
                : "bg-white text-[#6b7280] border-[#e5e7eb] hover:border-[#1D9E75]/40 hover:text-[#1a1a1a]"
            }`}
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {hasQuery && (
        <div>
          {noResults ? (
            /* Empty state */
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-[#f3f4f6] flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-[#9ca3af]" />
              </div>
              <p className="font-semibold text-[#1a1a1a] mb-1">
                Kein Programm gefunden für &bdquo;{query}&ldquo;
              </p>
              <p className="text-sm text-[#6b7280] mb-6 max-w-sm mx-auto">
                Versuche den Kurznamen wie &bdquo;KfW 261&ldquo;, suche nach der Förderstelle wie &bdquo;BAFA&ldquo; oder starte das KI-Matching.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={clearQuery}
                  className="text-sm font-medium text-[#6b7280] border border-[#e5e7eb] hover:border-[#1D9E75]/40 px-5 py-2 rounded-lg transition-colors"
                >
                  Suche leeren
                </button>
                <Link
                  href="/app/foerderungen"
                  className="flex items-center justify-center gap-1.5 text-sm font-semibold text-white bg-[#1D9E75] hover:bg-[#0F6E56] transition-colors px-5 py-2 rounded-lg"
                >
                  KI-Matching starten <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : (
            /* Results list */
            <div>
              <p className="text-xs text-[#9ca3af] mb-3">{results.length} Ergebnis{results.length !== 1 ? "se" : ""}</p>
              <div className="space-y-3">
                {results.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-[#e5e7eb] rounded-xl p-5 hover:border-[#1D9E75]/40 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => handleSelect(p)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Badges */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <TypBadge typ={p.typ} />
                          <StelleBadge stelle={p.foerderstelle} />
                        </div>

                        {/* Name + max amount */}
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-semibold text-[#1a1a1a] leading-snug">
                            {p.name}
                          </p>
                          <span className="text-sm font-bold text-[#1D9E75] flex-shrink-0">
                            {p.maxBetrag.split(" ")[0] === "bis"
                              ? p.maxBetrag.split(" ").slice(0, 2).join(" ")
                              : p.maxBetrag.split(" ")[0]}
                          </span>
                        </div>

                        {/* Themen */}
                        <p className="text-xs text-[#9ca3af] mt-1">
                          {p.themen.slice(0, 4).join(", ")}
                        </p>

                        {/* Max betrag detail */}
                        <p className="text-xs text-[#6b7280] mt-1">
                          Max. {p.maxBetrag}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#f3f4f6] flex items-center justify-between">
                      <p className="text-xs text-[#9ca3af] line-clamp-1 flex-1 mr-4">
                        {p.beschreibung.substring(0, 80)}…
                      </p>
                      <button
                        className="text-xs font-semibold text-[#1D9E75] hover:text-[#0F6E56] flex items-center gap-1 flex-shrink-0 transition-colors"
                        onClick={(e) => { e.stopPropagation(); handleSelect(p); }}
                      >
                        Programm ansehen <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Idle state — no query */}
      {!hasQuery && (
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-[#E1F5EE] flex items-center justify-center mx-auto mb-4">
            <Search size={22} className="text-[#1D9E75]" />
          </div>
          <p className="text-sm font-semibold text-[#1a1a1a] mb-1">
            {foerderprogramme.length} Förderprogramme in der Datenbank
          </p>
          <p className="text-xs text-[#6b7280] mb-6">
            Suche nach Name, Förderstelle, Thema oder ID (z.B. &bdquo;beg-em&ldquo;)
          </p>
          <div className="flex flex-col items-center gap-2 text-xs text-[#6b7280]">
            <p className="font-medium">Oder starte das KI-Matching für personalisierte Ergebnisse:</p>
            <Link
              href="/app/foerderungen"
              className="flex items-center gap-1.5 text-sm font-semibold text-[#1D9E75] hover:text-[#0F6E56] transition-colors"
            >
              KI-Matching starten <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
