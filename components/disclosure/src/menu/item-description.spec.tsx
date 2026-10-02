import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Item, ItemDescription } from "#menu/index.ts";
import { listed, rowed } from "#menu/menu.fixtures.tsx";

describe("ItemDescription", () => {
  it("renders a span", async () => {
    const { container } = await drawn(
      listed(
        <Item value="acme">
          Acme
          <ItemDescription>Pro plan</ItemDescription>
        </Item>,
      ),
    );

    expect(slotElement(container, "menu", "itemDescription").tagName).toBe("SPAN");
  });

  it("joins the row's accessible name", async () => {
    await drawn(rowed(<ItemDescription>Pro plan</ItemDescription>));

    expect(screen.getByRole("menuitem", { name: "Pro plan Acme" })).toBeDefined();
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(
      rowed(<ItemDescription as="small">Pro plan</ItemDescription>),
    );

    expect(slotElement(container, "menu", "itemDescription").tagName).toBe("SMALL");
  });
});
