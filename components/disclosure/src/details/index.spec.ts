import { describe, expect, it } from "vitest";

import * as barrel from "#details/index.ts";

describe("index", () => {
  it("exports the four parts", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Content",
      "Indicator",
      "Root",
      "Summary",
    ]);
  });
});
