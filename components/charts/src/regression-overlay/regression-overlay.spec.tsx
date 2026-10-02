import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { laidOut } from "#cartesian/cartesian.fixtures.ts";
import {
  RegressionOverlay,
  type RegressionOverlayProps,
} from "#regression-overlay/regression-overlay.tsx";
import { ScatterPlot } from "#scatter-plot/scatter-plot.tsx";

/**
 * Describes one product: its price in euros and the units it sells a week.
 */
interface Product {
  readonly price: number | undefined;
  readonly units: number;
}

/**
 * Lists three products whose units fall by 10 a week for each euro on the price, and one without
 * a price.
 */
const PRODUCTS: Product[] = [
  { price: 20, units: 300 },
  { price: 10, units: 400 },
  { price: undefined, units: 350 },
  { price: 30, units: 200 },
];

/**
 * Lists two products of a rival inside the same ranges.
 */
const RIVALS: Product[] = [
  { price: 15, units: 320 },
  { price: 25, units: 260 },
];

/**
 * Renders the products and the rivals with a trend line through the products, the line's props
 * changed by a case, and returns the container.
 */
function drawn(
  overlay: Partial<RegressionOverlayProps<Product>> = {},
  hidden: string[] = [],
): HTMLElement {
  laidOut();

  return render(
    <ScatterPlot
      defaultHiddenKeys={hidden}
      label="Weekly units by price"
      series={[
        { key: "products", label: "Products", points: PRODUCTS },
        { key: "rivals", label: "Rivals", points: RIVALS },
      ]}
      xKey="price"
      xLabel="Price"
      yKey="units"
      yLabel="Units a week"
    >
      <RegressionOverlay data={PRODUCTS} xKey="price" yKey="units" {...overlay} />
    </ScatterPlot>,
  ).container;
}

/**
 * Returns the trend line inside a container.
 */
function lineOf(container: Element): Element | null {
  return container.querySelector(".recharts-reference-line-line");
}

/**
 * Returns the centre of every point of the first series inside a container, in data order.
 */
function centresOf(container: Element): number[][] {
  const scatter = container.querySelector(".recharts-scatter");

  return [...(scatter?.querySelectorAll(".recharts-symbols") ?? [])].map((symbol) => {
    const moved = /translate\((?<x>[^,]+), (?<y>[^)]+)\)/u.exec(
      symbol.getAttribute("transform") ?? "",
    );

    return [Number(moved?.groups?.["x"]), Number(moved?.groups?.["y"])];
  });
}

describe("RegressionOverlay", () => {
  it("runs the line from the leftmost point to the rightmost on the fitted line", () => {
    const container = drawn();
    const line = lineOf(container);
    const [, leftmost = [], rightmost = []] = centresOf(container);

    expect(["x1", "y1", "x2", "y2"].map((name) => Number(line?.getAttribute(name)))).toStrictEqual([
      ...leftmost,
      ...rightmost,
    ]);
  });

  it("dashes the line in the neutral palette's chart color without series", () => {
    const line = lineOf(drawn());

    expect(
      ["stroke", "stroke-dasharray", "stroke-width"].map((name) => line?.getAttribute(name)),
    ).toStrictEqual(["var(--colors-neutral-chart)", "6 4", "2"]);
  });

  it("colors the line in its series' color", () => {
    expect(lineOf(drawn({ series: "products" }))?.getAttribute("stroke")).toBe(
      "var(--colors-series-1)",
    );
  });

  it("clips the line to the plot", () => {
    expect(lineOf(drawn())?.getAttribute("clip-path")).toMatch(/^url\(#/u);
  });

  it("renders nothing where no line fits", () => {
    expect(lineOf(drawn({ data: [{ price: 10, units: 400 }] }))).toBeNull();
  });

  it("hides the line while the legend hides its series", () => {
    expect(lineOf(drawn({ series: "products" }, ["products"]))).toBeNull();
  });

  it("ignores the legend without series", () => {
    expect(lineOf(drawn({}, ["products"]))).not.toBeNull();
  });

  it("fades the line while the legend points at another series", () => {
    const container = drawn({ series: "products" });

    fireEvent.pointerEnter(within(container).getByRole("button", { name: "Rivals" }));

    expect(lineOf(container)?.getAttribute("opacity")).toBe("var(--chart-faded)");
  });

  it("wraps the line in a layer of the trend class", () => {
    expect(lineOf(drawn())?.closest(".chart-trend")).not.toBeNull();
  });
});
