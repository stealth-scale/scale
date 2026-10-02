import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Item, ItemMark } from "#menu/index.ts";
import { listed, rowed } from "#menu/menu.fixtures.tsx";

describe("ItemMark", () => {
  it("renders a span", async () => {
    const { container } = await drawn(
      listed(
        <Item value="acme">
          <ItemMark>A</ItemMark>
          Acme
        </Item>,
      ),
    );

    expect(slotElement(container, "menu", "itemMark").tagName).toBe("SPAN");
  });

  it("hides its text from the row's accessible name", async () => {
    await drawn(rowed(<ItemMark>A</ItemMark>));

    expect(screen.getByRole("menuitem", { name: "Acme" })).toBeDefined();
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(rowed(<ItemMark as="b">A</ItemMark>));

    expect(slotElement(container, "menu", "itemMark").tagName).toBe("B");
  });
});
