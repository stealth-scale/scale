import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("names everything a specimen is written with and nothing beside it", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Board",
      "DisplayProvider",
      "Drawn",
      "FRAMES",
      "Index",
      "Matrix",
      "NAMED",
      "NAMESPACE",
      "PHONE",
      "Page",
      "Rail",
      "RailSearch",
      "Room",
      "Sample",
      "Tile",
      "captionOf",
      "declarations",
      "declared",
      "deviceOf",
      "entryOf",
      "framedDeclaration",
      "grouped",
      "indexId",
      "nameOf",
      "parted",
      "routeId",
      "scene",
      "scenesOf",
      "specimen",
      "stale",
      "uncovered",
      "useWords",
      "valuesOf",
      "widthsOf",
      "written",
    ]);
  });

  it("publishes no binding of its own", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|PropsProvider)/u);
    }
  });
});
