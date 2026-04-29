import Anthropic from "@anthropic-ai/sdk";
import { foerderprogramme, FoerderprogrammDB } from "@/lib/foerderprogramme";
import type { Foerderprogramm } from "@/types";

console.log('API Key vorhanden:', !!process.env.ANTHROPIC_API_KEY)
console.log('API Key Anfang:', process.env.ANTHROPIC_API_KEY?.substring(0, 20))

export const runtime = "nodejs";

function buildProgrammListe(): string {
  return foerderprogramme
    .map(
      (p) =>
        `ID: ${p.id}
Name: ${p.name}
Typ: ${p.typ}
Themen: ${p.themen.join(", ")}
Zielgruppe: ${p.zielgruppe.join(", ")}
Bundesländer: ${Array.isArray(p.bundeslaender) ? p.bundeslaender.join(", ") : "alle"}
Max. Betrag: ${p.maxBetrag}
Förderquote: ${p.foerderquote}
Voraussetzungen: ${p.voraussetzungen.join("; ")}`
    )
    .join("\n---\n");
}

function mapToFoerderprogramm(
  db: FoerderprogrammDB,
  score: number,
  begruendung: string,
  empfehlung: string
): Foerderprogramm {
  const badge: Foerderprogramm["badge"] =
    db.typ === "kredit" || db.typ === "buergschaft" ? "Kredit" : "Zuschuss";
  return {
    id: db.id,
    name: db.name,
    badge,
    foerdergeber: db.foerderstelle,
    maxBetrag: db.maxBetrag,
    frist: db.frist,
    beschreibung: db.beschreibung,
    passung: score,
    passungBegruendung: begruendung,
    empfehlung: empfehlung,
  };
}

const STATIC_FALLBACK: Foerderprogramm[] = [
  {
    id: "beg-em",
    name: "BEG Einzelmaßnahmen (BAFA)",
    badge: "Zuschuss",
    foerdergeber: "BAFA",
    maxBetrag: "bis 70%",
    frist: "laufend",
    beschreibung:
      "Bundesförderung für effiziente Gebäude — Einzelmaßnahmen an der Gebäudehülle, Anlagentechnik und Heizungsoptimierung.",
    passung: 92,
  },
  {
    id: "kfw-270",
    name: "KfW 270 Erneuerbare Energien",
    badge: "Kredit",
    foerdergeber: "KfW",
    maxBetrag: "150.000 €",
    frist: "laufend",
    beschreibung:
      "Günstige Finanzierung für Photovoltaik-, Solarthermie-, Windkraft- und Wasserkraftanlagen.",
    passung: 85,
  },
  {
    id: "bafa-heizung",
    name: "BAFA Heizungsförderung",
    badge: "Zuschuss",
    foerdergeber: "BAFA",
    maxBetrag: "bis 35%",
    frist: "31.12.2025",
    beschreibung:
      "Förderung des Heizungsaustauschs auf erneuerbare Energien: Wärmepumpe, Solarthermie, Biomasse.",
    passung: 78,
  },
  {
    id: "digital-jetzt",
    name: "Digital Jetzt (BMWK)",
    badge: "befristet",
    foerdergeber: "BMWK",
    maxBetrag: "bis 50.000 €",
    frist: "28.02.2025",
    beschreibung:
      "Investitionsförderung für digitale Technologien in KMU: Software, Hardware, Cybersicherheit.",
    passung: 71,
  },
  {
    id: "bafa-beratung",
    name: "BAFA Unternehmensberatung",
    badge: "Zuschuss",
    foerdergeber: "BAFA",
    maxBetrag: "4.000 €",
    frist: "laufend",
    beschreibung:
      "Bundesförderung für Beratung von KMU und Freiberuflern durch qualifizierte Berater.",
    passung: 65,
  },
];

export async function POST(request: Request) {
  const { firmenprofil } = await request.json();

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ matches: STATIC_FALLBACK, demoMode: true });
  }

  try {
    const client = new Anthropic();
    const programmliste = buildProgrammListe();

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 2000,
      system: `Du bist ein Experte für deutsche Fördermittel für Handwerksbetriebe und KMUs.
Analysiere das Firmenprofil und wähle 4–6 passende Förderprogramme aus der Datenbank.

Scoring-Regeln (strikt einhalten):
- Der höchste Score darf nur EINMAL vergeben werden — kein Gleichstand an erster Stelle
- Vergib Scores realistisch und differenziert: nicht alle über 90%, typische Spanne 55–95%
- Score als Integer zurückgeben (nicht als Dezimalzahl)
- Wirklich passende Programme haben 80–95%, mittelmäßig passende 65–79%, schwach passende 55–64%
- Wenn ein Programm nicht zur Zielgruppe passt, nicht aufnehmen statt niedrigen Score geben

Antworte AUSSCHLIESSLICH mit einem validen JSON-Array ohne Markdown oder Erklärungen:
[{"id":"...","passungScore":85,"passungBegruendung":"2-3 Sätze warum dieses Programm passt","empfehlung":"1-2 Sätze konkrete nächste Schritte"}]`,
      messages: [
        {
          role: "user",
          content: `FÖRDERPROGRAMM-DATENBANK:\n${programmliste}\n\n---\n\nFIRMENPROFIL:\n${JSON.stringify(firmenprofil, null, 2)}\n\nWähle 4–6 passende Programme und gib das JSON-Array zurück.`,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Extract JSON array — Claude sometimes adds preamble despite instructions
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array in response");

    const aiMatches: Array<{
      id: string;
      passungScore: number;
      passungBegruendung: string;
      empfehlung: string;
    }> = JSON.parse(jsonMatch[0]);

    const result: Foerderprogramm[] = aiMatches
      .map((m) => {
        const db = foerderprogramme.find((p) => p.id === m.id);
        if (!db) return null;
        return mapToFoerderprogramm(
          db,
          m.passungScore,
          m.passungBegruendung,
          m.empfehlung
        );
      })
      .filter((p): p is Foerderprogramm => p !== null);

    if (result.length === 0) throw new Error("No valid programmes matched");

    return Response.json({ matches: result });
  } catch (error) {
    console.error("[matching] Error:", error);
    return Response.json({ matches: STATIC_FALLBACK, demoMode: true });
  }
}
