"use client";

import { FirmenProfil, Foerderprogramm, AntragsData } from "@/types";

interface Props {
  profil: FirmenProfil;
  programme: Foerderprogramm[];
  selectedIds: string[];
  antrag: AntragsData;
  onChange: (updated: AntragsData) => void;
  onBack: () => void;
  onExport: () => void;
}

function generateProjectDescription(
  profil: FirmenProfil,
  prog: Foerderprogramm
): string {
  return `${profil.firmenname || "Das Unternehmen"} ist ein ${profil.branche || "Handwerksbetrieb"} mit ${profil.mitarbeiterzahl || "mehreren"} Mitarbeitern in ${profil.bundesland || "Deutschland"} (Rechtsform: ${profil.rechtsform || "k.A."}). Im Rahmen des vorliegenden Förderantrags plant das Unternehmen folgendes Vorhaben: ${profil.vorhaben || "eine betriebliche Investitionsmaßnahme"}. Dieses Vorhaben erfüllt die Voraussetzungen des Förderprogramms „${prog.name}" (Fördergeber: ${prog.foerdergeber}). Die geplante Maßnahme dient der nachhaltigen Stärkung der betrieblichen Wettbewerbsfähigkeit und trägt zur Erreichung der förderpolitischen Ziele des Programms bei. Der beantragte Förderbetrag beläuft sich auf den maximal förderfähigen Betrag gemäß Programmrichtlinien.`;
}

export default function Screen3Application({
  profil,
  programme,
  selectedIds,
  antrag,
  onChange,
  onBack,
  onExport,
}: Props) {
  const mainProg =
    programme.find((p) => p.id === selectedIds[0]) ?? programme[0];

  // Hint text based on programme
  const getHint = (prog: Foerderprogramm) => {
    if (prog.name.includes("BEG") || prog.name.includes("Heizung")) {
      return "Sie benötigen einen zugelassenen Energieeffizienz-Experten (EEE) vor Baubeginn. Stellen Sie sicher, dass der Experte die Maßnahme bestätigt, bevor Sie mit der Umsetzung beginnen.";
    }
    if (prog.name.includes("KfW")) {
      return "Der KfW-Antrag muss zwingend vor Beginn des Vorhabens gestellt werden. Beauftragen Sie zunächst eine akkreditierte Bank als Hausbank für die Antragsstellung.";
    }
    if (prog.name.includes("Digital")) {
      return "Das Programm ist befristet. Reichen Sie den Antrag baldmöglichst ein — Mittel werden nach Antragsdatum vergeben, bis das Budget erschöpft ist.";
    }
    return "Stellen Sie sicher, dass alle erforderlichen Unterlagen vollständig vorliegen, bevor Sie den Antrag einreichen. Eine frühzeitige Einreichung erhöht Ihre Erfolgschancen.";
  };

  const handleProjektbeschreibungInit = () => {
    if (!antrag.projektbeschreibung && mainProg) {
      onChange({
        ...antrag,
        projektbeschreibung: generateProjectDescription(profil, mainProg),
      });
    }
  };

  // Auto-fill on first render if empty
  if (!antrag.projektbeschreibung && mainProg) {
    // We call this via effect-like logic — just set initial value
  }

  const labelClass = "block text-[13px] font-medium text-[#1a1a1a] mb-1.5";
  const inputClass = "zora-input";

  return (
    <div className="screen-enter screen-visible">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-[#1a1a1a] mb-1">
          Antrag vorbereiten
        </h1>
        <p className="text-[#6b7280] text-sm">
          Prüfen Sie Ihre Angaben und ergänzen Sie die Projektdetails.
        </p>
      </div>

      {/* KI Hint */}
      {mainProg && (
        <div className="bg-[#E1F5EE] border border-[#1D9E75]/20 rounded-[10px] p-4 mb-6 flex gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg
              className="w-5 h-5 text-[#1D9E75]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#1D9E75] mb-0.5">
              KI-Hinweis für {mainProg.name}
            </p>
            <p className="text-[13px] text-[#0F6E56] leading-relaxed">
              {getHint(mainProg)}
            </p>
          </div>
        </div>
      )}

      {/* Section 1: Antragsteller */}
      <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-5 mb-4">
        <h2 className="text-[14px] font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#E1F5EE] text-[#1D9E75] text-[11px] font-bold flex items-center justify-center flex-shrink-0">
            1
          </span>
          Antragsteller
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            ["Firmenname", profil.firmenname],
            ["Rechtsform", profil.rechtsform],
            ["Branche", profil.branche],
            ["Mitarbeiterzahl", profil.mitarbeiterzahl],
            ["Bundesland", profil.bundesland],
            ["Jahresumsatz", profil.jahresumsatz],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-[12px] text-[#9ca3af] font-medium">
                {label}
              </span>
              <span className="text-[13px] text-[#1a1a1a]">
                {value || "—"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Förderprogramm */}
      {mainProg && (
        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-5 mb-4">
          <h2 className="text-[14px] font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#E1F5EE] text-[#1D9E75] text-[11px] font-bold flex items-center justify-center flex-shrink-0">
              2
            </span>
            Ausgewählte Förderung
            {selectedIds.length > 1 && (
              <span className="text-[12px] text-[#6b7280] font-normal ml-1">
                (Hauptantrag)
              </span>
            )}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              ["Programmname", mainProg.name],
              ["Förderbetrag", mainProg.maxBetrag],
              ["Programmtyp", mainProg.badge],
              ["Antragsstelle", mainProg.foerdergeber],
              ["Frist", mainProg.frist],
              ["Passungsgrad", `${mainProg.passung}%`],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-[12px] text-[#9ca3af] font-medium">
                  {label}
                </span>
                <span className="text-[13px] text-[#1a1a1a]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Projektbeschreibung */}
      <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-5 mb-6">
        <h2 className="text-[14px] font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#E1F5EE] text-[#1D9E75] text-[11px] font-bold flex items-center justify-center flex-shrink-0">
            3
          </span>
          Projektbeschreibung
        </h2>
        <textarea
          className="zora-textarea"
          rows={5}
          value={
            antrag.projektbeschreibung ||
            (mainProg ? generateProjectDescription(profil, mainProg) : "")
          }
          onClick={handleProjektbeschreibungInit}
          onChange={(e) =>
            onChange({ ...antrag, projektbeschreibung: e.target.value })
          }
        />
        <p className="text-[12px] text-[#9ca3af] mt-2">
          Von Zora KI generiert — bitte nach Bedarf anpassen.
        </p>
      </div>

      {/* Additional fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className={labelClass}>Geschätzte Investitionssumme (€)</label>
          <input
            className={inputClass}
            type="text"
            placeholder="z.B. 45.000"
            value={antrag.investitionssumme}
            onChange={(e) =>
              onChange({ ...antrag, investitionssumme: e.target.value })
            }
          />
        </div>
        <div>
          <label className={labelClass}>Geplanter Umsetzungsbeginn</label>
          <input
            className={inputClass}
            type="text"
            placeholder="z.B. Q3 2025"
            value={antrag.umsetzungsbeginn}
            onChange={(e) =>
              onChange({ ...antrag, umsetzungsbeginn: e.target.value })
            }
          />
        </div>
      </div>

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
          onClick={onExport}
          className="flex-1 h-11 rounded-[8px] bg-[#1D9E75] text-white text-sm font-medium hover:bg-[#0F6E56] transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Als PDF exportieren &amp; einreichen
        </button>
      </div>
    </div>
  );
}
