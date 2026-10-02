import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { laidOut } from "#cartesian/cartesian.fixtures.ts";
import { type SankeyFlow, type SankeyNode } from "#sankey-chart/flows.ts";
import { SankeyChart, type SankeyChartProps } from "#sankey-chart/sankey-chart.tsx";

/**
 * Lists two channels, the visitors who signed up and the visitors who left.
 */
const NODES: readonly SankeyNode[] = [
  { key: "organic", label: "Organic search" },
  { key: "paid", label: "Paid search" },
  { key: "signup", label: "Signed up" },
  { key: "left", label: "Left" },
];

/**
 * Lists 110 organic and 50 paid visitors, 60 of whom signed up.
 */
const FLOWS: readonly SankeyFlow[] = [
  { from: "organic", to: "signup", value: 40 },
  { from: "organic", to: "left", value: 70 },
  { from: "paid", to: "signup", value: 20 },
  { from: "paid", to: "left", value: 30 },
];

/**
 * Renders a sankey of the visitors, with the props a case changes.
 */
function drawn(props: Partial<SankeyChartProps> = {}): ReturnType<typeof render> {
  laidOut();

  return render(
    <SankeyChart flows={FLOWS} label="Visitors" locale="en-US" nodes={NODES} {...props} />,
  );
}

/**
 * Returns the mark at a place in the walk.
 */
function markAt(container: Element, walk: number): Element | null {
  return container.querySelector(`[data-walk="${String(walk)}"]`);
}

/**
 * Returns the trace of every mark in the walk's order.
 */
function tracesOf(container: Element): Array<string | undefined> {
  return [...container.querySelectorAll<SVGElement>("[data-walk]")]
    .toSorted((first, second) => Number(first.dataset["walk"]) - Number(second.dataset["walk"]))
    .map((mark) => mark.dataset["trace"]);
}

/**
 * Returns every bar's box from its rectangle's path, which recharts writes with rounded corners.
 */
function barsOf(
  container: Element,
): Array<{ height: number; width: number; x: number; y: number }> {
  return [...container.querySelectorAll(".chart-node .recharts-rectangle")].map((bar) => {
    const numbers = [...(bar.getAttribute("d") ?? "").matchAll(/-?\d+(?:\.\d+)?/gu)].map((match) =>
      Number(match[0]),
    );
    const [x = 0] = numbers;
    const y = numbers[8] ?? 0;

    return { height: (numbers[26] ?? 0) - y, width: (numbers[16] ?? 0) - x, x, y };
  });
}

/**
 * Returns the text of every word written beside the nodes.
 */
