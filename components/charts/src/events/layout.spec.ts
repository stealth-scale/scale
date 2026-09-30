import { describe, expect, it } from "vitest";

import {
  layoutEvents,
  type LayoutOptions,
  loudestColor,
  OTHER_LANE,
  type TimelineEvent,
} from "#events/layout.ts";

/**
 * Returns the instant of a minute past midnight on 28 September 2026, UTC.
 */
function minute(count: number): number {
  return Date.UTC(2026, 8, 28, 0, count);
}

/**
 * Lists four deploys across two services over 100 minutes.
 */
const DEPLOYS: TimelineEvent[] = [
  { at: minute(0), key: "a1", label: "api 1.4", lane: "api" },
  { at: minute(40), key: "w1", label: "web 2.0", lane: "web" },
  { at: minute(60), key: "a2", label: "api 1.5", lane: "api" },
  { at: minute(100), key: "w2", label: "web 2.1", lane: "web" },
];

/**
 * Returns the keys of each lane's clusters' moments, lane by lane.
 */
function keysOf(events: readonly TimelineEvent[], options: LayoutOptions = {}): string[][][] {
  return layoutEvents(events, options).lanes.map((lane) =>
    lane.clusters.map((cluster) => cluster.events.map((event) => event.key)),
  );
}

describe("layout", () => {
  it("lays the lanes out in the order the moments first name them", () => {
    expect(layoutEvents(DEPLOYS).lanes.map((lane) => lane.key)).toStrictEqual(["api", "web"]);
  });

  it("keeps the stated lanes in their order", () => {
    expect(
      layoutEvents(DEPLOYS, { lanes: ["web", "api"] }).lanes.map((lane) => lane.key),
    ).toStrictEqual(["web", "api"]);
  });

  it("leaves out a moment of a lane that is not stated", () => {
    expect(keysOf(DEPLOYS, { lanes: ["web"] })).toStrictEqual([[["w1"], ["w2"]]]);
  });

  it("puts a moment without a lane in the other lane after the stated lanes", () => {
    const loose = [...DEPLOYS, { at: minute(20), key: "n1", label: "Notice" }];

    expect(
      layoutEvents(loose, { lanes: ["api", "web"] }).lanes.map((lane) => lane.key),
    ).toStrictEqual(["api", "web", OTHER_LANE]);
  });

  it("keeps the other lane where the stated lanes list it", () => {
    const loose = [...DEPLOYS, { at: minute(20), key: "n1", label: "Notice" }];

    expect(
      layoutEvents(loose, { lanes: [OTHER_LANE, "api", "web"] }).lanes.map((lane) => lane.key),
    ).toStrictEqual([OTHER_LANE, "api", "web"]);
  });

  it("joins moments closer than the gap into one cluster", () => {
    const burst = [
      { at: minute(0), key: "b1", label: "Alert", lane: "api" },
      { at: minute(1), key: "b2", label: "Alert", lane: "api" },
      { at: minute(100), key: "b3", label: "Resolved", lane: "api" },
    ];

    expect(keysOf(burst)).toStrictEqual([[["b1", "b2"], ["b3"]]]);
  });

  it("opens a new cluster at the gap from where the open one started", () => {
    const drizzle = [0, 1, 2, 3, 100].map((at) => ({
      at: minute(at),
      key: `d${String(at)}`,
      label: "Alert",
      lane: "api",
    }));

    expect(keysOf(drizzle, { minGap: 0.025 })).toStrictEqual([
      [["d0", "d1", "d2"], ["d3"], ["d100"]],
    ]);
  });

  it("opens a new cluster at a moment exactly the gap after where the open one started", () => {
    const edge = [0, 3, 100].map((at) => ({
      at: minute(at),
      key: `e${String(at)}`,
      label: "Alert",
      lane: "api",
    }));

    expect(keysOf(edge, { minGap: 0.03 })).toStrictEqual([[["e0"], ["e3"], ["e100"]]]);
  });

  it("ends a cluster at its last moment", () => {
    const burst = [
      { at: minute(1), key: "b2", label: "Alert", lane: "api" },
      { at: minute(0), key: "b1", label: "Alert", lane: "api" },
      { at: minute(100), key: "b3", label: "Resolved", lane: "api" },
    ];
    const [cluster] = layoutEvents(burst).lanes[0]?.clusters ?? [];

    expect([cluster?.at, cluster?.last]).toStrictEqual([minute(0), minute(1)]);
  });

  it("ends a cluster of one moment at that moment", () => {
    expect(layoutEvents(DEPLOYS).lanes[0]?.clusters[0]?.last).toBe(minute(0));
  });

  it("keys a cluster by its first moment", () => {
    const burst = [
      { at: minute(1), key: "late", label: "Alert", lane: "api" },
      { at: minute(0), key: "early", label: "Alert", lane: "api" },
      { at: minute(100), key: "end", label: "Resolved", lane: "api" },
    ];

    expect(layoutEvents(burst).lanes[0]?.clusters[0]?.key).toBe("early");
  });

  it("spans the window from the earliest to the latest moment", () => {
    const { end, start } = layoutEvents(DEPLOYS);

    expect([start, end]).toStrictEqual([minute(0), minute(100)]);
  });

  it("places each cluster at its share of the window", () => {
    expect(
      layoutEvents(DEPLOYS).lanes.flatMap((lane) => lane.clusters.map((cluster) => cluster.share)),
    ).toStrictEqual([0, 0.6, 0.4, 1]);
  });

  it("spans the window from since to until", () => {
    const { end, start } = layoutEvents(DEPLOYS, {
      since: new Date(minute(-20)),
      until: "2026-09-28T02:00:00Z",
    });

    expect([start, end]).toStrictEqual([minute(-20), minute(120)]);
  });

  it("leaves out a moment outside the window", () => {
    expect(keysOf(DEPLOYS, { since: minute(30), until: minute(70) })).toStrictEqual([
      [["a2"]],
      [["w1"]],
    ]);
  });

  it("keeps a lane whose moments are all outside the window", () => {
    expect(keysOf(DEPLOYS, { since: minute(50), until: minute(70) })).toStrictEqual([[["a2"]], []]);
  });

  it("leaves out a moment whose instant cannot be read", () => {
    const unread = [...DEPLOYS, { at: "yesterday", key: "x", label: "Unknown", lane: "api" }];

    expect(keysOf(unread)).toStrictEqual([
      [["a1"], ["a2"]],
      [["w1"], ["w2"]],
    ]);
  });

  it("returns no lanes without a readable moment", () => {
    expect(layoutEvents([{ at: "never", key: "x", label: "Unknown" }])).toStrictEqual({
      end: 0,
      lanes: [],
      start: 0,
    });
  });

  it("places a lone moment at the start of its window", () => {
    expect(
      layoutEvents([{ at: minute(5), key: "one", label: "Deploy" }]).lanes[0]?.clusters[0]?.share,
    ).toBe(0);
  });

  it("reads instants written in each of the three forms alike", () => {
    const mixed = [
      { at: new Date(minute(0)), key: "d", label: "Date", lane: "api" },
      { at: minute(50), key: "n", label: "Number", lane: "api" },
      { at: "2026-09-28T01:40:00Z", key: "s", label: "String", lane: "api" },
    ];

    expect(layoutEvents(mixed).lanes[0]?.clusters.map((cluster) => cluster.share)).toStrictEqual([
      0, 0.5, 1,
    ]);
  });

  it.each([
    { colors: ["success", "error", "warning"], names: "success, error and warning", want: "error" },
    { colors: ["success", "warning"], names: "success and warning", want: "warning" },
    { colors: ["info", "success"], names: "info and success", want: "info" },
  ] as const)("returns $want for a cluster of $names", ({ colors, want }) => {
    const events = colors.map((color, index) => ({
      at: minute(index),
      color,
      key: String(index),
      label: "Moment",
    }));

    expect(loudestColor(events)).toBe(want);
  });

  it("leaves a cluster without colors uncolored", () => {
    expect(loudestColor(DEPLOYS)).toBeUndefined();
  });
});
