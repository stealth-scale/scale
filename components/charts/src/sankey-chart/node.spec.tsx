import { type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type NodeView } from "#sankey-chart/graph.ts";
import { Node, type NodeProps } from "#sankey-chart/node.tsx";

/**
 * Lists a source and a sink.
 */
const VIEWS: readonly NodeView[] = [
  { color: undefined, key: "organic", sink: false, title: "Organic search", value: 110, walk: 0 },
  { color: undefined, key: "left", sink: true, title: "Left", value: 100, walk: 3 },
];

/**
 * Returns the source's bar, 10 by 40 at 100, 20, in an `svg`, with the props a case changes.
 */
function node(props: Partial<NodeProps> = {}): ReactElement {
  return (
    <svg>
      <Node
        colorOf={(key) => `var(--${key})`}
        detail={(value) => `€${String(value)}`}
        height={40}
        index={0}
        views={VIEWS}
        width={10}
        x={100}
        y={20}
        {...props}
      />
    </svg>
  );
}

/**
 * Renders a node into a host that counts the pointer's `mouseover` events, and returns the count's
 * spy.
 */
function pointed(props: Partial<NodeProps>): () => void {
  const over = vi.fn<() => void>();
  const host = document.createElement("div");

  document.body.append(host);
  host.addEventListener("mouseover", () => {
    over();
  });
  render(node(props), { container: host });

  return over;
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

/**
 * Renders a node of the views per position in one `svg`, each 10 by 40 at the position and at the
 * height stated for it, else 20, and returns whether each node's words are marked as not fitting.
 */
function cleared(
  views: readonly NodeView[],
  xs: readonly number[],
  ys: readonly number[] = [],
): boolean[] {
  measured();

  const { container } = render(
    <svg>
      {xs.map((x, index) => (
        <Node
          colorOf={() => "red"}
          height={40}
          index={index}
          key={x}
          views={views}
          width={10}
          x={x}
          y={ys[index] ?? 20}
        />
      ))}
    </svg>,
  );

  return [...container.querySelectorAll("g")].map((group) =>
    [...group.querySelectorAll("text")].every((text) => text.dataset["overflow"] !== undefined),
  );
}

/**
 * Returns each line of words with where it is anchored: its text, `x`, `y` and anchor.
 */
function linesOf(container: Element): string[][] {
  return [...container.querySelectorAll("text")].map((text) => [
    text.textContent,
    text.getAttribute("x") ?? "",
    text.getAttribute("y") ?? "",
    text.getAttribute("text-anchor") ?? "",
  ]);
}

describe("Node", () => {
  it("paints the bar in the node's color", () => {
    const { container } = render(node());

    expect(container.querySelector(".recharts-rectangle")?.getAttribute("fill")).toBe(
      "var(--organic)",
    );
  });

  it("marks its place in the walk", () => {
    const { container } = render(node());

    expect(container.querySelector("g")?.dataset["walk"]).toBe("0");
  });

  it("takes the node class", () => {
    const { container } = render(node());

    expect(container.querySelector("g")?.getAttribute("class")).toBe("chart-node");
  });

  it("writes its name and its value 6px after the bar where the bar is two lines tall", () => {
    const { container } = render(node());

    expect(linesOf(container)).toStrictEqual([
      ["Organic search", "116", "32", "start"],
      ["€110", "116", "48", "start"],
    ]);
  });

  it("writes a sink's name 6px before the bar", () => {
    const { container } = render(node({ index: 1 }));

    expect(linesOf(container)[0]).toStrictEqual(["Left", "94", "32", "end"]);
  });

  it("writes its value on a bar just two lines tall", () => {
    const { container } = render(node({ height: 32 }));

    expect(linesOf(container)).toHaveLength(2);
  });

  it("writes only its name in the bar's middle where the bar is shorter", () => {
    const { container } = render(node({ height: 31 }));

    expect(linesOf(container)).toStrictEqual([["Organic search", "116", "35.5", "start"]]);
  });

  it("writes only its name without a writer", () => {
    const { container } = render(node({ detail: undefined }));

    expect(linesOf(container).map(([text]) => text)).toStrictEqual(["Organic search"]);
  });

  it("writes its words in the share class", () => {
    const { container } = render(node());

    expect(container.querySelector("text")?.getAttribute("class")).toBe(
      "recharts-text chart-share",
    );
  });

  it("writes no trace outside a chart", () => {
    const { container } = render(node());

    expect(container.querySelector("g")?.dataset["trace"]).toBeUndefined();
  });

  it("renders nothing for an index without a view", () => {
    const { container } = render(node({ index: 5 }));

    expect(container.querySelector("g")).toBeNull();
  });

  it("renders nothing without an index", () => {
    const { container } = render(node({ index: undefined }));

    expect(container.querySelector("g")).toBeNull();
  });

  it("renders its bar at the origin without recharts' geometry", () => {
    const { container } = render(
      <svg>
        <Node colorOf={() => "red"} index={0} views={VIEWS} />
      </svg>,
    );

    expect(linesOf(container)).toStrictEqual([["Organic search", "6", "0", "start"]]);
  });

  it("shows the words of two nodes apart", () => {
    expect(cleared(VIEWS, [10, 250])).toStrictEqual([false, false]);
  });

  it("hides the words of a node that meet the words of a node earlier in the walk", () => {
    expect(cleared(VIEWS, [10, 130])).toStrictEqual([false, true]);
  });

  it("shows the words of a node below the words of an earlier node", () => {
    expect(cleared(VIEWS, [10, 130], [20, 100])).toStrictEqual([false, false]);
  });

  it("sends the pointer to itself when its place is the initial one", () => {
    expect(pointed({ initial: 0 })).toHaveBeenCalledExactlyOnceWith();
  });

  it("sends no pointer when another place is the initial one", () => {
    expect(pointed({ initial: 3 })).not.toHaveBeenCalled();
  });

  it("sends no pointer without a view", () => {
    expect(pointed({ index: 5, initial: undefined })).not.toHaveBeenCalled();
  });
});
