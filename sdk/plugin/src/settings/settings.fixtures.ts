import {
  type Migration,
  type ResolvedSettingsSection,
  type SettingsSchema,
  type SettingsSectionReference,
} from "@stealthscale/sdk-core";

import { timeOffContract } from "#host/product.fixtures.ts";

export const DIGEST: SettingsSchema = {
  additionalProperties: false,
  properties: {
    frequency: { default: "daily", enum: ["daily", "weekly"], type: "string" },
    hour: { default: 9, maximum: 23, minimum: 0, type: "integer" },
    muted: { default: false, type: "boolean" },
    note: { default: "hi", maxLength: 4, minLength: 2, pattern: "^[a-zé]+$", type: "string" },
    ratio: { default: 0.5, type: "number" },
  },
  type: "object",
};

export function sectionOf(given: Partial<ResolvedSettingsSection> = {}): ResolvedSettingsSection {
  return {
    component: false,
    id: "prefs/digest",
    label: "settings.digest.title",
    migrations: [],
    plugin: "prefs",
    schema: DIGEST,
    schemaVersion: 1,
    target: "prefs/prefs",
    ...given,
  };
}

export function storedAs(version: number, values: Readonly<Record<string, unknown>>): string {
  return JSON.stringify({ values, version });
}

export const TO_THREE: Readonly<Record<number, Migration>> = {
  1: (values) => ({ ...values, hour: 7 }),
  2: (values) => ({ ...values, frequency: "weekly" }),
};

export const BROKEN: Readonly<Record<number, Migration>> = {
  1: () => {
    throw new Error("broken");
  },
};

export const REMINDERS = timeOffContract.settings.sections.reminders;

export const REMINDERS_KEY = "stealth.people.ada@acme.settings.time-off.reminders";

export const ANYONE_KEY = "stealth.people.anyone.settings.time-off.reminders";

export const UNDECLARED_SECTION: SettingsSectionReference<"payroll/digest"> = {
  id: "payroll/digest",
  kind: "settingsSection",
};
