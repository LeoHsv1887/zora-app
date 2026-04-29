"use client";

import { useState } from "react";
import { Download, FileText, File, Upload, FolderOpen } from "lucide-react";

type DokTyp = "Bescheid" | "Rechnung" | "Nachweis" | "Antrag" | "Bestätigung";

interface Dokument {
  id: number;
  name: string;
  typ: DokTyp;
  antrag: string;
  hochgeladen: string;
  groesse: string;
}

const DOKUMENTE: Dokument[] = [
  { id: 1, name: "BEG_Antrag_Muster_2025.pdf", typ: "Antrag", antrag: "BEG Einzelmaßnahmen", hochgeladen: "12.01.2025", groesse: "284 KB" },
  { id: 2, name: "KfW270_Bewilligungsbescheid.pdf", typ: "Bescheid", antrag: "KfW 270", hochgeladen: "22.11.2024", groesse: "512 KB" },
  { id: 3, name: "EEE_Bestaetigung_Energieprofi.pdf", typ: "Bestätigung", antrag: "BEG Einzelmaßnahmen", hochgeladen: "08.01.2025", groesse: "189 KB" },
  { id: 4, name: "Rechnung_Waermepumpe_Bosch.pdf", typ: "Rechnung", antrag: "BEG Einzelmaßnahmen", hochgeladen: "15.12.2024", groesse: "341 KB" },
  { id: 5, name: "Verwendungsnachweis_KfW270.pdf", typ: "Nachweis", antrag: "KfW 270", hochgeladen: "10.01.2025", groesse: "628 KB" },
  { id: 6, name: "Digital_Jetzt_Kostenplan.pdf", typ: "Antrag", antrag: "Digital Jetzt", hochgeladen: "10.01.2025", groesse: "156 KB" },
];

const TYP_COLORS: Record<DokTyp, string> = {
  Bescheid: "bg-green-100 text-green-700",
  Rechnung: "bg-blue-100 text-blue-700",
  Nachweis: "bg-amber-100 text-amber-700",
  Antrag: "bg-[#E1F5EE] text-[#1D9E75]",
  Bestätigung: "bg-purple-100 text-purple-700",
};

const KATEGORIEN: { key: "Alle" | DokTyp; label: string; count: number }[] = [
  { key: "Alle", label: "Alle Dokumente", count: DOKUMENTE.length },
  { key: "Bescheid", label: "Bescheide", count: DOKUMENTE.filter((d) => d.typ === "Bescheid").length },
  { key: "Rechnung", label: "Rechnungen", count: DOKUMENTE.filter((d) => d.typ === "Rechnung").length },
  { key: "Nachweis", label: "Nachweise", count: DOKUMENTE.filter((d) => d.typ === "Nachweis").length },
  { key: "Antrag", label: "Anträge", count: DOKUMENTE.filter((d) => d.typ === "Antrag").length },
  { key: "Bestätigung", label: "Bestätigungen", count: DOKUMENTE.filter((d) => d.typ === "Bestätigung").length },
];

export default function DokumentePage() {
  const [kategorie, setKategorie] = useState<"Alle" | DokTyp>("Alle");
  const [dragging, setDragging] = useState(false);

  const filtered = kategorie === "Alle" ? DOKUMENTE : DOKUMENTE.filter((d) => d.typ === kategorie);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-1">Deine Unterlagen & Nachweise</h2>
        <p className="text-[#6b7280] text-sm">{DOKUMENTE.length} Dokumente · alle sicher gespeichert</p>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); }}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${dragging ? "border-[#1D9E75] bg-[#E1F5EE]" : "border-[#e5e7eb] bg-white hover:border-[#1D9E75]/40 hover:bg-[#f9fafb]"}`}
      >
        <Upload size={28} className={`mx-auto mb-3 ${dragging ? "text-[#1D9E75]" : "text-[#9ca3af]"}`} />
        <p className="font-semibold text-[#1a1a1a] mb-1">Dokument hier ablegen oder klicken</p>
        <p className="text-sm text-[#9ca3af]">PDF, JPG, PNG — max. 10 MB</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Kategorien sidebar */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-4 h-fit">
          <h3 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide mb-3">Kategorien</h3>
          <div className="space-y-0.5">
            {KATEGORIEN.map((k) => (
              <button
                key={k.key}
                onClick={() => setKategorie(k.key)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${kategorie === k.key ? "bg-[#E1F5EE] text-[#1D9E75] font-semibold" : "text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#1a1a1a]"}`}
              >
                <div className="flex items-center gap-2">
                  <FolderOpen size={14} className={kategorie === k.key ? "text-[#1D9E75]" : "text-[#9ca3af]"} />
                  {k.label}
                </div>
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${kategorie === k.key ? "bg-[#1D9E75]/20 text-[#1D9E75]" : "bg-[#f3f4f6] text-[#9ca3af]"}`}>
                  {k.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Document list */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 bg-[#f9fafb] border-b border-[#e5e7eb] text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">
              <span>Dateiname</span>
              <span>Typ</span>
              <span>Antrag</span>
              <span>Hochgeladen</span>
              <span>Aktionen</span>
            </div>

            <div className="divide-y divide-[#f3f4f6]">
              {filtered.map((d) => (
                <div key={d.id} className="px-6 py-4 hover:bg-[#f9fafb] transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 md:gap-4 items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#f3f4f6] flex items-center justify-center flex-shrink-0">
                        <FileText size={16} className="text-[#6b7280]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1a1a1a] truncate max-w-[200px]">{d.name}</p>
                        <p className="text-xs text-[#9ca3af]">{d.groesse}</p>
                      </div>
                    </div>
                    <span className={`inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full w-fit ${TYP_COLORS[d.typ]}`}>
                      {d.typ}
                    </span>
                    <p className="text-sm text-[#6b7280] truncate">{d.antrag}</p>
                    <p className="text-sm text-[#6b7280]">{d.hochgeladen}</p>
                    <button className="p-1.5 rounded-lg hover:bg-[#E1F5EE] text-[#9ca3af] hover:text-[#1D9E75] transition-colors">
                      <Download size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
