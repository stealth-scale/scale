import { describe, expect, it } from "vitest";

import * as barrel from "#native-select/index.ts";

describe("index", () => {
  it("exports the three parts and no other runtime name", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Field", "Indicator", "Root"]);
  });
});
