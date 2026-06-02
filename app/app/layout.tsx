"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ZoraLogo } from "@/components/ZoraLogo";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Search,
  FileText,
  Users,
  FolderOpen,
  Settings,
  Bell,
  ChevronRight,
  Menu,
  X,
  Newspaper,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/app/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/app/foerderungen", icon: Search, label: "Förderungen finden" },
  { href: "/app/neuigkeiten", icon: Newspaper, label: "Neuigkeiten", badge: "NEU" },
  { href: "/app/antraege", icon: FileText, label: "Meine Anträge" },
  { href: "/app/partner", icon: Users, label: "Partner finden" },
  { href: "/app/dokumente", icon: FolderOpen, label: "Dokumente" },
  { href: "/app/einstellungen", icon: Settings, label: "Einstellungen" },
];

const PAGE_HEADERS: Record<string, { title: string; subtitle: string }> = {
  "/app/dashboard": { title: "Dein Förder-Überblick", subtitle: "Alle wichtigen Infos auf einen Blick" },
  "/app/foerderungen": { title: "Finde deine Förderung — in 5 Minuten", subtitle: "KI-gestütztes Matching aus 100+ Programmen" },
  "/app/neuigkeiten": { title: "Aktuelles aus der Förderwelt", subtitle: "Neuigkeiten und Änderungen bei Förderprogrammen" },
  "/app/antraege": { title: "Deine Anträge & ihr Status", subtitle: "Verfolge den Status deiner Förderanträge" },
  "/app/partner": { title: "Zertifizierte Partner in deiner Nähe", subtitle: "EEEs und Fachbetriebe für deine Förderung" },
  "/app/dokumente": { title: "Deine Unterlagen & Nachweise", subtitle: "Alle relevanten Dateien zentral gespeichert" },
  "/app/einstellungen": { title: "Dein Profil & Einstellungen", subtitle: "Verwalte dein Konto und deine Präferenzen" },
};

function getUserInitials(user: { email?: string; user_metadata?: { vorname?: string; nachname?: string } } | null): string {
  if (!user) return "?"
  const v = user.user_metadata?.vorname
  const n = user.user_metadata?.nachname
  if (v && n) return `${v[0]}${n[0]}`.toUpperCase()
  if (v) return v.slice(0, 2).toUpperCase()
  if (user.email) return user.email.slice(0, 2).toUpperCase()
  return "?"
}

function getUserDisplayName(user: { email?: string; user_metadata?: { vorname?: string; nachname?: string } } | null): string {
  if (!user) return "Gast"
  const v = user.user_metadata?.vorname
  const n = user.user_metadata?.nachname
  if (v && n) return `${v} ${n[0]}.`
  if (v) return v
  return user.email?.split("@")[0] ?? "Nutzer"
}

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const initials = getUserInitials(user)
  const displayName = getUserDisplayName(user)

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: "#0A1F1A" }}>
      {/* Logo */}
      <div className="h-16 flex items-center px-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
        <ZoraLogo href="/" variant="light" onClick={onClose} />
        {onClose && (
          <button className="ml-auto p-1" style={{ color: "rgba(255,255,255,0.7)" }} onClick={onClose}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/app/dashboard" && item.href !== "/app/neuigkeiten" && pathname.startsWith(item.href));
          const isFoerderungen = item.href === "/app/foerderungen";
          const hasBadge = "badge" in item && item.badge;
          return (
            <div key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: active ? "rgba(255,255,255,0.12)" : "transparent",
                  color: active ? "white" : "rgba(255,255,255,0.65)",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "white";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.65)";
                  }
                }}
              >
                <item.icon size={18} className="text-white flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {hasBadge && (
                  <span className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full leading-none" style={{ background: "linear-gradient(135deg, #1D9E75, #2ECC9A)" }}>
                    {item.badge}
                  </span>
                )}
              </Link>
              {isFoerderungen && active && (
                <div className="ml-9 mt-1 mb-1 space-y-0.5">
                  {[
                    { href: "/app/foerderungen", label: "KI-Matching" },
                    { href: "/app/foerderungen/suche", label: "Direktsuche" },
                  ].map((sub) => {
                    const subActive =
                      sub.href === "/app/foerderungen"
                        ? pathname === "/app/foerderungen"
                        : pathname.startsWith(sub.href);
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={onClose}
                        className="block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        style={{
                          color: subActive ? "white" : "rgba(255,255,255,0.55)",
                          backgroundColor: subActive ? "rgba(255,255,255,0.12)" : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (!subActive) {
                            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.08)";
                            (e.currentTarget as HTMLAnchorElement).style.color = "white";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!subActive) {
                            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                            (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.55)";
                          }
                        }}
                      >
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-4 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
        <Link
          href="/app/einstellungen"
          className="flex items-center gap-3 mb-3 hover:opacity-80 transition-opacity"
          onClick={onClose}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #1D9E75, #2ECC9A)" }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{displayName}</p>
            <p className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.45)" }}>
              {user?.email ?? ""}
            </p>
          </div>
          <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
          style={{ color: "rgba(255,255,255,0.5)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.8)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.5)";
          }}
        >
          <LogOut size={15} />
          <span>Abmelden</span>
        </button>
      </div>
    </div>
  );
}

function AppHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const initials = getUserInitials(user)

  return (
    <>
      <header className="h-16 bg-white border-b border-[#E2EAE8] flex items-center px-6 sticky top-0 z-30">
        <button className="md:hidden mr-4 p-1 text-[#6B7F7A]" onClick={() => setMobileOpen(true)}>
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#0D1F1B] leading-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{title}</h1>
          {subtitle && <p className="text-xs" style={{ color: "#6B7F7A" }}>{subtitle}</p>}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button className="relative p-2 rounded-lg hover:bg-[#F8FAFB] text-[#6B7F7A] transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "linear-gradient(135deg, #1D9E75, #2ECC9A)" }} />
          </button>
          <Link href="/app/einstellungen">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white hover:opacity-80 transition-opacity" style={{ background: "linear-gradient(135deg, #1D9E75, #2ECC9A)" }}>
              {initials}
            </div>
          </Link>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 shadow-xl overflow-hidden">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}

function PageTitleResolver({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const routeKey = Object.keys(PAGE_HEADERS).find(
    (key) => pathname === key || (key !== "/app/dashboard" && key !== "/app/neuigkeiten" && pathname.startsWith(key))
  );
  const header = routeKey ? PAGE_HEADERS[routeKey] : { title: "Zora", subtitle: "" };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <AppHeader title={header.title} subtitle={header.subtitle} />
      <main className="flex-1 overflow-auto p-6" style={{ background: "#F8FAFB" }}>{children}</main>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F8FAFB" }}>
      <aside className="hidden md:block w-60 flex-shrink-0 h-full">
        <Sidebar />
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <PageTitleResolver>{children}</PageTitleResolver>
      </div>
    </div>
  );
}
