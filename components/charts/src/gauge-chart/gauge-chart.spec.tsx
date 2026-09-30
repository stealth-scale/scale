import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { laidOut } from "#cartesian/cartesian.fixtures.ts";
import { type GaugeZone } from "#gauge-chart/bands.ts";
import { GaugeChart, type GaugeChartProps } from "#gauge-chart/gauge-chart.tsx";

/**
 * Lists three zones of a latency in milliseconds, from healthy to critical.
 */
const ZONES: readonly GaugeZone[] = [
  { color: "success", label: "Healthy", upTo: 600 },
  { color: "warning", label: "Watch", upTo: 900 },
  { color: "error", label: "Critical", upTo: 1200 },
];

/**
 * Centre of the dial in the 480 by 270 layout, inside recharts' 5px margin.
 */
const CENTER = { x: 240, y: 135 };

/**
 * Radius of the reading ring's outer edge: 84% of the 130px circle the layout fits.
 */
const READING = 130 * 0.84;

/**
 * Renders a gauge of a 740ms latency on a dial to 1,200ms, with the props a case changes.
 */
function drawn(props: Partial<GaugeChartProps> = {}): ReturnType<typeof render> {
  laidOut();

  return render(
    <GaugeChart label="Checkout latency" locale="en-US" max={1200} value={740} {...props} />,
  );
}

/**
 * Returns the sector paths of each pie, the zones' ring first where it renders.
 */
function ringsOf(container: Element): Element[][] {
  return [...container.querySelectorAll(".recharts-pie")].map((pie) =>
    Array.from(pie.querySelectorAll(".recharts-pie-sector path")),
  );
}

/**
 * Returns the sector paths of the reading's ring.
 */
function readingOf(container: Element): Element[] {
  return ringsOf(container).at(-1) ?? [];
}

/**
 * Returns the sector groups of the reading's ring, one per sector recharts renders.
 */
function sectorsOf(container: Element): Element[] {
  return Array.from(
    [...container.querySelectorAll(".recharts-pie")]
      .at(-1)
      ?.querySelectorAll(".recharts-pie-sector") ?? [],
  );
}

/**
 * Returns the numbers of a sector's path: the outer arc's start, its radius, its flags and its end,
 * then the inner arc's.
 */
function numbersOf(path: Element | undefined): number[] {
  return [...(path?.getAttribute("d") ?? "").matchAll(/-?\d+(?:\.\d+)?/gu)].map((match) =>
    Number(match[0]),
  );
}

/**
 * Returns the text of a part of the chart.
 */
function textOf(container: Element, selector: string): null | string | undefined {
  return container.querySelector(selector)?.textContent;
}

/**
 * Returns the angle of a point around the dial's centre, in degrees counter-clockwise from 3
 * o'clock.
 */
function angleAt(x = 0, y = 0): number {
  return (Math.atan2(CENTER.y - y, x - CENTER.x) * 180) / Math.PI;
}

