import { XAxis, YAxis, ZAxis } from "recharts";
import { describe, expect, it } from "vitest";

import { scatterAxesOf, type ScatterAxesOptions, scatterGridOf } from "#scatter-plot/axes.tsx";

/**
 * Writes every tick as one word.
 */
const format = (): string => "tick";

/**
 * Lists the box of a plot 400 wide and 200 tall at 40 across and 10 down.
 */
const OFFSET = { bottom: 0, brushBottom: 0, height: 200, left: 40, right: 0, top: 10, width: 400 };

/**
 * Lists the axes of a scatter of deals: size across, days up, points of 60 square pixels.
 */
const DEALS: ScatterAxesOptions = {
  area: 60,
  x: { domain: undefined, format, key: "size", title: "Deal size" },
  y: { domain: undefined, format, key: "days", title: "Days to close" },
};

describe("axes", () => {
  it("returns a numeric x axis titled under its ticks", () => {
    const [x] = scatterAxesOf(DEALS);

    expect([x?.type, x?.props]).toMatchObject([
      XAxis,
      {
        dataKey: "size",
        height: 48,
        label: { position: "insideBottom", value: "Deal size" },
        name: "Deal size",
        tickFormatter: format,
        type: "number",
      },
    ]);
  });

  it("returns a numeric y axis titled along the start edge", () => {
    const [, y] = scatterAxesOf(DEALS);

    expect([y?.type, y?.props]).toMatchObject([
      YAxis,
      {
        dataKey: "days",
        label: { angle: -90, position: "insideLeft", value: "Days to close" },
        name: "Days to close",
        type: "number",
        width: "auto",
      },
    ]);
  });

  it("gives every point one area without a size axis", () => {
    const [, , size] = scatterAxesOf(DEALS);

    expect([size?.type, size?.props]).toMatchObject([ZAxis, { range: [60, 60] }]);
  });

  it("sizes each point by the size axis' field over its range", () => {
    const [, , size] = scatterAxesOf({
      ...DEALS,
      size: { key: "arr", range: [40, 1600], title: "ARR" },
    });

    expect(size?.props).toMatchObject({
      dataKey: "arr",
      name: "ARR",
      range: [40, 1600],
      type: "number",
    });
  });

  it("pads both axes by the radius of a point", () => {
    const [x, y] = scatterAxesOf(DEALS);

    expect([x?.props, y?.props]).toMatchObject([
      { padding: { left: 5, right: 5 } },
      { padding: { bottom: 5, top: 5 } },
    ]);
  });

  it("pads both axes by the radius of the largest sized point", () => {
    const [x] = scatterAxesOf({ ...DEALS, size: { key: "arr", range: [40, 1600], title: "ARR" } });

    expect(x?.props).toMatchObject({ padding: { left: 23, right: 23 } });
  });

  it("passes a stated domain to each axis", () => {
    const [x, y] = scatterAxesOf({
      ...DEALS,
      x: { ...DEALS.x, domain: [0, 100] },
      y: { ...DEALS.y, domain: [1, 5] },
    });

    expect([x?.props, y?.props]).toMatchObject([{ domain: [0, 100] }, { domain: [1, 5] }]);
  });

  it("leaves out the domain of an axis without one", () => {
    const [x] = scatterAxesOf(DEALS);

    expect(x?.props).not.toHaveProperty("domain");
  });

  it("spans an axis with named ends over its stated domain with a tick at each end", () => {
    const [x] = scatterAxesOf({
      ...DEALS,
      x: { ...DEALS.x, domain: [2, 8], ends: ["Small", "Large"] },
    });

    expect(x?.props).toMatchObject({ domain: [2, 8], ticks: [2, 8] });
  });

  it("spans an axis with named ends from 0 to 1 without a stated domain", () => {
    const [, y] = scatterAxesOf({ ...DEALS, y: { ...DEALS.y, ends: ["Fast", "Slow"] } });

    expect(y?.props).toMatchObject({ domain: [0, 1], ticks: [0, 1] });
  });

  it("writes the ticks of an axis without named ends with its formatter", () => {
    const [x] = scatterAxesOf(DEALS);

    expect(x?.props).not.toHaveProperty("tick");
  });

  it("renders the grid at the ticks of axes without named ends", () => {
    expect(scatterGridOf(DEALS.x, DEALS.y).props).toStrictEqual({});
  });

  it("returns the plot's left edge then its right edge as the vertical lines of an x axis with named ends", () => {
    const grid = scatterGridOf({ ends: ["Low", "High"] }, DEALS.y);

    expect(
      grid.props.verticalCoordinatesGenerator?.(
        { height: 300, offset: OFFSET, width: 500, xAxis: undefined },
        false,
      ),
    ).toStrictEqual([40, 440]);
  });

  it("returns the plot's top edge then its bottom edge as the horizontal lines of a y axis with named ends", () => {
    const grid = scatterGridOf(DEALS.x, { ends: ["Low", "High"] });

    expect(
      grid.props.horizontalCoordinatesGenerator?.(
        { height: 300, offset: OFFSET, width: 500, yAxis: undefined },
        false,
      ),
    ).toStrictEqual([10, 210]);
  });
});
