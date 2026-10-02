import { describe, expect, it } from "vitest";

import * as barrel from "#tag/index.ts";

describe("index", () => {
  it("exports the five parts and no other runtime name", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "CloseTrigger",
      "EndElement",
      "Label",
      "Root",
      "StartElement",
    ]);
  });
});
