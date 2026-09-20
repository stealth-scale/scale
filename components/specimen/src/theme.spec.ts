import { describe, expect, it } from "vitest";

import { presetViolations } from "@stealthscale/testing-theme";

import preset from "#theme.ts";

describe("theme", () => {
  it("registers every recipe file under its class name", () => {
    expect(presetViolations(preset, { at: import.meta.dirname })).toStrictEqual([]);
  });

  it("names the package that publishes it", () => {
    expect(preset.name).toBe("@stealthscale/specimen");
  });

  it("makes the root of a framed document see-through", () => {
    expect(preset.globalCss).toStrictEqual({ "html[data-framed]": { background: "transparent" } });
  });
});
