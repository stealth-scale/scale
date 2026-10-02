import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { laidOut } from "#cartesian/cartesian.fixtures.ts";
import { type HierarchyNode } from "#hierarchy/hierarchy.ts";
import { TreemapChart, type TreemapChartProps } from "#treemap-chart/treemap-chart.tsx";

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
 * Renders a treemap of the nodes, with the props a case changes.
 */
function drawn(props: Partial<TreemapChartProps> = {}): ReturnType<typeof render> {
  laidOut();

  return render(<TreemapChart label="Cloud spend" locale="en-US" nodes={NODES} {...props} />);
}

/**
 * Returns every tile's group, depth first.
 */
function tilesOf(container: Element): Element[] {
  return [...container.querySelectorAll(".chart-tile")];
}

/**
 * Returns the tile at a place in the walk.
 */
function tileAt(container: Element, walk: number): Element | null {
  return container.querySelector(`.chart-tile[data-walk="${String(walk)}"]`);
}

/**
 * Returns a tile's box from its rectangle's path, which recharts writes with rounded corners.
 */
function boxOf(tile: Element | null): { height: number; width: number; x: number; y: number } {
  const numbers = [
    ...(tile?.querySelector(".recharts-rectangle")?.getAttribute("d") ?? "").matchAll(
      /-?\d+(?:\.\d+)?/gu,
    ),
  ].map((match) => Number(match[0]));
  const [x = 0] = numbers;
  const y = numbers[8] ?? 0;

  return { height: (numbers[26] ?? 0) - y, width: (numbers[16] ?? 0) - x, x, y };
}

/**
 * Returns the text of every word written on a tile, depth first.
 */
