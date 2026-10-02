import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Arc, type ArcProps } from "#chord-diagram/arc.tsx";
import { type ArcMark } from "#chord-diagram/marks.ts";

const RING = { centre: { x: 150, y: 150 }, ends: 88, inner: 90, outer: 100 };

function markOf(startAngle: number, endAngle: number): ArcMark {
  return {
    color: undefined,
    group: { endAngle, key: "api", startAngle, value: 10 },
    inflow: 4,
    kind: "arc",
    title: "api",
    walk: 3,
  };
}

function arc(props: Partial<ArcProps> = {}): HTMLElement {
  return render(
    <svg>
      <Arc
        color="var(--api)"
        mark={markOf(0, Math.PI / 2)}
        onEnter={() => {}}
        onLeave={() => {}}
        ring={RING}
        trace={undefined}
        {...props}
      />
    </svg>,
  ).container;
}

function placeOf(container: HTMLElement): string[] {
  const text = container.querySelector("text");

  return [
    Math.round(Number(text?.getAttribute("x")) * 100) / 100,
    Math.round(Number(text?.getAttribute("y")) * 100) / 100,
    text?.getAttribute("text-anchor"),
  ].map(String);
}

describe("Arc", () => {
  it("paints the arc in the node's color", () => {
    expect(arc().querySelector(".recharts-sector")?.getAttribute("fill")).toBe("var(--api)");
  });

  it("starts the arc at its start angle from 12 o'clock", () => {
    expect(arc().querySelector(".recharts-sector")?.getAttribute("d")).toMatch(/^M 150,50\s/u);
  });

  it("takes the node class", () => {
    expect(arc().querySelector("g")?.getAttribute("class")).toBe("chart-node");
  });

  it("marks its place in the walk", () => {
    expect(arc().querySelector("g")?.dataset["walk"]).toBe("3");
  });

  it("writes its trace", () => {
    expect(arc({ trace: "dimmed" }).querySelector("g")?.dataset["trace"]).toBe("dimmed");
  });

  it("writes no trace while the readout is at no mark", () => {
    expect(arc().querySelector("g")?.dataset["trace"]).toBeUndefined();
  });

  it("writes its name 8px outside the ring from the arc's middle on the right half", () => {
    expect(placeOf(arc())).toStrictEqual(["226.37", "73.63", "start"]);
  });

  it("writes its name towards the arc's middle on the left half", () => {
    expect(placeOf(arc({ mark: markOf(Math.PI, (Math.PI * 3) / 2) }))).toStrictEqual([
      "73.63",
      "226.37",
      "end",
    ]);
  });

  it("writes its name in the share class", () => {
    expect(arc().querySelector("text")?.getAttribute("class")).toBe("recharts-text chart-share");
  });

  it("renders the name alone for an arc of no length", () => {
    const container = arc({ mark: markOf(1, 1) });

    expect([container.querySelector(".recharts-sector"), container.textContent]).toStrictEqual([
      null,
      "api",
    ]);
  });

  it("moves the readout to the arc when the pointer enters it", () => {
    const onEnter = vi.fn<() => void>();

    fireEvent.mouseEnter(arc({ onEnter }).querySelector("g") ?? document.body);

    expect(onEnter).toHaveBeenCalledOnce();
  });

  it("clears the readout when the pointer leaves the arc", () => {
    const onLeave = vi.fn<() => void>();

    fireEvent.mouseLeave(arc({ onLeave }).querySelector("g") ?? document.body);

    expect(onLeave).toHaveBeenCalledOnce();
  });

  it("hides its name where it leaves the plot's side", () => {
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function box(
      this: Element,
    ) {
      if (this.localName === "svg") return new DOMRect(0, 0, 300, 300);

      const x = Number(this.getAttribute("x"));

      return new DOMRect(x, Number(this.getAttribute("y")) - 8, 90, 16);
    });

    const container = arc({ mark: markOf(Math.PI / 4, (Math.PI * 3) / 4) });

    expect(container.querySelector("text")?.dataset["overflow"]).toBe("");
  });
});
