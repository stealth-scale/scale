import { describe, expect, it } from "vitest";

import * as barrel from "#chart/index.ts";

describe("index", () => {
  it("exports the kit's eleven names alone", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Caption",
      "Crosshair",
      "Empty",
      "Key",
      "KeyItem",
      "Legend",
      "Plot",
      "Root",
      "Tooltip",
      "colorOf",
      "useChart",
    ]);
  });
});
