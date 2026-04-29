"use client";

import { useState } from "react";
import { Star, MapPin, Phone, Mail, ChevronRight } from "lucide-react";

const ALL_PARTNERS = [
  { id: 1, name: "EnergieProfi GmbH", role: "Energieeffizienz-Experte (EEE)", typ: "EEE", bewertung: 4.9, anz: 127, distanz: 2.3, plz: "30159", tags: ["BEG", "BAFA", "Wärmepumpe", "Photovoltaik"], tel: "+49 511 12345-0", email: "info@energieprofi.de", verfuegbar: true },
  { id: 2, name: "SolarBerater Hannover", role: "Energieberater (BAFA-listiert)", typ: "EEE", bewertung: 4.7, anz: 89, distanz: 4.8, plz: "30449", tags: ["PV", "KfW 270", "BEG", "Solarthermie"], tel: "+49 511 98765-0", email: "beratung@solar-hannover.de", verfuegbar: true },
  { id: 3, name: "Klimaexperten Nord", role: "Zertifizierter Energieberater", typ: "EEE", bewertung: 4.6, anz: 64, distanz: 7.1, plz: "30519", tags: ["Heizung", "Dämmung", "BAFA", "Fenster"], tel: "+49 511 55544-0", email: "info@klimaexperten-nord.de", verfuegbar: false },
  { id: 4, name: "SHK Meister Müller", role: "Sanitär, Heizung, Klima", typ: "SHK", bewertung: 4.8, anz: 203, distanz: 1.5, plz: "30159", tags: ["Wärmepumpe", "Heizungstausch", "BEG", "Fußbodenheizung"], tel: "+49 511 11223-0", email: "kontakt@shk-mueller.de", verfuegbar: true },
  { id: 5, name: "Elektro Schmidt GmbH", role: "Elektrotechnik & Photovoltaik", typ: "Elektro", bewertung: 4.6, anz: 178, distanz: 3.2, plz: "30449", tags: ["PV-Anlage", "Wallbox", "KfW", "Smart Home"], tel: "+49 511 33445-0", email: "info@elektro-schmidt.de", verfuegbar: true },
  { id: 6, name: "Dach & Solar Bauer KG", role: "Dachdecker & Solartechnik", typ: "Dach", bewertung: 4.7, anz: 91, distanz: 5.9, plz: "30519", tags: ["Dachsanierung", "Solarthermie", "BEG", "Dämmung"], tel: "+49 511 66778-0", email: "buero@dach-solar-bauer.de", verfuegbar: true },
];

type PartnerTyp = "Alle" | "EEE" | "SHK" | "Elektro" | "Dach";

export default function PartnerPage() {
  const [typ, setTyp] = useState<PartnerTyp>("Alle");
  const [radius, setRadius] = useState(10);
  const [plz, setPlz] = useState("30159");

  const filtered = ALL_PARTNERS.filter((p) => {
    if (typ !== "Alle" && p.typ !== typ) return false;
    if (p.distanz > radius) return false;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-1">Zertifizierte Partner in deiner Nähe</h2>
        <p className="text-[#6b7280] text-sm">EEEs und Fachbetriebe für deine Förderung</p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#6b7280] mb-2">PLZ / Ort</label>
            <input
              className="zora-input"
              placeholder="30159"
              value={plz}
              onChange={(e) => setPlz(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6b7280] mb-2">Radius: {radius} km</label>
            <input
              type="range"
              min={2}
              max={50}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full h-2 bg-[#e5e7eb] rounded-full appearance-none cursor-pointer accent-[#1D9E75] mt-3"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6b7280] mb-2">Kategorie</label>
            <div className="flex flex-wrap gap-1.5">
              {(["Alle", "EEE", "SHK", "Elektro", "Dach"] as PartnerTyp[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTyp(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${typ === t ? "bg-[#1D9E75] text-white" : "bg-[#f3f4f6] text-[#6b7280] hover:bg-[#e5e7eb]"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Partner list */}
        <div className="lg:col-span-2 space-y-4">
          <p className="text-sm text-[#6b7280]">
            <strong className="text-[#1a1a1a]">{filtered.length}</strong> Partner im Umkreis von {radius} km
          </p>

          {filtered.map((p) => (
            <div key={p.id} className="bg-white border border-[#e5e7eb] rounded-xl p-5 hover:border-[#1D9E75]/40 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-9 h-9 rounded-full bg-[#E1F5EE] flex items-center justify-center text-sm font-bold text-[#1D9E75] flex-shrink-0">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1a1a1a] text-sm">{p.name}</p>
                      <p className="text-xs text-[#6b7280]">{p.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3 mb-3">
                    <div className="flex items-center gap-1">
                      <Star size={13} className="text-amber-400 fill-amber-400" />
                      <span className="text-sm font-semibold text-[#1a1a1a]">{p.bewertung}</span>
                      <span className="text-xs text-[#9ca3af]">({p.anz})</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#9ca3af]">
                      <MapPin size={11} /> {p.distanz} km
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.verfuegbar ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.verfuegbar ? "Verfügbar" : "Ausgebucht"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-[#E1F5EE] text-[#1D9E75] font-medium px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <a href={`tel:${p.tel}`} className="flex items-center gap-1.5 text-xs text-[#6b7280] hover:text-[#1D9E75] transition-colors border border-[#e5e7eb] px-3 py-1.5 rounded-lg hover:border-[#1D9E75]/40">
                      <Phone size={12} /> Anrufen
                    </a>
                    <a href={`mailto:${p.email}`} className="flex items-center gap-1.5 text-xs text-[#6b7280] hover:text-[#1D9E75] transition-colors border border-[#e5e7eb] px-3 py-1.5 rounded-lg hover:border-[#1D9E75]/40">
                      <Mail size={12} /> E-Mail
                    </a>
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#1D9E75] hover:bg-[#0F6E56] transition-colors px-3 py-1.5 rounded-lg">
                      Anfrage senden <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#9ca3af]">
              <MapPin size={32} className="mx-auto mb-3 opacity-50" />
              <p className="font-medium">Keine Partner im gewählten Radius</p>
              <p className="text-sm">Erhöhe den Radius oder ändere die Kategorie.</p>
            </div>
          )}
        </div>

        {/* Map + Stats */}
        <div className="space-y-4">
          {/* Map placeholder */}
          <div className="bg-white border-2 border-dashed border-[#e5e7eb] rounded-xl h-64 flex flex-col items-center justify-center text-[#9ca3af]">
            <MapPin size={32} className="mb-3 text-[#1D9E75] opacity-60" />
            <p className="font-medium text-sm">Kartenansicht</p>
            <p className="text-xs mt-1">Hannover, {radius} km Radius</p>
          </div>

          {/* Stats */}
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-[#1a1a1a] text-sm">Partner-Statistiken</h3>
            {[
              { label: "EEE-Berater verfügbar", value: ALL_PARTNERS.filter(p => p.typ === "EEE" && p.verfuegbar).length },
              { label: "Handwerksbetriebe", value: ALL_PARTNERS.filter(p => p.typ !== "EEE").length },
              { label: "Ø Bewertung", value: (ALL_PARTNERS.reduce((s, p) => s + p.bewertung, 0) / ALL_PARTNERS.length).toFixed(1) },
              { label: "Partner gesamt", value: ALL_PARTNERS.length },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-sm text-[#6b7280]">{s.label}</span>
                <span className="text-sm font-bold text-[#1a1a1a]">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
