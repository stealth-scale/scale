import { describe, expect, it } from "vitest";

import * as heatmap from "#heatmap/index.ts";

describe("index", () => {
  it("exports calendarCells and Heatmap as its runtime names", () => {
    expect(Object.keys(heatmap).toSorted()).toStrictEqual(["Heatmap", "calendarCells"]);
  });
});
