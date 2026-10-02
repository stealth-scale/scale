import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { laidOut } from "#cartesian/cartesian.fixtures.ts";
import { ChordDiagram, type ChordDiagramProps } from "#chord-diagram/chord-diagram.tsx";
import { type SankeyFlow, type SankeyNode } from "#sankey-chart/flows.ts";

const NODES: readonly SankeyNode[] = [
  { key: "api", label: "api" },
  { key: "auth", label: "auth" },
  { key: "billing", label: "billing" },
];

/**
 * Lists calls between three services: api and auth both ways, api and billing both ways, and auth
 * to billing one way.
 */
const CALLS: readonly SankeyFlow[] = [
  { from: "api", to: "auth", value: 2600 },
  { from: "auth", to: "api", value: 1900 },
  { from: "api", to: "billing", value: 1400 },
  { from: "billing", to: "api", value: 700 },
  { from: "auth", to: "billing", value: 500 },
];

function drawn(props: Partial<ChordDiagramProps> = {}): ReturnType<typeof render> {
  laidOut();

  return render(
    <ChordDiagram flows={CALLS} label="Calls" locale="en-US" nodes={NODES} {...props} />,
  );
}

function tracesOf(container: Element): Array<string | undefined> {
  return [...container.querySelectorAll<SVGElement>("[data-walk]")]
    .toSorted((first, second) => Number(first.dataset["walk"]) - Number(second.dataset["walk"]))
    .map((mark) => mark.dataset["trace"]);
}

function headingOf(container: Element): string | undefined {
  return container.querySelector(".chart__tooltip .chart__heading")?.textContent;
}

function rowsOf(container: Element): string[][] {
  return [...container.querySelectorAll(".chart__tooltip .chart__row")].map((row) => [
    row.querySelector(".chart__name")?.textContent ?? "",
    row.querySelector(".chart__value")?.textContent ?? "",
  ]);
}

function fillsOf(container: Element, selector: string): Array<null | string> {
  return [...container.querySelectorAll(selector)].map((mark) => mark.getAttribute("fill"));
}

