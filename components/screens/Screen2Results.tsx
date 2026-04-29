"use client";

import Link from "next/link";
import { FirmenProfil, Foerderprogramm } from "@/types";
import { WIZARD_ROUTES } from "@/lib/wizardConfigs";

interface Props {
  profil: FirmenProfil;
  programmes: Foerderprogramm[];
  selected: string[];
  onToggle: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const BADGE_STYLES: Record<string, string> = {
  Zuschuss: "bg-[#E1F5EE] text-[#1D9E75]",
  Kredit: "bg-[#EFF6FF] text-[#3b82f6]",
  befristet: "bg-[#FFFBEB] text-[#d97706]",
};

export default function Screen2Results({
  profil,
  programmes,
  selected,
  onToggle,
  onBack,
  onNext,
}: Props) {
  return (
    <div className="screen-enter screen-visible">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-[#1a1a1a] mb-1">
          {programmes.length} passende Förderungen gefunden
        </h1>
        <p className="text-[#6b7280] text-sm">
          Basierend auf Ihrem Profil als{" "}
          <span className="text-[#1a1a1a] font-medium">{profil.branche}</span>-Betrieb
          {profil.firmenname ? (
            <>
              {" "}(
              <span className="text-[#1a1a1a] font-medium">
                {profil.firmenname}
              </span>
              )
            </>
          ) : null}
          . Wählen Sie die Programme, für die Sie einen Antrag stellen möchten.
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3 mb-6">
        {programmes.map((prog) => {
          const isSelected = selected.includes(prog.id);
          return (
            <button
              key={prog.id}
              type="button"
              onClick={() => onToggle(prog.id)}
              className={`text-left w-full bg-white rounded-[12px] border p-5 transition-all cursor-pointer ${
                isSelected
                  ? "border-[#1D9E75] ring-2 ring-[#1D9E75]/20"
                  : "border-[#e5e7eb] hover:border-[#1D9E75]/40"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Main content */}
                <div className="flex-1 min-w-0">
                  {/* Title row */}
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-semibold text-[15px] text-[#1a1a1a]">
                      {prog.name}
                    </span>
                    <span
                      className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                        BADGE_STYLES[prog.badge] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {prog.badge}
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
                    <span className="text-[13px] text-[#6b7280] flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                      </svg>
                      {prog.foerdergeber}
                    </span>
                    <span className="text-[13px] text-[#6b7280] flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {prog.maxBetrag}
                    </span>
                    <span className="text-[13px] text-[#6b7280] flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {prog.frist}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[13px] text-[#6b7280] leading-relaxed mb-3 line-clamp-2">
                    {prog.beschreibung}
                  </p>

                  {/* Progress bar */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="progress-track flex-1">
                      <div
                        className="progress-fill"
                        style={{ width: `${prog.passung}%` }}
                      />
                    </div>
                    <span className="text-[13px] font-semibold text-[#1D9E75] w-10 text-right flex-shrink-0">
                      {prog.passung}%
                    </span>
                    <span className="text-[12px] text-[#9ca3af] hidden sm:block">
                      Passung
                    </span>
                  </div>

                  {/* Wizard CTA */}
                  {WIZARD_ROUTES[prog.id] ? (
                    <Link
                      href={WIZARD_ROUTES[prog.id]}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#1D9E75] hover:text-[#0F6E56] transition-colors"
                    >
                      Antrag jetzt starten
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[12px] text-[#9ca3af] cursor-not-allowed" title="Vollständiger Wizard in Kürze verfügbar">
                      Antrag vorbereiten
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-[10px]">(demnächst)</span>
                    </span>
                  )}
                </div>

                {/* Checkbox */}
                <div
                  className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5 transition-all ${
                    isSelected
                      ? "bg-[#1D9E75] border-[#1D9E75]"
                      : "border-[#d1d5db] bg-white"
                  }`}
                >
                  {isSelected && (
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selection hint */}
      {selected.length > 0 && (
        <p className="text-[13px] text-[#6b7280] mb-4 text-center">
          <span className="font-medium text-[#1D9E75]">{selected.length}</span>{" "}
          {selected.length === 1 ? "Förderung ausgewählt" : "Förderungen ausgewählt"}
        </p>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 h-11 rounded-[8px] border border-[#e5e7eb] bg-white text-[#1a1a1a] text-sm font-medium hover:bg-[#f9fafb] transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Zurück
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={selected.length === 0}
          className={`flex-1 h-11 rounded-[8px] text-sm font-medium flex items-center justify-center gap-2 transition-all ${
            selected.length > 0
              ? "bg-[#1D9E75] text-white hover:bg-[#0F6E56]"
              : "bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed"
          }`}
        >
          Antrag vorbereiten
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
