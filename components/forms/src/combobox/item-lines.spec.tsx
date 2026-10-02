import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { accounts, opened, picked } from "#combobox/combobox.fixtures.tsx";
import { ItemDescription } from "#combobox/item-description.ts";
import { ItemLines } from "#combobox/item-lines.ts";
import { ItemText } from "#combobox/item-text.tsx";
import { Item } from "#combobox/item.tsx";

describe("ItemLines", () => {
  it("renders a span that contains the text and the description", async () => {
    const [bridge] = accounts().items;

    await drawn(
      picked(
        {},
        {
          rows: (
            <Item item={bridge}>
              <ItemLines data-testid="lines">
                <ItemText item={bridge}>Bridge Ledger</ItemText>
                <ItemDescription>Clearing today</ItemDescription>
              </ItemLines>
            </Item>
          ),
        },
      ),
    );
    await opened();

    expect(screen.getByTestId("lines").childElementCount).toBe(2);
  });
});
