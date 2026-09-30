import { describe, expect, it } from "vitest";

import * as bubbleChart from "#bubble-chart/index.ts";

describe("index", () => {
  it("exports BubbleChart alone", () => {
    expect(Object.keys(bubbleChart)).toStrictEqual(["BubbleChart"]);
  });
});
