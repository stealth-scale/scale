import { describe, expect, it } from "vitest";

import { LATENCIES } from "#histogram-chart/examples/latencies.ts";

describe("latencies", () => {
  it("lists 140 response times", () => {
    expect(LATENCIES).toHaveLength(140);
  });

  it("runs from 14 to 460 milliseconds", () => {
    expect([Math.min(...LATENCIES), Math.max(...LATENCIES)]).toStrictEqual([14, 460]);
  });
});
