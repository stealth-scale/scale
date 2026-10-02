import { describe, expect, it } from "vitest";

import { presetViolations } from "@stealthscale/testing-theme";

import preset from "#theme.ts";

describe("theme", () => {
  it("returns no violation for a preset registering every recipe file in the package", () => {
    expect(presetViolations(preset, { at: import.meta.dirname })).toStrictEqual([]);
  });

  it("sets name to the package that publishes it", () => {
    expect(preset.name).toBe("@stealthscale/component-graphs");
  });
});
