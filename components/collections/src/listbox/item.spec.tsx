import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Item } from "#listbox/item.tsx";
import { composed, offered } from "#listbox/listbox.fixtures.tsx";
import { ROWS } from "#listbox/rows.fixtures.ts";

describe("Item", () => {
  it("renders a div", () => {
    const { container } = render(offered(<Item item={ROWS[0]} />));

    expect(slotElement(container, "listbox", "item").tagName).toBe("DIV");
  });

  it("renders the element with the option role", () => {
    render(offered(<Item item={ROWS[0]} />));

    expect(screen.getByRole("option")).toBeTruthy();
  });

  it("sets no tabindex", () => {
    render(offered(<Item item={ROWS[0]} />));

    expect(screen.getByRole("option").getAttribute("tabindex")).toBeNull();
  });

  it("sets aria-selected to false by default", () => {
    render(composed());

    expect(screen.getByRole("option", { name: "Invoices" }).getAttribute("aria-selected")).toBe(
      "false",
    );
  });

  it("sets aria-selected to true after a press", async () => {
    render(composed());
    await pressed(screen.getByRole("option", { name: "Invoices" }));

    expect(screen.getByRole("option", { name: "Invoices" }).getAttribute("aria-selected")).toBe(
      "true",
    );
  });
});
