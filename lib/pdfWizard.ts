import type { WizardConfig } from "./wizardConfigs/types";

interface AiText {
  projektbeschreibung: string;
  begruendung: string;
  energetischerNutzen: string;
  naechsteSchritte: string;
}

export async function generateWizardPDF(
  config: WizardConfig,
  values: Record<string, unknown>,
  aiText: AiText | null
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = margin;

  const green: [number, number, number] = [29, 158, 117];
  const darkText: [number, number, number] = [26, 26, 26];
  const grayText: [number, number, number] = [107, 114, 128];
  const lightGreen: [number, number, number] = [225, 245, 238];
  const borderColor: [number, number, number] = [229, 231, 235];
  const lightBlue: [number, number, number] = [239, 246, 255];

  const checkPageBreak = (needed = 20) => {
    if (y + needed > pageH - 20) {
      doc.addPage();
      y = margin;
      addFooter();
    }
  };

  const addFooter = () => {
    const footerY = pageH - 10;
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 4, pageW - margin, footerY - 4);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...grayText);
    const today = new Date().toLocaleDateString("de-DE");
    doc.text(
      `Erstellt mit Zora · zora.app · ${today}`,
      pageW / 2,
      footerY,
      { align: "center" }
    );
  };

  const sectionTitle = (title: string) => {
    checkPageBreak(14);
    doc.setFillColor(...lightGreen);
    doc.roundedRect(margin, y, contentW, 8, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...green);
    doc.text(title, margin + 4, y + 5.5);
    y += 12;
  };

  const row = (label: string, value: string) => {
    checkPageBreak(7);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...grayText);
    doc.text(label, margin + 2, y);
    doc.setTextColor(...darkText);
    const maxW = contentW - 58;
    const lines = doc.splitTextToSize(value || "—", maxW);
    doc.text(lines, margin + 58, y);
    y += Math.max(lines.length * 4.5, 6);
  };

  const highlightBox = (label: string, value: string) => {
    checkPageBreak(18);
    doc.setFillColor(...lightGreen);
    doc.roundedRect(margin, y, contentW, 14, 3, 3, "F");
    doc.setDrawColor(...green);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, contentW, 14, 3, 3, "S");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...green);
    doc.text(label, margin + 5, y + 5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 110, 86);
    doc.text(value, margin + 5, y + 11.5);
    y += 18;
  };

  // ── Header ────────────────────────────────────────────────────────────
  // Green bar
  doc.setFillColor(...green);
  doc.rect(0, 0, pageW, 18, "F");

  // Logo
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text("Zora", margin, 12);

  // Title
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(225, 245, 238);
  doc.text(config.programmName, margin + 14, 12);

  // Date right
  doc.setFontSize(8);
  doc.setTextColor(225, 245, 238);
  const today = new Date().toLocaleDateString("de-DE");
  doc.text(today, pageW - margin, 12, { align: "right" });

  y = 26;

  // Main title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(...darkText);
  doc.text(config.title, margin, y);
  y += 4;

  doc.setDrawColor(...green);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageW - margin, y);
  y += 10;

  // ── Angaben nach Schritt ──────────────────────────────────────────────
  let sectionCount = 1;
  for (const step of config.steps) {
    if (step.isSummary || step.isInfoOnly) continue;
    if (step.condition && !step.condition(values)) continue;

    // Collect non-empty fields
    const visibleFields = step.fields.filter((f) => {
      if (f.type === "info") return false;
      if (f.dependsOn) {
        const depVal = values[f.dependsOn.field];
        if (f.dependsOn.value !== undefined && depVal !== f.dependsOn.value) return false;
        if (f.dependsOn.values !== undefined && !f.dependsOn.values.includes(depVal as string)) return false;
      }
      const val = values[f.id];
      return val !== undefined && val !== "" && val !== null;
    });

    if (visibleFields.length === 0) continue;

    sectionTitle(`${sectionCount}. ${step.title}`);
    sectionCount++;

    for (const field of visibleFields) {
      const raw = values[field.id];
      let display = "";
      if (Array.isArray(raw)) {
        // checkbox multi-select: find labels
        const labels = (raw as string[]).map((v) => {
          const opt = field.options?.find((o) => o.value === v);
          return opt?.label || v;
        });
        display = labels.join(", ");
      } else if (field.options) {
        const opt = field.options.find((o) => o.value === raw);
        display = opt?.label || String(raw);
      } else if (field.unit) {
        display = `${String(raw)} ${field.unit}`;
      } else {
        display = String(raw);
      }
      row(field.label, display);
    }

    // Berechnung
    if (step.berechnungFn) {
      const berechnungen = step.berechnungFn(values);
      if (berechnungen.length > 0) {
        checkPageBreak(10);
        y += 2;
        doc.setFillColor(...lightBlue);
        doc.roundedRect(margin, y, contentW, 7, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(59, 130, 246);
        doc.text("Berechnung", margin + 4, y + 5);
        y += 9;

        for (const b of berechnungen) {
          checkPageBreak(7);
          if (b.highlight) {
            highlightBox(b.label, b.value);
          } else {
            row(b.label, b.value);
          }
        }
      }
    }

    y += 4;
  }

  // ── KI-generierte Projektbeschreibung ─────────────────────────────────
  if (aiText) {
    sectionTitle(`${sectionCount}. KI-generierte Projektbeschreibung`);
    sectionCount++;

    const sections = [
      { title: "Projektbeschreibung", text: aiText.projektbeschreibung },
      { title: "Begründung der Fördernotwendigkeit", text: aiText.begruendung },
      { title: "Energetischer Nutzen", text: aiText.energetischerNutzen },
    ];

    for (const s of sections) {
      checkPageBreak(12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...darkText);
      doc.text(s.title, margin + 2, y);
      y += 5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(50, 50, 50);
      const lines = doc.splitTextToSize(s.text, contentW - 4);
      for (const line of lines) {
        checkPageBreak(5);
        doc.text(line, margin + 2, y);
        y += 4.5;
      }
      y += 4;
    }
  }

  // ── Nächste Schritte ──────────────────────────────────────────────────
  checkPageBreak(40);
  sectionTitle(`${sectionCount}. Nächste Schritte`);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  config.naechsteSchritte.forEach((s, i) => {
    checkPageBreak(8);
    doc.setFillColor(...green);
    doc.circle(margin + 3.5, y - 0.5, 2.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(`${i + 1}`, margin + 3.5, y + 0.5, { align: "center" });

    doc.setTextColor(...darkText);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const wrapped = doc.splitTextToSize(s.text, contentW - 14);
    doc.text(wrapped, margin + 9, y);
    y += wrapped.length * 4.5 + 3;
  });

  addFooter();

  // Save
  const vorname = String(values.vorname || "");
  const nachname = String(values.nachname || "");
  const name = [vorname, nachname].filter(Boolean).join("_") || "Antragsteller";
  const filename = `Foerderantrag_${config.id.toUpperCase()}_${name}_${today.replace(/\./g, "-")}.pdf`;
  doc.save(filename);
}
