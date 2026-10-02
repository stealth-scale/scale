import { describe, expect, it } from "vitest";

import * as examples from "#line-chart/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file but the revenue example", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "anomalies",
      "budget",
      "comparison",
      "controlled",
      "guide",
      "latency",
      "peak",
      "quiet",
      "releases",
      "replay",
      "retention",
      "uptime",
    ]);
  });
});
