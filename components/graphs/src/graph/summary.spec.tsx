import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import * as Graph from "#graph/index.ts";

describe("Summary", () => {
  it("renders its children in the summary class", () => {
    const { container } = render(
      <Graph.Root>
        <Graph.Summary>
          <output>Revenue report: 3 upstream, 2 downstream</output>
        </Graph.Summary>
      </Graph.Root>,
    );

    expect(slotElement(container, "graph", "summary").textContent).toBe(
      "Revenue report: 3 upstream, 2 downstream",
    );
  });

  it("renders a div", () => {
    const { container } = render(
      <Graph.Root>
        <Graph.Summary>Select a node.</Graph.Summary>
      </Graph.Root>,
    );

    expect(slotElement(container, "graph", "summary").tagName).toBe("DIV");
  });

  it("throws outside a root", () => {
    expect(() => render(<Graph.Summary>Alone</Graph.Summary>)).toThrow();
  });
});
