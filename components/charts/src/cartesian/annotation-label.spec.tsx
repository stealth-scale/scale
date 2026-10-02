import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AnnotationLabel, type AnnotationLabelProps } from "#cartesian/annotation-label.tsx";

/**
 * Renders an annotation's words for a box 40px wide at 100 across and 20 down, and returns the
 * text element.
 */
function written(props: Partial<AnnotationLabelProps> = {}): null | SVGTextElement {
  return render(
    <svg>
      <AnnotationLabel
        order={0}
        point={false}
        value="Deploy 4.12"
        width={40}
        x={100}
        y={20}
        {...props}
      />
    </svg>,
  ).container.querySelector("text");
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
      this.getAttribute("text-anchor") === "middle" ? x - width / 2 : x,
      Number(this.getAttribute("y")) - 8,
      width,
      16,
    );
  });
}

describe("AnnotationLabel", () => {
  it("writes a mark's words 4px inside the top of its box", () => {
    const text = written();

    expect([text?.getAttribute("x"), text?.getAttribute("y")]).toStrictEqual(["104", "24"]);
  });

  it("hangs a mark's words from the top of its box", () => {
    const text = written();

    expect([
      text?.getAttribute("text-anchor"),
      text?.querySelector("tspan")?.getAttribute("dy"),
    ]).toStrictEqual(["start", "0.71em"]);
  });

  it("centres a point's words 4px above its ring", () => {
    const text = written({ point: true });

    expect([
      text?.getAttribute("x"),
      text?.getAttribute("y"),
      text?.getAttribute("text-anchor"),
    ]).toStrictEqual(["120", "16", "middle"]);
  });

  it("writes the words in the annotation label class", () => {
    expect(written()?.getAttribute("class")).toContain("chart-annotation-label");
  });

  it("gives the words its place in the chart's list", () => {
    expect(written({ order: 3 })?.closest<SVGGElement>("g.chart-node")?.dataset["walk"]).toBe("3");
  });

  it("hides words that meet the words of an earlier annotation", () => {
    measured();

    const { container } = render(
      <svg>
        <AnnotationLabel order={0} point={false} value="Deploy" width={0} x={100} y={20} />
        <AnnotationLabel order={1} point={false} value="Freeze" width={0} x={120} y={20} />
      </svg>,
    );

    expect(
      [...container.querySelectorAll("text")].map((text) => text.dataset["overflow"]),
    ).toStrictEqual([undefined, ""]);
  });

  it("hides words that come to meet earlier words when they change", () => {
    measured();

    const deploy = (
      <AnnotationLabel order={0} point={false} value="Deploy" width={0} x={100} y={20} />
    );
    const { container, rerender } = render(
      <svg>
        {deploy}
        <AnnotationLabel order={1} point value="Spike" width={0} x={200} y={20} />
      </svg>,
    );

    rerender(
      <svg>
        {deploy}
        <AnnotationLabel order={1} point value="A much longer spike" width={0} x={200} y={20} />
      </svg>,
    );

    expect(container.querySelectorAll("text")[1]?.dataset["overflow"]).toBe("");
  });
});