function wordsOf(container: Element): string[] {
  return [...container.querySelectorAll(".chart-tile text")].map((text) => text.textContent);
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

describe("TreemapChart", () => {
  it("returns no accessibility violation", async () => {
    laidOut();

    await expect(
      accessibilityViolations(() => (
        <TreemapChart caption="Kubernetes costs the most." label="Cloud spend" nodes={NODES} />
      )),
    ).resolves.toStrictEqual([]);
  });

  it("renders a tile per node", () => {
    const { container } = drawn();

    expect(tilesOf(container)).toHaveLength(8);
  });

  it("places the largest leaf of the largest node at the top left", () => {
    const { container } = drawn();

    expect(boxOf(tileAt(container, 1))).toMatchObject({ x: 0, y: 0 });
  });

  it("gives a leaf about twice the area of a leaf half its size", () => {
    const { container } = drawn();
    const postgres = boxOf(tileAt(container, 1));
    const redis = boxOf(tileAt(container, 3));

    expect((postgres.width * postgres.height) / (redis.width * redis.height)).toBeCloseTo(
      18_400 / 4100,
      0,
    );
  });

  it("parts neighbouring tiles by 2px", () => {
    const { container } = drawn();
    const boxes = tilesOf(container)
      .slice(1)
      .map((tile) => boxOf(tile));

    expect(
      boxes.some((first) =>
        boxes.some((second) => Math.round(second.x - (first.x + first.width)) === 2),
      ),
    ).toBe(true);
  });

  it("leaves a family's tile unpainted under its parts", () => {
    const { container } = drawn();

    expect(tileAt(container, 0)?.querySelector("path")?.getAttribute("fill")).toBe("transparent");
  });

  it("fills the largest family's parts from the first series color", () => {
    const { container } = drawn();

    expect(tileAt(container, 1)?.querySelector("path")?.getAttribute("fill")).toBe(
      "color-mix(in oklab, var(--colors-series-1) 100%, var(--colors-bg-panel))",
    );
  });

  it("fills a family's smallest part with 45% of its color", () => {
    const { container } = drawn();

    expect(tileAt(container, 3)?.querySelector("path")?.getAttribute("fill")).toBe(
      "color-mix(in oklab, var(--colors-series-1) 45%, var(--colors-bg-panel))",
    );
  });

  it("fills the next family from the next series color", () => {
    const { container } = drawn();

    expect(tileAt(container, 5)?.querySelector("path")?.getAttribute("fill")).toContain(
      "var(--colors-series-2)",
    );
  });

  it("fills a family from its stated palette", () => {
    const { container } = drawn({
      nodes: [{ color: "teal", key: "cdn", value: 10 }],
    });

    expect(tileAt(container, 0)?.querySelector("path")?.getAttribute("fill")).toContain(
      "var(--colors-teal-chart)",
    );
  });

  it("writes each part's name and its value and share", () => {
    const { container } = drawn();

    expect(wordsOf(container).slice(0, 2)).toStrictEqual(["Postgres", "18,400 · 28%"]);
  });

  it("writes the values with valueOptions", () => {
    const { container } = drawn({
      valueOptions: { currency: "EUR", maximumFractionDigits: 0, style: "currency" },
    });

    expect(wordsOf(container)[1]).toBe("€18,400 · 28%");
  });

  it("writes no value on the tiles when values is off", () => {
    const { container } = drawn({ values: false });

    expect(wordsOf(container).slice(0, 2)).toStrictEqual(["Postgres", "Kafka"]);
  });

  it("names the families in the legend with their totals largest first", () => {
    const { container } = drawn();

    expect(legendOf(container)).toStrictEqual(["Data 32,200", "Platform 29,400", "CDN 4,400"]);
  });

  it("names the families in the legend without totals when values is off", () => {
    const { container } = drawn({ values: false });

    expect(legendOf(container)).toStrictEqual(["Data", "Platform", "CDN"]);
  });

  it("names a family in the legend by its key without a label", () => {
    const { container } = drawn({ nodes: [{ key: "cdn", value: 10 }], values: false });

    expect(legendOf(container)).toStrictEqual(["cdn"]);
  });

  it("leaves a family the legend hides out of the layout", () => {
    const { container, getByRole } = drawn();

    fireEvent.click(getByRole("button", { name: "Data 32,200" }));

    expect(tilesOf(container)).toHaveLength(4);
  });

  it("writes each share of the families shown", () => {
    const { container } = drawn({ defaultHiddenKeys: ["data"] });

    expect(wordsOf(container).slice(0, 2)).toStrictEqual(["Kubernetes", "21,800 · 64%"]);
  });

  it("hides the families in hiddenKeys", () => {
    const { container } = drawn({ hiddenKeys: ["data", "platform"] });

    expect(tilesOf(container)).toHaveLength(1);
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
      tileAt(container, 1)?.getAttribute("opacity"),
      tileAt(container, 5)?.getAttribute("opacity"),
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

  it("writes a share to two significant digits", () => {
    const { container } = drawn({ defaultIndex: 4 });

    expect(rowsOf(container)[1]).toStrictEqual(["Of total", "45%"]);
  });

  it("writes a sliver's share to two significant digits", () => {
    const { container } = drawn({
      defaultIndex: 1,
      nodes: [
        { key: "sliver", value: 3 },
        { key: "rest", value: 997 },
      ],
    });

    expect(rowsOf(container)[1]).toStrictEqual(["Of total", "0.3%"]);
  });

  it("names the tooltip's rows with the stated words", () => {
    const { container } = drawn({ defaultIndex: 5, shareLabel: "Share", valueLabel: "Spend" });

    expect(rowsOf(container).map(([name]) => name)).toStrictEqual(["Spend", "Share"]);
  });

  it("heads the tooltip with the node's key without a label", () => {
    const { container } = drawn({ defaultIndex: 0, nodes: [{ key: "cdn", value: 10 }] });

    expect(headingOf(container)).toBe("cdn");
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

  it("walks the tiles depth first with the arrow keys", () => {
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

  it("walks to the last tile with End", () => {
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

  it("leaves a negative part out of the layout", () => {
    const { container } = drawn({
      nodes: [
        {
          children: [
            { key: "db", value: 300 },
            { key: "credit", label: "Credit", value: -100 },
          ],
          key: "data",
        },
      ],
    });

    expect(tilesOf(container)).toHaveLength(2);
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

  it("gives the plot the video ratio unless stated", () => {
    const { container } = drawn();

    expect(container.querySelector(".chart__plot--video")).not.toBeNull();
  });

  it("passes the ratio to the figure", () => {
    const { container } = drawn({ ratio: "square" });

    expect(container.querySelector(".chart__plot--square")).not.toBeNull();
  });
});
