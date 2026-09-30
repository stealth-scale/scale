import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { accounts, opened, picked } from "#combobox/combobox.fixtures.tsx";
import { ItemDescription } from "#combobox/item-description.ts";
import { ItemText } from "#combobox/item-text.tsx";
import { Item } from "#combobox/item.tsx";

describe("ItemDescription", () => {
  it("adds its words to the row's name", async () => {
    const [bridge] = accounts().items;

    await drawn(
      picked(
        {},
        {
          rows: (
            <Item item={bridge}>
              <ItemText item={bridge}>Bridge Ledger</ItemText>
              <ItemDescription>Clearing today</ItemDescription>
            </Item>
          ),
        },
      ),
    );
    await opened();

    expect(screen.getByRole("option", { name: /Clearing today/u })).toBeDefined();
  });
});
