import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Indicator } from "#toc/indicator.tsx";
import { List } from "#toc/list.tsx";
import { composed, railed } from "#toc/toc.fixtures.tsx";

describe("Indicator", () => {
  it("draws a list item inside the root it needs above it", async () => {
    const { container } = await drawn(
      railed(
        <List>
          <Indicator />
        </List>,
      ),
    );

    expect(slotElement(container, "toc", "indicator").tagName).toBe("LI");
  });

  it("is hidden until there is a row to measure", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "toc", "indicator").hasAttribute("hidden")).toBe(true);
  });

  it("leaves a reader stepping through the list one stop for each heading", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "toc", "indicator").getAttribute("aria-hidden")).toBe("true");
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(
      railed(
        <List>
          <Indicator as="div" />
        </List>,
      ),
    );

    expect(slotElement(container, "toc", "indicator").tagName).toBe("DIV");
  });
});
