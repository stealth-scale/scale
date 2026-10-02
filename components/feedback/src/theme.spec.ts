import { describe, expect, it } from "vitest";

import { presetViolations } from "@stealthscale/testing-theme";

import preset from "#theme.ts";

describe("theme", () => {
  it("registers every recipe file in the package under its own class name", () => {
    expect(presetViolations(preset, { at: import.meta.dirname })).toStrictEqual([]);
  });

  it("takes its preset name from the package that ships it", () => {
    expect(preset.name).toBe("@stealthscale/component-feedback");
  });
});
