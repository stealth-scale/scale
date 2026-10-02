/**
 * Covers the removal and the reporting check the demotion returns.
 */

import { describe, expect, it } from "vitest";

import { warn } from "#warn.ts";

describe("warn", () => {
  it("returns a removal targeting css.check first", () => {
    const held = warn({ because: "adopting the rules" });

    expect(held[0]?.kind).toBe("removal");
    expect(held[0]).toHaveProperty("target", "css.check");
  });

  it("returns a removal named css.warn carrying the reason the caller gave", () => {
    const held = warn({ because: "adopting the rules" });

    expect(held[0]?.name).toBe("css.warn");
    expect(held[0]).toHaveProperty("because", "adopting the rules");
  });

  it("returns a contribution named css.warn second", () => {
    const held = warn({ because: "adopting the rules" })[1];

    expect(held?.kind).toBe("contribution");
    expect(held?.name).toBe("css.warn");
  });

  it("returns two layers when rules are stated", () => {
    const held = warn({ because: "adopting the rules", rules: { "color-no-hex": true } });

    expect(held).toHaveLength(2);
  });
});
