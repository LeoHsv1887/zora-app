'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ZoraLogo } from '@/components/ZoraLogo'
import { useAuth, supabase } from '@/contexts/AuthContext'
import {
  Eye, EyeOff, ArrowRight, AlertCircle, Loader2, Check,
  Home, Users, Building2, ChevronLeft,
} from 'lucide-react'

type Nutzertyp = 'privatperson' | 'handwerker' | 'kmu'

interface Step1Data {
  vorname: string
  nachname: string
  email: string
  password: string
  passwordConfirm: string
  agbAccepted: boolean
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const score = checks.filter(Boolean).length
  const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-[#1D9E75]']
  const labels = ['Schwach', 'Mittel', 'Gut', 'Stark']
  if (!password) return null
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < score ? colors[score - 1] : 'bg-[#e5e7eb]'}`} />
        ))}
      </div>
      <p className="text-xs text-[#9ca3af]">Passwortstärke: {labels[score - 1] ?? 'Schwach'}</p>
    </div>
  )
}

function Step1({ onNext }: { onNext: (data: Step1Data) => void }) {
  const [data, setData] = useState<Step1Data>({
    vorname: '', nachname: '', email: '', password: '', passwordConfirm: '', agbAccepted: false,
  })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()

  const validate = () => {
    if (!data.vorname.trim() || !data.nachname.trim()) return 'Bitte gib Vor- und Nachnamen ein.'
    if (!data.email.includes('@')) return 'Bitte gib eine gültige E-Mail-Adresse ein.'
    if (data.password.length < 8) return 'Das Passwort muss mindestens 8 Zeichen lang sein.'
    if (data.password !== data.passwordConfirm) return 'Die Passwörter stimmen nicht überein.'
    if (!data.agbAccepted) return 'Bitte akzeptiere die AGB um fortzufahren.'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setError(null)
    setLoading(true)

    const { error } = await signUp(data.email, data.password, {
      vorname: data.vorname,
      nachname: data.nachname,
    })

    if (error) {
      setError(error.message === 'User already registered'
        ? 'Diese E-Mail ist bereits registriert. Bitte melde dich an.'
        : `Fehler: ${error.message}`)
      setLoading(false)
      return
    }

    onNext(data)
  }

  const set = (k: keyof Step1Data, v: string | boolean) => setData((d) => ({ ...d, [k]: v }))

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-[#0D1F1B] mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
        Konto erstellen
      </h2>
      <p className="text-sm text-[#6B7F7A] mb-5">Kostenlos starten — in weniger als 2 Minuten.</p>

      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Vorname</label>
          <input className="zora-input w-full" placeholder="Max" value={data.vorname} onChange={(e) => set('vorname', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Nachname</label>
          <input className="zora-input w-full" placeholder="Mustermann" value={data.nachname} onChange={(e) => set('nachname', e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">E-Mail-Adresse</label>
        <input type="email" className="zora-input w-full" placeholder="deine@email.de" value={data.email} onChange={(e) => set('email', e.target.value)} />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Passwort</label>
        <div className="relative">
          <input
            type={showPw ? 'text' : 'password'}
            className="zora-input w-full pr-10"
            placeholder="Mindestens 8 Zeichen"
            value={data.password}
            onChange={(e) => set('password', e.target.value)}
          />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280]">
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <PasswordStrength password={data.password} />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Passwort bestätigen</label>
        <input
          type="password"
          className="zora-input w-full"
          placeholder="Passwort wiederholen"
          value={data.passwordConfirm}
          onChange={(e) => set('passwordConfirm', e.target.value)}
        />
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <div
          onClick={() => set('agbAccepted', !data.agbAccepted)}
          className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center mt-0.5 transition-colors ${data.agbAccepted ? 'bg-[#1D9E75] border-[#1D9E75]' : 'border-[#d1d5db]'}`}
        >
          {data.agbAccepted && <Check size={11} className="text-white" />}
        </div>
        <span className="text-sm text-[#6b7280]">
          Ich akzeptiere die{' '}
          <a href="#" className="text-[#1D9E75] hover:underline">AGB</a> und die{' '}
          <a href="#" className="text-[#1D9E75] hover:underline">Datenschutzerklärung</a>.
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 text-white text-sm font-bold py-3 rounded-xl transition-all hover:-translate-y-px disabled:opacity-60 disabled:translate-y-0 mt-2"
        style={{ background: 'linear-gradient(135deg, #1D9E75, #2ECC9A)', boxShadow: '0 8px 24px rgba(29,158,117,0.35)' }}
      >
        {loading ? <><Loader2 size={16} className="animate-spin" /> Konto wird erstellt…</> : <>Konto erstellen <ArrowRight size={16} /></>}
      </button>
    </form>
  )
}

