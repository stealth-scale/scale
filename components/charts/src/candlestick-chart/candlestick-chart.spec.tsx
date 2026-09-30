import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import {
  CandlestickChart,
  type CandlestickChartProps,
} from "#candlestick-chart/candlestick-chart.tsx";
import { laidOut } from "#cartesian/cartesian.fixtures.ts";

/**
 * Describes one trading day of the fixture.
 */
interface Day {
  readonly close: number;
  readonly day: string;
  readonly high: number;
  readonly low: number;
  readonly open: number;
}

/**
 * Lists three trading days: a rise, a fall and a flat day.
 */
const DAYS: readonly Day[] = [
  { close: 103, day: "2026-09-01", high: 104, low: 98, open: 100 },
  { close: 100, day: "2026-09-02", high: 105, low: 99, open: 103 },
  { close: 100, day: "2026-09-03", high: 102, low: 97, open: 100 },
];

/**
 * Renders the days with the props a case changes, and returns the container.
 */
function drawn(props: Partial<CandlestickChartProps<Day>> = {}): Element {
  laidOut();

  return render(
    <CandlestickChart
      categoryKey="day"
      data={DAYS}
      label="Daily prices"
      locale="en-US"
      {...props}
    />,
  ).container;
}

/**
 * Returns the text of every element a selector matches inside a container, in document order.
 */
function textsOf(container: Element, selector: string): string[] {
  return [...container.querySelectorAll(selector)].map((element) => element.textContent);
}

/**
 * Returns the body of every candle inside the chart's surface, the active one last.
 */
function bodiesOf(container: Element): Element[] {
  return [...container.querySelectorAll(".recharts-surface g > rect[stroke-width]")];
}

/**
 * Returns the length in pixels of every resting candle's wick.
 */
function wicksOf(container: Element): number[] {
  return [...container.querySelectorAll(".recharts-bar-rectangle line")].map(
    (wick) => Number(wick.getAttribute("y2")) - Number(wick.getAttribute("y1")),
  );
}

/**
 * Returns the category axis' labels, each with the words recharts writes in separate `tspan`s.
 */
function categoriesOf(container: Element): string[] {
  return [...container.querySelectorAll(".recharts-xAxis-tick-labels text")].map((text) =>
    [...text.querySelectorAll("tspan")].map((word) => word.textContent).join(" "),
  );
}

