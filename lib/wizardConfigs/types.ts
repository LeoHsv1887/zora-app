export interface FieldOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
  badge?: string;
}

export type FieldType =
  | "text"
  | "number"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "info"
  | "textarea";

export interface FieldDependsOn {
  field: string;
  value?: unknown;
  values?: unknown[];
}

export interface WizardField {
  id: string;
  type: FieldType;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: FieldOption[];
  unit?: string;
  min?: number;
  max?: number;
  halfWidth?: boolean;
  helperText?: string;
  content?: string; // for info type
  dependsOn?: FieldDependsOn;
}

export interface BerechnungEntry {
  label: string;
  value: string;
  highlight?: boolean;
  warning?: boolean;
}

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  kiHinweis?: string;
  fields: WizardField[];
  isSummary?: boolean;
  isInfoOnly?: boolean;
  infoContent?: string;
  condition?: (values: Record<string, unknown>) => boolean;
  berechnungFn?: (values: Record<string, unknown>) => BerechnungEntry[];
}

export interface NaechsterSchritt {
  text: string;
  url?: string;
}

export interface WizardConfig {
  id: string;
  title: string;
  programmName: string;
  antragstelle: string;
  antragUrl?: string;
  naechsteSchritte: NaechsterSchritt[];
  steps: WizardStep[];
}
