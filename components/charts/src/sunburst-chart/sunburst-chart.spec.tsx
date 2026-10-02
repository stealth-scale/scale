import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { laidOut } from "#cartesian/cartesian.fixtures.ts";
import { type HierarchyNode } from "#hierarchy/hierarchy.ts";
import { SunburstChart, type SunburstChartProps } from "#sunburst-chart/sunburst-chart.tsx";

/**
 * Lists a data team of three services, a platform team of two and a CDN at the top level: 32,200,
 * 29,400 and 4,400 of 66,000.
 */
const NODES: readonly HierarchyNode[] = [
  { key: "cdn", label: "CDN", value: 4400 },
  {
    children: [
      { key: "kafka", label: "Kafka", value: 9700 },
      { key: "db", label: "Postgres", value: 18_400 },
      { key: "redis", label: "Redis", value: 4100 },
    ],
    key: "data",
    label: "Data",
  },
  {
    children: [
      { key: "k8s", label: "Kubernetes", value: 21_800 },
      { key: "logs", label: "Log ingest", value: 7600 },
    ],
    key: "platform",
    label: "Platform",
  },
];

/**
 * Middle of the rings in the 480 by 270 plot `laidOut` measures, inside recharts' 5px margin.
 */
const MIDDLE = { x: 240, y: 135 };

/**
 * Describes a sector's path: its radii, and the points it starts and ends at on its outer edge.
 */
interface Geometry {
  readonly end: { x: number; y: number };
  readonly inner: number;
  readonly outer: number;
  readonly start: { x: number; y: number };
  readonly sweep: number;
}

/**
 * Renders a sunburst of the nodes, with the props a case changes.
 */
function drawn(props: Partial<SunburstChartProps> = {}): ReturnType<typeof render> {
  laidOut();

  return render(<SunburstChart label="Cloud spend" locale="en-US" nodes={NODES} {...props} />);
}

/**
 * Returns the sectors of every ring, the innermost ring first, each in its ring's order.
 */
function ringsOf(container: Element): Element[][] {
  return [...container.querySelectorAll(".recharts-pie")].map((pie) =>
    Array.from(pie.querySelectorAll(".recharts-sector")),
  );
}

/**
 * Returns the arc at a place in the walk.
 */
function arcAt(container: Element, walk: number): Element | null {
  return container.querySelector(`[data-walk="${String(walk)}"] .recharts-sector`);
}

/**
 * Returns a sector's radii, sweep and outer ends from its path, which recharts writes as the outer
 * arc, a line to the inner edge and the inner arc back.
 */
function geometryOf(sector: Element | null | undefined): Geometry {
  const numbers = [...(sector?.getAttribute("d") ?? "").matchAll(/-?\d+(?:\.\d+)?/gu)].map(
    (match) => Number(match[0]),
  );

  return {
    end: { x: numbers[7] ?? 0, y: numbers[8] ?? 0 },
    inner: numbers[11] ?? 0,
    outer: numbers[2] ?? 0,
    start: { x: numbers[0] ?? 0, y: numbers[1] ?? 0 },
    sweep: numbers[6] ?? 0,
  };
}

/**
 * Returns the angle of a point around the middle, in degrees counter-clockwise from 3 o'clock.
 */
function angleOf(point: { x: number; y: number }): number {
  return (Math.atan2(MIDDLE.y - point.y, point.x - MIDDLE.x) * 180) / Math.PI;
}

/**
 * Returns the tooltip's heading.
 */
function headingOf(container: Element): string | undefined {
  return container.querySelector(".chart__tooltip .chart__heading")?.textContent;
}

/**
 * Returns the tooltip's rows as their names and values.
 */
function rowsOf(container: Element): string[][] {
  return [...container.querySelectorAll(".chart__tooltip .chart__row")].map((row) => [
    row.querySelector(".chart__name")?.textContent ?? "",
    row.querySelector(".chart__value")?.textContent ?? "",
  ]);
}

