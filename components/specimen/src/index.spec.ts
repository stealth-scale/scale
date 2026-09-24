import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("exports the specimen kit's public names only", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Board",
      "Contained",
      "DisplayProvider",
      "Drawn",
      "FRAMES",
      "Focused",
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
      "grounded",
      "grouped",
      "indexId",
      "landmarked",
      "nameOf",
      "parted",
      "routeId",
      "scene",
      "scenesOf",
      "specimen",
      "stale",
      "uncovered",
      "useCatalogueMark",
      "useWords",
      "valuesOf",
      "widthsOf",
      "written",
    ]);
  });

  it("exports no recipe binding or props provider", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|PropsProvider)/u);
    }
  });
});
