import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement, slotVariantClass } from "@stealthscale/testing-theme";

import * as Graph from "#graph/index.ts";

describe("Empty", () => {
  it("renders its message in the empty class", () => {
    const { container } = render(
      <Graph.Root>
        <Graph.Empty>No tables to show.</Graph.Empty>
      </Graph.Root>,
    );

    expect(slotElement(container, "graph", "empty").textContent).toBe("No tables to show.");
  });

  it("takes the root's ratio", () => {
    const { container } = render(
      <Graph.Root ratio="square">
        <Graph.Empty>No tables to show.</Graph.Empty>
      </Graph.Root>,
    );

    expect(slotElement(container, "graph", "empty").classList).toContain(
      slotVariantClass("graph", "empty", "ratio", "square"),
    );
  });

  it("throws outside a root", () => {
    expect(() => render(<Graph.Empty>Alone</Graph.Empty>)).toThrow();
  });
});
