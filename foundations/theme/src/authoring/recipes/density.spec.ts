import { describe, expect, it } from "vitest";

import { dense } from "#authoring/recipes/density.ts";

describe("dense", () => {
  it("multiplies a token reference by the density in force where it is drawn", () => {
    expect(dense("{sizes.control.md}")).toBe("calc({sizes.control.md} * var(--density, 1))");
  });

  it("multiplies a length CSS writes as readily as a token", () => {
    expect(dense("2.5rem")).toBe("calc(2.5rem * var(--density, 1))");
  });
});
