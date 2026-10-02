/**
 * Covers the two rules the selector set turns on.
 */

import { describe, expect, it } from "vitest";

import { SELECTOR } from "#rules/selector.ts";

describe("selector", () => {
  it("sets selector-max-id to 0", () => {
    expect(SELECTOR["selector-max-id"]).toBe(0);
  });

  it("sets selector-no-qualifying-type to true", () => {
    expect(SELECTOR["selector-no-qualifying-type"]).toBe(true);
  });
});
