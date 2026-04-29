"use client";

import { Foerderprogramm } from "@/types";

interface Props {
  programme: Foerderprogramm[];
  selectedIds: string[];
  onRestart: () => void;
}

const NAECHSTE_SCHRITTE = [
  "Projektbeschreibung finalisieren und Angebote von Fachbetrieben einholen",
  "Energieeffizienz-Experten oder zugelassenen Fachbetrieb beauftragen",
  "PDF-Antrag bei der zuständigen Antragsstelle einreichen",
  "Bewilligungsbescheid abwarten — erst danach mit der Maßnahme beginnen",
];

export default function Screen4Success({ programme, selectedIds, onRestart }: Props) {
  const mainProg = programme.find((p) => p.id === selectedIds[0]) ?? programme[0];

  const stats = [
    {
      label: "Max. Förderbetrag",
      value: mainProg?.maxBetrag ?? "—",
      icon: (
        <svg className="w-5 h-5 text-[#1D9E75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Bearbeitungszeit",
      value: "4–8 Wochen",
      icon: (
        <svg className="w-5 h-5 text-[#1D9E75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Weitere Anträge",
      value: `${selectedIds.length > 1 ? selectedIds.length - 1 : 0} offen`,
      icon: (
        <svg className="w-5 h-5 text-[#1D9E75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="screen-enter screen-visible flex flex-col items-center text-center">
      {/* Success icon */}
      <div className="w-20 h-20 rounded-full bg-[#1D9E75] flex items-center justify-center mb-6 shadow-lg shadow-[#1D9E75]/20">
        <svg
          className="w-10 h-10 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-medium text-[#1a1a1a] mb-2">
        Antrag wurde vorbereitet!
      </h1>
      <p className="text-[#6b7280] text-sm leading-relaxed max-w-md mb-8">
        Ihr PDF wurde erstellt und kann jetzt direkt bei der{" "}
        <span className="font-medium text-[#1a1a1a]">
          {mainProg?.foerdergeber ?? "zuständigen Stelle"}
        </span>{" "}
        eingereicht werden.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-[12px] border border-[#e5e7eb] p-4 flex flex-col items-center gap-2"
          >
            <div className="w-10 h-10 rounded-full bg-[#E1F5EE] flex items-center justify-center">
              {stat.icon}
            </div>
            <span className="text-lg font-semibold text-[#1a1a1a]">
              {stat.value}
            </span>
            <span className="text-[12px] text-[#6b7280]">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Checklist */}
      <div className="w-full bg-white rounded-[12px] border border-[#e5e7eb] p-5 mb-6 text-left">
        <h2 className="text-[14px] font-semibold text-[#1a1a1a] mb-4">
          Nächste Schritte
        </h2>
        <ol className="flex flex-col gap-3">
          {NAECHSTE_SCHRITTE.map((schritt, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#E1F5EE] text-[#1D9E75] text-[12px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-[13px] text-[#374151] leading-relaxed">
                {schritt}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onRestart}
        className="h-11 px-8 rounded-[8px] bg-[#1D9E75] text-white text-sm font-medium hover:bg-[#0F6E56] transition-colors flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Weiteren Antrag stellen
      </button>
    </div>
  );
}
