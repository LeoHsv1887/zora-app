"use client";

import { FirmenProfil } from "@/types";

interface Props {
  profil: FirmenProfil;
  onChange: (updated: FirmenProfil) => void;
  onSubmit: () => void;
}

export default function Screen1Profile({ profil, onChange, onSubmit }: Props) {
  const set = <K extends keyof FirmenProfil>(key: K, value: FirmenProfil[K]) =>
    onChange({ ...profil, [key]: value });

  const isValid =
    profil.firmenname.trim() !== "" &&
    profil.rechtsform !== "" &&
    profil.branche !== "" &&
    profil.mitarbeiterzahl !== "" &&
    profil.bundesland !== "" &&
    profil.jahresumsatz !== "" &&
    profil.vorhaben.trim() !== "";

  const inputClass = "zora-input";
  const labelClass = "block text-[13px] font-medium text-[#1a1a1a] mb-1.5";

  return (
    <div className="screen-enter screen-visible">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-[#1a1a1a] mb-2">
          Ihr Firmenprofil
        </h1>
        <p className="text-[#6b7280] text-sm leading-relaxed">
          Nur wenige Angaben — unsere KI findet dann alles Passende.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isValid) onSubmit();
        }}
      >
        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Firmenname */}
            <div className="sm:col-span-2">
              <label className={labelClass}>Firmenname</label>
              <input
                className={inputClass}
                type="text"
                placeholder="z.B. Mustermann GmbH"
                value={profil.firmenname}
                onChange={(e) => set("firmenname", e.target.value)}
              />
            </div>

            {/* Rechtsform */}
            <div>
              <label className={labelClass}>Rechtsform</label>
              <select
                className={inputClass}
                value={profil.rechtsform}
                onChange={(e) => set("rechtsform", e.target.value as FirmenProfil["rechtsform"])}
              >
                <option value="">Bitte wählen</option>
                <option>GmbH</option>
                <option>Einzelunternehmen</option>
                <option>GbR</option>
                <option>UG</option>
                <option>AG</option>
                <option>e.K.</option>
              </select>
            </div>

            {/* Branche */}
            <div>
              <label className={labelClass}>Branche</label>
              <select
                className={inputClass}
                value={profil.branche}
                onChange={(e) => set("branche", e.target.value as FirmenProfil["branche"])}
              >
                <option value="">Bitte wählen</option>
                <option>Sanitär/Heizung/Klima</option>
                <option>Elektroinstallation</option>
                <option>Dachdeckerei</option>
                <option>Zimmerei</option>
                <option>Maler</option>
                <option>Kfz-Werkstatt</option>
                <option>Sonstiges Handwerk</option>
              </select>
            </div>

            {/* Mitarbeiterzahl */}
            <div>
              <label className={labelClass}>Mitarbeiterzahl</label>
              <select
                className={inputClass}
                value={profil.mitarbeiterzahl}
                onChange={(e) => set("mitarbeiterzahl", e.target.value as FirmenProfil["mitarbeiterzahl"])}
              >
                <option value="">Bitte wählen</option>
                <option>1–5</option>
                <option>6–20</option>
                <option>21–50</option>
                <option>51–250</option>
              </select>
            </div>

            {/* Bundesland */}
            <div>
              <label className={labelClass}>Bundesland</label>
              <select
                className={inputClass}
                value={profil.bundesland}
                onChange={(e) => set("bundesland", e.target.value as FirmenProfil["bundesland"])}
              >
                <option value="">Bitte wählen</option>
                <option>Baden-Württemberg</option>
                <option>Bayern</option>
                <option>Berlin</option>
                <option>Brandenburg</option>
                <option>Bremen</option>
                <option>Hamburg</option>
                <option>Hessen</option>
                <option>Mecklenburg-Vorpommern</option>
                <option>Niedersachsen</option>
                <option>Nordrhein-Westfalen</option>
                <option>Rheinland-Pfalz</option>
                <option>Saarland</option>
                <option>Sachsen</option>
                <option>Sachsen-Anhalt</option>
                <option>Schleswig-Holstein</option>
                <option>Thüringen</option>
              </select>
            </div>

            {/* Jahresumsatz */}
            <div className="sm:col-span-2">
              <label className={labelClass}>Jahresumsatz</label>
              <select
                className={inputClass}
                value={profil.jahresumsatz}
                onChange={(e) => set("jahresumsatz", e.target.value as FirmenProfil["jahresumsatz"])}
              >
                <option value="">Bitte wählen</option>
                <option>unter 250k</option>
                <option>250k–1Mio</option>
                <option>1–5Mio</option>
                <option>über 5Mio</option>
              </select>
            </div>

            {/* Vorhaben */}
            <div className="sm:col-span-2">
              <label className={labelClass}>
                Was planen Sie?
                <span className="text-[#9ca3af] font-normal ml-1">
                  (kurze Beschreibung Ihres Vorhabens)
                </span>
              </label>
              <textarea
                className="zora-textarea"
                rows={3}
                placeholder="z.B. Wir möchten unsere Heizungsanlage auf Wärmepumpe umstellen und gleichzeitig eine PV-Anlage auf dem Betriebsgebäude installieren."
                value={profil.vorhaben}
                onChange={(e) => set("vorhaben", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          type="submit"
          disabled={!isValid}
          className={`w-full h-12 rounded-[8px] font-medium text-sm flex items-center justify-center gap-2 transition-all ${
            isValid
              ? "bg-[#1D9E75] text-white hover:bg-[#0F6E56] cursor-pointer shadow-sm"
              : "bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed"
          }`}
        >
          Förderungen finden
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