function Step2({ onNext, onBack }: { onNext: (typ: Nutzertyp) => void; onBack: () => void }) {
  const [selected, setSelected] = useState<Nutzertyp | null>(null)

  const CARDS = [
    {
      typ: 'privatperson' as Nutzertyp,
      icon: <Home size={24} />,
      title: 'Privatperson',
      desc: 'Eigenheim sanieren, PV-Anlage, Wärmepumpe & mehr.',
      tags: ['KfW', 'BAFA', 'Länderprogramme'],
    },
    {
      typ: 'handwerker' as Nutzertyp,
      icon: <Users size={24} />,
      title: 'Handwerker & Betrieb',
      desc: 'Für dich als Betrieb und für deine Kunden vermitteln.',
      tags: ['Investitionsförderung', 'Kunden-Matching'],
    },
    {
      typ: 'kmu' as Nutzertyp,
      icon: <Building2 size={24} />,
      title: 'KMU & Unternehmen',
      desc: 'Wachstum, Digitalisierung, Energie & Nachhaltigkeit.',
      tags: ['Digital Jetzt', 'KfW', 'BAFA'],
    },
  ]

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-[#6b7280] hover:text-[#1a1a1a] mb-4 transition-colors">
        <ChevronLeft size={16} /> Zurück
      </button>
      <h2 className="text-2xl font-bold text-[#0D1F1B] mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
        Wer bist du?
      </h2>
      <p className="text-sm text-[#6B7F7A] mb-6">Wähle aus, für wen du Förderungen suchst.</p>

      <div className="space-y-3 mb-6">
        {CARDS.map((c) => {
          const active = selected === c.typ
          return (
            <button
              key={c.typ}
              type="button"
              onClick={() => setSelected(c.typ)}
              className="w-full text-left p-4 rounded-xl border-2 transition-all"
              style={{
                borderColor: active ? '#1D9E75' : '#e5e7eb',
                background: active ? '#E1F5EE' : 'white',
              }}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 mt-0.5 ${active ? 'text-[#1D9E75]' : 'text-[#9ca3af]'}`}>{c.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#0D1F1B]">{c.title}</p>
                  <p className="text-sm text-[#6b7280] mt-0.5">{c.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {c.tags.map((t) => (
                      <span key={t} className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: '#F1F5F4', color: '#6B7F7A' }}>{t}</span>
                    ))}
                  </div>
                </div>
                {active && (
                  <div className="w-5 h-5 rounded-full bg-[#1D9E75] flex items-center justify-center flex-shrink-0">
                    <Check size={11} className="text-white" />
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => selected && onNext(selected)}
        disabled={!selected}
        className="w-full flex items-center justify-center gap-2 text-white text-sm font-bold py-3 rounded-xl transition-all hover:-translate-y-px disabled:opacity-40 disabled:translate-y-0"
        style={{ background: 'linear-gradient(135deg, #1D9E75, #2ECC9A)', boxShadow: '0 8px 24px rgba(29,158,117,0.35)' }}
      >
        Weiter <ArrowRight size={16} />
      </button>
    </div>
  )
}

function Step3({ nutzertyp, userId, onDone }: { nutzertyp: Nutzertyp; userId: string; onDone: () => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [privatData, setPrivatData] = useState({ plz: '', bundesland: '' })
  const [handwerkerData, setHandwerkerData] = useState({ firmenname: '', branche: '', bundesland: '' })
  const [kmuData, setKmuData] = useState({ firmenname: '', branche: '', mitarbeiter: '' })

  const BUNDESLAENDER = ['Bayern', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 'Hessen',
    'Mecklenburg-Vorpommern', 'Niedersachsen', 'Nordrhein-Westfalen', 'Rheinland-Pfalz',
    'Saarland', 'Sachsen', 'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen', 'Baden-Württemberg']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Update profile nutzertyp
      await supabase.from('profiles').update({ nutzertyp }).eq('id', userId)

      // Save company data if applicable
      if (nutzertyp === 'handwerker') {
        await supabase.from('firmenprofile').upsert({
          user_id: userId,
          firmenname: handwerkerData.firmenname,
          branche: handwerkerData.branche,
          bundesland: handwerkerData.bundesland,
        }, { onConflict: 'user_id' })
      } else if (nutzertyp === 'kmu') {
        await supabase.from('firmenprofile').upsert({
          user_id: userId,
          firmenname: kmuData.firmenname,
          branche: kmuData.branche,
          mitarbeiter: kmuData.mitarbeiter,
        }, { onConflict: 'user_id' })
      }

      onDone()
    } catch {
      setError('Profil konnte nicht gespeichert werden. Du kannst es später in den Einstellungen anpassen.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-[#0D1F1B] mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
        Profil vervollständigen
      </h2>
      <p className="text-sm text-[#6B7F7A] mb-5">Noch ein paar Details — damit dein Matching noch besser wird.</p>

      {error && (
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {nutzertyp === 'privatperson' && (
        <>
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Postleitzahl</label>
            <input className="zora-input w-full" placeholder="z.B. 30159" value={privatData.plz} onChange={(e) => setPrivatData({ ...privatData, plz: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Bundesland</label>
            <select className="zora-input w-full bg-white" value={privatData.bundesland} onChange={(e) => setPrivatData({ ...privatData, bundesland: e.target.value })}>
              <option value="">Bitte wählen…</option>
              {BUNDESLAENDER.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
        </>
      )}

      {nutzertyp === 'handwerker' && (
        <>
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Firmenname</label>
            <input className="zora-input w-full" placeholder="z.B. Mustermann Heizung GmbH" value={handwerkerData.firmenname} onChange={(e) => setHandwerkerData({ ...handwerkerData, firmenname: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Branche</label>
            <select className="zora-input w-full bg-white" value={handwerkerData.branche} onChange={(e) => setHandwerkerData({ ...handwerkerData, branche: e.target.value })}>
              <option value="">Bitte wählen…</option>
              {['Sanitär / Heizung / Klima', 'Elektroinstallation', 'Dachdeckerei', 'Zimmerei', 'Malerarbeiten', 'Kfz-Werkstatt', 'Sonstiges Handwerk'].map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Bundesland</label>
            <select className="zora-input w-full bg-white" value={handwerkerData.bundesland} onChange={(e) => setHandwerkerData({ ...handwerkerData, bundesland: e.target.value })}>
              <option value="">Bitte wählen…</option>
              {BUNDESLAENDER.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
        </>
      )}

      {nutzertyp === 'kmu' && (
        <>
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Firmenname</label>
            <input className="zora-input w-full" placeholder="z.B. Mustermann GmbH" value={kmuData.firmenname} onChange={(e) => setKmuData({ ...kmuData, firmenname: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Branche</label>
            <select className="zora-input w-full bg-white" value={kmuData.branche} onChange={(e) => setKmuData({ ...kmuData, branche: e.target.value })}>
              <option value="">Bitte wählen…</option>
              {['Produktion / Fertigung', 'Handel', 'Dienstleistungen', 'IT / Software', 'Gesundheit', 'Bau / Immobilien', 'Sonstiges'].map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">Mitarbeiterzahl</label>
            <select className="zora-input w-full bg-white" value={kmuData.mitarbeiter} onChange={(e) => setKmuData({ ...kmuData, mitarbeiter: e.target.value })}>
              <option value="">Bitte wählen…</option>
              {['1–5', '6–20', '21–50', '51–250', 'Über 250'].map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 text-white text-sm font-bold py-3 rounded-xl transition-all hover:-translate-y-px disabled:opacity-60 disabled:translate-y-0 mt-2"
        style={{ background: 'linear-gradient(135deg, #1D9E75, #2ECC9A)', boxShadow: '0 8px 24px rgba(29,158,117,0.35)' }}
      >
        {loading ? <><Loader2 size={16} className="animate-spin" /> Speichern…</> : <>Dashboard öffnen <ArrowRight size={16} /></>}
      </button>

      <button type="button" onClick={onDone} className="w-full text-center text-xs text-[#9ca3af] hover:text-[#6b7280] mt-1">
        Überspringen — später in den Einstellungen anpassen
      </button>
    </form>
  )
}

export default function RegistrierungPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null)
  const [nutzertyp, setNutzertyp] = useState<Nutzertyp>('privatperson')

  const STEP_LABELS = ['Account', 'Nutzertyp', 'Profil']

  const handleStep1Done = (data: Step1Data) => {
    setStep1Data(data)
    setStep(2)
  }

  const handleStep2Done = (typ: Nutzertyp) => {
    setNutzertyp(typ)
    setStep(3)
  }

  const handleDone = () => {
    router.push('/app/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: 'linear-gradient(135deg, #0D1F1B 0%, #0F2920 100%)' }}>
      {/* Logo */}
      <div className="mb-8">
        <ZoraLogo href="/" variant="light" />
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl p-8" style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-7">
          {STEP_LABELS.map((label, i) => {
            const s = i + 1
            const done = step > s
            const active = step === s
            return (
              <div key={label} className="flex items-center gap-1.5 flex-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                    done ? 'bg-[#1D9E75] text-white' : active ? 'bg-[#0D1F1B] text-white' : 'bg-[#e5e7eb] text-[#9ca3af]'
                  }`}
                >
                  {done ? <Check size={11} /> : s}
                </div>
                <span className={`text-xs font-medium ${active ? 'text-[#0D1F1B]' : 'text-[#9ca3af]'}`}>{label}</span>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`flex-1 h-px mx-1 ${done ? 'bg-[#1D9E75]' : 'bg-[#e5e7eb]'}`} />
                )}
              </div>
            )
          })}
        </div>

        {step === 1 && <Step1 onNext={handleStep1Done} />}
        {step === 2 && <Step2 onNext={handleStep2Done} onBack={() => setStep(1)} />}
        {step === 3 && (
          <Step3
            nutzertyp={nutzertyp}
            userId={user?.id ?? ''}
            onDone={handleDone}
          />
        )}
      </div>

      <p className="mt-5 text-sm text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>
        Bereits registriert?{' '}
        <Link href="/login" className="text-[#2ECC9A] font-medium hover:underline">Anmelden</Link>
      </p>

      <p className="mt-3 text-xs text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
        © 2025 Zora GmbH · Datenschutz · Impressum
      </p>
    </div>
  )
}