/**
 * Returns the text of every legend button.
 */
function legendOf(container: Element): string[] {
  return [...container.querySelectorAll(".chart__legend button")].map((item) => item.textContent);
}

describe("SunburstChart", () => {
  it("returns no accessibility violation", async () => {
    laidOut();

    await expect(
      accessibilityViolations(() => (
        <SunburstChart caption="Kubernetes costs the most." label="Cloud spend" nodes={NODES} />
      )),
    ).resolves.toStrictEqual([]);
  });

  it("renders a ring per level", () => {
    const { container } = drawn();

    expect(ringsOf(container).map((ring) => ring.length)).toStrictEqual([3, 6]);
  });

  it("starts the inner ring at 36% of the radius", () => {
    const { container } = drawn();

    expect(geometryOf(ringsOf(container)[0]?.[0]).inner).toBeCloseTo(46.8, 1);
  });

  it("splits the room to 96% of the radius evenly between the rings", () => {
    const { container } = drawn();
    const [inner, outer] = ringsOf(container).map((ring) => geometryOf(ring[0]));

    expect([inner?.outer, outer?.inner, outer?.outer]).toStrictEqual([85.8, 85.8, 124.8]);
  });

  it("starts the first arc at 12 o'clock", () => {
    const { container } = drawn();

    expect(angleOf(geometryOf(arcAt(container, 0)).start)).toBeCloseTo(90, 5);
  });

  it("runs the arcs clockwise", () => {
    const { container } = drawn();

    expect(geometryOf(arcAt(container, 0)).sweep).toBe(1);
  });

  it("sweeps a family's arc by its share of the total", () => {
    const { container } = drawn();

    expect(angleOf(geometryOf(arcAt(container, 0)).end)).toBeCloseTo(
      90 - (360 * 32_200) / 66_000,
      3,
    );
  });

  it("ends a family's last part where the family ends", () => {
    const { container } = drawn();

    expect(angleOf(geometryOf(arcAt(container, 3)).end)).toBeCloseTo(
      angleOf(geometryOf(arcAt(container, 0)).end),
      3,
    );
  });

  it("leaves a transparent gap outside a top-level leaf", () => {
    const { container } = drawn();

    expect(ringsOf(container)[1]?.at(-1)?.getAttribute("fill")).toBe("transparent");
  });

  it("gives the gap the gap class", () => {
    const { container } = drawn();

    expect(ringsOf(container)[1]?.at(-1)?.getAttribute("class")).toBe("recharts-sector chart-gap");
  });

  it("gives the gap no place in the walk", () => {
    const { container } = drawn();

    expect(container.querySelectorAll("[data-walk]")).toHaveLength(8);
  });

  it("fills the largest family from the first series color", () => {
    const { container } = drawn();

    expect(arcAt(container, 0)?.getAttribute("fill")).toBe(
      "color-mix(in oklab, var(--colors-series-1) 100%, var(--colors-bg-panel))",
    );
  });

  it("fills a family's largest part with 82% of its color", () => {
    const { container } = drawn();

    expect(arcAt(container, 1)?.getAttribute("fill")).toBe(
      "color-mix(in oklab, var(--colors-series-1) 82%, var(--colors-bg-panel))",
    );
  });

  it("fills the next family from the next series color", () => {
    const { container } = drawn();

    expect(arcAt(container, 4)?.getAttribute("fill")).toContain("var(--colors-series-2)");
  });

  it("fills a family from its stated palette", () => {
    const { container } = drawn({ nodes: [{ color: "teal", key: "cdn", value: 10 }] });

    expect(arcAt(container, 0)?.getAttribute("fill")).toContain("var(--colors-teal-chart)");
  });

  it("writes no word on the arcs", () => {
    const { container } = drawn();

    expect(container.querySelectorAll(".recharts-pie text")).toHaveLength(0);
  });

  it("names the families in the legend with their totals largest first", () => {
    const { container } = drawn();

    expect(legendOf(container)).toStrictEqual(["Data 32,200", "Platform 29,400", "CDN 4,400"]);
  });

  it("names the families in the legend without totals when values is off", () => {
    const { container } = drawn({ values: false });

    expect(legendOf(container)).toStrictEqual(["Data", "Platform", "CDN"]);
  });

  it("leaves a family the legend hides out of the rings", () => {
    const { container, getByRole } = drawn();

    fireEvent.click(getByRole("button", { name: "Data 32,200" }));

    expect(ringsOf(container).map((ring) => ring.length)).toStrictEqual([2, 3]);
  });

  it("sweeps each arc by its share of the families shown", () => {
    const { container } = drawn({ defaultHiddenKeys: ["data"] });

    expect(angleOf(geometryOf(arcAt(container, 0)).end)).toBeCloseTo(
      450 - (360 * 29_400) / 33_800,
      3,
    );
  });

  it("renders a ring per level of the families shown", () => {
    const { container } = drawn({ hiddenKeys: ["data", "platform"] });

    expect(ringsOf(container).map((ring) => ring.length)).toStrictEqual([1]);
  });

  it("reports the hidden families after a press in the legend", () => {
    const onHiddenKeysChange = vi.fn<(hidden: readonly string[]) => void>();
    const { getByRole } = drawn({ onHiddenKeysChange });

    fireEvent.click(getByRole("button", { name: "CDN 4,400" }));

    expect(onHiddenKeysChange).toHaveBeenLastCalledWith(["cdn"]);
  });

  it("fades the other families while the legend points at one", () => {
    const { container, getByRole } = drawn();

    fireEvent.pointerEnter(getByRole("button", { name: "Platform 29,400" }));

    expect([
      arcAt(container, 1)?.getAttribute("opacity"),
      arcAt(container, 5)?.getAttribute("opacity"),
    ]).toStrictEqual(["var(--chart-faded)", "1"]);
  });

  it("renders no legend when legend is off", () => {
    const { container } = drawn({ legend: false });

    expect(container.querySelector(".chart__legend")).toBeNull();
  });

  it("names the legend's group by legendLabel", () => {
    const { getByRole } = drawn({ legendLabel: "Teams" });

    expect(getByRole("group", { name: "Teams" })).toBeDefined();
  });

  it("heads the tooltip with the node's name", () => {
    const { container } = drawn({ defaultIndex: 5 });

    expect(headingOf(container)).toBe("Kubernetes");
  });

  it("writes the node's value and its share of the total in the tooltip", () => {
    const { container } = drawn({ defaultIndex: 5 });

    expect(rowsOf(container)).toStrictEqual([
      ["Value", "21,800"],
      ["Of total", "33%"],
    ]);
  });

  it("writes a family's total in its tooltip", () => {
    const { container } = drawn({ defaultIndex: 0 });

    expect(rowsOf(container)[0]).toStrictEqual(["Value", "32,200"]);
  });

  it("writes the values in the tooltip with valueOptions", () => {
    const { container } = drawn({
      defaultIndex: 1,
      valueOptions: { currency: "EUR", maximumFractionDigits: 0, style: "currency" },
    });

    expect(rowsOf(container)[0]).toStrictEqual(["Value", "€18,400"]);
  });

  it("names the tooltip's rows with the stated words", () => {
    const { container } = drawn({ defaultIndex: 5, shareLabel: "Share", valueLabel: "Spend" });

    expect(rowsOf(container).map(([name]) => name)).toStrictEqual(["Spend", "Share"]);
  });

  it("opens no tooltip for a place past the walk", () => {
    const { container } = drawn({ defaultIndex: 20 });

    expect(headingOf(container)).toBeUndefined();
  });

  it("opens the tooltip at the first family when the keyboard focuses the chart", () => {
    const { container, getByRole } = drawn();

    act(() => {
      getByRole("application", { name: "Cloud spend" }).focus();
    });

    expect(headingOf(container)).toBe("Data");
  });

  it("walks the arcs depth first with the arrow keys", () => {
    const { container, getByRole } = drawn();
    const surface = getByRole("application", { name: "Cloud spend" });

    act(() => {
      surface.focus();
    });
    fireEvent.keyDown(surface, { key: "ArrowRight" });
    const second = headingOf(container);
    fireEvent.keyDown(surface, { key: "ArrowRight" });

    expect([second, headingOf(container)]).toStrictEqual(["Postgres", "Kafka"]);
  });

  it("walks to the last arc with End", () => {
    const { container, getByRole } = drawn();
    const surface = getByRole("application", { name: "Cloud spend" });

    act(() => {
      surface.focus();
    });
    fireEvent.keyDown(surface, { key: "End" });

    expect(headingOf(container)).toBe("CDN");
  });

  it("makes the chart's svg its one tab stop", () => {
    const { container } = drawn();

    expect(
      [...container.querySelectorAll("[tabindex]:not([tabindex='-1'])")].map(
        (element) => element.tagName,
      ),
    ).toStrictEqual(["svg"]);
  });

  it("renders the center in the hole", () => {
    const { container } = drawn({ center: "€66K" });

    expect(container.querySelector(".chart__center-value")?.textContent).toBe("€66K");
  });

  it("renders the center's label under the figure", () => {
    const { container } = drawn({ center: "€66K", centerLabel: "per month" });

    expect(container.querySelector(".chart__center-label")?.textContent).toBe("per month");
  });

  it("renders no center without one", () => {
    const { container } = drawn();

    expect(container.querySelector(".chart__center")).toBeNull();
  });

  it("renders No data in the plot's place without nodes", () => {
    const { container } = drawn({ nodes: [] });

    expect(container.querySelector(".chart__empty")?.textContent).toBe("No data");
  });

  it("renders the stated message without nodes", () => {
    const { container } = drawn({ empty: "No spend this month.", nodes: [] });

    expect(container.querySelector(".chart__empty")?.textContent).toBe("No spend this month.");
  });

  it("renders the empty state when no node has a size", () => {
    const { container } = drawn({ nodes: [{ key: "credit", value: -30 }] });

    expect(container.querySelector(".chart__empty")).not.toBeNull();
  });

  it("renders no legend without nodes", () => {
    const { container } = drawn({ nodes: [] });

    expect(container.querySelector(".chart__legend")).toBeNull();
  });

  it("names the figure by its caption", () => {
    const { getByRole } = drawn({ caption: "Kubernetes costs the most." });

    expect(getByRole("figure", { name: "Kubernetes costs the most." })).toBeDefined();
  });

  it("renders no caption without one", () => {
    const { container } = drawn();

    expect(container.querySelector("figcaption")).toBeNull();
  });

  it("renders the children inside the chart", () => {
    const { container } = drawn({ children: <g className="probe" /> });

    expect(container.querySelector(".recharts-surface .probe")).not.toBeNull();
  });

  it("gives the plot the square ratio unless stated", () => {
    const { container } = drawn();

    expect(container.querySelector(".chart__plot--square")).not.toBeNull();
  });

  it("passes the ratio to the figure", () => {
    const { container } = drawn({ ratio: "video" });

    expect(container.querySelector(".chart__plot--video")).not.toBeNull();
  });

  it("renders every arc at once without animate", () => {
    vi.useFakeTimers();

    const { container } = drawn();

    vi.useRealTimers();

    expect(container.querySelectorAll(".recharts-sector")).toHaveLength(9);
  });

  it("starts every arc at no angle when animate is set", () => {
    vi.useFakeTimers();

    const { container } = drawn({ animate: true });

    vi.useRealTimers();

    expect(container.querySelectorAll(".recharts-sector")).toHaveLength(0);
  });
});
