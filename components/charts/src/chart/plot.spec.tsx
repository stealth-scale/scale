import { render } from "@testing-library/react";
import { Line, LineChart } from "recharts";
import { describe, expect, it, vi } from "vitest";

import { charted, ROWS } from "#chart/chart.fixtures.tsx";
import { Plot } from "#chart/plot.tsx";

/**
 * Makes every element measure 480 by 270, where happy-dom lays out nothing and measures 0.
 */
function laidOut(): void {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
    new DOMRect(0, 0, 480, 270),
  );
}

describe("Plot", () => {
  it("renders the chart inside the plot's box", () => {
    laidOut();

    const { container } = render(
      charted({
        children: (
          <Plot>
            <LineChart data={ROWS}>
              <Line dataKey="paid" isAnimationActive={false} />
            </LineChart>
          </Plot>
        ),
      }),
    );

    expect(container.querySelector(".chart__plot .recharts-surface")).not.toBeNull();
  });

  it("renders the chart at the size of the box it measures", () => {
    laidOut();

    const { container } = render(
      charted({
        children: (
          <Plot>
            <LineChart data={ROWS}>
              <Line dataKey="paid" isAnimationActive={false} />
            </LineChart>
          </Plot>
        ),
      }),
    );

    expect(container.querySelector(".recharts-surface")?.getAttribute("width")).toBe("480");
  });

  it("passes its props to the box", () => {
    laidOut();

    const { container } = render(
      charted({
        children: (
          <Plot data-testid="plot">
            <LineChart data={ROWS}>
              <Line dataKey="paid" isAnimationActive={false} />
            </LineChart>
          </Plot>
        ),
      }),
    );

    expect(container.querySelector<HTMLElement>(".chart__plot")?.dataset["testid"]).toBe("plot");
  });

  it("renders the center over the plot hidden from assistive technology", () => {
    laidOut();

    const { container } = render(
      charted({
        children: (
          <Plot center="450">
            <LineChart data={ROWS}>
              <Line dataKey="paid" isAnimationActive={false} />
            </LineChart>
          </Plot>
        ),
      }),
    );

    expect(
      container.querySelector(".chart__plot > .chart__center")?.getAttribute("aria-hidden"),
    ).toBe("true");
  });

  it("renders the center's figure", () => {
    laidOut();

    const { container } = render(
      charted({
        children: (
          <Plot center="450">
            <LineChart data={ROWS}>
              <Line dataKey="paid" isAnimationActive={false} />
            </LineChart>
          </Plot>
        ),
      }),
    );

    expect(container.querySelector(".chart__center-value")?.textContent).toBe("450");
  });

  it("renders the center's label under its figure", () => {
    laidOut();

    const { container } = render(
      charted({
        children: (
          <Plot center="450" centerLabel="Paid">
            <LineChart data={ROWS}>
              <Line dataKey="paid" isAnimationActive={false} />
            </LineChart>
          </Plot>
        ),
      }),
    );

    expect(
      [...(container.querySelector(".chart__center")?.children ?? [])].map(
        (each) => each.textContent,
      ),
    ).toStrictEqual(["450", "Paid"]);
  });

  it("renders no center without one", () => {
    laidOut();

    const { container } = render(
      charted({
        children: (
          <Plot centerLabel="Paid">
            <LineChart data={ROWS}>
              <Line dataKey="paid" isAnimationActive={false} />
            </LineChart>
          </Plot>
        ),
      }),
    );

    expect(container.querySelector(".chart__center")).toBeNull();
  });

  it("renders nothing while the chart has no rows", () => {
    const { container } = render(
      charted({
        children: (
          <Plot>
            <LineChart data={[]}>
              <Line dataKey="paid" isAnimationActive={false} />
            </LineChart>
          </Plot>
        ),
        data: [],
      }),
    );

    expect(container.querySelector(".chart__plot")).toBeNull();
  });
});
