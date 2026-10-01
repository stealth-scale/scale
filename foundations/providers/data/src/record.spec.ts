import { describe, expect, it } from "vitest";

import { isRecord } from "#record.ts";

describe("isRecord", () => {
  it("returns true for an object", () => {
    expect(isRecord({ id: "7" })).toBe(true);
  });

  it.each([
    { label: "an array", value: [] },
    { label: "null", value: null },
    { label: "a string", value: "7" },
  ])("returns false for $label", ({ value }) => {
    expect(isRecord(value)).toBe(false);
  });
});
