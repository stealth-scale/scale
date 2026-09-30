import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";

import { Caption } from "#chart/caption.tsx";
import { API, charted } from "#chart/chart.fixtures.tsx";
import { Empty } from "#chart/empty.tsx";
import { Legend } from "#chart/legend.tsx";
import { Root } from "#chart/root.tsx";

describe("Root", () => {
  it("passes the component conformance checks as a figure", () => {
    expect(
      violations(Root, { as: true, children: true, element: "FIGURE", props: { chart: API } }),
    ).toStrictEqual([]);
  });

  it("returns no accessibility violation", async () => {
    await expect(accessibilityViolations(Root, { props: { chart: API } })).resolves.toStrictEqual(
      [],
    );
  });

  it("renders a figure", () => {
    const { getByRole } = render(charted());

    expect(getByRole("figure")).toBeDefined();
  });

  it("provides the chart to the parts inside it", () => {
    const { getAllByRole } = render(charted({ children: <Legend /> }));

    expect(getAllByRole("button").map((button) => button.textContent)).toStrictEqual([
      "Paid",
      "Refunded",
    ]);
  });

  it("applies the ratio passed to the parts it shapes", () => {
    const { container } = render(
      charted({ children: <Empty>No disputes.</Empty>, data: [], ratio: "square" }),
    );

    expect(
      container.querySelector(".chart__empty")?.classList.contains("chart__empty--square"),
    ).toBe(true);
  });

  it("points aria-labelledby at the caption while one renders", () => {
    const { getByRole } = render(charted({ children: <Caption>Refunds rose.</Caption> }));
    const figure = getByRole("figure");

    expect(figure.getAttribute("aria-labelledby")).toBe(figure.querySelector("figcaption")?.id);
  });

  it("sets no aria-labelledby without a caption", () => {
    const { getByRole } = render(charted());

    expect(getByRole("figure").getAttribute("aria-labelledby")).toBeNull();
  });

  it("drops aria-labelledby once the caption unmounts", () => {
    const { getByRole, rerender } = render(charted({ children: <Caption>Refunds rose.</Caption> }));

    rerender(charted());

    expect(getByRole("figure").getAttribute("aria-labelledby")).toBeNull();
  });
});
