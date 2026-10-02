import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { ItemContent } from "#radio-card/item-content.ts";
import { ItemDescription } from "#radio-card/item-description.tsx";
import { ItemText } from "#radio-card/item-text.tsx";
import { Item } from "#radio-card/item.tsx";
import { Root } from "#radio-card/root.tsx";

describe("state", () => {
  it("throws for a description rendered outside RadioCard.Item", () => {
    expect(() => render(<ItemDescription>Leaves overnight.</ItemDescription>)).toThrow(
      "RadioGroup",
    );
  });

  it("keeps the ID the caller passes to a description", async () => {
    await drawn(
      <Root aria-label="Delivery speed">
        <Item value="next">
          <ItemContent>
            <ItemText>Next day</ItemText>
            <ItemDescription id="overnight">Leaves overnight.</ItemDescription>
          </ItemContent>
        </Item>
      </Root>,
    );

    expect(screen.getByRole("radio").getAttribute("aria-describedby")).toBe("overnight");
  });

  it("drops a description's ID from the input when it unmounts", async () => {
    const { rerender } = await drawn(
      <Root aria-label="Delivery speed">
        <Item value="next">
          <ItemText>Next day</ItemText>
          <ItemDescription>Leaves overnight.</ItemDescription>
        </Item>
      </Root>,
    );

    await act(async () => {
      rerender(
        <Root aria-label="Delivery speed">
          <Item value="next">
            <ItemText>Next day</ItemText>
          </Item>
        </Root>,
      );
      await Promise.resolve();
    });

    expect(screen.getByRole("radio").getAttribute("aria-describedby")).toBeNull();
  });
});