describe("CandlestickChart", () => {
  it("returns no accessibility violation", async () => {
    laidOut();

    await expect(
      accessibilityViolations(() => (
        <CandlestickChart
          caption="The price ended where it started the week."
          categoryKey="day"
          data={DAYS}
          label="Daily prices"
        />
      )),
    ).resolves.toStrictEqual([]);
  });

  it("renders a candle per day with four prices", () => {
    expect(bodiesOf(drawn())).toHaveLength(3);
  });

  it("leaves out a day without a finite price", () => {
    expect(
      bodiesOf(drawn({ data: [...DAYS, { ...DAYS[0], close: Number.NaN, day: "x" } as Day] })),
    ).toHaveLength(3);
  });

  it("colors each candle by its direction", () => {
    expect(bodiesOf(drawn()).map((body) => body.getAttribute("fill"))).toStrictEqual([
      "var(--colors-success-chart)",
      "var(--colors-error-chart)",
      "var(--colors-neutral-chart)",
    ]);
  });

  it("edges the active candle 2px wide", () => {
    expect(
      bodiesOf(drawn({ defaultIndex: 0 })).map((body) => body.getAttribute("stroke-width")),
    ).toStrictEqual(["0", "0", "2"]);
  });

  it("renders each candle at most 28px wide", () => {
    expect(bodiesOf(drawn()).map((body) => body.getAttribute("width"))).toStrictEqual([
      "28",
      "28",
      "28",
    ]);
  });

  it("writes the category ticks with labelOptions", () => {
    expect(
      categoriesOf(drawn({ labelOptions: { day: "numeric", month: "short", timeZone: "UTC" } })).at(
        -1,
      ),
    ).toBe("Sep 3");
  });

  it("heads the tooltip with the day in labelOptions", () => {
    const container = drawn({
      defaultIndex: 1,
      labelOptions: { day: "numeric", month: "short", timeZone: "UTC" },
    });

    expect(textsOf(container, ".chart__heading")).toStrictEqual(["Sep 2"]);
  });

  it("heads the tooltip with the category as it is without labelOptions", () => {
    expect(textsOf(drawn({ defaultIndex: 1 }), ".chart__heading")).toStrictEqual(["2026-09-02"]);
  });

  it("names the tooltip's rows in English unless stated", () => {
    expect(textsOf(drawn({ defaultIndex: 0 }), ".chart__name")).toStrictEqual([
      "Open",
      "High",
      "Low",
      "Close",
      "Change",
    ]);
  });

  it("names the tooltip's rows by the label props", () => {
    const container = drawn({
      changeLabel: "Verandering",
      closeLabel: "Slot",
      defaultIndex: 0,
      highLabel: "Hoog",
      lowLabel: "Laag",
      openLabel: "Open",
    });

    expect(textsOf(container, ".chart__name")).toStrictEqual([
      "Open",
      "Hoog",
      "Laag",
      "Slot",
      "Verandering",
    ]);
  });

  it("writes the prices and the signed change with its percentage", () => {
    expect(textsOf(drawn({ defaultIndex: 1 }), ".chart__value")).toStrictEqual([
      "103",
      "105",
      "99",
      "100",
      "-3 (-2.91%)",
    ]);
  });

  it("writes the prices with valueOptions", () => {
    const container = drawn({
      defaultIndex: 0,
      valueOptions: { currency: "USD", style: "currency" },
    });

    expect(textsOf(container, ".chart__value")).toStrictEqual([
      "$100.00",
      "$104.00",
      "$98.00",
      "$103.00",
      "+$3.00 (+3.00%)",
    ]);
  });

  it("steps the value ticks by 1 2 or 5 times a power of ten", () => {
    expect(textsOf(drawn(), ".recharts-yAxis-tick-labels text")).toStrictEqual([
      "95",
      "97.5",
      "100",
      "102.5",
      "105",
    ]);
  });

  it("sets the value axis' domain by valueDomain", () => {
    expect(
      textsOf(drawn({ valueDomain: [0, 200] }), ".recharts-yAxis-tick-labels text").at(-1),
    ).toBe("200");
  });

  it("renders the key naming the colors and the parts below the plot", () => {
    expect(textsOf(drawn({ data: DAYS.slice(0, 2) }), ".chart__key li")).toStrictEqual([
      "Up",
      "Down",
      "Open to close",
      "Low to high",
    ]);
  });

  it("names the flat color in the key while a day closed at its open", () => {
    expect(textsOf(drawn(), ".chart__key li")).toContain("Flat");
  });

  it("names the key's entries by the label props", () => {
    const container = drawn({
      bodyLabel: "Opening tot slot",
      downLabel: "Omlaag",
      flatLabel: "Gelijk",
      upLabel: "Omhoog",
      wickLabel: "Laag tot hoog",
    });

    expect(textsOf(container, ".chart__key li")).toStrictEqual([
      "Omhoog",
      "Omlaag",
      "Gelijk",
      "Opening tot slot",
      "Laag tot hoog",
    ]);
  });

  it("renders no key when legend is false", () => {
    expect(drawn({ legend: false }).querySelector(".chart__key")).toBeNull();
  });

  it("renders no key without a day to render", () => {
    expect(drawn({ data: [] }).querySelector(".chart__key")).toBeNull();
  });

  it("renders No data in the plot's place without a day to render", () => {
    expect(textsOf(drawn({ data: [] }), ".chart__empty")).toStrictEqual(["No data"]);
  });

  it("renders the empty message it states", () => {
    expect(textsOf(drawn({ data: [], empty: "Market closed" }), ".chart__empty")).toStrictEqual([
      "Market closed",
    ]);
  });

  it("renders no grid when grid is off", () => {
    expect(drawn({ grid: false }).querySelector(".recharts-cartesian-grid")).toBeNull();
  });

  it("names the keyboard layer by the label", () => {
    expect(drawn().querySelector(".recharts-surface title")?.textContent).toBe("Daily prices");
  });

  it("names the figure by its caption", () => {
    expect(textsOf(drawn({ caption: "The price ended flat." }), "figcaption")).toStrictEqual([
      "The price ended flat.",
    ]);
  });

  it("renders recharts children inside the chart", () => {
    expect(drawn({ children: <g className="probe" /> }).querySelector(".probe")).not.toBeNull();
  });

  it("passes none of its own props to the figure", () => {
    const figure = drawn({
      animate: false,
      labelOptions: { day: "numeric" },
      upLabel: "Up",
      valueOptions: { style: "decimal" },
    }).querySelector("figure");

    expect(figure?.getAttributeNames().toSorted()).toStrictEqual(["class", "data-recipe"]);
  });

  it("renders every candle at its full height without animate", () => {
    vi.useFakeTimers();

    const wicks = wicksOf(drawn());

    vi.useRealTimers();

    expect(Math.min(...wicks)).toBeGreaterThan(1);
  });

  it("starts every candle flat when animate is set", () => {
    vi.useFakeTimers();

    const wicks = wicksOf(drawn({ animate: true }));

    vi.useRealTimers();

    expect(wicks).toStrictEqual([0, 0, 0]);
  });
});
