import { describe, expect, it } from "vitest";

import { depth, shadows } from "#draw/depth.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("depth", () => {
  it("draws six heights and the two inner shadows", () => {
    expect(Object.keys(shadows(262))).toStrictEqual([
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
      "2xl",
      "inner",
      "inset",
    ]);
  });

  it("casts further at each height", () => {
    expect(tokenAt(shadows(262), "xs")).toContain("0 1px 2px");
    expect(tokenAt(shadows(262), "2xl")).toContain("0 24px 48px");
  });

  it("tints the shadow with the hue it was given", () => {
    expect(tokenAt(shadows(120), "md")).toContain("120");
  });

  it("casts a black shadow three times as dark on a dark page", () => {
    expect(tokenAt(shadows(262), "md")).toBe(
      "0 4px 8px light-dark(oklch(20% 0.02 262 / 0.080), oklch(0% 0.02 262 / 0.240))",
    );
  });

  it("scales every alpha by the depth a theme asked for", () => {
    expect(tokenAt(shadows(262, 2), "md")).toContain("0.160");
  });

  it("draws the inner shadows inset", () => {
    expect(tokenAt(shadows(262), "inner")).toMatch(/^inset 0 2px 4px 0 /u);
    expect(tokenAt(shadows(262), "inset")).toMatch(/^inset 0 0 0 1px /u);
  });

  it("draws the shadows at the foundation's hue and depth when nothing is stated", () => {
    expect(depth()).toStrictEqual({ shadows: shadows(262, 1) });
  });

  it("draws the shadows at the hue and the depth a theme states", () => {
    expect(depth({ depth: 2, hue: 120 })).toStrictEqual({ shadows: shadows(120, 2) });
  });
});
