import { type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Arc, type ArcProps } from "#sunburst-chart/arc.tsx";

/**
 * Returns a quarter ring from 12 o'clock to 3 o'clock between the radii 40 and 80 around 100, 100
 * in an `svg`, with the props a case changes.
 */
function arc(props: Partial<ArcProps> = {}): ReactElement {
  return (
    <svg>
      <Arc
        cx={100}
        cy={100}
        endAngle={0}
        fill="var(--fill)"
        innerRadius={40}
        outerRadius={80}
        startAngle={90}
        walk={3}
        {...props}
      />
    </svg>
  );
}

/**
 * Renders an arc into a host that counts the pointer's `mouseover` events, and returns the count's
 * spy.
 */
function pointed(props: Partial<ArcProps>): () => void {
  const over = vi.fn<() => void>();
  const host = document.createElement("div");

  document.body.append(host);
  host.addEventListener("mouseover", () => {
    over();
  });
  render(arc(props), { container: host });

  return over;
}

describe("Arc", () => {
  it("paints the sector in its fill", () => {
    const { container } = render(arc());

    expect(container.querySelector(".recharts-sector")?.getAttribute("fill")).toBe("var(--fill)");
  });

  it("starts the sector at its outer radius and start angle", () => {
    const { container } = render(arc());

    expect(
      container.querySelector(".recharts-sector")?.getAttribute("d")?.startsWith("M 100,20"),
    ).toBe(true);
  });

  it("marks its place in the walk", () => {
    const { container } = render(arc());

    expect(container.querySelector("g")?.dataset["walk"]).toBe("3");
  });

  it("marks no place without one", () => {
    const { container } = render(arc({ walk: undefined }));

    expect(container.querySelector("g")?.dataset["walk"]).toBeUndefined();
  });

  it("passes its class to the sector", () => {
    const { container } = render(arc({ className: "chart-gap" }));

    expect(container.querySelector("path")?.getAttribute("class")).toBe(
      "recharts-sector chart-gap",
    );
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

  it("sends no pointer without an initial place", () => {
    expect(pointed({ initial: undefined })).not.toHaveBeenCalled();
  });

  it("sends no pointer without a place or an initial one", () => {
    expect(pointed({ initial: undefined, walk: undefined })).not.toHaveBeenCalled();
  });
});
