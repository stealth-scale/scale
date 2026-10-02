import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { ItemText } from "#listbox/item-text.tsx";
import { offered } from "#listbox/listbox.fixtures.tsx";
import { ROWS } from "#listbox/rows.fixtures.ts";

describe("ItemText", () => {
  it("renders a span", () => {
    const { container } = render(offered(<ItemText item={ROWS[0]}>Invoices</ItemText>));

    expect(slotElement(container, "listbox", "itemText").tagName).toBe("SPAN");
  });

  it("renders the row's text", () => {
    render(offered(<ItemText item={ROWS[0]}>Invoices</ItemText>));

    expect(screen.getByText("Invoices")).toBeTruthy();
  });
});
