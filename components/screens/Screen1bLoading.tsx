"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "KI analysiert Ihr Profil…",
  "Durchsuche 800+ Förderprogramme…",
  "Berechne Passungsscores…",
];

export default function Screen1bLoading() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[340px] gap-6 screen-enter screen-visible">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <svg
          className="animate-spin w-16 h-16"
          viewBox="0 0 64 64"
          fill="none"
        >
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="#E1F5EE"
            strokeWidth="5"
          />
          <path
            d="M32 4a28 28 0 0 1 28 28"
            stroke="#1D9E75"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[#1D9E75]" />
        </div>
      </div>

      {/* Message */}
      <div className="text-center">
        <p
          key={msgIndex}
          className="text-[#1a1a1a] font-medium text-base transition-all duration-300"
          style={{ animation: "fadeIn 0.3s ease" }}
        >
          {MESSAGES[msgIndex]}
        </p>
        <p className="text-[#6b7280] text-sm mt-1">
          Bitte warten Sie einen Moment
        </p>
      </div>

      {/* Dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] opacity-60"
            style={{
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
