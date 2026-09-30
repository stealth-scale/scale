import { type ReactElement, useRef } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useCleared } from "#chart/cleared.ts";

interface Line {
  readonly anchor?: "end" | "start";
  readonly size?: number;
  readonly text: string;
  readonly x: number;
  readonly y?: number;
}

function Words({
  lines,
  walk,
}: {
  readonly lines: readonly Line[];
  readonly walk: number;
}): null | ReactElement {
  const group = useRef<SVGGElement>(null);

  useCleared(group, JSON.stringify(lines));

  if (lines.length === 0) return null;

  return (
    <g className="chart-node" data-walk={walk} ref={group}>
      {lines.map((line) => (
        <text
          key={line.text}
          style={line.size === undefined ? undefined : { fontSize: line.size }}
          textAnchor={line.anchor ?? "start"}
          x={line.x}
          y={line.y ?? 40}
        >
          {line.text}
        </text>
      ))}
    </g>
  );
}

/**
 * Measures the `svg` 300 by 200, and every line of words at 7px a character on a 16px line around
 * its anchor, as a browser lays them out.
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

function plotted(nodes: ReadonlyArray<readonly Line[]>): ReactElement {
  return (
    <svg>
      {nodes.map((lines, walk) => (
        <Words key={lines.map((line) => line.text).join()} lines={lines} walk={walk} />
      ))}
    </svg>
  );
}

/**
 * Renders a node per list of lines in one `svg`, each at its place in the walk, and returns
 * whether each node's lines are marked as not fitting.
 */
function cleared(nodes: ReadonlyArray<readonly Line[]>): boolean[] {
  measured();

  const { container } = render(plotted(nodes));

  return [...container.querySelectorAll("g")].map((group) =>
    [...group.querySelectorAll("text")].every((text) => text.dataset["overflow"] !== undefined),
  );
}

const ORGANIC: Line = { text: "Organic search", x: 26 };

describe("useCleared", () => {
  it("shows the lines of two nodes apart", () => {
    expect(cleared([[ORGANIC], [{ anchor: "end", text: "Left", x: 244 }]])).toStrictEqual([
      false,
      false,
    ]);
  });

  it("hides the lines of a node that meet the lines of a node earlier in the walk", () => {
    expect(cleared([[ORGANIC], [{ anchor: "end", text: "Left", x: 124 }]])).toStrictEqual([
      false,
      true,
    ]);
  });

  it("hides the lines of a node 5px after the lines of an earlier node", () => {
    expect(cleared([[ORGANIC], [{ anchor: "end", text: "Left", x: 157 }]])).toStrictEqual([
      false,
      true,
    ]);
  });

  it("hides the lines of a node 5px before the lines of an earlier node", () => {
    expect(cleared([[{ anchor: "end", text: "Left", x: 157 }], [ORGANIC]])).toStrictEqual([
      false,
      true,
    ]);
  });

  it("shows the lines of a node 1.5 lines of 16px under the lines of an earlier node", () => {
    expect(cleared([[ORGANIC], [{ anchor: "end", text: "Left", x: 124, y: 64 }]])).toStrictEqual([
      false,
      false,
    ]);
  });

  it("hides the lines of a node 23px under the lines of an earlier node", () => {
    expect(cleared([[ORGANIC], [{ anchor: "end", text: "Left", x: 124, y: 63 }]])).toStrictEqual([
      false,
      true,
    ]);
  });

  it("shows the lines of a node 1.5 lines of 16px over the lines of an earlier node", () => {
    expect(cleared([[ORGANIC], [{ anchor: "end", text: "Left", x: 124, y: 16 }]])).toStrictEqual([
      false,
      false,
    ]);
  });

  it("hides the lines of a node 23px over the lines of an earlier node", () => {
    expect(cleared([[ORGANIC], [{ anchor: "end", text: "Left", x: 124, y: 17 }]])).toStrictEqual([
      false,
      true,
    ]);
  });

  it("shows the lines of a node 26px under the lines of an earlier node in one 16px font", () => {
    expect(cleared([[ORGANIC], [{ anchor: "end", text: "Left", x: 124, y: 66 }]])).toStrictEqual([
      false,
      false,
    ]);
  });

  it("hides the lines of a node in a 16px font 26px under a line in a 20px font", () => {
    expect(
      cleared([[{ ...ORGANIC, size: 20 }], [{ anchor: "end", text: "Left", x: 124, y: 66 }]]),
    ).toStrictEqual([false, true]);
  });

  it("hides the lines of a node in a 20px font 26px under a line in a 16px font", () => {
    expect(
      cleared([[ORGANIC], [{ anchor: "end", size: 20, text: "Left", x: 124, y: 66 }]]),
    ).toStrictEqual([false, true]);
  });

  it("shows the lines of a node 6px from the lines of an earlier node", () => {
    expect(cleared([[ORGANIC], [{ anchor: "end", text: "Left", x: 158 }]])).toStrictEqual([
      false,
      false,
    ]);
  });

  it("shows the lines of a node below the lines of an earlier node", () => {
    expect(cleared([[ORGANIC], [{ anchor: "end", text: "Left", x: 124, y: 120 }]])).toStrictEqual([
      false,
      false,
    ]);
  });

  it("shows the lines of a node above the lines of an earlier node", () => {
    expect(
      cleared([[{ ...ORGANIC, y: 120 }], [{ anchor: "end", text: "Left", x: 124 }]]),
    ).toStrictEqual([false, false]);
  });

  it("hides the lines of a node that leave the plot's end side", () => {
    expect(cleared([[{ text: "Organic search", x: 266 }]])).toStrictEqual([true]);
  });

  it("hides the lines of a node that leave the plot's start side", () => {
    expect(cleared([[{ anchor: "end", text: "Left", x: 14 }]])).toStrictEqual([true]);
  });

  it("shows the lines that meet only lines an earlier node hides", () => {
    expect(
      cleared([[ORGANIC], [{ text: "Paid search", x: 76 }], [{ text: "Social media", x: 146 }]]),
    ).toStrictEqual([false, true, false]);
  });

  it("hides every line of a node when one line meets", () => {
    measured();

    const { container } = render(
      plotted([
        [ORGANIC],
        [
          { anchor: "end", text: "Left", x: 124 },
          { anchor: "end", text: "€100", x: 124, y: 120 },
        ],
      ]),
    );

    expect(
      [...container.querySelectorAll("text")].map((text) => text.dataset["overflow"]),
    ).toStrictEqual([undefined, "", ""]);
  });

  it("shows the lines of a node again when a layout moves them apart", () => {
    measured();

    const { container, rerender } = render(
      plotted([[ORGANIC], [{ anchor: "end", text: "Left", x: 124 }]]),
    );

    rerender(plotted([[ORGANIC], [{ anchor: "end", text: "Left", x: 244 }]]));

    expect(container.querySelectorAll("[data-overflow]")).toHaveLength(0);
  });

  it("marks nothing for a node that renders no group", () => {
    measured();

    expect(() => render(plotted([[]]))).not.toThrow();
  });
});
