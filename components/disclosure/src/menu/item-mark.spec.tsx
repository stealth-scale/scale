import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Item, ItemMark } from "#menu/index.ts";
import { listed, rowed } from "#menu/menu.fixtures.tsx";

describe("ItemMark", () => {
  it("draws a span inside the row it needs above it", async () => {
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

  it("is hidden from a screen reader, the words of the row saying what it stands for", async () => {
    await drawn(rowed(<ItemMark>A</ItemMark>));

    expect(screen.getByRole("menuitem", { name: "Acme" })).toBeDefined();
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(rowed(<ItemMark as="b">A</ItemMark>));

    expect(slotElement(container, "menu", "itemMark").tagName).toBe("B");
  });
});
