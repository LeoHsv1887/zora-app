"use client";

export default function Topbar() {
  return (
    <header className="bg-white border-b border-[#e5e7eb] sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full bg-[#1D9E75] flex-shrink-0"
            aria-hidden="true"
          />
          <span className="text-[#1a1a1a] font-semibold text-lg tracking-tight">
            Zora
          </span>
        </div>

        {/* Demo badge */}
        <span className="text-xs font-medium text-[#6b7280] bg-[#f3f4f6] border border-[#e5e7eb] px-3 py-1 rounded-full">
          Demo · MVP
        </span>
      </div>
    </header>
  );
}
