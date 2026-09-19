import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("names everything a specimen is written with and nothing beside it", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Index",
      "Matrix",
      "NAMED",
      "Page",
      "Rail",
      "captionOf",
      "declarations",
      "declared",
      "entryOf",
      "grouped",
      "indexId",
      "nameOf",
      "parted",
      "routeId",
      "scene",
      "specimen",
    ]);
  });

  it("publishes no binding of its own", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
