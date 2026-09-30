import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { laidOut } from "#cartesian/cartesian.fixtures.ts";
import { PieChart } from "#pie-chart/pie-chart.tsx";
import { arcsOf, sectorsOf, SLICES } from "#polar/polar.fixtures.ts";

describe("PieChart", () => {
  it("renders a sector per slice", () => {
    laidOut();

    const { container } = render(<PieChart label="Customers per plan" slices={SLICES} />);

    expect(sectorsOf(container)).toHaveLength(3);
  });

  it("renders a whole pie with one arc per sector", () => {
    laidOut();

    const { container } = render(<PieChart label="Customers per plan" slices={SLICES} />);

    expect(arcsOf(container)).toStrictEqual([1, 1, 1]);
  });
});
