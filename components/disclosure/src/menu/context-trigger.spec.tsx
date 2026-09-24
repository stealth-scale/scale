import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { attr, drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { ContextTrigger } from "#menu/context-trigger.tsx";
import { listed, righted } from "#menu/menu.fixtures.tsx";

describe("ContextTrigger", () => {
  it("renders a div", async () => {
    const { container } = await drawn(listed(<ContextTrigger>A row</ContextTrigger>));

    expect(slotElement(container, "menu", "contextTrigger").tagName).toBe("DIV");
  });

  it("sets data-state closed while the menu is closed", async () => {
    const { container } = await drawn(righted());

    expect(attr(container, "context-trigger", "state")).toBe("closed");
  });

  it("opens the menu on a contextmenu event", async () => {
    const { container } = await drawn(righted());

    fireEvent.contextMenu(slotElement(container, "menu", "contextTrigger"));
    await settled();

    expect(screen.getByRole("menu")).toBeDefined();
  });

  it("sets data-value to its value", async () => {
    const { container } = await drawn(listed(<ContextTrigger value="row-7">A row</ContextTrigger>));

    expect(slotElement(container, "menu", "contextTrigger").dataset["value"]).toBe("row-7");
  });

  it("sets no data-value without a value", async () => {
    const { container } = await drawn(listed(<ContextTrigger>A row</ContextTrigger>));

    expect(slotElement(container, "menu", "contextTrigger").dataset["value"]).toBeUndefined();
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(listed(<ContextTrigger as="li">A row</ContextTrigger>));

    expect(slotElement(container, "menu", "contextTrigger").tagName).toBe("LI");
  });
});
