import { describe, expect, it } from "vitest";

import {
  type HeatmapCell,
  type HeatmapHeading,
  keyOf,
  leadOf,
  type Place,
  resolve,
  textOf,
} from "#heatmap/cells.ts";

/**
 * Lists four readings: Monday at 09 and 10, Tuesday at 10, and Tuesday at 09 missing.
 */
const CELLS: readonly HeatmapCell[] = [
  { column: "09", row: "mon", value: 10 },
  { column: "10", row: "mon", value: 30 },
  { column: "09", row: "tue", value: null },
  { column: "10", row: "tue", value: 20 },
];

/**
 * Lists two groups of columns: March and April.
 */
const GROUPS: readonly HeatmapHeading[] = [
  { key: "mar", label: "Mar" },
  { key: "apr", label: "Apr" },
];

/**
 * Returns the value of each row's places, in the rows' and columns' order.
 */
function valuesOf(
  cells: readonly HeatmapCell[],
  rows?: readonly HeatmapHeading[],
): Array<Array<null | number>> {
  return resolve(cells, { rows }).lines.map((line) => line.places.map((place) => place.value));
}

/**
 * Returns the runs of columns that name the groups in order, as each run's group key and span.
 */
function runsOf(groups: ReadonlyArray<string | undefined>): Array<[string | undefined, number]> {
  const columns = groups.map((group, at) => ({ group, key: String(at), label: String(at) }));

  return resolve([], { columns, groups: GROUPS }).runs.map((run) => [run.heading?.key, run.span]);
}

/**
 * Returns a place of Tuesday at 10 with a reading of 20 and the changes a case states.
 */
function placeOf(reading?: Partial<HeatmapCell>): Place {
  return {
    column: "10",
    key: keyOf("tue", "10"),
    reading:
      reading === undefined ? undefined : { column: "10", row: "tue", value: 20, ...reading },
    row: "tue",
    value: reading?.value === undefined ? 20 : reading.value,
  };
}

