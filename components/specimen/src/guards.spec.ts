import { describe, expect, it } from "vitest";

import { isRecord, isWorded } from "#guards.ts";

/**
 * A value that is nothing, typed so the fixer leaves the call it is handed to alone.
 */
const NOTHING: unknown = undefined;

describe("isRecord", () => {
  it("accepts an object and an array", () => {
    expect(isRecord({})).toBe(true);
    expect(isRecord([])).toBe(true);
  });

  it("refuses null and nothing and a scalar", () => {
    expect(isRecord(null)).toBe(false);
    expect(isRecord(NOTHING)).toBe(false);
    expect(isRecord("a")).toBe(false);
  });
});

describe("isWorded", () => {
  it("accepts a list of words and an empty list", () => {
    expect(isWorded(["a", "b"])).toBe(true);
    expect(isWorded([])).toBe(true);
  });

  it("refuses a list holding anything else and anything that is no list", () => {
    expect(isWorded(["a", 1])).toBe(false);
    expect(isWorded("a")).toBe(false);
  });
});
