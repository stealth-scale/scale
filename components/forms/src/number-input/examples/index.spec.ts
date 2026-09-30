import { describe, expect, it } from "vitest";

import * as examples from "#number-input/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "discount",
      "leading",
      "order",
      "payout",
      "seats",
    ]);
  });
});
