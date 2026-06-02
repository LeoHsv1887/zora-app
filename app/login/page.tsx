'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ZoraLogo } from '@/components/ZoraLogo'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError('E-Mail oder Passwort ist falsch. Bitte überprüfe deine Eingaben.')
      setLoading(false)
      return
    }

    router.push('/app/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #0D1F1B 0%, #0F2920 100%)' }}>
      {/* Logo */}
      <div className="mb-8">
        <ZoraLogo href="/" variant="light" />
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl p-8" style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
        <h1 className="text-2xl font-bold text-[#0D1F1B] mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
          Willkommen zurück
        </h1>
        <p className="text-sm text-[#6B7F7A] mb-6">
          Melde dich an und finde deine Förderung.
        </p>

        {error && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm text-red-700">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">E-Mail-Adresse</label>
            <input
              type="email"
              required
              autoComplete="email"
              className="zora-input w-full"
              placeholder="deine@email.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-[#1a1a1a]">Passwort</label>
              <a href="#" className="text-xs text-[#1D9E75] hover:underline">Passwort vergessen?</a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                className="zora-input w-full pr-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 text-white text-sm font-bold py-3 rounded-xl transition-all hover:-translate-y-px disabled:opacity-60 disabled:translate-y-0 mt-2"
            style={{ background: 'linear-gradient(135deg, #1D9E75, #2ECC9A)', boxShadow: '0 8px 24px rgba(29,158,117,0.35)' }}
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Anmelden…</>
            ) : (
              <>Anmelden <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e5e7eb]" />
          </div>
          <div className="relative flex justify-center text-xs text-[#9ca3af] bg-white px-3">
            oder
          </div>
        </div>

        <p className="text-center text-sm text-[#6B7F7A]">
          Noch kein Konto?{' '}
          <Link href="/registrierung" className="font-semibold text-[#1D9E75] hover:underline inline-flex items-center gap-1">
            Jetzt registrieren <ArrowRight size={12} />
          </Link>
        </p>
      </div>

      <p className="mt-6 text-xs text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
        © 2025 Zora GmbH · Datenschutz · Impressum
      </p>
    </div>
  )
}
