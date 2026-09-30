import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { laidOut } from "#cartesian/cartesian.fixtures.ts";
import { PolarAreaChart, type PolarAreaChartProps } from "#polar-area-chart/polar-area-chart.tsx";
import { type PieSlice } from "#polar/types.ts";

/**
 * Lists four six-hour buckets of requests, noon the largest.
 */
const HOURS: readonly PieSlice[] = [
  { key: "00", label: "00:00", value: 300 },
  { key: "06", label: "06:00", value: 600 },
  { key: "12", label: "12:00", value: 1200 },
  { key: "18", label: "18:00", value: 900 },
];

/**
 * Centre of the rose in the 480 by 270 layout, inside recharts' 5px margin.
 */
const CENTER = { x: 240, y: 135 };

/**
 * Radius of a wedge at the value of a full radius: 76% of the 130px circle the layout fits.
 */
const FULL = 130 * 0.76;

/**
 * Renders the chart over the hours, with the props a case changes.
 */
function drawn(props: Partial<PolarAreaChartProps> = {}): ReturnType<typeof render> {
  laidOut();

  return render(
    <PolarAreaChart label="Requests by hour" locale="en-US" slices={HOURS} {...props} />,
  );
}

/**
 * Returns every wedge's path.
 */
function wedgesOf(container: Element): Element[] {
  return [...container.querySelectorAll(".recharts-pie-sector path")];
}

/**
 * Returns the numbers of a wedge's path: the outer arc's start, its radius twice, its flags, its
 * end and the centre.
 */
function numbersOf(path: Element | undefined): number[] {
  return [...(path?.getAttribute("d") ?? "").matchAll(/-?\d+(?:\.\d+)?/gu)].map((match) =>
    Number(match[0]),
  );
}

/**
 * Returns the radius of a wedge's outer arc.
 */
function radiusOf(path: Element | undefined): number {
  return numbersOf(path)[2] ?? 0;
}

/**
 * Returns the angle in degrees, counter-clockwise from 3 o'clock, of the point the text of a name
 * is anchored at.
 */
function angleOf(text: Element | null): number {
  const x = Number(text?.getAttribute("x"));
  const y = Number(text?.getAttribute("y"));

  return ((((Math.atan2(CENTER.y - y, x - CENTER.x) * 180) / Math.PI) % 360) + 360) % 360;
}

