"use client";

import { Search } from "lucide-react";
import { ALL_WIZARD_CONFIGS } from "@/lib/wizardConfigs";
import AntragWizard from "./AntragWizard";

interface Props {
  programmId: string;
}

export default function AntragWizardLoader({ programmId }: Props) {
  const config = ALL_WIZARD_CONFIGS[programmId];

  if (!config) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center p-6">
        <div className="text-center">
          <Search size={40} className="mb-4 mx-auto text-[#6b7280]" />
          <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">
            Wizard nicht gefunden
          </h2>
          <p className="text-sm text-[#6b7280] mb-6">
            Kein Antragswizard für &bdquo;{programmId}&ldquo; verfügbar.
          </p>
          <a
            href="/app/foerderungen"
            className="inline-flex items-center gap-2 bg-[#1D9E75] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[#0F6E56] transition-colors"
          >
            ← Zurück zur Fördersuche
          </a>
        </div>
      </div>
    );
  }

  return <AntragWizard config={config} />;
}
