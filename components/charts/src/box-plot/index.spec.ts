import { describe, expect, it } from "vitest";

import * as boxPlot from "#box-plot/index.ts";

describe("index", () => {
  it("exports BoxPlot alone", () => {
    expect(Object.keys(boxPlot)).toStrictEqual(["BoxPlot"]);
  });
});
