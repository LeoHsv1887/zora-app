"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type {
  WizardConfig,
  WizardStep,
  WizardField,
  BerechnungEntry,
} from "@/lib/wizardConfigs/types";

interface AiText {
  projektbeschreibung: string;
  begruendung: string;
  energetischerNutzen: string;
  naechsteSchritte: string;
}

interface AntragWizardProps {
  config: WizardConfig;
}

// ── Animation variants ─────────────────────────────────────────────────────
const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -48 : 48,
    opacity: 0,
  }),
};

// ── Field Components ───────────────────────────────────────────────────────

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1">{msg}</p>;
}

function RadioCards({
  field,
  value,
  onChange,
  error,
}: {
  field: WizardField;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const cols =
    field.options && field.options.length <= 2
      ? "grid-cols-2"
      : field.options && field.options.length <= 4
      ? "grid-cols-2 sm:grid-cols-4"
      : "grid-cols-2 sm:grid-cols-3";

  return (
    <div>
      <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className={`grid ${cols} gap-2`}>
        {field.options?.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`text-left p-3 rounded-xl border-2 transition-all ${
                selected
                  ? "border-[#1D9E75] bg-[#E1F5EE]"
                  : "border-[#e5e7eb] bg-white hover:border-[#1D9E75]/40"
              }`}
            >
              {opt.icon && (
                <div className="text-xl mb-1">{opt.icon}</div>
              )}
              <div className="text-sm font-semibold text-[#1a1a1a] leading-tight">
                {opt.label}
              </div>
              {opt.description && (
                <div className="text-xs text-[#6b7280] mt-0.5 leading-tight">
                  {opt.description}
                </div>
              )}
              {opt.badge && (
                <div className="mt-1.5 inline-block text-xs font-bold text-[#1D9E75] bg-white border border-[#1D9E75]/30 px-1.5 py-0.5 rounded-full">
                  {opt.badge}
                </div>
              )}
            </button>
          );
        })}
      </div>
      <FieldError msg={error} />
    </div>
  );
}

