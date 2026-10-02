import { describe, expect, it } from "vitest";

import * as examples from "#timestamp/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "activity",
      "deadline",
      "imports",
      "live",
      "moment",
      "payouts",
      "permit",
      "receipts",
      "vitals",
    ]);
  });
});
