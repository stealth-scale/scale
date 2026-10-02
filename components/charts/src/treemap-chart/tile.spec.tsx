import { type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Tile, type TileProps } from "#treemap-chart/tile.tsx";

/**
 * Returns a tile 120 by 60 at 10, 20 in an `svg`, with the props a case changes.
 */
function tile(props: Partial<TileProps> = {}): ReactElement {
  return (
    <svg>
      <Tile
        depth={2}
        detail={(size) => `€${String(size)} · 23%`}
        fill="var(--fill)"
        height={60}
        opacity="0.5"
        title="Postgres"
        value={18_400}
        walk={3}
        width={120}
        x={10}
        y={20}
        {...props}
      />
    </svg>
  );
}

/**
 * Renders a tile with the props a case changes.
 */
function tiled(props: Partial<TileProps> = {}): ReturnType<typeof render> {
  return render(tile(props));
}

/**
 * Renders a tile into a host that counts the pointer's `mouseover` events, and returns the count's
 * spy.
 */
function pointed(props: Partial<TileProps>): () => void {
  const over = vi.fn<() => void>();
  const host = document.createElement("div");

  document.body.append(host);
  host.addEventListener("mouseover", () => {
    over();
  });
  render(tile(props), { container: host });

  return over;
}

/**
 * Measures every line of words at 7px a character, as a browser lays them out.
 */
function measured(): void {
  vi.spyOn(SVGTextElement.prototype, "getComputedTextLength").mockImplementation(function length(
    this: SVGTextElement,
  ) {
    return (this.textContent?.length ?? 0) * 7;
  });
}

/**
 * Returns the text of every line written on the tile.
 */
function linesOf(container: Element): string[] {
  return [...container.querySelectorAll("text")].map((text) => text.textContent);
}

/**
 * Returns the text of every line the tile marks as wider than itself.
 */
function overflowOf(container: Element): string[] {
  return [...container.querySelectorAll("text[data-overflow]")].map((text) => text.textContent);
}

describe("Tile", () => {
  it("renders nothing for recharts' root", () => {
    const { container } = tiled({ depth: 0 });

    expect(container.querySelector("g")).toBeNull();
  });

  it("renders nothing without a depth", () => {
    const { container } = tiled({ depth: undefined });

    expect(container.querySelector("g")).toBeNull();
  });

  it("paints the rectangle in the fill", () => {
    const { container } = tiled();

    expect(container.querySelector(".recharts-rectangle")?.getAttribute("fill")).toBe(
      "var(--fill)",
    );
  });

  it("renders the rectangle at the tile's box", () => {
    const { container } = tiled();
    const path = container.querySelector(".recharts-rectangle")?.getAttribute("d") ?? "";

    expect(path.startsWith("M 10,22")).toBe(true);
  });

  it("marks its place in the walk", () => {
    const { container } = tiled();

    expect(container.querySelector("g")?.dataset["walk"]).toBe("3");
  });

  it("takes its family's opacity", () => {
    const { container } = tiled();

    expect(container.querySelector("g")?.getAttribute("opacity")).toBe("0.5");
  });

  it("takes the tile class", () => {
    const { container } = tiled();

    expect(container.querySelector("g")?.getAttribute("class")).toBe("chart-tile");
  });

  it("writes its name and the line under it on a tile two lines tall", () => {
    const { container } = tiled();

    expect(linesOf(container)).toStrictEqual(["Postgres", "€18400 · 23%"]);
  });

  it("writes its words in the share class", () => {
    const { container } = tiled();

    expect(container.querySelector("text")?.getAttribute("class")).toBe(
      "recharts-text chart-share",
    );
  });

  it("writes its name 6px inside the top-left corner", () => {
    const { container } = tiled();
    const name = container.querySelector("text");

    expect([name?.getAttribute("x"), name?.getAttribute("y")]).toStrictEqual(["16", "26"]);
  });

  it("writes the line under the name one line lower", () => {
    const { container } = tiled();

    expect(container.querySelectorAll("text")[1]?.getAttribute("y")).toBe("42");
  });

  it("writes both lines on a tile just two lines tall", () => {
    const { container } = tiled({ height: 44 });

    expect(linesOf(container)).toHaveLength(2);
  });

  it("writes only its name on a tile one line tall", () => {
    const { container } = tiled({ height: 43 });

    expect(linesOf(container)).toStrictEqual(["Postgres"]);
  });

  it("writes its name on a tile just one line tall", () => {
    const { container } = tiled({ height: 28 });

    expect(linesOf(container)).toStrictEqual(["Postgres"]);
  });

  it("writes no word on a tile shorter than a line", () => {
    const { container } = tiled({ height: 27 });

    expect(linesOf(container)).toStrictEqual([]);
  });

  it("writes only its name without a writer for the line under it", () => {
    const { container } = tiled({ detail: undefined });

    expect(linesOf(container)).toStrictEqual(["Postgres"]);
  });

  it("writes only its name when the writer returns an empty line", () => {
    const { container } = tiled({ detail: () => "" });

    expect(linesOf(container)).toStrictEqual(["Postgres"]);
  });

  it("writes no word on a parent", () => {
    const { container } = tiled({ fill: "transparent" });

    expect(linesOf(container)).toStrictEqual([]);
  });

  it("writes no word without a fill", () => {
    const { container } = tiled({ fill: undefined });

    expect(linesOf(container)).toStrictEqual([]);
  });

  it("marks no line when both fit across the tile", () => {
    measured();
    const { container } = tiled();

    expect(overflowOf(container)).toStrictEqual([]);
  });

  it("marks the name and the line under it when the name is wider than the tile", () => {
    measured();
    const { container } = tiled({ width: 67 });

    expect(overflowOf(container)).toStrictEqual(["Postgres", "€18400 · 23%"]);
  });

  it("marks the line under the name with a name wider than the tile", () => {
    measured();
    const { container } = tiled({ detail: () => "€1", title: "Kubernetes cluster", width: 100 });

    expect(overflowOf(container)).toStrictEqual(["Kubernetes cluster", "€1"]);
  });

  it("marks the line under the name alone when only it is wider than the tile", () => {
    measured();
    const { container } = tiled({ width: 95 });

    expect(overflowOf(container)).toStrictEqual(["€18400 · 23%"]);
  });

  it("marks no line when both just fit", () => {
    measured();
    const { container } = tiled({ width: 96 });

    expect(overflowOf(container)).toStrictEqual([]);
  });

  it("measures again when the tile widens", () => {
    measured();
    const { container, rerender } = tiled({ width: 67 });

    rerender(tile({ width: 120 }));

    expect(overflowOf(container)).toStrictEqual([]);
  });

  it("sends the pointer to itself when its place is the initial one", () => {
    expect(pointed({ initial: 3 })).toHaveBeenCalledExactlyOnceWith();
  });

  it("sends no pointer when another place is the initial one", () => {
    expect(pointed({ initial: 2 })).not.toHaveBeenCalled();
  });

  it("sends no pointer without a place", () => {
    expect(pointed({ initial: 3, walk: undefined })).not.toHaveBeenCalled();
  });

  it("sends no pointer without a place or an initial one", () => {
    expect(pointed({ initial: undefined, walk: undefined })).not.toHaveBeenCalled();
  });

  it("renders an empty tile at the origin without recharts' geometry", () => {
    const { container } = render(
      <svg>
        <Tile depth={1} />
      </svg>,
    );

    expect(container.querySelector("g")?.getAttribute("opacity")).toBe("1");
  });
});