function CheckboxCards({
  field,
  value,
  onChange,
  error,
}: {
  field: WizardField;
  value: string[];
  onChange: (v: string[]) => void;
  error?: string;
}) {
  const toggle = (v: string) => {
    if (value.includes(v)) {
      onChange(value.filter((x) => x !== v));
    } else {
      onChange([...value, v]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {field.options?.map((opt) => {
          const selected = value.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`text-left p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                selected
                  ? "border-[#1D9E75] bg-[#E1F5EE]"
                  : "border-[#e5e7eb] bg-white hover:border-[#1D9E75]/40"
              }`}
            >
              <div
                className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-all ${
                  selected
                    ? "bg-[#1D9E75] border-[#1D9E75]"
                    : "border-[#d1d5db] bg-white"
                }`}
              >
                {selected && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {opt.icon && <span className="text-base">{opt.icon}</span>}
                  <span className="text-sm font-medium text-[#1a1a1a]">
                    {opt.label}
                  </span>
                  {opt.badge && (
                    <span className="ml-auto text-xs font-bold text-[#1D9E75] bg-white border border-[#1D9E75]/30 px-1.5 py-0.5 rounded-full flex-shrink-0">
                      {opt.badge}
                    </span>
                  )}
                </div>
                {opt.description && (
                  <p className="text-xs text-[#6b7280] mt-0.5">
                    {opt.description}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <FieldError msg={error} />
    </div>
  );
}

function TextField({
  field,
  value,
  onChange,
  error,
}: {
  field: WizardField;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className={`zora-input w-full ${error ? "border-red-400 focus:border-red-400 focus:shadow-none" : ""}`}
      />
      {field.helperText && !error && (
        <p className="text-xs text-[#9ca3af] mt-1">{field.helperText}</p>
      )}
      <FieldError msg={error} />
    </div>
  );
}

function NumberField({
  field,
  value,
  onChange,
  error,
}: {
  field: WizardField;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
          className={`zora-input w-full ${field.unit ? "pr-12" : ""} ${
            error ? "border-red-400 focus:border-red-400 focus:shadow-none" : ""
          }`}
        />
        {field.unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#6b7280] font-medium pointer-events-none">
            {field.unit}
          </span>
        )}
      </div>
      {field.helperText && !error && (
        <p className="text-xs text-[#9ca3af] mt-1">{field.helperText}</p>
      )}
      <FieldError msg={error} />
    </div>
  );
}

function SelectField({
  field,
  value,
  onChange,
  error,
}: {
  field: WizardField;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`zora-input w-full bg-white ${
          error ? "border-red-400 focus:border-red-400 focus:shadow-none" : ""
        }`}
      >
        <option value="">Bitte wählen…</option>
        {field.options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <FieldError msg={error} />
    </div>
  );
}

function DateField({
  field,
  value,
  onChange,
  error,
}: {
  field: WizardField;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`zora-input w-full ${
          error ? "border-red-400 focus:border-red-400 focus:shadow-none" : ""
        }`}
      />
      <FieldError msg={error} />
    </div>
  );
}

// ── Berechnung Box ─────────────────────────────────────────────────────────

function BerechnungBox({ entries }: { entries: BerechnungEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 overflow-hidden">
      <div className="px-4 py-2 bg-blue-100 border-b border-blue-200">
        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
          Automatische Berechnung
        </span>
      </div>
      <div className="divide-y divide-blue-100">
        {entries.map((e, i) =>
          e.highlight ? (
            <div key={i} className="px-4 py-3 bg-[#E1F5EE]">
              <div className="text-xs text-[#6b7280] mb-0.5">{e.label}</div>
              <div className="text-xl font-bold text-[#0F6E56]">{e.value}</div>
            </div>
          ) : e.warning ? (
            <div key={i} className="px-4 py-2.5 bg-amber-50">
              <div className="text-xs text-[#6b7280]">{e.label}</div>
              <div className="text-sm font-semibold text-amber-700">{e.value}</div>
            </div>
          ) : (
            <div key={i} className="px-4 py-2.5 flex items-center justify-between gap-4">
              <span className="text-xs text-[#6b7280]">{e.label}</span>
              <span className="text-sm font-medium text-[#1a1a1a] text-right">
                {e.value}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ── KI Hint ────────────────────────────────────────────────────────────────

function KiHinweis({ text }: { text: string }) {
  return (
    <div className="rounded-xl bg-[#E1F5EE] border border-[#1D9E75]/20 p-4 flex gap-3">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#1D9E75] flex items-center justify-center">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p className="text-sm text-[#0F6E56] leading-relaxed">{text}</p>
    </div>
  );
}

// ── Summary Step ───────────────────────────────────────────────────────────

function SummaryStep({
  config,
  values,
  aiText,
  isGenerating,
  isExporting,
  onExport,
  onRegenerate,
}: {
  config: WizardConfig;
  values: Record<string, unknown>;
  aiText: AiText | null;
  isGenerating: boolean;
  isExporting: boolean;
  onExport: () => void;
  onRegenerate: () => void;
}) {
  return (
    <div className="space-y-5">
      {/* Summary table */}
      <div className="space-y-4">
        {config.steps
          .filter((s) => !s.isSummary && !s.isInfoOnly)
          .filter((s) => !s.condition || s.condition(values))
          .map((step) => {
            const filledFields = step.fields.filter((f) => {
              if (f.type === "info") return false;
              if (f.dependsOn) {
                const dv = values[f.dependsOn.field];
                if (f.dependsOn.value !== undefined && dv !== f.dependsOn.value) return false;
                if (f.dependsOn.values !== undefined && !f.dependsOn.values.includes(dv as string)) return false;
              }
              const v = values[f.id];
              return v !== undefined && v !== "" && v !== null && !(Array.isArray(v) && v.length === 0);
            });
            if (filledFields.length === 0) return null;
            return (
              <div key={step.id} className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
                <div className="px-4 py-3 bg-[#f9fafb] border-b border-[#e5e7eb]">
                  <h3 className="text-sm font-semibold text-[#1a1a1a]">
                    {step.title}
                  </h3>
                </div>
                <div className="divide-y divide-[#f3f4f6]">
                  {filledFields.map((f) => {
                    const raw = values[f.id];
                    let display = "";
                    if (Array.isArray(raw)) {
                      display = (raw as string[])
                        .map((v) => f.options?.find((o) => o.value === v)?.label || v)
                        .join(", ");
                    } else if (f.options) {
                      display = f.options.find((o) => o.value === raw)?.label || String(raw);
                    } else if (f.unit) {
                      display = `${raw} ${f.unit}`;
                    } else {
                      display = String(raw);
                    }
                    return (
                      <div key={f.id} className="px-4 py-2.5 flex items-start gap-4">
                        <span className="text-xs text-[#6b7280] w-40 flex-shrink-0 pt-0.5">
                          {f.label}
                        </span>
                        <span className="text-sm text-[#1a1a1a] font-medium flex-1">
                          {display}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

      {/* AI generated text */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
        <div className="px-4 py-3 bg-[#f9fafb] border-b border-[#e5e7eb] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#1a1a1a]">
            KI-generierte Projektbeschreibung
          </h3>
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isGenerating}
            className="text-xs text-[#1D9E75] hover:text-[#0F6E56] font-medium flex items-center gap-1 disabled:opacity-50"
          >
            <svg
              className={`w-3 h-3 ${isGenerating ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {isGenerating ? "Generiert…" : "Neu generieren"}
          </button>
        </div>
        <div className="p-4">
          {isGenerating ? (
            <div className="flex items-center gap-3 py-4">
              <div className="w-5 h-5 border-2 border-[#1D9E75] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-[#6b7280]">
                Claude erstellt Ihre Projektbeschreibung…
              </span>
            </div>
          ) : aiText ? (
            <div className="space-y-4">
              {[
                { title: "Projektbeschreibung", text: aiText.projektbeschreibung },
                { title: "Fördernotwendigkeit", text: aiText.begruendung },
                { title: "Energetischer Nutzen", text: aiText.energetischerNutzen },
              ].map((s) => (
                <div key={s.title}>
                  <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-1.5">
                    {s.title}
                  </p>
                  <p className="text-sm text-[#1a1a1a] leading-relaxed">
                    {s.text}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#9ca3af] italic">
              Keine KI-Textgenerierung verfügbar (Demo-Modus).
            </p>
          )}
        </div>
      </div>

      {/* Next steps */}
      <div className="bg-[#f9fafb] rounded-xl border border-[#e5e7eb] p-4">
        <h3 className="text-sm font-semibold text-[#1a1a1a] mb-3">
          Nächste Schritte
        </h3>
        <div className="space-y-2">
          {config.naechsteSchritte.map((s, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-[#1D9E75] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="flex-1">
                <span className="text-sm text-[#1a1a1a]">{s.text}</span>
                {s.url && (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-xs text-[#1D9E75] hover:underline inline-flex items-center"
                  >
                    <ArrowRight size={12} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export button */}
      <button
        type="button"
        onClick={onExport}
        disabled={isExporting || isGenerating}
        className="zora-btn-primary w-full py-3.5 rounded-xl text-base flex items-center justify-center gap-3 disabled:bg-[#E2EAE8] disabled:text-[#6B7F7A] disabled:shadow-none disabled:translate-y-0"
      >
        {isExporting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            PDF wird erstellt…
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Antrag als PDF exportieren
          </>
        )}
      </button>

      <p className="text-xs text-center text-[#9ca3af]">
        Das PDF enthält alle Ihre Angaben und die KI-generierte Projektbeschreibung.
      </p>
    </div>
  );
}

// ── InfoOnly Step ──────────────────────────────────────────────────────────

function InfoOnlyStep({ step }: { step: WizardStep }) {
  return (
    <div className="bg-[#E1F5EE] rounded-xl border border-[#1D9E75]/20 p-6">
      <div className="flex gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#1D9E75] flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-[#0F6E56] text-base">
            {step.title}
          </h3>
          <p className="text-xs text-[#1D9E75]">Wichtige Information</p>
        </div>
      </div>
      <div className="space-y-2">
        {step.infoContent?.split("\n").map((line, i) => (
          <p
            key={i}
            className={`text-sm text-[#0F6E56] leading-relaxed ${
              line.startsWith("•") ? "pl-2" : line === "" ? "h-2" : ""
            }`}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

// ── Main Wizard ────────────────────────────────────────────────────────────

export default function AntragWizard({ config }: AntragWizardProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState(1);
  const [aiText, setAiText] = useState<AiText | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Active steps (filtered by condition)
  const activeSteps = config.steps.filter(
    (s) => !s.condition || s.condition(values)
  );
  const currentStep = activeSteps[stepIndex] ?? activeSteps[0];
  const totalSteps = activeSteps.length;
  const isSummary = currentStep?.isSummary ?? false;
  const isInfoOnly = currentStep?.isInfoOnly ?? false;

  // LocalStorage persistence
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`antrag_wizard_${config.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.values) setValues(parsed.values);
      }
    } catch {}
  }, [config.id]);

  useEffect(() => {
    try {
      localStorage.setItem(
        `antrag_wizard_${config.id}`,
        JSON.stringify({ values, updatedAt: Date.now() })
      );
    } catch {}
  }, [values, config.id]);

  const setValue = useCallback((fieldId: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    setErrors((prev) => {
      if (!prev[fieldId]) return prev;
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  }, []);

  const isFieldVisible = (field: WizardField): boolean => {
    if (!field.dependsOn) return true;
    const depVal = values[field.dependsOn.field];
    if (field.dependsOn.value !== undefined)
      return depVal === field.dependsOn.value;
    if (field.dependsOn.values !== undefined)
      return field.dependsOn.values.includes(depVal as string);
    return true;
  };

  const validateStep = (step: WizardStep): Record<string, string> => {
    const errs: Record<string, string> = {};
    for (const field of step.fields) {
      if (field.type === "info") continue;
      if (!isFieldVisible(field)) continue;
      if (!field.required) continue;
      const val = values[field.id];
      if (
        val === undefined ||
        val === "" ||
        val === null ||
        (Array.isArray(val) && val.length === 0)
      ) {
        errs[field.id] = "Pflichtfeld — bitte ausfüllen";
      }
    }
    return errs;
  };

  const generateAiText = useCallback(async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/antrag-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programm: config.programmName,
          programmId: config.id,
          values,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiText(data.text);
      }
    } catch {}
    setIsGenerating(false);
  }, [config, values]);

  const goNext = async () => {
    if (!isInfoOnly && !isSummary) {
      const errs = validateStep(currentStep);
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        // Scroll to first error
        setTimeout(() => {
          document
            .querySelector("[data-error]")
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 50);
        return;
      }
    }
    setErrors({});

    const nextIdx = stepIndex + 1;
    if (nextIdx >= totalSteps) return;

    // Trigger AI text generation when entering summary
    if (activeSteps[nextIdx]?.isSummary && !aiText) {
      generateAiText();
    }

    setDirection(1);
    setStepIndex(nextIdx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    if (stepIndex === 0) return;
    setErrors({});
    setDirection(-1);
    setStepIndex((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { generateWizardPDF } = await import("@/lib/pdfWizard");
      await generateWizardPDF(config, values, aiText);
    } catch (e) {
      console.error("PDF export error:", e);
    }
    setIsExporting(false);
  };

  const renderField = (field: WizardField) => {
    if (!isFieldVisible(field)) return null;
    const err = errors[field.id];
    const val = values[field.id];

    switch (field.type) {
      case "text":
        return (
          <div
            key={field.id}
            className={field.halfWidth ? "" : ""}
            data-error={err ? true : undefined}
          >
            <TextField
              field={field}
              value={(val as string) || ""}
              onChange={(v) => setValue(field.id, v)}
              error={err}
            />
          </div>
        );
      case "number":
        return (
          <div key={field.id} data-error={err ? true : undefined}>
            <NumberField
              field={field}
              value={(val as string) || ""}
              onChange={(v) => setValue(field.id, v)}
              error={err}
            />
          </div>
        );
      case "select":
        return (
          <div key={field.id} data-error={err ? true : undefined}>
            <SelectField
              field={field}
              value={(val as string) || ""}
              onChange={(v) => setValue(field.id, v)}
              error={err}
            />
          </div>
        );
      case "radio":
        return (
          <div key={field.id} data-error={err ? true : undefined}>
            <RadioCards
              field={field}
              value={(val as string) || ""}
              onChange={(v) => setValue(field.id, v)}
              error={err}
            />
          </div>
        );
      case "checkbox":
        return (
          <div key={field.id} data-error={err ? true : undefined}>
            <CheckboxCards
              field={field}
              value={(val as string[]) || []}
              onChange={(v) => setValue(field.id, v)}
              error={err}
            />
          </div>
        );
      case "date":
        return (
          <div key={field.id} data-error={err ? true : undefined}>
            <DateField
              field={field}
              value={(val as string) || ""}
              onChange={(v) => setValue(field.id, v)}
              error={err}
            />
          </div>
        );
      case "info":
        return (
          <div
            key={field.id}
            className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800"
          >
            {field.content}
          </div>
        );
      default:
        return null;
    }
  };

  // Group half-width fields into pairs for grid layout
  const renderFields = (fields: WizardField[]) => {
    const result: React.ReactNode[] = [];
    let i = 0;
    while (i < fields.length) {
      const field = fields[i];
      if (!isFieldVisible(field)) {
        i++;
        continue;
      }
      const nextField = fields[i + 1];
      if (
        field.halfWidth &&
        nextField &&
        nextField.halfWidth &&
        isFieldVisible(nextField)
      ) {
        result.push(
          <div key={`pair-${i}`} className="grid grid-cols-2 gap-3">
            {renderField(field)}
            {renderField(nextField)}
          </div>
        );
        i += 2;
      } else {
        result.push(renderField(field));
        i++;
      }
    }
    return result;
  };

  // Live berechnungen
  const berechnungen: BerechnungEntry[] =
    currentStep?.berechnungFn ? currentStep.berechnungFn(values) : [];

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFB" }}>
      {/* Header */}
      <div className="bg-white sticky top-0 z-10" style={{ borderBottom: "1px solid #E2EAE8" }}>
        <div className="max-w-2xl mx-auto px-4 py-4">
          {/* Top row: back link + title */}
          <div className="flex items-center gap-3 mb-3">
            <Link
              href="/app/foerderungen"
              className="text-[#6b7280] hover:text-[#1a1a1a] transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-semibold text-[#1a1a1a] truncate">
                {config.title}
              </h1>
              <p className="text-xs text-[#6b7280]">
                Schritt {stepIndex + 1} von {totalSteps} · {config.antragstelle}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-[#e5e7eb] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#1D9E75] rounded-full"
              initial={false}
              animate={{
                width: `${((stepIndex + 1) / totalSteps) * 100}%`,
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>

          {/* Step dots */}
          <div className="flex gap-1 mt-2 justify-center">
            {activeSteps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === stepIndex
                    ? "w-5 bg-[#1D9E75]"
                    : idx < stepIndex
                    ? "w-2 bg-[#1D9E75]/60"
                    : "w-2 bg-[#e5e7eb]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={stepIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {/* Step header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#1a1a1a] mb-1">
                {currentStep?.title}
              </h2>
              {currentStep?.description && (
                <p className="text-sm text-[#6b7280]">
                  {currentStep.description}
                </p>
              )}
            </div>

            {/* KI Hinweis at top */}
            {currentStep?.kiHinweis && !isSummary && !isInfoOnly && (
              <div className="mb-5">
                <KiHinweis text={currentStep.kiHinweis} />
              </div>
            )}

            {/* Step content */}
            {isSummary ? (
              <SummaryStep
                config={config}
                values={values}
                aiText={aiText}
                isGenerating={isGenerating}
                isExporting={isExporting}
                onExport={handleExport}
                onRegenerate={generateAiText}
              />
            ) : isInfoOnly ? (
              <InfoOnlyStep step={currentStep} />
            ) : (
              <div className="space-y-5">
                {renderFields(currentStep?.fields || [])}
                {berechnungen.length > 0 && (
                  <BerechnungBox entries={berechnungen} />
                )}
              </div>
            )}

            {/* Navigation */}
            {!isSummary && (
              <div className="flex gap-3 mt-8">
                {stepIndex > 0 && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex-1 h-11 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 hover:bg-[#F1F5F4]"
                    style={{ border: "1px solid #E2EAE8", background: "white", color: "#0D1F1B" }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Zurück
                  </button>
                )}
                <button
                  type="button"
                  onClick={goNext}
                  className="zora-btn-primary flex-[2] h-11 rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  {stepIndex === totalSteps - 2
                    ? "Zusammenfassung anzeigen"
                    : isInfoOnly
                    ? "Verstanden — weiter"
                    : "Weiter"}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Back button on summary */}
            {isSummary && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={goBack}
                  className="w-full h-11 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 hover:bg-[#F1F5F4]"
                  style={{ border: "1px solid #E2EAE8", background: "white", color: "#0D1F1B" }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Angaben bearbeiten
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