describe("cells", () => {
  it("returns the key of a pair as the JSON of its row and column", () => {
    expect(keyOf("mon", "09")).toBe('["mon","09"]');
  });

  it("returns different keys for pairs whose words run together alike", () => {
    expect(keyOf("a b", "c")).not.toBe(keyOf("a", "b c"));
  });

  it("takes the columns in the order the cells first name them", () => {
    expect(resolve(CELLS).columns).toStrictEqual([
      { key: "09", label: "09" },
      { key: "10", label: "10" },
    ]);
  });

  it("takes the rows in the order the cells first name them", () => {
    expect(resolve(CELLS).lines.map((line) => line.heading)).toStrictEqual([
      { key: "mon", label: "mon" },
      { key: "tue", label: "tue" },
    ]);
  });

  it("takes the stated columns in their order", () => {
    const columns = [
      { key: "10", label: "10:00" },
      { key: "09", label: "09:00" },
    ];

    expect(resolve(CELLS, { columns }).columns).toBe(columns);
  });

  it("returns every pair of a stated row without readings as missing", () => {
    expect(
      valuesOf(CELLS, [
        { key: "mon", label: "Mon" },
        { key: "wed", label: "Wed" },
      ]),
    ).toStrictEqual([
      [10, 30],
      [null, null],
    ]);
  });

  it("reads a missing value as missing", () => {
    expect(valuesOf(CELLS)[1]?.[0]).toBeNull();
  });

  it("reads a pair without a reading as missing", () => {
    expect(
      valuesOf([
        { column: "09", row: "mon", value: 4 },
        { column: "10", row: "tue", value: 5 },
      ]),
    ).toStrictEqual([
      [4, null],
      [null, 5],
    ]);
  });

  it("returns no reading for a pair without one", () => {
    expect(
      resolve([
        { column: "09", row: "mon", value: 4 },
        { column: "10", row: "tue", value: 5 },
      ]).byKey.get(keyOf("mon", "10"))?.reading,
    ).toBeUndefined();
  });

  it("applies the later of two readings for one pair", () => {
    expect(valuesOf([...CELLS, { column: "10", row: "mon", value: 31 }])[0]).toStrictEqual([
      10, 31,
    ]);
  });

  it("returns the later of two readings for one pair", () => {
    const later = { column: "10", label: "Later", row: "mon", value: 31 };

    expect(resolve([...CELLS, later]).byKey.get(keyOf("mon", "10"))?.reading).toBe(later);
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY])("reads %d as missing", (value) => {
    expect(valuesOf([{ column: "09", row: "mon", value }])).toStrictEqual([[null]]);
  });

  it("leaves out a reading whose row is not on the stated rows", () => {
    expect(
      resolve(CELLS, { rows: [{ key: "mon", label: "Mon" }] }).byKey.has(keyOf("tue", "10")),
    ).toBe(false);
  });

  it("finds each place by its key with its reading", () => {
    expect(resolve(CELLS).byKey.get(keyOf("tue", "10"))).toStrictEqual({
      column: "10",
      key: keyOf("tue", "10"),
      reading: { column: "10", row: "tue", value: 20 },
      row: "tue",
      value: 20,
    });
  });

  it("keeps a row's heading with its places", () => {
    expect(resolve(CELLS).lines[1]?.places.map((place) => place.row)).toStrictEqual(["tue", "tue"]);
  });

  it("keeps a stated row's heading", () => {
    expect(
      resolve(CELLS, { rows: [{ key: "mon", label: "Mon" }] }).lines[0]?.heading,
    ).toStrictEqual({ key: "mon", label: "Mon" });
  });

  it("returns no runs without groups", () => {
    expect(resolve(CELLS).runs).toStrictEqual([]);
  });

  it("returns a run per consecutive columns of one group", () => {
    expect(runsOf(["mar", "mar", "apr"])).toStrictEqual([
      ["mar", 2],
      ["apr", 1],
    ]);
  });

  it("starts a second run for a group named again after another", () => {
    expect(runsOf(["mar", "apr", "mar"])).toStrictEqual([
      ["mar", 1],
      ["apr", 1],
      ["mar", 1],
    ]);
  });

  it("returns a run without a heading for columns in no group", () => {
    expect(runsOf([undefined, undefined, "mar"])).toStrictEqual([
      [undefined, 2],
      ["mar", 1],
    ]);
  });

  it("returns a run without a heading for a group the groups do not state", () => {
    expect(runsOf(["may"])).toStrictEqual([[undefined, 1]]);
  });

  it("keys each run by the place of its first column", () => {
    expect(
      resolve([], {
        columns: [
          { group: "mar", key: "a", label: "A" },
          { group: "mar", key: "b", label: "B" },
          { group: "apr", key: "c", label: "C" },
        ],
        groups: GROUPS,
      }).runs.map((run) => run.key),
    ).toStrictEqual(["0", "2"]);
  });

  it("returns the missing words for a place without a value", () => {
    expect(textOf(placeOf({ text: "12 of 40", value: null }), String, "No data")).toBe("No data");
  });

  it("returns a reading's text for a place with a value", () => {
    expect(textOf(placeOf({ text: "12 of 40" }), String, "No data")).toBe("12 of 40");
  });

  it("writes the value for a reading without text", () => {
    expect(textOf(placeOf({}), (value) => `${String(value)} orders`, "No data")).toBe("20 orders");
  });

  it("returns no lead for a place without a reading", () => {
    expect(leadOf(placeOf(), ", ")).toBeUndefined();
  });

  it("returns no lead for a reading without a label", () => {
    expect(leadOf(placeOf({}), ", ")).toBeUndefined();
  });

  it("returns a reading's label and the separator as its lead", () => {
    expect(leadOf(placeOf({ label: "Tuesday, March 3, 2026" }), ", ")).toBe(
      "Tuesday, March 3, 2026, ",
    );
  });
});
