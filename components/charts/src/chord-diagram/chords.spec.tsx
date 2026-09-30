import { fireEvent, render } from "@testing-library/react";
import { PieChart } from "recharts";
import { describe, expect, it } from "vitest";

import { charted } from "#chart/chart.fixtures.tsx";
import { Chords, type ChordsProps } from "#chord-diagram/chords.tsx";
import { marksOf } from "#chord-diagram/marks.ts";
import { ribbonPath, ringOf } from "#chord-diagram/paths.ts";

/**
 * Lists a pair a sends more of, and a pair c sends more of: ribbons ab and ac, then arcs a, b, c.
 */
const MARKS = marksOf(
  [{ key: "a" }, { key: "b" }, { key: "c" }],
  [
    { from: "a", to: "b", value: 60 },
    { from: "b", to: "a", value: 20 },
    { from: "c", to: "a", value: 30 },
  ],
);

function chords(props: Partial<ChordsProps> = {}): HTMLElement {
  return render(
    charted({
      children: (
        <PieChart height={320} width={320}>
          <Chords
            colorOf={(key) => `var(--${key})`}
            initial={undefined}
            marks={MARKS}
            words={{ inflow: "In", outflow: "Out" }}
            write={(value) => `#${String(value)}`}
            {...props}
          />
        </PieChart>
      ),
    }),
  ).container;
}

function ribbonsOf(container: HTMLElement): SVGPathElement[] {
  return [...container.querySelectorAll<SVGPathElement>("path.chart-flow")];
}

function arcsOf(container: HTMLElement): SVGGElement[] {
  return [...container.querySelectorAll<SVGGElement>("g.chart-node")];
}

function headingOf(container: HTMLElement): string | undefined {
  return container.querySelector(".chart__heading")?.textContent ?? undefined;
}

describe("Chords", () => {
  it("renders nothing outside a recharts chart", () => {
    const { container } = render(
      <svg>
        <Chords
          colorOf={String}
          initial={undefined}
          marks={MARKS}
          words={{ inflow: "In", outflow: "Out" }}
          write={String}
        />
      </svg>,
    );

    expect(container.querySelector("svg")?.childElementCount).toBe(0);
  });

  it("renders a ribbon per pair of nodes with a flow", () => {
    expect(ribbonsOf(chords())).toHaveLength(2);
  });

  it("renders an arc per node", () => {
    expect(arcsOf(chords())).toHaveLength(3);
  });

  it("paints each ribbon in the color of the node that sends more", () => {
    expect(ribbonsOf(chords()).map((ribbon) => ribbon.getAttribute("fill"))).toStrictEqual([
      "var(--a)",
      "var(--c)",
    ]);
  });

  it("paints each arc in its node's color", () => {
    expect(
      arcsOf(chords()).map((arc) => arc.querySelector(".recharts-sector")?.getAttribute("fill")),
    ).toStrictEqual(["var(--a)", "var(--b)", "var(--c)"]);
  });

  it("marks each ribbon's place in the walk", () => {
    expect(ribbonsOf(chords()).map((ribbon) => ribbon.dataset["walk"])).toStrictEqual(["1", "2"]);
  });

  it("takes the flow class on every ribbon", () => {
    expect(ribbonsOf(chords())[0]?.getAttribute("class")).toBe("chart-flow");
  });

  it("ends the ribbons 2px inside the ring of the plot's box", () => {
    const ring = ringOf({ height: 310, width: 310, x: 5, y: 5 });
    const first = MARKS.find((mark) => mark.kind === "ribbon");

    expect(ribbonsOf(chords())[0]?.getAttribute("d")).toBe(
      first?.kind === "ribbon" ? ribbonPath(first.ribbon, ring.centre, ring.ends) : "",
    );
  });

  it("renders the ribbons before the arcs so the arcs cover them", () => {
    const container = chords();
    const [last] = ribbonsOf(container).toReversed();

    expect(
      Boolean(
        (last?.compareDocumentPosition(arcsOf(container)[0] ?? document.body) ?? 0) &
        Node.DOCUMENT_POSITION_FOLLOWING,
      ),
    ).toBe(true);
  });

  it("opens the readout at the initial place", () => {
    expect(headingOf(chords({ initial: 1 }))).toBe("a ⇄ b");
  });

  it("opens no readout without an initial place", () => {
    expect(chords().querySelector(".chart__tooltip")?.childElementCount).toBe(0);
  });

  it("moves the readout to a ribbon the pointer enters", () => {
    const container = chords();

    fireEvent.mouseEnter(ribbonsOf(container)[1] ?? document.body);

    expect(headingOf(container)).toBe("a ⇄ c");
  });

  it("moves the readout to an arc the pointer enters", () => {
    const container = chords();

    fireEvent.mouseEnter(arcsOf(container)[2] ?? document.body);

    expect(headingOf(container)).toBe("c");
  });

  it("clears the readout when the pointer leaves the mark it is at", () => {
    const container = chords({ initial: 1 });

    fireEvent.mouseLeave(ribbonsOf(container)[0] ?? document.body);

    expect(container.querySelector(".chart__tooltip")?.childElementCount).toBe(0);
  });

  it("keeps the readout when the pointer leaves another mark", () => {
    const container = chords({ initial: 1 });

    fireEvent.mouseLeave(arcsOf(container)[2] ?? document.body);

    expect(headingOf(container)).toBe("a ⇄ b");
  });

  it("lights the ribbons of the arc the readout is at and dims the rest", () => {
    const container = chords();

    fireEvent.mouseEnter(arcsOf(container)[1] ?? document.body);

    expect(ribbonsOf(container).map((ribbon) => ribbon.dataset["trace"])).toStrictEqual([
      "lit",
      "dimmed",
    ]);
  });

  it("dims the other arcs while the readout is at an arc", () => {
    const container = chords();

    fireEvent.mouseEnter(arcsOf(container)[1] ?? document.body);

    expect(arcsOf(container).map((arc) => arc.dataset["trace"])).toStrictEqual([
      "dimmed",
      undefined,
      "dimmed",
    ]);
  });
});
