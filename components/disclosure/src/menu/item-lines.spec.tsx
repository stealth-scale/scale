import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Item, ItemDescription, ItemLines, ItemText } from "#menu/index.ts";
import { listed, rowed } from "#menu/menu.fixtures.tsx";

describe("ItemLines", () => {
  it("draws a span inside the row it needs above it", async () => {
    const { container } = await drawn(
      listed(
        <Item value="acme">
          <ItemLines>
            <ItemText>Acme</ItemText>
          </ItemLines>
        </Item>,
      ),
    );

    expect(slotElement(container, "menu", "itemLines").tagName).toBe("SPAN");
  });

  it("stacks the words and the line under them inside one row", async () => {
    await drawn(
      rowed(
        <ItemLines>
          <ItemText>Globex</ItemText>
          <ItemDescription>Enterprise</ItemDescription>
        </ItemLines>,
      ),
    );

    expect(screen.getByRole("menuitem", { name: "Globex Enterprise Acme" })).toBeDefined();
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(rowed(<ItemLines as="div">Globex</ItemLines>));

    expect(slotElement(container, "menu", "itemLines").tagName).toBe("DIV");
  });
});
