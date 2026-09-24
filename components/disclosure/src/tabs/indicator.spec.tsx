import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Indicator } from "#tabs/indicator.tsx";
import { composed, tabbed } from "#tabs/tabs.fixtures.tsx";

describe("Indicator", () => {
  it("renders a div", async () => {
    const { container } = await drawn(tabbed(<Indicator />));

    expect(slotElement(container, "tabs", "indicator").tagName).toBe("DIV");
  });

  it("sets data-orientation", async () => {
    const { container } = await drawn(composed({ orientation: "vertical" }));

    expect(slotElement(container, "tabs", "indicator").dataset["orientation"]).toBe("vertical");
  });

  it("sets hidden before a tab is measured", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "tabs", "indicator").hasAttribute("hidden")).toBe(true);
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(tabbed(<Indicator as="span" />));

    expect(slotElement(container, "tabs", "indicator").tagName).toBe("SPAN");
  });

  it("sets aria-hidden", async () => {
    const { container } = await drawn(tabbed(<Indicator />));

    expect(slotElement(container, "tabs", "indicator").getAttribute("aria-hidden")).toBe("true");
  });
});
