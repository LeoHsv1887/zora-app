"use client";

import { useState, useEffect } from "react";
import { Check, Upload, Loader2 } from "lucide-react";
import { useAuth, supabase } from "@/contexts/AuthContext";

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

function InputField({ label, value, type = "text", onChange, readOnly }: { label: string; value: string; type?: string; onChange?: (v: string) => void; readOnly?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">{label}</label>
      <input
        type={type}
        className="zora-input"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly || !onChange}
      />
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[#E2EAE8] rounded ${className}`} />;
}

function getUserInitials(vorname?: string, nachname?: string): string {
  if (vorname && nachname) return `${vorname[0]}${nachname[0]}`.toUpperCase();
  if (vorname) return vorname.slice(0, 2).toUpperCase();
  return "?";
}

export default function EinstellungenPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<SettingsTab>("profil");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profil, setProfil] = useState({
    vorname: "",
    nachname: "",
    email: "",
    telefon: "",
  });

  const [firma, setFirma] = useState({
    name: "",
    rechtsform: "GmbH",
    branche: "Sanitär/Heizung/Klima",
    mitarbeiter: "6–20",
    bundesland: "Niedersachsen",
    umsatz: "1–5Mio",
    steuernr: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    fristen: true,
    neueProgramme: true,
    partnerAnfragen: false,
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaved, setPasswordSaved] = useState(false);

  // Load profile data from Supabase
  useEffect(() => {
    if (!user) return;

    Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("firmenprofile").select("*").eq("user_id", user.id).single(),
    ]).then(([profileRes, firmaRes]) => {
      if (profileRes.data) {
        setProfil({
          vorname: profileRes.data.vorname ?? user.user_metadata?.vorname ?? "",
          nachname: profileRes.data.nachname ?? user.user_metadata?.nachname ?? "",
          email: profileRes.data.email ?? user.email ?? "",
          telefon: profileRes.data.telefon ?? "",
        });
      } else {
        // Fallback to user metadata
        setProfil({
          vorname: user.user_metadata?.vorname ?? "",
          nachname: user.user_metadata?.nachname ?? "",
          email: user.email ?? "",
          telefon: "",
        });
      }

      if (firmaRes.data) {
        setFirma({
          name: firmaRes.data.firmenname ?? "",
          rechtsform: firmaRes.data.rechtsform ?? "GmbH",
          branche: firmaRes.data.branche ?? "Sanitär/Heizung/Klima",
          mitarbeiter: firmaRes.data.mitarbeiter ?? "6–20",
          bundesland: firmaRes.data.bundesland ?? "Niedersachsen",
          umsatz: firmaRes.data.umsatz ?? "1–5Mio",
          steuernr: firmaRes.data.steuernr ?? "",
        });
      }

      setLoading(false);
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    if (tab === "profil") {
      await supabase.from("profiles").upsert({
        id: user.id,
        email: profil.email,
        vorname: profil.vorname,
        nachname: profil.nachname,
        telefon: profil.telefon,
        updated_at: new Date().toISOString(),
      });
    }

    if (tab === "firma") {
      await supabase.from("firmenprofile").upsert({
        user_id: user.id,
        firmenname: firma.name,
        rechtsform: firma.rechtsform,
        branche: firma.branche,
        mitarbeiter: firma.mitarbeiter,
        bundesland: firma.bundesland,
        umsatz: firma.umsatz,
        steuernr: firma.steuernr,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 8) {
      setPasswordError("Das neue Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }
    setPasswordError(null);
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);
    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setPasswordSaved(false), 3000);
    }
  };

  const initials = getUserInitials(profil.vorname, profil.nachname);

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
                {loading ? "…" : initials}
              </div>
              <div>
                <p className="font-semibold" style={{ color: "#0D1F1B" }}>Profilbild</p>
                <button className="flex items-center gap-1.5 text-sm text-[#1D9E75] mt-1 hover:underline">
                  <Upload size={13} /> Foto hochladen
                </button>
              </div>
            </div>

            <div className="h-px bg-[#f3f4f6]" />

            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Vorname" value={profil.vorname} onChange={(v) => setProfil({ ...profil, vorname: v })} />
                <InputField label="Nachname" value={profil.nachname} onChange={(v) => setProfil({ ...profil, nachname: v })} />
                <InputField label="E-Mail" value={profil.email} type="email" onChange={(v) => setProfil({ ...profil, email: v })} />
                <InputField label="Telefon" value={profil.telefon} onChange={(v) => setProfil({ ...profil, telefon: v })} />
              </div>
            )}

            <div className="h-px bg-[#f3f4f6]" />

            <div>
              <p className="font-semibold text-[#1a1a1a] mb-4">Passwort ändern</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Aktuelles Passwort</label>
                  <input type="password" className="zora-input" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Neues Passwort</label>
                  <input type="password" className="zora-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 8 Zeichen" />
                </div>
              </div>
              {passwordError && <p className="text-xs text-red-600 mt-2">{passwordError}</p>}
              {passwordSaved && <p className="text-xs text-[#1D9E75] mt-2 flex items-center gap-1"><Check size={12} /> Passwort geändert</p>}
              {(currentPassword || newPassword) && (
                <button
                  onClick={handlePasswordChange}
                  disabled={saving}
                  className="mt-3 text-xs font-semibold text-[#1D9E75] hover:underline disabled:opacity-60"
                >
                  Passwort aktualisieren
                </button>
              )}
            </div>
          </div>
        )}

        {/* Firma Tab */}
        {tab === "firma" && (
          <div className="space-y-5">
            <h3 className="font-bold" style={{ color: "#0D1F1B", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Firmendaten</h3>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        )}

        {/* Benachrichtigungen */}
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

        {/* Abonnement */}
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
                {["Unbegrenzte Förderanfragen", "KI-Antragsgenerator mit PDF-Export", "Alle 2.500+ Förderprogramme", "Partner-Vermittlung inklusive", "Status-Tracking & Fristen-Alerts", "Dokumenten-Archiv (5 GB)", "Prioritäts-Support"].map((f) => (
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
              disabled={saving || loading}
              className="flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-lg transition-all hover:-translate-y-px disabled:opacity-60 disabled:translate-y-0"
              style={{ background: "linear-gradient(135deg, #1D9E75, #2ECC9A)", boxShadow: "0 4px 16px rgba(29,158,117,0.3)" }}
            >
              {saving ? <><Loader2 size={14} className="animate-spin" /> Speichern…</> : saved ? <><Check size={14} /> Gespeichert!</> : "Änderungen speichern"}
            </button>
            {saved && <span className="text-sm text-[#1D9E75] flex items-center gap-1"><Check size={14} /> Erfolgreich gespeichert</span>}
          </div>
        )}
      </div>
    </div>
  );
}
