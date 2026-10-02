import { describe, expect, it } from "vitest";

import * as barrel from "#timeline/index.ts";

describe("index", () => {
  it("exports the seven parts and no other runtime name", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Connector",
      "Content",
      "Description",
      "Indicator",
      "Item",
      "Root",
      "Title",
    ]);
  });
});
