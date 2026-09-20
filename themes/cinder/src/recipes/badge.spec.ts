import { describe, expect, it } from "vitest";

import { badge } from "#recipes/badge.ts";

describe("badge", () => {
  it("sets every label in capitals tracked wide and names no class or slot", () => {
    expect(badge).toStrictEqual({
      base: { letterSpacing: "wide", textTransform: "uppercase" },
    });
  });
});
