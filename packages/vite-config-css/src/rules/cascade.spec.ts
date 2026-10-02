/**
 * Reads back each rule the cascade set turns on.
 */

import { describe, expect, it } from "vitest";

import { CASCADE } from "#rules/cascade.ts";

describe("cascade", () => {
  it("sets declaration-no-important to true", () => {
    expect(CASCADE["declaration-no-important"]).toBe(true);
  });

  it("turns on the two rules that reject a block which never applies", () => {
    expect(CASCADE["no-descending-specificity"]).toBe(true);
    expect(CASCADE["no-duplicate-selectors"]).toBe(true);
  });
});
