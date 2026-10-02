import { describe, expect, it } from "vitest";

import * as barrel from "#data-list/index.ts";

describe("index", () => {
  it("exports the four parts and no other runtime name", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Item",
      "ItemLabel",
      "ItemValue",
      "Root",
    ]);
  });
});
