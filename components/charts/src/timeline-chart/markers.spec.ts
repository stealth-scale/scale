import { describe, expect, it, vi } from "vitest";

import { layoutEvents, OTHER_LANE, type TimelineEvent } from "#events/layout.ts";
import { markersOf, namedOf, pressOf } from "#timeline-chart/markers.ts";
import { at, DAY, LANES } from "#timeline-chart/timeline-chart.fixtures.tsx";

/**
 * Lays the day out from midnight to midnight across the two services and the other lane.
 */
const LAYOUT = layoutEvents(DAY, { lanes: ["api", "web"], since: at(0), until: at(24) });

describe("markers", () => {
  it("returns a marker per cluster lane by lane", () => {
    expect(markersOf(LAYOUT.lanes).map((marker) => marker.cluster.key)).toStrictEqual([
      "a1",
      "b1",
      "a2",
      "w1",
      "n1",
    ]);
  });

  it("numbers each marker by its place in the walk", () => {
    expect(markersOf(LAYOUT.lanes).map((marker) => marker.walk)).toStrictEqual([0, 1, 2, 3, 4]);
  });

  it("places each marker at its cluster's first moment in its lane", () => {
    const [, burst] = markersOf(LAYOUT.lanes);

    expect([burst?.at, burst?.lane]).toStrictEqual([at(14, 3), "api"]);
  });

  it("colors a cluster by its loudest moment", () => {
    const [, burst] = markersOf(LAYOUT.lanes);

    expect(burst?.color).toBe("var(--colors-error-chart)");
  });

  it("colors a marker without a color with the first series color", () => {
    expect(markersOf(LAYOUT.lanes).at(-1)?.color).toBe("var(--colors-series-1)");
  });

  it("names each stated lane by its label", () => {
    expect(namedOf(LAYOUT.lanes, LANES, "Other").map((lane) => lane.label)).toStrictEqual([
      "API",
      "Web",
      "Other",
    ]);
  });

  it("names a lane without a stated label by its key", () => {
    expect(namedOf(LAYOUT.lanes, undefined, "Other").map((lane) => lane.label)).toStrictEqual([
      "api",
      "web",
      "Other",
    ]);
  });

  it("keys the lane of the moments that name no lane with the other lane's key", () => {
    expect(namedOf(LAYOUT.lanes, LANES, "Other").at(-1)?.key).toBe(OTHER_LANE);
  });

  it("returns no press without a selection handler", () => {
    expect(pressOf()).toBeUndefined();
  });

  it("hands the caller a marker's moments on a press", () => {
    const onSelect = vi.fn<(events: readonly TimelineEvent[]) => void>();

    for (const burst of markersOf(LAYOUT.lanes).slice(1, 2)) pressOf(onSelect)?.(burst);

    expect(onSelect.mock.lastCall?.[0].map((event) => event.key)).toStrictEqual(["b1", "b2", "b3"]);
  });
});
