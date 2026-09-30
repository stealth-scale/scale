import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { ItemDescription } from "#select/item-description.ts";
import { ItemLines } from "#select/item-lines.ts";
import { ItemText } from "#select/item-text.tsx";
import { Item } from "#select/item.tsx";
import { accounts, opened, picked } from "#select/select.fixtures.tsx";

describe("ItemDescription", () => {
  it("renders a span", async () => {
    const [bridge] = accounts().items;

    await drawn(
      picked(
        {},
        {
          rows: (
            <Item item={bridge}>
              <ItemLines>
                <ItemText item={bridge}>Bridge Ledger</ItemText>
                <ItemDescription>Clearing today</ItemDescription>
              </ItemLines>
            </Item>
          ),
        },
      ),
    );
    await opened();

    expect(slotElement(screen.getByRole("option"), "select", "itemDescription").tagName).toBe(
      "SPAN",
    );
  });

  it("adds its words to the row's name", async () => {
    const [bridge] = accounts().items;

    await drawn(
      picked(
        {},
        {
          rows: (
            <Item item={bridge}>
              <ItemLines>
                <ItemText item={bridge}>Bridge Ledger</ItemText>
                <ItemDescription>Clearing today</ItemDescription>
              </ItemLines>
            </Item>
          ),
        },
      ),
    );
    await opened();

    expect(screen.getByRole("option", { name: /Clearing today/u })).toBeDefined();
  });
});
