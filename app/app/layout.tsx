"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ZoraLogo } from "@/components/ZoraLogo";
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

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: "#0F6E56" }}>
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
      <nav className="flex-1 px-3 py-5 space-y-0.5">
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
                  backgroundColor: active ? "rgba(255,255,255,0.15)" : "transparent",
                  color: active ? "white" : "rgba(255,255,255,0.7)",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.10)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "white";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)";
                  }
                }}
              >
                <item.icon size={18} className="text-white flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {hasBadge && (
                  <span className="text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full leading-none">
                    {item.badge}
                  </span>
                )}
              </Link>
              {/* Sub-nav for Förderungen */}
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
                          color: subActive ? "white" : "rgba(255,255,255,0.6)",
                          backgroundColor: subActive ? "rgba(255,255,255,0.15)" : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (!subActive) {
                            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.10)";
                            (e.currentTarget as HTMLAnchorElement).style.color = "white";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!subActive) {
                            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                            (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.6)";
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

      {/* User */}
      <div className="px-4 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            LV
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Leonard V.</p>
            <span
              className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: "#5DCAA5", color: "#0F6E56" }}
            >
              Pro Plan
            </span>
          </div>
          <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.6)" }} />
        </div>
      </div>
    </div>
  );
}

function AppHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="h-16 bg-white border-b border-[#e5e7eb] flex items-center px-6 sticky top-0 z-30">
        <button className="md:hidden mr-4 p-1 text-[#6b7280]" onClick={() => setMobileOpen(true)}>
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-base font-semibold text-[#1a1a1a] leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-[#9ca3af]">{subtitle}</p>}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button className="relative p-2 rounded-lg hover:bg-[#f9fafb] text-[#6b7280] transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1D9E75] rounded-full" />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#E1F5EE] flex items-center justify-center text-xs font-bold text-[#1D9E75]">
            LV
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
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
      <main className="flex-1 overflow-auto bg-[#f9fafb] p-6">{children}</main>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#f9fafb] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-60 flex-shrink-0 h-full">
        <Sidebar />
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <PageTitleResolver>{children}</PageTitleResolver>
      </div>
    </div>
  );
}
