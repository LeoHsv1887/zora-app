"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

interface NewsCard {
  date: string;
  badge: string;
  badgeColor: string;
  title: string;
  text: string;
}

const NEWS: NewsCard[] = [
  {
    date: "15. April 2026",
    badge: "KfW 458",
    badgeColor: "bg-[#E1F5EE] text-[#0F6E56]",
    title: "KfW 458: Klimageschwindigkeitsbonus läuft Ende 2026 aus",
    text: "Der Klimageschwindigkeitsbonus von 20% für den Austausch alter Öl- und Gasheizungen wird zum 31.12.2026 reduziert. Wer noch von der vollen Förderung profitieren möchte, sollte seinen Antrag zeitnah stellen.",
  },
  {
    date: "10. April 2026",
    badge: "BAFA",
    badgeColor: "bg-amber-100 text-amber-700",
    title: "BEG Einzelmaßnahmen: Neue technische Mindestanforderungen ab Mai 2026",
    text: "Das BAFA hat aktualisierte technische Mindestanforderungen für geförderte Lüftungsanlagen veröffentlicht. Bestehende Anträge sind nicht betroffen.",
  },
  {
    date: "3. April 2026",
    badge: "Tipp",
    badgeColor: "bg-blue-100 text-blue-700",
    title: "iSFP zuerst: Warum der Sanierungsfahrplan sich immer lohnt",
    text: "Mit einem individuellen Sanierungsfahrplan (iSFP) erhalten Sie +5% Förderbonus auf alle BEG-Maßnahmen und können doppelt so hohe Kosten abrechnen. Wir erklären warum sich das fast immer rechnet.",
  },
  {
    date: "28. März 2026",
    badge: "Digital Jetzt",
    badgeColor: "bg-purple-100 text-purple-700",
    title: "Digital Jetzt: Budget für 2026 fast ausgeschöpft — jetzt beantragen",
    text: "Das BMWK meldet dass das Förderbudget für Digital Jetzt 2026 zu über 70% vergeben ist. Unternehmen sollten ihren Antrag nicht weiter aufschieben.",
  },
  {
    date: "20. März 2026",
    badge: "KfW 270",
    badgeColor: "bg-[#E1F5EE] text-[#0F6E56]",
    title: "PV-Anlagen: KfW 270 jetzt auch für Balkonkraftwerke",
    text: "Die KfW hat den Kreditrahmen für erneuerbare Energien erweitert. Auch steckerfertige PV-Anlagen (Balkonkraftwerke) können ab sofort über KfW 270 finanziert werden.",
  },
  {
    date: "15. März 2026",
    badge: "Allgemein",
    badgeColor: "bg-gray-100 text-gray-600",
    title: "Fördermittel 2026: Die wichtigsten Änderungen im Überblick",
    text: "Ein umfassender Überblick über alle wesentlichen Änderungen bei deutschen Förderprogrammen im Jahr 2026 — von BEG über KfW bis zu regionalen Programmen.",
  },
];

export default function NeuigkeitenPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="max-w-5xl mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeUp}>
        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-1">Neuigkeiten rund um Fördermittel</h2>
        <p className="text-[#6b7280]">Aktuelle Änderungen bei Förderprogrammen, neue Regelungen und Tipps</p>
      </motion.div>

      {/* News Grid */}
      <motion.div
        variants={stagger}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {NEWS.map((card, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } },
            }}
            className="bg-white rounded-xl border border-[#e5e7eb] p-5 hover:shadow-md transition-all group flex flex-col"
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${card.badgeColor}`}>
                {card.badge}
              </span>
              <span className="text-xs text-[#9ca3af]">{card.date}</span>
            </div>
            <h3 className="text-sm font-bold text-[#1a1a1a] mb-2 leading-snug">{card.title}</h3>
            <p className="text-sm text-[#6b7280] leading-relaxed flex-1 mb-4">{card.text}</p>
            <a
              href="#"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D9E75] hover:text-[#0F6E56] transition-colors group-hover:gap-2"
            >
              Mehr lesen <ArrowRight size={12} />
            </a>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
