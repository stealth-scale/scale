import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PointLabel } from "#scatter-plot/point-label.tsx";
import { scored } from "#scatter-plot/scatter-plot.fixtures.tsx";

/**
 * Describes the words of one point in a spec: the words and the left edge of its 10px symbol.
 */
interface Written {
  readonly value: string;
  readonly x: number;
}

/**
 * Renders one point's words outside a chart, for a point 10px square at 100 across and 50 down.
 */
function alone(value?: unknown): Element {
  return render(
    <svg>
      <PointLabel height={10} order={0} value={value} width={10} x={100} y={50} />
    </svg>,
  ).container;
}

/**
 * Measures the `svg` 300 by 200, and every line of words at 7px a character on a 16px line from its
 * anchor, as a browser lays them out.
 */
function measured(): void {
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function box(
    this: Element,
  ) {
    if (this.localName === "svg") return new DOMRect(0, 0, 300, 200);

    const width = (this.textContent?.length ?? 0) * 7;
    const x = Number(this.getAttribute("x"));

    return new DOMRect(
      this.getAttribute("text-anchor") === "end" ? x - width : x,
      Number(this.getAttribute("y")) - 8,
      width,
      16,
    );
  });
}

/**
 * Renders the words of points on one line in one `svg`, in order, and returns whether each is
 * hidden.
 */
function hidden(points: readonly Written[]): boolean[] {
  measured();

  const { container } = render(
    <svg>
      {points.map((point, order) => (
        <PointLabel
          height={10}
          key={point.value}
          order={order}
          value={point.value}
          width={10}
          x={point.x}
          y={50}
        />
      ))}
    </svg>,
  );

  return [...container.querySelectorAll("text")].map((text) => text.dataset["overflow"] === "");
}

/**
 * Returns the text anchor of the words beside each vendor, in the order of the vendors.
 */
function anchorsOf(container: Element): Array<null | string> {
  return [...container.querySelectorAll("text.chart-point-label")].map((label) =>
    label.getAttribute("text-anchor"),
  );
}

describe("PointLabel", () => {
  it("writes the words 4px past the point's end edge", () => {
    const label = alone("Alder").querySelector("text");

    expect([label?.getAttribute("x"), label?.getAttribute("text-anchor")]).toStrictEqual([
      "114",
      "start",
    ]);
  });

  it("centres the words on the point's height", () => {
    expect(alone("Alder").querySelector("text")?.getAttribute("y")).toBe("55");
  });

  it("writes a number as its words", () => {
    expect(alone(42).querySelector("text")?.textContent).toBe("42");
  });

  it("writes nothing for a point without words", () => {
    expect(alone().querySelector("text")).toBeNull();
  });

  it("writes the words before a point past 72% of the plot's width", () => {
    expect(anchorsOf(scored())).toStrictEqual(["start", "start", "start", "end"]);
  });

  it("writes the words before a point at 76% of the plot's width", () => {
    const rowan = { execution: 0.5, name: "Rowan", vision: 0.76 };

    expect(anchorsOf(scored({ series: [{ key: "vendors", points: [rowan] }] }))).toStrictEqual([
      "end",
    ]);
  });

  it("ends the words before the centre of a point past 72% of the plot's width", () => {
    const container = scored();
    const symbol = container.querySelectorAll(".recharts-symbols")[3];
    const centre = Number(
      /translate\(([\d.]+)/u.exec(symbol?.getAttribute("transform") ?? "")?.[1],
    );
    const label = container.querySelectorAll("text.chart-point-label")[3];

    expect(Number(label?.getAttribute("x"))).toBeLessThan(centre);
  });

  it("shows the words of two points apart", () => {
    expect(
      hidden([
        { value: "Alder", x: 20 },
        { value: "Birch", x: 120 },
      ]),
    ).toStrictEqual([false, false]);
  });

  it("hides the words that meet the words of an earlier point", () => {
    expect(
      hidden([
        { value: "Alder", x: 20 },
        { value: "Birch", x: 60 },
      ]),
    ).toStrictEqual([false, true]);
  });

  it("hides the words that leave the plot's side", () => {
    expect(hidden([{ value: "Hawthorn", x: 250 }])).toStrictEqual([true]);
  });

  it("gives the words of a point its place among the chart's points", () => {
    const { container } = render(
      <svg>
        <PointLabel height={10} order={6} value="Alder" width={10} x={100} y={50} />
      </svg>,
    );

    expect(container.querySelector<SVGGElement>("g.chart-node")?.dataset["walk"]).toBe("6");
  });
});
