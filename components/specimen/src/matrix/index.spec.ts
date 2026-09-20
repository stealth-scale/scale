import { describe, expect, it } from "vitest";

import * as barrel from "#matrix/index.ts";

describe("index", () => {
  it("names everything the matrix publishes and nothing beside it", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Matrix",
      "captionOf",
      "nameOf",
      "valuesOf",
    ]);
  });
});
