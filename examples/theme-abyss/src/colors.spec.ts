import { describe, expect, it } from "vitest";

import { COLORS as FATHOM } from "@stealthscale/example-theme-fathom";
import { canonical } from "@stealthscale/theme/authoring";

import { COLORS } from "#colors.ts";

describe("colors", () => {
  it("states the pages and the primary and the accent and nothing else", () => {
    expect(Object.keys(COLORS).toSorted()).toStrictEqual(["accent", "dark", "light", "primary"]);
    expect(COLORS.light).toStrictEqual({ page: "oklch(93.0% 0.0200 195.0)" });
    expect(COLORS.dark).toStrictEqual({ page: "oklch(13.0% 0.0200 195.0)" });
  });

  it("draws the primary from the indigo and the accent from Fathom's teal", () => {
    expect(COLORS.primary).toStrictEqual(canonical("indigo"));
    expect(COLORS.accent).toBe(FATHOM.primary);
  });
});
