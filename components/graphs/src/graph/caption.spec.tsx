import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as Graph from "#graph/index.ts";

describe("Caption", () => {
  it("renders a figcaption with the root's caption ID", () => {
    const { container } = render(
      <Graph.Root>
        <Graph.Caption>The churn model failed.</Graph.Caption>
      </Graph.Root>,
    );
    const caption = container.querySelector("figcaption");

    expect(container.querySelector("figure")?.getAttribute("aria-labelledby")).toBe(caption?.id);
  });

  it("renders its words in the caption class", () => {
    const { container } = render(
      <Graph.Root>
        <Graph.Caption>The churn model failed.</Graph.Caption>
      </Graph.Root>,
    );

    expect(container.querySelector("figcaption")?.className).toContain("graph__caption");
  });

  it("throws outside a root", () => {
    expect(() => render(<Graph.Caption>Alone</Graph.Caption>)).toThrow();
  });
});
