import { describe, expect, it } from "vitest";

import * as Timer from "#timer/index.ts";

describe("index", () => {
  it("exports the parts and the parser", () => {
    expect(Object.keys(Timer).toSorted()).toStrictEqual([
      "ActionTrigger",
      "Area",
      "Control",
      "Item",
      "Root",
      "Separator",
      "parse",
    ]);
  });

  it("parses a time in units into milliseconds", () => {
    expect(Timer.parse({ minutes: 2, seconds: 5 })).toBe(125_000);
  });

  it("throws from parse for an object that names no unit above milliseconds", () => {
    expect(() => Timer.parse({ milliseconds: 5 })).toThrow("Invalid date");
  });

  it("parses a date string into its epoch milliseconds", () => {
    expect(Timer.parse("2026-10-01T00:00:00Z")).toBe(Date.UTC(2026, 9, 1));
  });
});
