import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Indicator } from "#tabs/indicator.tsx";
import { closable, composed, tabbed } from "#tabs/tabs.fixtures.tsx";

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

  it("moves under the selected tab when a tab before it leaves the list", async () => {
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(80);
    vi.spyOn(HTMLElement.prototype, "offsetLeft", "get").mockImplementation(function place(
      this: HTMLElement,
    ) {
      return 100 * [...(this.parentElement?.children ?? [])].indexOf(this);
    });

    const { container } = await drawn(closable());

    fireEvent.click(within(screen.getByRole("tab", { name: "first" })).getByTitle("Close"));
    await settled();

    expect(slotElement(container, "tabs", "indicator").style.getPropertyValue("--left")).toBe(
      "0px",
    );
  });
});
