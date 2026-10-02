import { type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Flow, type FlowProps } from "#sankey-chart/flow.tsx";
import { type FlowView } from "#sankey-chart/graph.ts";

/**
 * Lists a flow from the organic channel to the sign-up.
 */
const VIEWS: readonly FlowView[] = [{ from: "organic", to: "signup", walk: 1 }];

/**
 * Returns the flow's band, 12px wide from 10, 20 to 130, 80 through control points at 50 and 90, in
 * an `svg`, with the props a case changes.
 */
function flow(props: Partial<FlowProps> = {}): ReactElement {
  return (
    <svg>
      <Flow
        colorOf={(key) => `var(--${key})`}
        index={0}
        linkWidth={12}
        sourceControlX={50}
        sourceX={10}
        sourceY={20}
        targetControlX={90}
        targetX={130}
        targetY={80}
        views={VIEWS}
        {...props}
      />
    </svg>
  );
}

/**
 * Renders a flow into a host that counts the pointer's `mouseover` events, and returns the count's
 * spy.
 */
function pointed(props: Partial<FlowProps>): () => void {
  const over = vi.fn<() => void>();
  const host = document.createElement("div");

  document.body.append(host);
  host.addEventListener("mouseover", () => {
    over();
  });
  render(flow(props), { container: host });

  return over;
}

describe("Flow", () => {
  it("renders recharts' curve from its start to its end", () => {
    const { container } = render(flow());

    expect(container.querySelector("path")?.getAttribute("d")).toBe("M10,20C50,20 90,80 130,80");
  });

  it("paints the band in its source's color", () => {
    const { container } = render(flow());

    expect(container.querySelector("path")?.getAttribute("stroke")).toBe("var(--organic)");
  });

  it("makes the band as wide as the flow", () => {
    const { container } = render(flow());

    expect(container.querySelector("path")?.getAttribute("stroke-width")).toBe("12");
  });

  it("makes the band at least 1px wide", () => {
    const { container } = render(flow({ linkWidth: 0.4 }));

    expect(container.querySelector("path")?.getAttribute("stroke-width")).toBe("1");
  });

  it("fills nothing", () => {
    const { container } = render(flow());

    expect(container.querySelector("path")?.getAttribute("fill")).toBe("none");
  });

  it("marks its place in the walk", () => {
    const { container } = render(flow());

    expect(container.querySelector("path")?.dataset["walk"]).toBe("1");
  });

  it("takes the flow class", () => {
    const { container } = render(flow());

    expect(container.querySelector("path")?.getAttribute("class")).toBe("chart-flow");
  });

  it("writes no trace outside a chart", () => {
    const { container } = render(flow());

    expect(container.querySelector("path")?.dataset["trace"]).toBeUndefined();
  });

  it("renders nothing for an index without a view", () => {
    const { container } = render(flow({ index: 4 }));

    expect(container.querySelector("path")).toBeNull();
  });

  it("renders nothing without an index", () => {
    const { container } = render(flow({ index: undefined }));

    expect(container.querySelector("path")).toBeNull();
  });

  it("renders a point at the origin without recharts' geometry", () => {
    const { container } = render(
      <svg>
        <Flow colorOf={() => "red"} index={0} views={VIEWS} />
      </svg>,
    );

    expect(container.querySelector("path")?.getAttribute("d")).toBe("M0,0C0,0 0,0 0,0");
  });

  it("sends the pointer to itself when its place is the initial one", () => {
    expect(pointed({ initial: 1 })).toHaveBeenCalledExactlyOnceWith();
  });

  it("sends no pointer when another place is the initial one", () => {
    expect(pointed({ initial: 0 })).not.toHaveBeenCalled();
  });

  it("sends no pointer without a view", () => {
    expect(pointed({ index: 4, initial: undefined })).not.toHaveBeenCalled();
  });
});
