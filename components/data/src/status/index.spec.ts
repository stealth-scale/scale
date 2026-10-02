import { describe, expect, it } from "vitest";

import * as barrel from "#status/index.ts";

describe("index", () => {
  it("exports Indicator and Root and no other runtime name", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["Indicator", "Root"]);
  });
});
