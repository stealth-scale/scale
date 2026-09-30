import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { laidOut } from "#cartesian/cartesian.fixtures.ts";
import { DonutChart } from "#donut-chart/donut-chart.tsx";
import { arcsOf, SLICES } from "#polar/polar.fixtures.ts";

describe("DonutChart", () => {
  it("renders a ring with an outer and an inner arc per sector", () => {
    laidOut();

    const { container } = render(<DonutChart label="Customers per plan" slices={SLICES} />);

    expect(arcsOf(container)).toStrictEqual([2, 2, 2]);
  });

  it("renders the center in the hole", () => {
    laidOut();

    const { container } = render(
      <DonutChart center="1,000" label="Customers per plan" slices={SLICES} />,
    );

    expect(container.querySelector(".chart__center-value")?.textContent).toBe("1,000");
  });

  it("renders the center's label under the figure", () => {
    laidOut();

    const { container } = render(
      <DonutChart
        center="1,000"
        centerLabel="customers"
        label="Customers per plan"
        slices={SLICES}
      />,
    );

    expect(container.querySelector(".chart__center-label")?.textContent).toBe("customers");
  });
});
