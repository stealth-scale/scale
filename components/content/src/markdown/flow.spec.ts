import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { rendered } from "#markdown/markdown.fixtures.tsx";

describe("renderFlow", () => {
  it("renders a quotation's blocks in a div with the recipe's flow class", () => {
    const { container } = rendered("> One.\n>\n> Two.\n");

    expect(slotElement(container, "markdown", "flow").childElementCount).toBe(2);
  });
});
