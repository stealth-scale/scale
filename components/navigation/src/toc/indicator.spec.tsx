import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Indicator } from "#toc/indicator.tsx";
import { List } from "#toc/list.tsx";
import { composed, railed } from "#toc/toc.fixtures.tsx";

describe("Indicator", () => {
  it("renders a list item inside the root", async () => {
    const { container } = await drawn(
      railed(
        <List>
          <Indicator />
        </List>,
      ),
    );

    expect(slotElement(container, "toc", "indicator").tagName).toBe("LI");
  });

  it("sets hidden when no heading is active", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "toc", "indicator").hasAttribute("hidden")).toBe(true);
  });

  it("sets aria-hidden to true", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "toc", "indicator").getAttribute("aria-hidden")).toBe("true");
  });

  it("renders the element passed as as", async () => {
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
