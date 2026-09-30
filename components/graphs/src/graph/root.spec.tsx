import { render, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement, slotVariantClass } from "@stealthscale/testing-theme";

import { drawn } from "#graph/graph.fixtures.tsx";
import * as Graph from "#graph/index.ts";

describe("Root", () => {
  it("renders a figure", () => {
    const { container } = render(<Graph.Root />);

    expect(container.querySelector("figure")?.className).toContain("graph__root");
  });

  it("names the figure by its caption while one renders", () => {
    const { getByRole } = render(
      <Graph.Root>
        <Graph.Caption>The churn model failed.</Graph.Caption>
      </Graph.Root>,
    );

    expect(getByRole("figure", { name: "The churn model failed." })).toBeDefined();
  });

  it("points the figure at no caption without one", () => {
    const { container } = render(<Graph.Root />);

    expect(container.querySelector("figure")?.getAttribute("aria-labelledby")).toBeNull();
  });

  it("gives its parts the direction it states", () => {
    const { result } = renderHook(() => Graph.useGraphDirection(), {
      wrapper: ({ children }) => <Graph.Root direction="right">{children}</Graph.Root>,
    });

    expect(result.current).toBe("right");
  });

  it("gives its parts the direction down unless stated", () => {
    const { result } = renderHook(() => Graph.useGraphDirection(), { wrapper: Graph.Root });

    expect(result.current).toBe("down");
  });

  it("gives the canvas the ratio it states", async () => {
    const { container } = await drawn({}, null, { ratio: "square" });

    expect(slotElement(container, "graph", "canvas").classList).toContain(
      slotVariantClass("graph", "canvas", "ratio", "square"),
    );
  });

  it("gives the canvas the video ratio unless stated", async () => {
    const { container } = await drawn();

    expect(slotElement(container, "graph", "canvas").classList).toContain(
      slotVariantClass("graph", "canvas", "ratio", "video"),
    );
  });
});
