import { describe, expect, it } from "vitest";

import { CODE } from "#authoring/contract.ts";
import { families } from "#preset/semantic-tokens/colors.ts";
import { modedAt } from "#tokens.fixtures.ts";

describe("families", () => {
  it("draws the page light at ninety-seven and dark at thirteen", () => {
    expect(modedAt(families.bg, "DEFAULT", "base")).toBe("oklch(97.0% 0.0060 262.0)");
    expect(modedAt(families.bg, "DEFAULT", "_dark")).toBe("oklch(13.0% 0.0060 262.0)");
  });

  it("reads the grey ramp for the inks and the lines", () => {
    expect(modedAt(families.fg, "DEFAULT", "base")).toBe("{colors.gray.950}");
    expect(modedAt(families.border, "DEFAULT", "base")).toBe("{colors.gray.300}");
  });

  it("inks every kind of code token", () => {
    expect(Object.keys(families.code).toSorted()).toStrictEqual([...CODE].toSorted());
  });

  it("inks a comment from the muted ink", () => {
    expect(families.code.comment).toStrictEqual({ value: "{colors.fg.muted}" });
  });
});
