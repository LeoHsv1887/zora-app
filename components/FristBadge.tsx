import { programmFristen, getRemainingTime } from "@/lib/fristen";

interface FristBadgeProps {
  typ: "frist" | "budget" | "beliebt";
  text: string;
  dringlichkeit: "hoch" | "mittel" | "niedrig";
  countdown?: Date | null;
}

const STYLES = {
  hoch: {
    cls: "bg-[#FCEBEB] border border-[#F09595] text-[#A32D2D]",
    icon: "⚠️",
  },
  mittel: {
    cls: "bg-[#FAEEDA] border border-[#F0C070] text-[#854F0B]",
    icon: "⏰",
  },
  niedrig: {
    cls: "bg-[#E1F5EE] text-[#0F6E56]",
    icon: "✓",
  },
} as const;

export function FristBadge({ text, dringlichkeit, countdown }: FristBadgeProps) {
  const { cls, icon } = STYLES[dringlichkeit];
  const label = countdown ? `${text} — ${getRemainingTime(countdown)}` : text;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cls}`}>
      <span>{icon}</span>
      {label}
    </span>
  );
}

export function FristBadgeForId({ programmId }: { programmId: string }) {
  const frist = programmFristen[programmId];
  if (!frist) return null;
  return <FristBadge {...frist} />;
}
