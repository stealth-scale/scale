import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { laidOut } from "#cartesian/cartesian.fixtures.ts";
import { RadialBarChart, type RadialBarChartProps } from "#radial-bar-chart/radial-bar-chart.tsx";
import { type RadialBarDatum } from "#radial-bar-chart/rings.ts";

/**
 * Lists a plan's use of three quotas as shares.
 */
const BARS: readonly RadialBarDatum[] = [
  { key: "storage", label: "Storage", value: 0.82 },
  { key: "seats", label: "Seats", value: 0.61 },
  { key: "api", label: "API calls", value: 0.34 },
];

/**
 * Centre of the rings in the 480 by 270 layout, inside recharts' 5px margin.
 */
const CENTER = { x: 240, y: 135 };

/**
 * Radius of the largest circle the chart fits in the 480 by 270 layout.
 */
const RADIUS = 130;

/**
 * Width of each of three rings' bands between the hole of 30% and the full radius.
 */
const BAND = (RADIUS * 0.7) / 3;

/**
 * Space recharts leaves at each side of a ring inside its band: a tenth of the band.
 */
const GAP = BAND * 0.1;

/**
 * Thickness of each ring, which recharts rounds to whole pixels.
 */
const THICKNESS = Math.round(BAND - 2 * GAP);

/**
 * Lists the fixture bars with storage past a full turn of 1.
 */
const OVER: readonly RadialBarDatum[] = [
  { key: "storage", label: "Storage", value: 1.2 },
  ...BARS.slice(1),
];

/**
 * Lists the fixture bars with storage below zero.
 */
const UNDER: readonly RadialBarDatum[] = [
  { key: "storage", label: "Storage", value: -0.2 },
  ...BARS.slice(1),
];

/**
 * Renders the chart over the fixture bars, with the props a case changes.
 */
function drawn(props: Partial<RadialBarChartProps> = {}): ReturnType<typeof render> {
  laidOut();

  return render(
    <RadialBarChart
      bars={BARS}
      label="Plan usage"
      locale="en-US"
      valueOptions={{ style: "percent" }}
      {...props}
    />,
  );
}

/**
 * Renders the chart and moves the pointer onto the outermost ring at 12 o'clock.
 */
async function pointed(): Promise<ReturnType<typeof render>> {
  const rendered = drawn();
  const wrapper = rendered.container.querySelector(".recharts-wrapper");

  if (wrapper !== null) {
    fireEvent.mouseMove(wrapper, { clientX: CENTER.x, clientY: CENTER.y - RADIUS + BAND / 2 });
  }

  await act(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 20);
    });
  });

  return rendered;
}

/**
 * Returns the numbers of a ring's path: the outer arc's start, its radius, its large-arc flag and
 * its end.
 */
function arcOf(container: Element, name: string): number[] {
  const path = container.querySelector(`.recharts-radial-bar-sector[name=${name}]`);

  return [...(path?.getAttribute("d") ?? "").matchAll(/-?\d+(?:\.\d+)?/gu)].map((match) =>
    Number(match[0]),
  );
}

/**
 * Returns the angle in degrees a ring's outer arc turns through, from its chord and its radius.
 */
function turnOf(container: Element, name: string): number {
  const [x0 = 0, y0 = 0, radius = 1, , , large = 0, , x1 = 0, y1 = 0] = arcOf(container, name);
  const small = (2 * Math.asin(Math.hypot(x1 - x0, y1 - y0) / (2 * radius)) * 180) / Math.PI;

  return large === 1 ? 360 - small : small;
}

