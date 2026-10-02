import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, itemed, toggled } from "#accordion/accordion.fixtures.tsx";
import { ItemContent } from "#accordion/item-content.tsx";

describe("ItemContent", () => {
  it("renders a div", async () => {
    const { container } = await drawn(itemed(<ItemContent>The answer</ItemContent>));

    expect(slotElement(container, "accordion", "itemContent").tagName).toBe("DIV");
  });

  it("sets the region role named by its trigger", async () => {
    await drawn(composed({ defaultValue: ["delivery"] }));

    expect(screen.getByRole("region", { name: "Delivery" }).textContent).toBe("About delivery");
  });

  it("sets hidden while closed", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "accordion", "itemContent").hasAttribute("hidden")).toBe(true);
  });

  it("removes hidden on a press of its trigger", async () => {
    const { container } = await drawn(composed());

    await toggled(screen.getByRole("button", { name: "Delivery" }));

    expect(slotElement(container, "accordion", "itemContent").hasAttribute("hidden")).toBe(false);
  });

  it("sets no data-state on the first render of an open item", async () => {
    const { container } = await drawn(composed({ defaultValue: ["delivery"] }));

    expect(slotElement(container, "accordion", "itemContent").dataset["state"]).toBeUndefined();
  });

  it("sets data-state closed while closed", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "accordion", "itemContent").dataset["state"]).toBe("closed");
  });

  it("writes the measured height as a custom property", async () => {
    const { container } = await drawn(composed());

    expect(
      slotElement(container, "accordion", "itemContent").style.getPropertyValue("--height"),
    ).toBe("0px");
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(itemed(<ItemContent as="section">The answer</ItemContent>));

    expect(slotElement(container, "accordion", "itemContent").tagName).toBe("SECTION");
  });
});
