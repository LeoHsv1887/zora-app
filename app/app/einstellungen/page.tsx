"use client";

import { useState } from "react";
import { Check, Upload } from "lucide-react";

type SettingsTab = "profil" | "firma" | "benachrichtigungen" | "abonnement";

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? "bg-[#1D9E75]" : "bg-[#d1d5db]"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${value ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

function InputField({ label, value, type = "text", onChange }: { label: string; value: string; type?: string; onChange?: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">{label}</label>
      <input
        type={type}
        className="zora-input"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={!onChange}
      />
    </div>
  );
}

export default function EinstellungenPage() {
  const [tab, setTab] = useState<SettingsTab>("profil");
  const [saved, setSaved] = useState(false);

  const [profil, setProfil] = useState({
    vorname: "Leonard",
    nachname: "von der Ecken",
    email: "leonard@example.de",
    telefon: "+49 511 123 456",
  });

  const [firma, setFirma] = useState({
    name: "von der Ecken Energietechnik GmbH",
    rechtsform: "GmbH",
    branche: "Sanitär/Heizung/Klima",
    mitarbeiter: "6–20",
    bundesland: "Niedersachsen",
    umsatz: "1–5Mio",
    steuernr: "21/123/45678",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    fristen: true,
    neueProgramme: true,
    partnerAnfragen: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const TABS: { key: SettingsTab; label: string }[] = [
    { key: "profil", label: "Profil" },
    { key: "firma", label: "Firma" },
    { key: "benachrichtigungen", label: "Benachrichtigungen" },
    { key: "abonnement", label: "Abonnement" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: "#0D1F1B", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Dein Profil & Einstellungen</h2>
        <p className="text-sm" style={{ color: "#6B7F7A" }}>Verwalte dein Konto und deine Präferenzen</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg w-fit" style={{ background: "#F1F5F4" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${tab === t.key ? "bg-white shadow-sm" : "hover:text-[#0D1F1B]"}`}
            style={{ color: tab === t.key ? "#0D1F1B" : "#6B7F7A" }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6" style={{ border: "1px solid #E2EAE8", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
        {/* Profil Tab */}
        {tab === "profil" && (
          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#E1F5EE] flex items-center justify-center text-xl font-bold text-[#1D9E75]">
                LV
              </div>
              <div>
                <p className="font-semibold" style={{ color: "#0D1F1B" }}>Profilbild</p>
                <button className="flex items-center gap-1.5 text-sm text-[#1D9E75] mt-1 hover:underline">
                  <Upload size={13} /> Foto hochladen
                </button>
              </div>
            </div>

            <div className="h-px bg-[#f3f4f6]" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Vorname" value={profil.vorname} onChange={(v) => setProfil({ ...profil, vorname: v })} />
              <InputField label="Nachname" value={profil.nachname} onChange={(v) => setProfil({ ...profil, nachname: v })} />
              <InputField label="E-Mail" value={profil.email} type="email" onChange={(v) => setProfil({ ...profil, email: v })} />
              <InputField label="Telefon" value={profil.telefon} onChange={(v) => setProfil({ ...profil, telefon: v })} />
            </div>

            <div className="h-px bg-[#f3f4f6]" />

            <div>
              <p className="font-semibold text-[#1a1a1a] mb-4">Passwort ändern</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Aktuelles Passwort" value="" type="password" />
                <InputField label="Neues Passwort" value="" type="password" />
              </div>
            </div>
          </div>
        )}

        {/* Firma Tab */}
        {tab === "firma" && (
          <div className="space-y-5">
            <h3 className="font-bold" style={{ color: "#0D1F1B", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Firmendaten</h3>
            <InputField label="Firmenname" value={firma.name} onChange={(v) => setFirma({ ...firma, name: v })} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Rechtsform</label>
                <select className="zora-input" value={firma.rechtsform} onChange={(e) => setFirma({ ...firma, rechtsform: e.target.value })}>
                  {["GmbH", "Einzelunternehmen", "GbR", "UG", "AG", "e.K."].map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Branche</label>
                <select className="zora-input" value={firma.branche} onChange={(e) => setFirma({ ...firma, branche: e.target.value })}>
                  {["Sanitär/Heizung/Klima", "Elektroinstallation", "Dachdeckerei", "Zimmerei", "Maler", "Kfz-Werkstatt", "Sonstiges Handwerk"].map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Mitarbeiterzahl</label>
                <select className="zora-input" value={firma.mitarbeiter} onChange={(e) => setFirma({ ...firma, mitarbeiter: e.target.value })}>
                  {["1–5", "6–20", "21–50", "51–250"].map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Bundesland</label>
                <select className="zora-input" value={firma.bundesland} onChange={(e) => setFirma({ ...firma, bundesland: e.target.value })}>
                  {["Bayern", "Niedersachsen", "Nordrhein-Westfalen", "Baden-Württemberg", "Hessen", "Berlin"].map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Jahresumsatz</label>
                <select className="zora-input" value={firma.umsatz} onChange={(e) => setFirma({ ...firma, umsatz: e.target.value })}>
                  {["unter 250k", "250k–1Mio", "1–5Mio", "über 5Mio"].map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>
              <InputField label="Steuernummer" value={firma.steuernr} onChange={(v) => setFirma({ ...firma, steuernr: v })} />
            </div>
          </div>
        )}

        {/* Benachrichtigungen Tab */}
        {tab === "benachrichtigungen" && (
          <div className="space-y-5">
            <h3 className="font-bold" style={{ color: "#0D1F1B", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Benachrichtigungen</h3>
            {[
              { key: "email" as const, label: "E-Mail-Alerts", desc: "Statusänderungen und wichtige Updates per E-Mail" },
              { key: "fristen" as const, label: "Fristen-Erinnerungen", desc: "7 und 1 Tag vor Ablauf wichtiger Fristen" },
              { key: "neueProgramme" as const, label: "Neue Förderprogramme", desc: "Wenn neue passende Programme verfügbar sind" },
              { key: "partnerAnfragen" as const, label: "Partner-Anfragen", desc: "Benachrichtigung bei neuen Partneranfragen" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-4 border-b border-[#f3f4f6] last:border-0">
                <div>
                  <p className="font-medium text-[#1a1a1a] text-sm">{item.label}</p>
                  <p className="text-xs text-[#9ca3af] mt-0.5">{item.desc}</p>
                </div>
                <Toggle
                  value={notifications[item.key]}
                  onChange={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                />
              </div>
            ))}
          </div>
        )}

        {/* Abonnement Tab */}
        {tab === "abonnement" && (
          <div className="space-y-6">
            <div className="bg-[#E1F5EE] border border-[#1D9E75]/30 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#6b7280] mb-1">Aktueller Plan</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#1a1a1a]">Pro</span>
                    <span className="bg-[#1D9E75] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">Aktiv</span>
                  </div>
                  <p className="text-sm text-[#6b7280] mt-1">49 € / Monat · nächste Abrechnung 01.05.2025</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4" style={{ color: "#0D1F1B", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Im Pro-Plan enthalten</h3>
              <div className="space-y-2.5">
                {[
                  "Unbegrenzte Förderanfragen",
                  "KI-Antragsgenerator mit PDF-Export",
                  "Alle 2.500+ Förderprogramme",
                  "Partner-Vermittlung inklusive",
                  "Status-Tracking & Fristen-Alerts",
                  "Dokumenten-Archiv (5 GB)",
                  "Prioritäts-Support",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#1D9E75] flex-shrink-0" />
                    <span className="text-sm text-[#6b7280]">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#f3f4f6] pt-5">
              <button className="flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-lg transition-all hover:-translate-y-px" style={{ background: "linear-gradient(135deg, #1D9E75, #2ECC9A)", boxShadow: "0 4px 16px rgba(29,158,117,0.3)" }}>
                Plan upgraden auf Enterprise
              </button>
              <p className="text-xs text-[#9ca3af] mt-2">Mehr Nutzer, mehr Speicher, dedizierter Account Manager.</p>
            </div>
          </div>
        )}

        {/* Save button */}
        {tab !== "abonnement" && (
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-lg transition-all hover:-translate-y-px"
              style={{ background: "linear-gradient(135deg, #1D9E75, #2ECC9A)", boxShadow: "0 4px 16px rgba(29,158,117,0.3)" }}
            >
              {saved ? <><Check size={15} /> Gespeichert!</> : "Änderungen speichern"}
            </button>
            {saved && <span className="text-sm text-[#1D9E75]">✓ Erfolgreich gespeichert</span>}
          </div>
        )}
      </div>
    </div>
  );
}
