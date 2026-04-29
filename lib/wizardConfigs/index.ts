export { kfw458Config } from "./kfw-458";
export { begEmConfig } from "./beg-em";
export { kfw261Config } from "./kfw-261";
export { bafaEnergieberatungConfig } from "./bafa-energieberatung";
export { kfw270Config } from "./kfw-270";
export type { WizardConfig, WizardStep, WizardField, BerechnungEntry, FieldOption, FieldType } from "./types";

import { kfw458Config } from "./kfw-458";
import { begEmConfig } from "./beg-em";
import { kfw261Config } from "./kfw-261";
import { bafaEnergieberatungConfig } from "./bafa-energieberatung";
import { kfw270Config } from "./kfw-270";
import type { WizardConfig } from "./types";

export const ALL_WIZARD_CONFIGS: Record<string, WizardConfig> = {
  "kfw-458": kfw458Config,
  "beg-em": begEmConfig,
  "kfw-261": kfw261Config,
  "bafa-energieberatung": bafaEnergieberatungConfig,
  "kfw-270": kfw270Config,
};

// Map from foerderprogramm IDs to wizard routes
export const WIZARD_ROUTES: Record<string, string> = {
  "kfw-458": "/app/antrag/kfw-458",
  "beg-em": "/app/antrag/beg-em",
  "kfw-261": "/app/antrag/kfw-261",
  "bafa-energieberatung": "/app/antrag/bafa-energieberatung",
  "kfw-270": "/app/antrag/kfw-270",
  // Aliases for existing program IDs in the database
  "beg-em-bafa": "/app/antrag/beg-em",
  "kfw270": "/app/antrag/kfw-270",
  "kfw261": "/app/antrag/kfw-261",
};
