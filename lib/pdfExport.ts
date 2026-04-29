import { FirmenProfil, Foerderprogramm, AntragsData } from "@/types";

export async function generatePDF(
  profil: FirmenProfil,
  programm: Foerderprogramm,
  antrag: AntragsData
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = margin;

  // Colors
  const green: [number, number, number] = [29, 158, 117];
  const darkText: [number, number, number] = [26, 26, 26];
  const grayText: [number, number, number] = [107, 114, 128];
  const lightGreen: [number, number, number] = [225, 245, 238];
  const borderColor: [number, number, number] = [229, 231, 235];

  // ── Header ──────────────────────────────────────────────────────────
  // Green dot
  doc.setFillColor(...green);
  doc.circle(margin + 3, y + 3, 3, "F");

  // "Zora" wordmark
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...green);
  doc.text("Zora", margin + 9, y + 5);

  // Date top right
  const today = new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...grayText);
  doc.text(today, pageW - margin, y + 5, { align: "right" });

  y += 14;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...darkText);
  doc.text(`Förderantrag — ${programm.name}`, margin, y);
  y += 4;

  // Green underline
  doc.setDrawColor(...green);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageW - margin, y);
  y += 10;

  // ── Section helper ────────────────────────────────────────────────
  const sectionTitle = (title: string) => {
    doc.setFillColor(...lightGreen);
    doc.roundedRect(margin, y, contentW, 8, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...green);
    doc.text(title, margin + 4, y + 5.5);
    y += 12;
  };

  const row = (label: string, value: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...grayText);
    doc.text(label, margin + 2, y);
    doc.setTextColor(...darkText);
    doc.text(value || "—", margin + 55, y);
    y += 6;
  };

  // ── Sektion 1: Antragsteller ──────────────────────────────────────
  sectionTitle("1. Antragsteller");
  row("Firmenname", profil.firmenname);
  row("Rechtsform", profil.rechtsform);
  row("Branche", profil.branche);
  row("Mitarbeiterzahl", profil.mitarbeiterzahl);
  row("Bundesland", profil.bundesland);
  row("Jahresumsatz", profil.jahresumsatz);
  y += 4;

  // ── Sektion 2: Förderprogramm ─────────────────────────────────────
  sectionTitle("2. Förderprogramm");
  row("Programm", programm.name);
  row("Fördergeber", programm.foerdergeber);
  row("Max. Förderbetrag", programm.maxBetrag);
  row("Frist", programm.frist);
  row("Programmtyp", programm.badge);
  row("Passungsgrad", `${programm.passung}%`);
  y += 4;

  // ── Sektion 3: Projektbeschreibung ────────────────────────────────
  sectionTitle("3. Projektbeschreibung");

  if (antrag.investitionssumme) {
    row("Investitionssumme", `${antrag.investitionssumme} €`);
  }
  if (antrag.umsetzungsbeginn) {
    row("Geplanter Beginn", antrag.umsetzungsbeginn);
  }
  y += 2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...darkText);
  const lines = doc.splitTextToSize(antrag.projektbeschreibung, contentW - 4);
  // Prevent overflow — add new page if needed
  if (y + lines.length * 5 > 260) {
    doc.addPage();
    y = margin;
  }
  doc.text(lines, margin + 2, y);
  y += lines.length * 5 + 8;

  // ── Sektion 4: Nächste Schritte ───────────────────────────────────
  if (y > 240) {
    doc.addPage();
    y = margin;
  }
  sectionTitle("4. Nächste Schritte");

  const schritte = [
    "Projektbeschreibung finalisieren und ggf. Angebote einholen",
    "Energieeffizienz-Experten oder Fachbetrieb beauftragen (falls erforderlich)",
    `Antrag online einreichen bei: ${programm.foerdergeber}`,
    "Bewilligungsbescheid abwarten — erst dann mit Maßnahme beginnen",
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  schritte.forEach((s, i) => {
    doc.setTextColor(...green);
    doc.setFont("helvetica", "bold");
    doc.text(`${i + 1}.`, margin + 2, y);
    doc.setTextColor(...darkText);
    doc.setFont("helvetica", "normal");
    const wrapped = doc.splitTextToSize(s, contentW - 14);
    doc.text(wrapped, margin + 10, y);
    y += wrapped.length * 5 + 2;
  });

  y += 6;

  // ── Footer ────────────────────────────────────────────────────────
  const footerY = doc.internal.pageSize.getHeight() - 10;
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY - 4, pageW - margin, footerY - 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...grayText);
  doc.text("Erstellt mit Zora · zora.app", pageW / 2, footerY, {
    align: "center",
  });

  // Save
  const filename = `Foerderantrag_${programm.name.replace(/\s+/g, "_")}_${profil.firmenname.replace(/\s+/g, "_")}.pdf`;
  doc.save(filename);
}
