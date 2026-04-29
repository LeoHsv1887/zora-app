import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: `Du bist Zora, ein freundlicher KI-Assistent für deutsche Fördermittel.
Du beantwortest Fragen rund um Förderprogramme wie BEG, BAFA, KfW und andere.
Antworte immer auf Deutsch, präzise und verständlich.
Halte Antworten kurz (max. 3-4 Sätze) damit sie gut im Chat lesbar sind.
Wenn jemand konkrete Förderungen sucht, empfehle ihm das KI-Matching auf der Plattform zu nutzen.
Du bist hilfsbereit, warmherzig und professionell.`,
      messages,
    });

    return Response.json({
      message:
        response.content[0].type === "text" ? response.content[0].text : "",
    });
  } catch {
    return Response.json(
      { message: "Entschuldigung, es gab einen Fehler. Bitte versuche es erneut." },
      { status: 500 }
    );
  }
}
