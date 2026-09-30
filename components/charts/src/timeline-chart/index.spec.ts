import { describe, expect, it } from "vitest";

import * as timeline from "#timeline-chart/index.ts";

describe("index", () => {
  it("exports the timeline with the layout of its moments", () => {
    expect(Object.keys(timeline).toSorted()).toStrictEqual([
      "OTHER_LANE",
      "TimelineChart",
      "layoutEvents",
    ]);
  });
});
