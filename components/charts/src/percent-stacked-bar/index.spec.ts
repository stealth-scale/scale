import { describe, expect, it } from "vitest";

import * as percentStackedBar from "#percent-stacked-bar/index.ts";

describe("index", () => {
  it("exports PercentStackedBar alone", () => {
    expect(Object.keys(percentStackedBar)).toStrictEqual(["PercentStackedBar"]);
  });
});
