import { describe, expect, it } from "vitest";

import { kindOf } from "#form/kinds.ts";

describe("kindOf", () => {
  it.each([
    { format: "email", kind: "email" },
    { format: "password", kind: "password" },
    { format: "uri", kind: "url" },
    { format: "url", kind: "url" },
  ])("returns a $kind box for the format $format", ({ format, kind }) => {
    expect(kindOf(format)).toBe(kind);
  });

  it("returns a plain box for a format without a box of its own", () => {
    expect(kindOf("date")).toBe("text");
  });

  it("returns a plain box where the schema states no format", () => {
    expect(kindOf()).toBe("text");
  });
});
