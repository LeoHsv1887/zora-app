export interface FristInfo {
  typ: "frist" | "budget" | "beliebt";
  text: string;
  dringlichkeit: "hoch" | "mittel" | "niedrig";
  countdown: Date | null;
}

export const programmFristen: Record<string, FristInfo> = {
  "kfw-458": {
    typ: "budget",
    text: "Klimabonus läuft Ende 2026 aus",
    dringlichkeit: "hoch",
    countdown: new Date("2026-12-31"),
  },
  "digital-jetzt": {
    typ: "budget",
    text: "Budget 2026 zu 70% ausgeschöpft",
    dringlichkeit: "hoch",
    countdown: null,
  },
  "beg-em": {
    typ: "frist",
    text: "Neue Mindestanforderungen ab Mai 2026",
    dringlichkeit: "mittel",
    countdown: new Date("2026-05-01"),
  },
  "kfw-261": {
    typ: "beliebt",
    text: "Sehr beliebt — hohe Nachfrage",
    dringlichkeit: "niedrig",
    countdown: null,
  },
  "bafa-heizung": {
    typ: "budget",
    text: "Hohe Nachfrage — jetzt beantragen",
    dringlichkeit: "mittel",
    countdown: null,
  },
  "kfw-270": {
    typ: "beliebt",
    text: "Günstigste Zinsen seit 2 Jahren",
    dringlichkeit: "niedrig",
    countdown: null,
  },
};

export function getRemainingTime(endDate: Date): string {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (months > 3) return `Noch ${months} Monate`;
  if (days > 0) return `Noch ${days} Tage`;
  return "Läuft bald ab";
}
