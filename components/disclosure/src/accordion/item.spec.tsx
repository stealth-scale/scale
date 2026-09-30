import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, itemed, toggled } from "#accordion/accordion.fixtures.tsx";
import { Item } from "#accordion/item.tsx";
import { Root } from "#accordion/root.tsx";

describe("Item", () => {
  it("renders a div", async () => {
    const { container } = await drawn(itemed(null));

    expect(slotElement(container, "accordion", "item").tagName).toBe("DIV");
  });

  it("sets data-state closed while closed", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "accordion", "item").dataset["state"]).toBe("closed");
  });

  it("sets data-state open while open", async () => {
    const { container } = await drawn(composed({ defaultValue: ["delivery"] }));

    expect(slotElement(container, "accordion", "item").dataset["state"]).toBe("open");
  });

  it("sets data-state open after a press of its trigger", async () => {
    const { container } = await drawn(composed());

    await toggled(screen.getByRole("button", { name: "Delivery" }));

    expect(slotElement(container, "accordion", "item").dataset["state"]).toBe("open");
  });

  it("disables its trigger with disabled", async () => {
    await drawn(composed({}, "abroad"));

    expect(screen.getByRole("button", { name: "Abroad" }).hasAttribute("disabled")).toBe(true);
  });

  it("keeps a disabled item closed on a press", async () => {
    await drawn(composed({}, "abroad"));
    await toggled(screen.getByRole("button", { name: "Abroad" }));

    expect(screen.getByRole("button", { name: "Abroad" }).getAttribute("aria-expanded")).toBe(
      "false",
    );
  });

  it("passes the element's props through", async () => {
    const { container } = await drawn(
      <Root>
        <Item className="mine" value="first" />
      </Root>,
    );

    expect(slotElement(container, "accordion", "item").classList.contains("mine")).toBe(true);
  });
});
