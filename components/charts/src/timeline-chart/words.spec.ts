import { describe, expect, it } from "vitest";

import { type TooltipEntry } from "#chart/tooltip.tsx";
import { layoutEvents } from "#events/layout.ts";
import { markersOf } from "#timeline-chart/markers.ts";
import { at, DAY, LANES } from "#timeline-chart/timeline-chart.fixtures.tsx";
import { headingOf, moreOf, rowsOf, SHOWN, writersOf } from "#timeline-chart/words.ts";

/**
 * Lists the markers of the day: the api's deploy, its burst of alerts, its fix, the web's deploy
 * and the notice.
 */
const MARKERS = markersOf(
  layoutEvents(DAY, { lanes: ["api", "web"], since: at(0), until: at(24) }).lanes,
);

/**
 * Lists the writers of the day in 24-hour UTC time, with the two services named.
 */
const WRITERS = writersOf({
  lanes: LANES,
  locale: "en-US",
  options: { hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZone: "UTC" },
});

/**
 * Returns the tooltip entries recharts passes for the marker at a place in the walk.
 */
function entriesAt(walk: number): TooltipEntry[] {
  return [{ payload: MARKERS[walk] }];
}

describe("words", () => {
  it("heads a marker of one moment with its lane and its time", () => {
    expect(headingOf(WRITERS)(entriesAt(0))).toBe("API, 09:00");
  });

  it("heads a cluster with its lane and the range of its moments", () => {
    expect(headingOf(WRITERS)(entriesAt(1))).toBe("API, 14:03 – 14:09");
  });

  it("heads a marker with its time alone in a chart of one lane", () => {
    const alone = writersOf({ lanes: LANES.slice(0, 1), locale: "en-US", options: {} });

    expect(headingOf({ ...alone, time: WRITERS.time })(entriesAt(0))).toBe("09:00");
  });

  it("heads no marker with no words", () => {
    expect(headingOf(WRITERS)([])).toBe("");
  });

  it("writes a marker of one moment as one row of its words", () => {
    expect(rowsOf(WRITERS)(entriesAt(3))).toStrictEqual([
      { key: "w1", name: "Deploy web 2.0", value: "" },
    ]);
  });

  it("writes each moment of a cluster with its time", () => {
    expect(rowsOf(WRITERS)(entriesAt(1)).map((row) => [row.name, row.value])).toStrictEqual([
      ["Latency alert", "14:03"],
      ["Error rate alert", "14:05"],
      ["Latency alert", "14:09"],
    ]);
  });

  it("counts the moments past the fifth in a last row", () => {
    const flood = Array.from({ length: 8 }, (_, index) => ({
      at: at(14, index),
      key: `f${String(index)}`,
      label: "Alert",
    }));
    const [marker] = markersOf(layoutEvents(flood, { since: at(0), until: at(24) }).lanes);
    const rows = rowsOf(WRITERS)([{ payload: marker }]);

    expect([rows.length, rows.at(-1)?.name]).toStrictEqual([SHOWN + 1, "3 more"]);
  });

  it("counts the one moment past the fifth in a last row", () => {
    const six = Array.from({ length: 6 }, (_, index) => ({
      at: at(14, index),
      key: `s${String(index)}`,
      label: "Alert",
    }));
    const [marker] = markersOf(layoutEvents(six, { since: at(0), until: at(24) }).lanes);

    expect(rowsOf(WRITERS)([{ payload: marker }]).at(-1)?.name).toBe("1 more");
  });

  it("writes no rows without a marker", () => {
    expect(rowsOf(WRITERS)([])).toStrictEqual([]);
  });

  it("counts the rest in English unless a writer is stated", () => {
    expect(moreOf(12)).toBe("12 more");
  });

  it("names a lane by its label", () => {
    expect(WRITERS.lane?.("web")).toBe("Web");
  });

  it("names a lane without a label by its key", () => {
    expect(WRITERS.lane?.("db")).toBe("db");
  });

  it("names no lane in a chart of one lane", () => {
    expect(writersOf({ lanes: [], locale: "en-US", options: {} }).lane).toBeUndefined();
  });

  it("joins the lane and the time with the locale's list separator", () => {
    expect(writersOf({ lanes: LANES, locale: "ja-JP", options: {} }).separator).toBe("、");
  });
});
