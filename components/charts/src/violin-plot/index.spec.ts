import { describe, expect, it } from "vitest";

import * as violinPlot from "#violin-plot/index.ts";

describe("index", () => {
  it("exports ViolinPlot alone", () => {
    expect(Object.keys(violinPlot)).toStrictEqual(["ViolinPlot"]);
  });
});