describe("RadialBarChart", () => {
  it("returns no accessibility violation", async () => {
    laidOut();

    await expect(
      accessibilityViolations(() => (
        <RadialBarChart bars={BARS} caption="Storage is at 82%." label="Plan usage" max={1} />
      )),
    ).resolves.toStrictEqual([]);
  });

  it("names the keyboard layer by the label", () => {
    const { container } = drawn();

    expect(container.querySelector(".recharts-surface title")?.textContent).toBe("Plan usage");
  });

  it("names the figure by its caption", () => {
    const { getByRole } = drawn({ caption: "Storage is at 82%." });

    expect(getByRole("figure", { name: "Storage is at 82%." })).toBeDefined();
  });

  it("renders a ring per bar", () => {
    const { container } = drawn();

    expect(container.querySelectorAll(".recharts-radial-bar-sector")).toHaveLength(3);
  });

  it("puts the first bar's ring outermost", () => {
    const { container } = drawn();

    expect(arcOf(container, "storage")[2] ?? 0).toBeGreaterThan(arcOf(container, "api")[2] ?? 0);
  });

  it("cuts a hole of 30% of the radius inside the innermost ring", () => {
    const { container } = drawn();

    expect(arcOf(container, "api")[11]).toBeCloseTo(RADIUS * 0.3 + GAP, 1);
  });

  it("puts the outermost ring at the radius of the largest circle the chart fits", () => {
    const { container } = drawn();

    expect(arcOf(container, "storage")[2]).toBeCloseTo(RADIUS - BAND + GAP + THICKNESS, 1);
  });

  it("starts each ring at 12 o'clock", () => {
    const { container } = drawn();
    const [x = 0, y = 0, radius = 0] = arcOf(container, "seats");

    expect([x, y]).toStrictEqual([
      expect.closeTo(CENTER.x, 1),
      expect.closeTo(CENTER.y - radius, 1),
    ]);
  });

  it("turns each ring through its share of max", () => {
    const { container } = drawn({ max: 1 });

    expect(turnOf(container, "seats")).toBeCloseTo(219.6, 1);
  });

  it("turns each ring through its share of the largest value without max", () => {
    const { container } = drawn();

    expect(turnOf(container, "seats")).toBeCloseTo((0.61 / 0.82) * 360, 1);
  });

  it("closes the track of a ring past max", () => {
    const { container } = drawn({ bars: OVER, max: 1 });

    expect(turnOf(container, "storage")).toBeCloseTo(360, 0);
  });

  it("keeps the turn of max for the other rings while a ring is past max", () => {
    const { container } = drawn({ bars: OVER, max: 1 });

    expect(turnOf(container, "seats")).toBeCloseTo(219.6, 1);
  });

  it("writes the value of a ring past max in the legend", () => {
    const { getByRole } = drawn({ bars: OVER, max: 1 });

    expect(getByRole("button", { name: "Storage 120%" })).toBeDefined();
  });

  it("writes the value of a ring past max in the tooltip", () => {
    const { container } = drawn({ bars: OVER, defaultIndex: 0, max: 1 });

    expect(container.querySelector(".chart__tooltip .chart__value")?.textContent).toBe("120%");
  });

  it("renders no arc for a ring below zero", () => {
    const { container } = drawn({ bars: UNDER, max: 1 });

    expect(turnOf(container, "storage")).toBe(0);
  });

  it("keeps the turn of max for the other rings while a ring is below zero", () => {
    const { container } = drawn({ bars: UNDER, max: 1 });

    expect(turnOf(container, "api")).toBeCloseTo(0.34 * 360, 1);
  });

  it("turns each ring through its share of the angles it states", () => {
    const { container } = drawn({ endAngle: -45, max: 1, startAngle: 225 });

    expect(turnOf(container, "seats")).toBeCloseTo(0.61 * 270, 1);
  });

  it("renders a track behind each ring unless stated", () => {
    const { container } = drawn();

    expect(container.querySelectorAll(".recharts-radial-bar-background-sector")).toHaveLength(3);
  });

  it("renders no track when track is off", () => {
    const { container } = drawn({ track: false });

    expect(container.querySelector(".recharts-radial-bar-background-sector")).toBeNull();
  });

  it("writes each ring's value beside its name in the legend", () => {
    const { getByRole } = drawn();

    expect(getByRole("button", { name: "Storage 82%" })).toBeDefined();
  });

  it("writes the key beside the value in the legend without a label", () => {
    const { getByRole } = drawn({ bars: [{ key: "storage", value: 0.5 }] });

    expect(getByRole("button", { name: "storage 50%" })).toBeDefined();
  });

  it("writes the names alone in the legend when values is off", () => {
    const { getByRole } = drawn({ values: false });

    expect(getByRole("button", { name: "Storage" })).toBeDefined();
  });

  it("names a ring by its key in the legend without a label", () => {
    const { getByRole } = drawn({ bars: [{ key: "storage", value: 0.5 }], values: false });

    expect(getByRole("button", { name: "storage" })).toBeDefined();
  });

  it("leaves a ring the legend hides out of the chart", () => {
    const { container, getByRole } = drawn();

    act(() => {
      fireEvent.click(getByRole("button", { name: "Seats 61%" }));
    });

    expect(container.querySelectorAll(".recharts-radial-bar-sector")).toHaveLength(2);
  });

  it("keeps the turn of max after the legend hides a ring", () => {
    const { container, getByRole } = drawn({ max: 1 });

    act(() => {
      fireEvent.click(getByRole("button", { name: "Storage 82%" }));
    });

    expect(turnOf(container, "seats")).toBeCloseTo(219.6, 1);
  });

  it("opens the tooltip at the bar defaultIndex names", () => {
    const { container } = drawn({ defaultIndex: 1 });

    expect(container.querySelector(".chart__tooltip .chart__name")?.textContent).toBe("Seats");
  });

  it("names a ring by its key in the tooltip without a label", () => {
    const { container } = drawn({ bars: [{ key: "storage", value: 0.5 }], defaultIndex: 0 });

    expect(container.querySelector(".chart__tooltip .chart__name")?.textContent).toBe("storage");
  });

  it("writes the ring's value with valueOptions in the tooltip", () => {
    const { container } = drawn({ defaultIndex: 1 });

    expect(container.querySelector(".chart__tooltip .chart__value")?.textContent).toBe("61%");
  });

  it("colors the tooltip's swatch with the ring's color", () => {
    const { container } = drawn({ defaultIndex: 1 });

    expect(
      container.querySelector(".chart__tooltip .color-swatch")?.getAttribute("style"),
    ).toContain("var(--colors-series-2)");
  });

  it("renders no tooltip heading", () => {
    const { container } = drawn({ defaultIndex: 1 });

    expect(container.querySelector(".chart__heading")).toBeNull();
  });

  it("renders no angle axis line around the rings", () => {
    const { container } = drawn();

    expect(container.querySelector(".recharts-polar-angle-axis-line")).toBeNull();
  });

  it("renders no tick marks around the rings", () => {
    const { container } = drawn();

    expect(container.querySelector(".recharts-polar-angle-axis-tick-line")).toBeNull();
  });

  it("opens the tooltip at the ring under the pointer", async () => {
    const { container } = await pointed();

    expect(container.querySelector(".chart__tooltip .chart__name")?.textContent).toBe("Storage");
  });

  it("renders no cursor under the pointer", async () => {
    const { container } = await pointed();

    expect(container.querySelector(".recharts-tooltip-cursor")).toBeNull();
  });

  it("renders no legend when legend is off", () => {
    const { container } = drawn({ legend: false });

    expect(container.querySelector("fieldset")).toBeNull();
  });

  it("renders no legend without bars", () => {
    const { container } = drawn({ bars: [] });

    expect(container.querySelector("fieldset")).toBeNull();
  });

  it("renders No data in the plot's place without bars", () => {
    const { container } = drawn({ bars: [] });

    expect(container.querySelector(".chart__empty")?.textContent).toBe("No data");
  });

  it("renders the stated message without bars", () => {
    const { container } = drawn({ bars: [], empty: "No usage yet." });

    expect(container.querySelector(".chart__empty")?.textContent).toBe("No usage yet.");
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
