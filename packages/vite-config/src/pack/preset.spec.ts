import { describe, expect, it } from "vitest";

import { base, node, web } from "#pack/preset.ts";

describe("preset", () => {
  it("states no platform layer in the base group", () => {
    expect(
      base()
        .map((one) => one.name)
        .join(),
    ).not.toContain("platform");
  });

  it("appends pack.platform(node) to the base group", () => {
    expect(node().map((one) => one.name)).toStrictEqual([
      ...base().map((one) => one.name),
      "pack.platform(node)",
    ]);
  });

  it("appends pack.platform(neutral) and pack.builtins to the base group", () => {
    expect(web().map((one) => one.name)).toStrictEqual([
      ...base().map((one) => one.name),
      "pack.platform(neutral)",
      "pack.builtins",
    ]);
  });

  it("includes the base layers in every tier", () => {
    for (const tier of [base(), node(), web()]) {
      const held = tier.map((one) => one.name);

      expect(held).toContain("pack.carry");
      expect(held).toContain("pack.declarations");
      expect(held).toContain("pack.quality");
      expect(held.some((one) => one.startsWith("pack.source("))).toBe(true);
    }
  });
});
