import { describe, expect, it } from "vitest";

import { presetViolations } from "@stealthscale/testing-theme";

import preset from "#theme.ts";

describe("theme", () => {
  it("registers every recipe file in src under its class name", () => {
    expect(presetViolations(preset, { at: import.meta.dirname })).toStrictEqual([]);
  });

  it("sets name to the package name", () => {
    expect(preset.name).toBe("@stealthscale/component-modals");
  });
});
