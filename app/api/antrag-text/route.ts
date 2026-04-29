import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

const FALLBACK_TEXTS: Record<string, {
  projektbeschreibung: string;
  begruendung: string;
  energetischerNutzen: string;
  naechsteSchritte: string;
}> = {
  default: {
    projektbeschreibung:
      "Im Rahmen der geplanten Modernisierungsmaßnahme soll das bestehende Gebäude energetisch auf den neuesten Stand gebracht werden. Die Maßnahme umfasst den Austausch veralteter Anlagenteile durch hocheffiziente, moderne Systeme, die den aktuellen Anforderungen an Energieeffizienz und Klimaschutz entsprechen. Die Durchführung erfolgt durch einen qualifizierten Fachbetrieb.",
    begruendung:
      "Die geplante Maßnahme ist wirtschaftlich ohne Förderunterstützung nicht darstellbar. Die hohen Investitionskosten übersteigen die kurzfristig erzielbaren Einsparungen erheblich. Eine staatliche Förderung macht das Vorhaben rentabel und trägt so dazu bei, den Gebäudebestand sukzessive zu sanieren und die Klimaschutzziele der Bundesregierung zu erreichen.",
    energetischerNutzen:
      "Durch die Maßnahme werden CO2-Emissionen erheblich reduziert und die Energieeffizienz des Gebäudes dauerhaft verbessert. Der Primärenergiebedarf sinkt signifikant, was sowohl den Klimazielen als auch den steigenden Energiekosten entgegenwirkt. Das Gebäude wird langfristig auf ein zukunftssicheres energetisches Niveau gebracht.",
    naechsteSchritte:
      "Nach positiver Förderzusage kann die Maßnahme wie geplant umgesetzt werden. Der Fachbetrieb wird umgehend beauftragt und mit der Installation begonnen. Nach Abschluss werden alle erforderlichen Nachweise zusammengestellt und fristgerecht eingereicht.",
  },
};

export async function POST(request: Request) {
  const { programm, programmId, values } = await request.json();

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({
      text: FALLBACK_TEXTS.default,
      demoMode: true,
    });
  }

  try {
    const client = new Anthropic();

    const systemPrompt = `Du bist ein Experte für deutsche Fördermittelanträge und Energieeffizienz.
Erstelle prägnante, fachlich korrekte Texte für einen Förderantrag "${programm}".
Basiere die Texte auf den angegebenen Eingaben des Antragstellers.
Antworte AUSSCHLIESSLICH mit einem validen JSON-Objekt ohne Markdown:
{
  "projektbeschreibung": "2-3 Absätze, fachsprachlich korrekt, konkret auf die Maßnahme bezogen",
  "begruendung": "1-2 Absätze Begründung der Fördernotwendigkeit",
  "energetischerNutzen": "1-2 Absätze Beschreibung des energetischen und klimatischen Nutzens",
  "naechsteSchritte": "2-3 Sätze zu konkreten nächsten Schritten nach Einreichung"
}`;

    const userContent = `Förderprogram: ${programm} (${programmId})

Antragsdaten:
${JSON.stringify(values, null, 2)}

Erstelle einen professionellen Förderantrag-Text basierend auf diesen Eingaben.`;

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userContent }],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const parsed = JSON.parse(jsonMatch[0]);
    return Response.json({ text: parsed });
  } catch (error) {
    console.error("[antrag-text] Error:", error);
    return Response.json({ text: FALLBACK_TEXTS.default, demoMode: true });
  }
}
