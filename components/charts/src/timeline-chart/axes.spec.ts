import { XAxis, YAxis } from "recharts";
import { describe, expect, it } from "vitest";

import { ticksOf, timelineAxesOf, type TimelineAxesOptions } from "#timeline-chart/axes.tsx";
import { at, LANES } from "#timeline-chart/timeline-chart.fixtures.tsx";

/**
 * Writes every time as one word.
 */
const time = (): string => "time";

/**
 * Lists the axes of a day of two services.
 */
const DAY: TimelineAxesOptions = { end: at(24), lanes: LANES, start: at(0), time };

describe("axes", () => {
  it("spaces the ticks evenly across the window with both ends", () => {
    expect(ticksOf(at(0), at(24), 5)).toStrictEqual([at(0), at(6), at(12), at(18), at(24)]);
  });

  it("writes both ends of the window for fewer than two ticks", () => {
    expect(ticksOf(at(0), at(24), 1)).toStrictEqual([at(0), at(24)]);
  });

  it("returns a numeric time axis over the window", () => {
    const [times] = timelineAxesOf(DAY);

    expect([times?.type, times?.props]).toMatchObject([
      XAxis,
      { dataKey: "at", domain: [at(0), at(24)], tickFormatter: time, type: "number" },
    ]);
  });

  it("writes five times across the window unless stated", () => {
    const [times] = timelineAxesOf(DAY);

    expect(times?.props).toMatchObject({ ticks: [at(0), at(6), at(12), at(18), at(24)] });
  });

  it("writes the number of times ticks states", () => {
    const [times] = timelineAxesOf({ ...DAY, ticks: 3 });

    expect(times?.props).toMatchObject({ ticks: [at(0), at(12), at(24)] });
  });

  it("keeps the times at both ends of the time axis", () => {
    const [times] = timelineAxesOf(DAY);

    expect(times?.props).toMatchObject({ interval: "preserveStartEnd" });
  });

  it("pads the time axis by half a pill at each end", () => {
    const [times] = timelineAxesOf(DAY);

    expect(times?.props).toMatchObject({ padding: { left: 14, right: 14 } });
  });

  it("returns a lane axis of the lanes' keys with the first lane at the top", () => {
    const [, lanes] = timelineAxesOf(DAY);

    expect([lanes?.type, lanes?.props]).toMatchObject([
      YAxis,
      {
        dataKey: "lane",
        domain: ["api", "web"],
        reversed: true,
        ticks: ["api", "web"],
        type: "category",
      },
    ]);
  });

  it("names every lane on the lane axis", () => {
    const [, lanes] = timelineAxesOf(DAY);

    expect(lanes?.props).toMatchObject({ hide: false, interval: 0 });
  });

  it("hides the lane axis of a chart of one lane", () => {
    const [, lanes] = timelineAxesOf({ ...DAY, lanes: LANES.slice(0, 1) });

    expect(lanes?.props).toMatchObject({ hide: true });
  });
});
