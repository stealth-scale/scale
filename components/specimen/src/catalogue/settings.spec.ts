import { createElement } from "react";

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RULES } from "#catalogue/audited.ts";
import {
  DEFAULTS,
  type Settings,
  SettingsProvider,
  settled,
  useSettings,
} from "#catalogue/settings.ts";
import { HEIGHTS } from "#device/devices.ts";

describe("useSettings", () => {
  it("reads the catalogue's own rules and heights outside a provider", () => {
    const { result } = renderHook(() => useSettings());

    expect(result.current).toStrictEqual({ audit: RULES, heights: HEIGHTS });
  });

  it("reads what a provider above it states", () => {
    const stated: Settings = { audit: { runOnly: ["image-alt"] }, heights: { phone: 400 } };
    const { result } = renderHook(() => useSettings(), {
      wrapper: ({ children }) => createElement(SettingsProvider, { value: stated }, children),
    });

    expect(result.current).toBe(stated);
  });
});

describe("DEFAULTS", () => {
  it("names the catalogue's own rules and heights", () => {
    expect(DEFAULTS.audit).toBe(RULES);
    expect(DEFAULTS.heights).toBe(HEIGHTS);
  });
});

describe("settled", () => {
  it("reads the catalogue's own values where an application states nothing", () => {
    expect(settled({})).toStrictEqual(DEFAULTS);
  });

  it("keeps the catalogue's rules beside the one an application turns off", () => {
    const { audit } = settled({ audit: { rules: { "color-contrast": { enabled: false } } } });

    expect(audit.rules).toMatchObject({
      "color-contrast": { enabled: false },
      region: { enabled: false },
      "target-size": { enabled: true },
    });
  });

  it("lets an application replace the catalogue's word on a rule", () => {
    const { audit } = settled({ audit: { rules: { region: { enabled: true } } } });

    expect(audit.rules?.["region"]).toStrictEqual({ enabled: true });
  });

  it("takes any other run option an application states", () => {
    expect(settled({ audit: { runOnly: ["image-alt"] } }).audit.runOnly).toStrictEqual([
      "image-alt",
    ]);
  });

  it("keeps the catalogue's heights beside the one an application states", () => {
    expect(settled({ heights: { phone: 400 } }).heights).toMatchObject({ md: 1024, phone: 400 });
  });
});
