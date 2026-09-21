/**
 * Covers the layers the call returns to a package extending a tier.
 */

import { describe, expect, it } from "vitest";

import { layers } from "#layers.ts";

describe("layers", () => {
  it("returns one layer named css.check", () => {
    expect(layers().map((one) => one.name)).toStrictEqual(["css.check"]);
  });

  it("returns one layer when the caller states globs", () => {
    expect(() => layers({ also: ["**/*.module.css"] })).not.toThrow();
    expect(layers({ except: ["vendor/**"] })).toHaveLength(1);
  });
});
