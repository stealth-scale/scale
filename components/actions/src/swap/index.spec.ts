import { describe, expect, it } from "vitest";

import * as Swap from "#swap/index.ts";

describe("index", () => {
  it("exports the two parts", () => {
    expect(Object.keys(Swap).toSorted()).toStrictEqual(["Indicator", "Root"]);
  });
});
