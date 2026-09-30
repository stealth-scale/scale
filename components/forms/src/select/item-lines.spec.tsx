import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { ItemDescription } from "#select/item-description.ts";
import { ItemLines } from "#select/item-lines.ts";
import { ItemText } from "#select/item-text.tsx";
import { Item } from "#select/item.tsx";
import { accounts, opened, picked } from "#select/select.fixtures.tsx";

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
