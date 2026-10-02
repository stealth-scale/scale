import { XAxis } from "recharts";
import { describe, expect, it } from "vitest";

import { edgeAxisOf, type EdgeRow, rangeOf } from "#histogram-chart/axis.tsx";

/**
 * Writes a value as JSON, so a case reads what the axis and the heading pass the formatter.
 */
const format = (value: unknown): string => JSON.stringify(value);

/**
 * Returns a run of bins 10 wide from 0.
 */
function rowsOf(count: number): EdgeRow[] {
  return Array.from({ length: count }, (_, at) => ({
    from: at * 10,
    middle: at * 10 + 5,
    to: (at + 1) * 10,
  }));
}

describe("axis", () => {
  it("returns a numeric x axis that reads the middle of each bin", () => {
    const axis = edgeAxisOf(rowsOf(3), format);

    expect([axis.type, axis.props]).toMatchObject([
      XAxis,
      { dataKey: "middle", tickFormatter: format, type: "number" },
    ]);
  });

  it("runs the axis from the first bin's lower edge to the last bin's upper edge", () => {
    expect(edgeAxisOf(rowsOf(3), format).props).toMatchObject({ domain: [0, 30] });
  });

  it("labels every edge for eight bins", () => {
    expect(edgeAxisOf(rowsOf(8), format).props).toMatchObject({
      ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80],
    });
  });

  it("labels every second edge for sixteen bins", () => {
    expect(edgeAxisOf(rowsOf(16), format).props).toMatchObject({
      ticks: [0, 20, 40, 60, 80, 100, 120, 140, 160],
    });
  });

  it("labels every fifth edge for seventeen bins", () => {
    expect(edgeAxisOf(rowsOf(17), format).props).toMatchObject({
      ticks: [0, 50, 100, 150],
    });
  });

  it("runs an axis without bins from 0 to 1", () => {
    expect(edgeAxisOf([], format).props).toMatchObject({ domain: [0, 1], ticks: [] });
  });

  it("writes the range of the bin a tooltip entry was read from", () => {
    expect(rangeOf([{ payload: { from: 20, to: 40 } }], format)).toBe("[20,40]");
  });

  it("passes the formatter no edges without an entry", () => {
    expect(rangeOf([], format)).toBe("[null,null]");
  });
});
