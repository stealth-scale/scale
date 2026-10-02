import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { laidOut } from "#cartesian/cartesian.fixtures.ts";
import { type WaterfallStep } from "#waterfall-chart/bars.ts";
import { WaterfallChart, type WaterfallChartProps } from "#waterfall-chart/waterfall-chart.tsx";

/**
 * Lists a revenue bridge: an opening balance, a rise, a fall and the closing total.
 */
const BRIDGE: readonly WaterfallStep[] = [
  { key: "opening", label: "August", total: true, value: 120 },
  { key: "new", label: "New", value: 40 },
  { key: "churn", label: "Churn", value: -25 },
  { key: "closing", label: "September", total: true },
];

/**
 * Renders the chart over the bridge with the props a case changes.
 */
function drawn(props: Partial<WaterfallChartProps> = {}): Element {
  laidOut();

  return render(<WaterfallChart label="Revenue bridge" locale="en-US" steps={BRIDGE} {...props} />)
    .container;
}

/**
 * Returns the pixels between the plot's top edge and the top of its tallest bar.
 */
function headroomOf(container: Element): number {
  const top = Number(container.querySelector("clipPath rect")?.getAttribute("y"));
  const bars = [...container.querySelectorAll(".recharts-bar-rectangle path")];

  return Math.min(...bars.map((bar) => Number(bar.getAttribute("y")))) - top;
}

/**
 * Returns the text of every element a selector matches inside a container, in document order.
 */
function textsOf(container: Element, selector: string): string[] {
  return [...container.querySelectorAll(selector)].map((element) => element.textContent);
}

describe("WaterfallChart", () => {
  it("returns no accessibility violation", async () => {
    laidOut();

    await expect(
      accessibilityViolations(() => (
        <WaterfallChart
          caption="Revenue closed at 135."
          label="Revenue bridge"
          locale="en-US"
          steps={BRIDGE}
        />
      )),
    ).resolves.toStrictEqual([]);
  });

  it("renders a bar per step", () => {
    expect(drawn().querySelectorAll(".recharts-bar-rectangle")).toHaveLength(4);
  });

  it("colors each bar by its direction", () => {
    expect(
      [...drawn().querySelectorAll(".recharts-bar-rectangle path")].map((bar) =>
        bar.getAttribute("fill"),
      ),
    ).toStrictEqual([
      "var(--colors-neutral-chart)",
      "var(--colors-success-chart)",
      "var(--colors-error-chart)",
      "var(--colors-neutral-chart)",
    ]);
  });

  it("floats a rise from the top of the total before it", () => {
    const [opening, rise] = [...drawn().querySelectorAll(".recharts-bar-rectangle path")].map(
      (bar) => ({ height: Number(bar.getAttribute("height")), y: Number(bar.getAttribute("y")) }),
    );

    expect((rise?.y ?? 0) + (rise?.height ?? 0)).toBeCloseTo(opening?.y ?? Number.NaN);
  });

  it("joins each bar to the next with a connector", () => {
    expect(drawn().querySelectorAll(".chart-connector")).toHaveLength(3);
  });

  it("dashes each connector", () => {
    expect(
      drawn()
        .querySelector(".chart-connector .recharts-reference-line-line")
        ?.getAttribute("stroke-dasharray"),
    ).toBe("4 4");
  });

  it("renders no connectors when connectors is off", () => {
    expect(drawn({ connectors: false }).querySelector(".chart-connector")).toBeNull();
  });

  it("writes each change with its sign and each total without one above its bar", () => {
    expect(textsOf(drawn(), ".recharts-label-list text")).toStrictEqual([
      "120",
      "+40",
      "-25",
      "135",
    ]);
  });

  it("writes a fall's value above the bar", () => {
    const container = drawn();
    const fall = container.querySelectorAll(".recharts-bar-rectangle path")[2];
    const value = container.querySelectorAll(".recharts-label-list text")[2];

    expect(Number(value?.getAttribute("y"))).toBeLessThan(Number(fall?.getAttribute("y")));
  });

  it("keeps 20px free above the tallest bar for its value", () => {
    expect(headroomOf(drawn())).toBe(20);
  });

  it("keeps no room above the tallest bar without values", () => {
    expect(headroomOf(drawn({ valueLabels: false }))).toBe(0);
  });

  it("writes no values on the bars when valueLabels is off", () => {
    expect(drawn({ valueLabels: false }).querySelector(".recharts-label-list")).toBeNull();
  });

  it("writes the signed change in the tooltip", () => {
    expect(textsOf(drawn({ defaultIndex: 2 }), ".chart__value")).toStrictEqual(["-25"]);
  });

  it("names the tooltip's value Amount by default", () => {
    expect(textsOf(drawn({ defaultIndex: 2 }), ".chart__name")).toStrictEqual(["Amount"]);
  });

  it("colors the tooltip's swatch by the bar's direction", () => {
    const swatch = drawn({ defaultIndex: 2 }).querySelector<HTMLElement>(
      ".chart__row [data-value]",
    );

    expect(swatch?.dataset["value"]).toBe("var(--colors-error-chart)");
  });

  it("renders No data in the plot's place without steps", () => {
    expect(textsOf(drawn({ steps: [] }), ".chart__empty")).toStrictEqual(["No data"]);
  });

  it("renders grid lines by default", () => {
    expect(drawn().querySelector(".recharts-cartesian-grid")).not.toBeNull();
  });

  it("renders no grid when grid is off", () => {
    expect(drawn({ grid: false }).querySelector(".recharts-cartesian-grid")).toBeNull();
  });

  it("renders the caption as the figure's name", () => {
    expect(textsOf(drawn({ caption: "Revenue closed at 135." }), "figcaption")).toStrictEqual([
      "Revenue closed at 135.",
    ]);
  });
});
