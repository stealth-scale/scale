import { describe, expect, expectTypeOf, it } from "vitest";

import {
  settingsPage,
  type SettingsPageReference,
  settingsSection,
  type SettingsSectionMarker,
  type SettingsSectionReference,
  type ValuesOf,
} from "#settings.ts";

interface Reminders {
  readonly channel: "chat" | "email";
  readonly days: number;
}

const ACCOUNT: SettingsPageReference = { id: "host/account", kind: "settingsPage" };

describe("settings", () => {
  it("marks a settings page", () => {
    expect(settingsPage({ label: "settings.title", order: 40 })).toStrictEqual({
      kind: "settingsPage",
      label: "settings.title",
      order: 40,
    });
  });

  it("marks a section that renders a component", () => {
    const calendar = settingsSection({ label: "settings.calendar", target: ACCOUNT });

    expect(calendar).toStrictEqual({
      kind: "settingsSection",
      label: "settings.calendar",
      target: ACCOUNT,
    });

    expectTypeOf(calendar).toEqualTypeOf<
      SettingsSectionMarker<Readonly<Record<string, unknown>>, undefined>
    >();
  });

  it("types a section's values by its schema", () => {
    const reminders = settingsSection({
      label: "settings.reminders",
      schema: {
        additionalProperties: false,
        properties: {
          channel: { default: "email", enum: ["email", "chat"], type: "string" },
          days: { default: 2, maximum: 14, minimum: 0, type: "integer" },
          note: { default: "", maxLength: 80, type: "string", "x-control": "textarea" },
          ratio: { default: 0.5, type: "number", "x-span": 2 },
          sound: { default: true, type: "boolean" },
        },
        type: "object",
      },
      schemaVersion: 2,
      target: ACCOUNT,
    });

    expect(reminders.schemaVersion).toBe(2);

    expectTypeOf<NonNullable<(typeof reminders)["~types"]>["values"]>().toEqualTypeOf<{
      readonly channel: "chat" | "email";
      readonly days: number;
      readonly note: string;
      readonly ratio: number;
      readonly sound: boolean;
    }>();
  });

  it("types the values of a section reference", () => {
    const reminders: SettingsSectionReference<"time-off/reminders", Reminders> = {
      id: "time-off/reminders",
      kind: "settingsSection",
    };

    expect(reminders.kind).toBe("settingsSection");

    expectTypeOf<ValuesOf<typeof reminders>>().toEqualTypeOf<Reminders>();
  });
});
