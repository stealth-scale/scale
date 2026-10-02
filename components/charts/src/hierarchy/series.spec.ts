import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { charted } from "#chart/chart.fixtures.tsx";
import { familiesOf } from "#hierarchy/series.tsx";

/**
 * Lists a service at the top level, a team of two services, and a credit below zero.
 */
const NODES = [
  { key: "cdn", value: 30 },
  {
    children: [
      { key: "db", value: 60 },
      { key: "cache", value: 40 },
    ],
    color: "teal" as const,
    key: "data",
    label: "Data",
  },
  { key: "credit", value: -5 },
];

describe("series", () => {
  it("orders the top-level nodes largest first without those of size 0", () => {
    expect(familiesOf(NODES, true).top.map((node) => node.key)).toStrictEqual(["data", "cdn"]);
  });

  it("keys a series per top-level node in their order", () => {
    expect(familiesOf(NODES, true).series.map((series) => series.key)).toStrictEqual([
      "data",
      "cdn",
    ]);
  });

  it("gives a series its node's color", () => {
    expect(familiesOf(NODES, true).series.map((series) => series.color)).toStrictEqual([
      "teal",
      undefined,
    ]);
  });

  it("writes each node's total beside its name", () => {
    const { container } = render(
      charted({ children: familiesOf(NODES, true).series[0]?.label, locale: "en-US" }),
    );

    expect(container.textContent).toBe("Data 100");
  });

  it("writes a node's key beside its total without a label", () => {
    const { container } = render(
      charted({ children: familiesOf(NODES, true).series[1]?.label, locale: "en-US" }),
    );

    expect(container.textContent).toBe("cdn 30");
  });

  it("writes the totals with valueOptions", () => {
    const { container } = render(
      charted({
        children: familiesOf(NODES, true, { style: "percent" }).series[1]?.label,
        locale: "en-US",
      }),
    );

    expect(container.textContent).toBe("cdn 3,000%");
  });

  it("names a series by its node's label alone when values is off", () => {
    expect(familiesOf(NODES, false).series.map((series) => series.label)).toStrictEqual([
      "Data",
      undefined,
    ]);
  });
});