function wordsOf(container: Element): string[] {
  return [...container.querySelectorAll(".chart-node text")].map((text) => text.textContent);
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

describe("SankeyChart", () => {
  it("returns no accessibility violation", async () => {
    laidOut();

    await expect(
      accessibilityViolations(() => (
        <SankeyChart caption="Most visitors left." flows={FLOWS} label="Visitors" nodes={NODES} />
      )),
    ).resolves.toStrictEqual([]);
  });

  it("renders a bar per node", () => {
    const { container } = drawn();

    expect(container.querySelectorAll(".chart-node .recharts-rectangle")).toHaveLength(4);
  });

  it("renders a band per flow", () => {
    const { container } = drawn();

    expect(container.querySelectorAll(".chart-flow")).toHaveLength(4);
  });

  it("renders each bar 10px wide", () => {
    const { container } = drawn();

    expect(barsOf(container).map((bar) => Math.round(bar.width))).toStrictEqual([10, 10, 10, 10]);
  });

  it("keeps 24px between two bars of a column", () => {
    const { container } = drawn();
    const [first, second] = barsOf(container)
      .filter((bar) => bar.x < 100)
      .toSorted((top, bottom) => top.y - bottom.y);

    expect((second?.y ?? 0) - ((first?.y ?? 0) + (first?.height ?? 0))).toBeCloseTo(24, 5);
  });

  it("leaves out a flow that closes a loop", () => {
    const { container } = drawn({ flows: [...FLOWS, { from: "signup", to: "paid", value: 5 }] });

    expect(container.querySelectorAll(".chart-flow")).toHaveLength(4);
  });

  it("paints the first node in the first series color", () => {
    const { container } = drawn();

    expect(markAt(container, 0)?.querySelector("path")?.getAttribute("fill")).toBe(
      "var(--colors-series-1)",
    );
  });

  it("paints a node in its stated palette", () => {
    const { container } = drawn({ nodes: [{ color: "teal", key: "organic" }, ...NODES.slice(1)] });

    expect(markAt(container, 0)?.querySelector("path")?.getAttribute("fill")).toBe(
      "var(--colors-teal-chart)",
    );
  });

  it("paints each band in its source's color", () => {
    const { container } = drawn();

    expect([1, 2, 4].map((walk) => markAt(container, walk)?.getAttribute("stroke"))).toStrictEqual([
      "var(--colors-series-1)",
      "var(--colors-series-1)",
      "var(--colors-series-2)",
    ]);
  });

  it("writes each node's name with its value under it", () => {
    const { container } = drawn();

    expect(wordsOf(container).slice(0, 2)).toStrictEqual(["Organic search", "110"]);
  });

  it("writes the values with valueOptions", () => {
    const { container } = drawn({
      valueOptions: { currency: "EUR", maximumFractionDigits: 0, style: "currency" },
    });

    expect(wordsOf(container)[1]).toBe("€110");
  });

  it("writes no value when values is off", () => {
    const { container } = drawn({ values: false });

    expect(wordsOf(container)).toStrictEqual([
      "Organic search",
      "Paid search",
      "Signed up",
      "Left",
    ]);
  });

  it("writes a sink's name before its bar", () => {
    const { container } = drawn();

    expect(markAt(container, 7)?.querySelector("text")?.getAttribute("text-anchor")).toBe("end");
  });

  it("heads the tooltip with a node's name", () => {
    const { container } = drawn({ defaultIndex: 0 });

    expect(headingOf(container)).toBe("Organic search");
  });

  it("writes a source's outflow in the tooltip", () => {
    const { container } = drawn({ defaultIndex: 0 });

    expect(rowsOf(container)).toStrictEqual([["Out", "110"]]);
  });

  it("heads the tooltip with a flow's two names", () => {
    const { container } = drawn({ defaultIndex: 1 });

    expect(headingOf(container)).toBe("Organic search → Signed up");
  });

  it("writes a flow's value and its share of its source in the tooltip", () => {
    const { container } = drawn({ defaultIndex: 1 });

    expect(rowsOf(container)).toStrictEqual([
      ["Value", "40"],
      ["Of source", "36%"],
    ]);
  });

  it("names the tooltip's rows with the stated words", () => {
    const { container } = drawn({ defaultIndex: 6, inflowLabel: "Entered", outflowLabel: "Sent" });

    expect(rowsOf(container)).toStrictEqual([["Entered", "60"]]);
  });

  it("names a flow's rows with the stated words", () => {
    const { container } = drawn({ defaultIndex: 4, shareLabel: "Share", valueLabel: "Visitors" });

    expect(rowsOf(container).map(([name]) => name)).toStrictEqual(["Visitors", "Share"]);
  });

  it("lifts the flow the tooltip is at and fades the other marks", () => {
    const { container } = drawn({ defaultIndex: 1 });

    expect(tracesOf(container)).toStrictEqual([
      "dimmed",
      "lit",
      "dimmed",
      "dimmed",
      "dimmed",
      "dimmed",
      "dimmed",
      "dimmed",
    ]);
  });

  it("lifts every flow a node sends while the tooltip is at it", () => {
    const { container } = drawn({ defaultIndex: 0 });

    expect(tracesOf(container)).toStrictEqual([
      undefined,
      "lit",
      "lit",
      "dimmed",
      "dimmed",
      "dimmed",
      "dimmed",
      "dimmed",
    ]);
  });

  it("lifts every flow of the node the tooltip is at", () => {
    const { container } = drawn({ defaultIndex: 6 });

    expect(tracesOf(container)).toStrictEqual([
      "dimmed",
      "lit",
      "dimmed",
      "dimmed",
      "lit",
      "dimmed",
      undefined,
      "dimmed",
    ]);
  });

  it("writes no trace while the tooltip is at no mark", () => {
    const { container } = drawn();

    expect(tracesOf(container).every((trace) => trace === undefined)).toBe(true);
  });

  it("opens the tooltip at the first node when the keyboard focuses the chart", () => {
    const { container, getByRole } = drawn();

    act(() => {
      getByRole("application", { name: "Visitors" }).focus();
    });

    expect(headingOf(container)).toBe("Organic search");
  });

  it("walks each node before the flows it sends with the arrow keys", () => {
    const { container, getByRole } = drawn();
    const surface = getByRole("application", { name: "Visitors" });

    act(() => {
      surface.focus();
    });
    fireEvent.keyDown(surface, { key: "ArrowRight" });
    const second = headingOf(container);
    fireEvent.keyDown(surface, { key: "ArrowRight" });
    const third = headingOf(container);
    fireEvent.keyDown(surface, { key: "ArrowRight" });

    expect([second, third, headingOf(container)]).toStrictEqual([
      "Organic search → Signed up",
      "Organic search → Left",
      "Paid search",
    ]);
  });

  it("walks to the last mark with End", () => {
    const { container, getByRole } = drawn();
    const surface = getByRole("application", { name: "Visitors" });

    act(() => {
      surface.focus();
    });
    fireEvent.keyDown(surface, { key: "End" });

    expect(headingOf(container)).toBe("Left");
  });

  it("makes the chart's svg its one tab stop", () => {
    const { container } = drawn();

    expect(
      [...container.querySelectorAll("[tabindex]:not([tabindex='-1'])")].map(
        (element) => element.tagName,
      ),
    ).toStrictEqual(["svg"]);
  });

  it("renders No data in the plot's place without flows", () => {
    const { container } = drawn({ flows: [] });

    expect(container.querySelector(".chart__empty")?.textContent).toBe("No data");
  });

  it("renders the stated message without flows", () => {
    const { container } = drawn({ empty: "No visitors this month.", flows: [] });

    expect(container.querySelector(".chart__empty")?.textContent).toBe("No visitors this month.");
  });

  it("renders the empty state when no flow can be rendered", () => {
    const { container } = drawn({ flows: [{ from: "organic", to: "organic", value: 3 }] });

    expect(container.querySelector(".chart__empty")).not.toBeNull();
  });

  it("names the figure by its caption", () => {
    const { getByRole } = drawn({ caption: "Most visitors left." });

    expect(getByRole("figure", { name: "Most visitors left." })).toBeDefined();
  });

  it("renders no caption without one", () => {
    const { container } = drawn();

    expect(container.querySelector("figcaption")).toBeNull();
  });

  it("renders the children inside the chart", () => {
    const { container } = drawn({ children: <g className="probe" /> });

    expect(container.querySelector(".recharts-surface .probe")).not.toBeNull();
  });

  it("gives the plot the video ratio unless stated", () => {
    const { container } = drawn();

    expect(container.querySelector(".chart__plot--video")).not.toBeNull();
  });

  it("passes the ratio to the figure", () => {
    const { container } = drawn({ ratio: "wide" });

    expect(container.querySelector(".chart__plot--wide")).not.toBeNull();
  });
});