describe("ChordDiagram", () => {
  it("returns no accessibility violation", async () => {
    laidOut();

    await expect(
      accessibilityViolations(() => (
        <ChordDiagram caption="api calls the most." flows={CALLS} label="Calls" nodes={NODES} />
      )),
    ).resolves.toStrictEqual([]);
  });

  it("renders an arc per node", () => {
    const { container } = drawn();

    expect(container.querySelectorAll(".chart-node .recharts-sector")).toHaveLength(3);
  });

  it("renders a ribbon per pair of nodes with a flow", () => {
    const { container } = drawn();

    expect(container.querySelectorAll(".chart-flow")).toHaveLength(3);
  });

  it("renders a ribbon for a node's flow to itself", () => {
    const { container } = drawn({ flows: [...CALLS, { from: "auth", to: "auth", value: 300 }] });

    expect(container.querySelectorAll(".chart-flow")).toHaveLength(4);
  });

  it("paints each arc in its place's series color", () => {
    const { container } = drawn();

    expect(fillsOf(container, ".chart-node .recharts-sector")).toStrictEqual([
      "var(--colors-series-1)",
      "var(--colors-series-2)",
      "var(--colors-series-3)",
    ]);
  });

  it("paints an arc in its node's stated palette", () => {
    const { container } = drawn({ nodes: [{ color: "teal", key: "api" }, ...NODES.slice(1)] });

    expect(fillsOf(container, ".chart-node .recharts-sector")[0]).toBe("var(--colors-teal-chart)");
  });

  it("paints each ribbon in the color of the node that sends more", () => {
    const { container } = drawn();

    expect(fillsOf(container, ".chart-flow")).toStrictEqual([
      "var(--colors-series-1)",
      "var(--colors-series-1)",
      "var(--colors-series-2)",
    ]);
  });

  it("writes each node's name beside its arc", () => {
    const { container } = drawn();

    expect(
      [...container.querySelectorAll(".chart-node text")].map((text) => text.textContent),
    ).toStrictEqual(["api", "auth", "billing"]);
  });

  it("heads the readout with an arc's node", () => {
    const { container } = drawn({ defaultIndex: 0 });

    expect(headingOf(container)).toBe("api");
  });

  it("writes what an arc's node sends and receives in the readout", () => {
    const { container } = drawn({ defaultIndex: 0 });

    expect(rowsOf(container)).toStrictEqual([
      ["Out", "4,000"],
      ["In", "2,600"],
    ]);
  });

  it("heads the readout with a ribbon's two nodes", () => {
    const { container } = drawn({ defaultIndex: 1 });

    expect(headingOf(container)).toBe("api ⇄ auth");
  });

  it("writes both directions of a ribbon in the readout", () => {
    const { container } = drawn({ defaultIndex: 1 });

    expect(rowsOf(container)).toStrictEqual([
      ["api → auth", "2,600"],
      ["auth → api", "1,900"],
    ]);
  });

  it("names the readout's rows with the stated words", () => {
    const { container } = drawn({ defaultIndex: 0, inflowLabel: "Received", outflowLabel: "Sent" });

    expect(rowsOf(container).map(([name]) => name)).toStrictEqual(["Sent", "Received"]);
  });

  it("writes the amounts with valueOptions", () => {
    const { container } = drawn({
      defaultIndex: 0,
      valueOptions: { maximumFractionDigits: 1, notation: "compact" },
    });

    expect(rowsOf(container)[0]).toStrictEqual(["Out", "4K"]);
  });

  it("writes the amounts in the stated locale", () => {
    const { container } = drawn({ defaultIndex: 0, locale: "de-DE" });

    expect(rowsOf(container)[0]).toStrictEqual(["Out", "4.000"]);
  });

  it("lifts the ribbons of the arc the readout is at and fades the other marks", () => {
    const { container } = drawn({ defaultIndex: 0 });

    expect(tracesOf(container)).toStrictEqual([
      undefined,
      "lit",
      "lit",
      "dimmed",
      "dimmed",
      "dimmed",
    ]);
  });

  it("lifts the ribbon the readout is at and fades the other marks", () => {
    const { container } = drawn({ defaultIndex: 4 });

    expect(tracesOf(container)).toStrictEqual([
      "dimmed",
      "dimmed",
      "dimmed",
      "dimmed",
      "lit",
      "dimmed",
    ]);
  });

  it("writes no trace while the readout is at no mark", () => {
    const { container } = drawn();

    expect(tracesOf(container).every((trace) => trace === undefined)).toBe(true);
  });

  it("opens the readout at the first arc when the keyboard focuses the chart", () => {
    const { container, getByRole } = drawn();

    act(() => {
      getByRole("application", { name: "Calls" }).focus();
    });

    expect(headingOf(container)).toBe("api");
  });

  it("walks each arc before the ribbons that start on it with the arrow keys", () => {
    const { container, getByRole } = drawn();
    const surface = getByRole("application", { name: "Calls" });

    act(() => {
      surface.focus();
    });
    fireEvent.keyDown(surface, { key: "ArrowRight" });
    const second = headingOf(container);
    fireEvent.keyDown(surface, { key: "ArrowRight" });
    const third = headingOf(container);
    fireEvent.keyDown(surface, { key: "ArrowRight" });

    expect([second, third, headingOf(container)]).toStrictEqual([
      "api ⇄ auth",
      "api ⇄ billing",
      "auth",
    ]);
  });

  it("walks to the last mark with End", () => {
    const { container, getByRole } = drawn();
    const surface = getByRole("application", { name: "Calls" });

    act(() => {
      surface.focus();
    });
    fireEvent.keyDown(surface, { key: "End" });

    expect(headingOf(container)).toBe("billing");
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
    const { container } = drawn({ empty: "No calls this hour.", flows: [] });

    expect(container.querySelector(".chart__empty")?.textContent).toBe("No calls this hour.");
  });

  it("renders the empty state when no flow counts", () => {
    const { container } = drawn({ flows: [{ from: "api", to: "auth", value: 0 }] });

    expect(container.querySelector(".chart__empty")).not.toBeNull();
  });

  it("names the figure by its caption", () => {
    const { getByRole } = drawn({ caption: "api calls the most." });

    expect(getByRole("figure", { name: "api calls the most." })).toBeDefined();
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
});
