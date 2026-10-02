import { describe, expect, it } from "vitest";

import { AMSTERDAM, FRANKFURT, SINGAPORE, VIRGINIA } from "#box-plot/examples/regions.ts";
import { boxStats } from "#stats/box.ts";

/**
 * Lists the four regions' response times in the order the examples render them.
 */
const REGIONS = [FRANKFURT, AMSTERDAM, VIRGINIA, SINGAPORE];

describe("regions", () => {
  it("lists 167 response times across the four regions", () => {
    expect(REGIONS.map((times) => times.length)).toStrictEqual([42, 41, 43, 41]);
  });

  it("puts the regions' medians from 61 to 165 milliseconds", () => {
    expect(REGIONS.map((times) => boxStats(times)?.median)).toStrictEqual([61, 69, 126, 165]);
  });

  it("gives every region an outlier past its upper whisker", () => {
    expect(REGIONS.map((times) => boxStats(times)?.outliers)).toStrictEqual([
      [158, 176],
      [214],
      [262, 301, 344],
      [388],
    ]);
  });

  it("leaves five outliers at a whisker of 3", () => {
    expect(REGIONS.flatMap((times) => boxStats(times, 3)?.outliers)).toStrictEqual([
      214, 262, 301, 344, 388,
    ]);
  });

  it("runs from 30 to 388 milliseconds", () => {
    expect([Math.min(...REGIONS.flat()), Math.max(...REGIONS.flat())]).toStrictEqual([30, 388]);
  });
});