describe("PolarAreaChart", () => {
  it("returns no accessibility violation", async () => {
    laidOut();

    await expect(
      accessibilityViolations(() => (
        <PolarAreaChart caption="Noon is the peak." label="Requests by hour" slices={HOURS} />
      )),
    ).resolves.toStrictEqual([]);
  });

  it("names the keyboard layer by the label", () => {
    const { container } = drawn();

    expect(container.querySelector(".recharts-surface title")?.textContent).toBe(
      "Requests by hour",
    );
  });

  it("names the figure by its caption", () => {
    const { getByRole } = drawn({ caption: "Noon is the peak." });

    expect(getByRole("figure", { name: "Noon is the peak." })).toBeDefined();
  });

  it("renders a wedge per slice", () => {
    const { container } = drawn();

    expect(wedgesOf(container)).toHaveLength(4);
  });

  it("extends the wedge at the largest value to the full radius", () => {
    const { container } = drawn();

    expect(radiusOf(wedgesOf(container)[2])).toBeCloseTo(FULL, 1);
  });

  it("extends a wedge at a quarter of the largest value to half the radius", () => {
    const { container } = drawn();

    expect(radiusOf(wedgesOf(container)[0])).toBeCloseTo(FULL / 2, 1);
  });

  it("extends the wedge at the largest value to the whole circle without names", () => {
    const { container } = drawn({ names: false });

    expect(radiusOf(wedgesOf(container)[2])).toBeCloseTo(130, 1);
  });

  it("extends each wedge to its share of max", () => {
    const { container } = drawn({ max: 4800 });

    expect(radiusOf(wedgesOf(container)[2])).toBeCloseTo(FULL / 2, 1);
  });

  it("starts the first wedge at 12 o'clock", () => {
    const { container } = drawn();
    const [x = 0, y = 0] = numbersOf(wedgesOf(container)[0]);

    expect([x, y]).toStrictEqual([
      expect.closeTo(CENTER.x, 1),
      expect.closeTo(CENTER.y - FULL / 2, 1),
    ]);
  });

  it("ends the first of four wedges a quarter turn on at 3 o'clock", () => {
    const { container } = drawn();
    const numbers = numbersOf(wedgesOf(container)[0]);

    expect(numbers.slice(7, 9)).toStrictEqual([
      expect.closeTo(CENTER.x + FULL / 2, 1),
      expect.closeTo(CENTER.y, 1),
    ]);
  });

  it("takes the pie's group out of the tab order", () => {
    const { container } = drawn();

    expect(container.querySelector(".recharts-pie")?.getAttribute("tabindex")).toBe("-1");
  });

  it("renders a name per slice around the rose", () => {
    const { container } = drawn();

    expect(
      [...container.querySelectorAll(".recharts-polar-angle-axis-tick-value")].map(
        (text) => text.textContent,
      ),
    ).toStrictEqual(["00:00", "06:00", "12:00", "18:00"]);
  });

  it("centres the first name on its wedge", () => {
    const { container } = drawn();

    expect(angleOf(container.querySelector(".recharts-polar-angle-axis-tick-value"))).toBeCloseTo(
      45,
      1,
    );
  });

  it("writes a slice's key as its name without a text label", () => {
    const { container } = drawn({ slices: [{ key: "north", value: 1 }] });

    expect(container.querySelector(".recharts-polar-angle-axis-tick-value")?.textContent).toBe(
      "north",
    );
  });

  it("renders no names when names is off", () => {
    const { container } = drawn({ names: false });

    expect(container.querySelector(".recharts-polar-angle-axis")).toBeNull();
  });

  it("renders no angle axis line around the rose", () => {
    const { container } = drawn();

    expect(container.querySelector(".recharts-polar-angle-axis-line")).toBeNull();
  });

  it("renders no tick marks around the rose", () => {
    const { container } = drawn();

    expect(container.querySelector(".recharts-polar-angle-axis-tick-line")).toBeNull();
  });

  it("colors every wedge with the theme's first series color unless stated", () => {
    const { container } = drawn();

    expect(new Set(wedgesOf(container).map((path) => path.getAttribute("fill")))).toStrictEqual(
      new Set(["var(--colors-series-1)"]),
    );
  });

  it("colors every wedge with the palette color states", () => {
    const { container } = drawn({ color: "teal" });

    expect(wedgesOf(container)[0]?.getAttribute("fill")).toBe("var(--colors-teal-chart)");
  });

  it("colors a wedge with the palette its slice states", () => {
    const { container } = drawn({
      color: "teal",
      slices: [{ color: "error", key: "north", value: 1 }, ...HOURS],
    });

    expect(wedgesOf(container)[0]?.getAttribute("fill")).toBe("var(--colors-error-chart)");
  });

  it("fills the wedge at the largest value completely", () => {
    const { container } = drawn();

    expect(wedgesOf(container)[2]?.getAttribute("fill-opacity")).toBe("1");
  });

  it("fills a smaller wedge less", () => {
    const { container } = drawn();

    expect(Number(wedgesOf(container)[0]?.getAttribute("fill-opacity"))).toBeCloseTo(
      0.45 + 0.55 / 4,
      10,
    );
  });

  it("writes each slice's value beside its name in the legend", () => {
    const { getByRole } = drawn();

    expect(getByRole("button", { name: "12:00 1,200" })).toBeDefined();
  });

  it("writes the names alone in the legend when values is off", () => {
    const { getByRole } = drawn({ values: false });

    expect(getByRole("button", { name: "12:00" })).toBeDefined();
  });

  it("writes the key beside the value in the legend without a label", () => {
    const { getByRole } = drawn({ slices: [{ key: "north", value: 5 }] });

    expect(getByRole("button", { name: "north 5" })).toBeDefined();
  });

  it("keeps the place of a wedge the legend hides", () => {
    const { container, getByRole } = drawn();

    act(() => {
      fireEvent.click(getByRole("button", { name: "06:00 600" }));
    });

    expect(wedgesOf(container).map((path) => radiusOf(path) > 1)).toStrictEqual([
      true,
      false,
      true,
      true,
    ]);
  });

  it("opens the tooltip at the slice defaultIndex names", () => {
    const { container } = drawn({ defaultIndex: 2 });

    expect(container.querySelector(".chart__tooltip .chart__name")?.textContent).toBe("12:00");
  });

  it("writes the slice's value in the tooltip rather than its angle", () => {
    const { container } = drawn({ defaultIndex: 2 });

    expect(container.querySelector(".chart__tooltip .chart__value")?.textContent).toBe("1,200");
  });

  it("writes the value with valueOptions in the tooltip", () => {
    const { container } = drawn({
      defaultIndex: 2,
      valueOptions: { notation: "compact" },
    });

    expect(container.querySelector(".chart__tooltip .chart__value")?.textContent).toBe("1.2K");
  });

  it("names a slice by its key in the tooltip without a label", () => {
    const { container } = drawn({ defaultIndex: 0, slices: [{ key: "north", value: 5 }] });

    expect(container.querySelector(".chart__tooltip .chart__name")?.textContent).toBe("north");
  });

  it("renders no tooltip heading", () => {
    const { container } = drawn({ defaultIndex: 2 });

    expect(container.querySelector(".chart__tooltip .chart__name")).not.toBeNull();
    expect(container.querySelector(".chart__heading")).toBeNull();
  });

  it("renders no legend when legend is off", () => {
    const { container } = drawn({ legend: false });

    expect(container.querySelector("fieldset")).toBeNull();
  });

  it("renders no legend without slices", () => {
    const { container } = drawn({ slices: [] });

    expect(container.querySelector("fieldset")).toBeNull();
  });

  it("renders No data in the plot's place without slices", () => {
    const { container } = drawn({ slices: [] });

    expect(container.querySelector(".chart__empty")?.textContent).toBe("No data");
  });

  it("renders the stated message without slices", () => {
    const { container } = drawn({ empty: "No requests yet.", slices: [] });

    expect(container.querySelector(".chart__empty")?.textContent).toBe("No requests yet.");
  });

  it("gives the plot the square ratio unless stated", () => {
    const { container } = drawn();

    expect(container.querySelector(".chart__plot--square")).not.toBeNull();
  });

  it("passes the ratio to the figure", () => {
    const { container } = drawn({ ratio: "landscape" });

    expect(container.querySelector(".chart__plot--landscape")).not.toBeNull();
  });

  it("renders the children inside the chart", () => {
    const { container } = drawn({ children: <g className="probe" /> });

    expect(container.querySelector(".recharts-surface .probe")).not.toBeNull();
  });

  it("renders no caption without one", () => {
    const { container } = drawn();

    expect(container.querySelector("figcaption")).toBeNull();
  });
});