describe("GaugeChart", () => {
  it("returns no accessibility violation", async () => {
    laidOut();

    await expect(
      accessibilityViolations(() => (
        <GaugeChart
          caption="p99 is in the watch zone."
          label="Checkout latency"
          max={1200}
          value={740}
          zones={ZONES}
        />
      )),
    ).resolves.toStrictEqual([]);
  });

  it("renders a meter named by the label", () => {
    const { getByRole } = drawn();

    expect(getByRole("meter", { name: "Checkout latency" })).toBeDefined();
  });

  it("states the meter's range and value", () => {
    const { getByRole } = drawn();
    const meter = getByRole("meter");

    expect(
      ["aria-valuemin", "aria-valuemax", "aria-valuenow"].map((name) => meter.getAttribute(name)),
    ).toStrictEqual(["0", "1200", "740"]);
  });

  it("writes the value and the zone's name as the meter's text", () => {
    const { getByRole } = drawn({ zones: ZONES });

    expect(getByRole("meter").getAttribute("aria-valuetext")).toBe("740, Watch");
  });

  it("writes the value alone as the meter's text for a zone whose name is not text", () => {
    const { getByRole } = drawn({ zones: [{ label: <b>Watch</b>, upTo: 1200 }] });

    expect(getByRole("meter").getAttribute("aria-valuetext")).toBe("740");
  });

  it("writes the value alone as the meter's text without zones", () => {
    const { getByRole } = drawn();

    expect(getByRole("meter").getAttribute("aria-valuetext")).toBe("740");
  });

  it("names the figure by its caption", () => {
    const { getByRole } = drawn({ caption: "p99 is in the watch zone." });

    expect(getByRole("figure", { name: "p99 is in the watch zone." })).toBeDefined();
  });

  it("writes the value in the middle of the dial", () => {
    const { container } = drawn();

    expect(textOf(container, ".chart__center-value")).toBe("740");
  });

  it("writes the zone's name under the value", () => {
    const { container } = drawn({ zones: ZONES });

    expect(textOf(container, ".chart__center-label")).toBe("Watch");
  });

  it("writes the stated words under the value in place of the zone's name", () => {
    const { container } = drawn({ centerLabel: "p99", zones: ZONES });

    expect(textOf(container, ".chart__center-label")).toBe("p99");
  });

  it("writes the value with valueOptions", () => {
    const { container } = drawn({ max: 1, value: 0.86, valueOptions: { style: "percent" } });

    expect(textOf(container, ".chart__center-value")).toBe("86%");
  });

  it("clamps a value past the maximum to the maximum", () => {
    const { getByRole } = drawn({ value: 4000 });

    expect(getByRole("meter").getAttribute("aria-valuenow")).toBe("1200");
  });

  it("writes a value past the maximum as it is in the middle of the dial", () => {
    const { container } = drawn({ value: 4000 });

    expect(textOf(container, ".chart__center-value")).toBe("4,000");
  });

  it("writes a value past the maximum as it is as the meter's text", () => {
    const { getByRole } = drawn({ value: 4000, zones: ZONES });

    expect(getByRole("meter").getAttribute("aria-valuetext")).toBe("4,000, Critical");
  });

  it("fills the dial to its end for a value past the maximum", () => {
    const { container } = drawn({ value: 4000 });

    expect(sectorsOf(container)).toHaveLength(1);
  });

  it("clamps a value below the minimum to the minimum", () => {
    const { getByRole } = drawn({ min: 100, value: 20 });

    expect(getByRole("meter").getAttribute("aria-valuenow")).toBe("100");
  });

  it("starts the range at 0 for a minimum that is not a finite number", () => {
    const { getByRole } = drawn({ min: Number.NaN });

    expect(getByRole("meter").getAttribute("aria-valuemin")).toBe("0");
  });

  it("ends the range one above the minimum for a maximum not above it", () => {
    const { getByRole } = drawn({ max: 0, value: 0.5 });

    expect(getByRole("meter").getAttribute("aria-valuemax")).toBe("1");
  });

  it("renders No data in the plot's place for a value that is not a finite number", () => {
    const { container } = drawn({ value: Number.NaN });

    expect(textOf(container, ".chart__empty")).toBe("No data");
  });

  it("renders the stated message for a value that is not a finite number", () => {
    const { container } = drawn({ empty: "No reading yet.", value: Number.NaN });

    expect(textOf(container, ".chart__empty")).toBe("No reading yet.");
  });

  it("renders the reading's ring alone without zones", () => {
    const { container } = drawn();

    expect(ringsOf(container)).toHaveLength(1);
  });

  it("renders a sector per zone in the zones' ring", () => {
    const { container } = drawn({ zones: ZONES });

    expect(ringsOf(container)[0]).toHaveLength(3);
  });

  it("renders the part no zone covers as a track in the zones' ring", () => {
    const { container } = drawn({ zones: ZONES.slice(0, 2) });

    expect(ringsOf(container)[0]?.at(-1)?.getAttribute("class")).toContain("chart-track");
  });

  it("tints each zone with its palette", () => {
    const { container } = drawn({ zones: ZONES });

    expect(ringsOf(container)[0]?.[1]?.getAttribute("fill")).toBe(
      "color-mix(in oklab, var(--colors-warning-chart) 40%, var(--colors-bg-panel))",
    );
  });

  it("tints a zone without a palette with the neutral palette", () => {
    const { container } = drawn({ zones: [{ upTo: 1200 }] });

    expect(ringsOf(container)[0]?.[0]?.getAttribute("fill")).toContain(
      "var(--colors-neutral-chart)",
    );
  });

  it("fills the reading in its zone's palette", () => {
    const { container } = drawn({ zones: ZONES });

    expect(readingOf(container)[0]?.getAttribute("fill")).toBe("var(--colors-warning-chart)");
  });

  it("fills the reading in the theme's first series color without zones", () => {
    const { container } = drawn();

    expect(readingOf(container)[0]?.getAttribute("fill")).toBe("var(--colors-series-1)");
  });

  it("fills the reading in the stated palette where its zone states none", () => {
    const { container } = drawn({ color: "teal", zones: [{ upTo: 1200 }] });

    expect(readingOf(container)[0]?.getAttribute("fill")).toBe("var(--colors-teal-chart)");
  });

  it("renders the rest of the range past the reading as a track", () => {
    const { container } = drawn();

    expect(readingOf(container)[1]?.getAttribute("class")).toContain("chart-track");
  });

  it("renders no track past a reading at the maximum", () => {
    const { container } = drawn({ value: 1200 });

    expect(sectorsOf(container)).toHaveLength(1);
  });

  it("renders no reading arc at the minimum", () => {
    const { container } = drawn({ value: 0 });

    expect(
      sectorsOf(container).map((sector) => sector.querySelector("path")?.getAttribute("class")),
    ).toStrictEqual([expect.stringContaining("chart-track")]);
  });

  it("starts the dial halfway between 6 and 9 o'clock", () => {
    const { container } = drawn();
    const [x = 0, y = 0] = numbersOf(readingOf(container)[0]);

    expect([x, y]).toStrictEqual([
      expect.closeTo(CENTER.x - READING * Math.SQRT1_2, 1),
      expect.closeTo(CENTER.y + READING * Math.SQRT1_2, 1),
    ]);
  });

  it("ends the dial halfway between 3 and 6 o'clock", () => {
    const { container } = drawn();
    const numbers = numbersOf(readingOf(container)[1]);

    expect(numbers.slice(7, 9)).toStrictEqual([
      expect.closeTo(CENTER.x + READING * Math.SQRT1_2, 1),
      expect.closeTo(CENTER.y + READING * Math.SQRT1_2, 1),
    ]);
  });

  it("fills the reading's share of the range", () => {
    const { container } = drawn({ max: 200, min: 100, value: 150 });
    const numbers = numbersOf(readingOf(container)[0]);

    expect(numbers.slice(7, 9)).toStrictEqual([
      expect.closeTo(CENTER.x, 1),
      expect.closeTo(CENTER.y - READING, 1),
    ]);
  });

  it("cuts a hole of 58% of the radius inside the reading", () => {
    const { container } = drawn();

    expect(numbersOf(readingOf(container)[0])[11]).toBeCloseTo(130 * 0.58, 1);
  });

  it("puts the zones' ring between 90% and 97% of the radius", () => {
    const { container } = drawn({ zones: ZONES });
    const numbers = numbersOf(ringsOf(container)[0]?.[0]);

    expect([numbers[2], numbers[11]]).toStrictEqual([
      expect.closeTo(130 * 0.97, 1),
      expect.closeTo(130 * 0.9, 1),
    ]);
  });

  it("parts the zones by a degree", () => {
    const { container } = drawn({ zones: ZONES });
    const [first, second] = ringsOf(container)[0] ?? [];
    const [, , , , , , , endX, endY] = numbersOf(first);
    const [startX, startY] = numbersOf(second);

    expect(angleAt(endX, endY) - angleAt(startX, startY)).toBeCloseTo(1, 1);
  });

  it("writes the minimum under the dial's lowest corner at the start", () => {
    const { container } = drawn();

    expect(Number(container.querySelector(".chart-limits text")?.getAttribute("y"))).toBeCloseTo(
      CENTER.y + 130 * 0.97 * Math.SQRT1_2 + 4,
      1,
    );
  });

  it("turns the dial between the angles it states", () => {
    const { container } = drawn({ endAngle: 0, startAngle: 180 });
    const [x = 0, y = 0] = numbersOf(readingOf(container)[0]);

    expect([x, y]).toStrictEqual([
      expect.closeTo(CENTER.x - READING, 1),
      expect.closeTo(CENTER.y, 1),
    ]);
  });

  it("writes the range's ends under the dial", () => {
    const { container } = drawn();

    expect(
      [...container.querySelectorAll(".chart-limits text")].map((text) => text.textContent),
    ).toStrictEqual(["0", "1,200"]);
  });

  it("writes no range's ends when limits is off", () => {
    const { container } = drawn({ limits: false });

    expect(container.querySelector(".chart-limits")).toBeNull();
  });

  it("renders no keyboard layer", () => {
    const { container } = drawn();

    expect(container.querySelector(".recharts-surface")?.getAttribute("tabindex")).toBeNull();
  });

  it("takes each pie's group out of the tab order", () => {
    const { container } = drawn({ zones: ZONES });

    expect(
      [...container.querySelectorAll(".recharts-pie")].map((pie) => pie.getAttribute("tabindex")),
    ).toStrictEqual(["-1", "-1"]);
  });

  it("renders no tooltip", () => {
    const { container } = drawn();

    expect(container.querySelector(".chart__tooltip")).toBeNull();
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
