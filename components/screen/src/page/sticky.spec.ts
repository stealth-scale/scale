import { describe, expect, it } from "vitest";

import { stuck } from "#page/sticky.ts";

describe("stuck", () => {
  it("returns an empty string when sticky", () => {
    expect(stuck(true)).toBe("");
  });

  it("returns undefined when not sticky", () => {
    expect(stuck(false)).toBeUndefined();
  });

  it("returns undefined without a value", () => {
    expect(stuck()).toBeUndefined();
  });
});
