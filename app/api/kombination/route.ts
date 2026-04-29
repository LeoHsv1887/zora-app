import Anthropic from "@anthropic-ai/sdk";
import type { FoerderprogrammDB } from "@/lib/foerderprogramme";

export const runtime = "nodejs";

function staticFallback(p1: FoerderprogrammDB, p2: FoerderprogrammDB): string {
  const typLabel = (p: FoerderprogrammDB) =>
    p.typ === "kredit" ? "Kredit" : p.typ === "buergschaft" ? "Bürgschaft" : "Zuschuss";
  return `Die Kombination von ${p1.name} (${typLabel(p1)}) und ${p2.name} (${typLabel(p2)}) ermöglicht eine maximale Ausschöpfung aller verfügbaren Förderungen für Ihr Vorhaben. Beide Programme sind grundsätzlich kombinierbar — achten Sie darauf, keine Doppelförderung für exakt dieselbe Maßnahme zu beantragen. Beantragen Sie zuerst ${p1.name}, da dieses Programm den Antrag vor Baubeginn voraussetzt.`;
}

export async function POST(request: Request) {
  const {
    programme1,
    programme2,
  }: { programme1: FoerderprogrammDB; programme2: FoerderprogrammDB } =
    await request.json();

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ beschreibung: staticFallback(programme1, programme2) });
  }

  try {
    const client = new Anthropic();
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 250,
      messages: [
        {
          role: "user",
          content: `Du bist ein Experte für deutsche Fördermittel. Erkläre in 2–3 prägnanten Sätzen warum die Kombination von "${programme1.name}" (${programme1.typ}, max. ${programme1.maxBetrag}) und "${programme2.name}" (${programme2.typ}, max. ${programme2.maxBetrag}) für Antragsteller sinnvoll ist. Erwähne ob Doppelförderung für dieselbe Maßnahme erlaubt ist und welches Programm zuerst beantragt werden sollte. Antworte nur mit dem Erklärungstext auf Deutsch, ohne Überschrift.`,
        },
      ],
    });
    const text =
      message.content[0].type === "text"
        ? message.content[0].text
        : staticFallback(programme1, programme2);
    return Response.json({ beschreibung: text });
  } catch {
    return Response.json({ beschreibung: staticFallback(programme1, programme2) });
  }
}
