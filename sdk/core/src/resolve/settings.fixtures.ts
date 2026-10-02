import { defineContract } from "#define.ts";
import { hostContract } from "#host.ts";
import { lazy, reminders } from "#manifest.fixtures.ts";
import { manifestOf, untypedContract } from "#resolve/resolve.fixtures.ts";
import { settingsPage, settingsSection } from "#settings.ts";

export const SETTINGS = {
  additionalProperties: false,
  properties: {
    channel: { default: "email", enum: ["email", "chat"], type: "string", "x-control": "radio" },
    code: { default: "ab", maxLength: 4, minLength: 2, pattern: "^[a-z]+$", type: "string" },
    days: { default: 2, maximum: 14, minimum: 0, type: "integer", "x-span": 2 },
    ratio: { default: 0.5, type: "number" },
    weekly: { default: true, type: "boolean" },
  },
  type: "object",
} as const;

export function migrate(
  values: Readonly<Record<string, unknown>>,
): Readonly<Record<string, unknown>> {
  return values;
}

export const prefsContract = defineContract("prefs", {
  settings: {
    pages: { main: settingsPage({ label: "settings.main", order: 2 }) },
    sections: {
      away: {
        kind: "settingsSection",
        label: "settings.away",
        target: { id: "billing/page", kind: "settingsPage" },
      },
      bare: settingsSection({
        label: "settings.bare",
        target: hostContract.settings.pages.account,
      }),
      form: settingsSection({
        label: "settings.form.title",
        schema: SETTINGS,
        schemaVersion: 3,
        target: hostContract.settings.pages.account,
      }),
    },
  },
});

export const prefs = manifestOf(prefsContract, {
  settings: {
    away: { component: lazy({ reminders }) },
    form: { migrations: { 1: migrate, 2: migrate, 3: migrate } },
  },
});

export const LOOSE = {
  additionalProperties: true,
  properties: {
    a: "text",
    b: { default: 1, type: "date" },
    c: { default: "x", minimum: 1, type: "string" },
    d: { default: "x", pattern: "(", type: "string" },
    e: { type: "boolean" },
    f: { default: "fax", enum: ["email"], type: "string" },
  },
  type: "object",
};

export const odd = manifestOf(
  untypedContract({
    ...defineContract("odd", {}),
    settings: {
      pages: {},
      sections: {
        broken: {
          id: "odd/broken",
          kind: "settingsSection",
          label: "settings.broken",
          schema: LOOSE,
          target: hostContract.settings.pages.account,
        },
      },
    },
  }),
);
