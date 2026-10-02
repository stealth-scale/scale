import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { ItemDeleteTrigger } from "#tags-input/item-delete-trigger.tsx";
import { ItemPreview } from "#tags-input/item-preview.tsx";
import { ItemText } from "#tags-input/item-text.tsx";
import { Item } from "#tags-input/item.tsx";
import { around, composed } from "#tags-input/tags-input.fixtures.tsx";

describe("Item", () => {
  it("renders a span", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "tags-input", "item").tagName).toBe("SPAN");
  });

  it("provides its tag to the parts inside it", async () => {
    await drawn(composed());

    expect(
      screen.getByText("Halden & Co").closest<HTMLElement>("[data-value]")?.dataset["value"],
    ).toBe("Halden & Co");
  });

  it("disables the delete trigger of a disabled item", async () => {
    await drawn(
      around((value, index) => (
        <Item disabled={index === 0} index={index} value={value}>
          <ItemPreview>
            <ItemText />
            <ItemDeleteTrigger />
          </ItemPreview>
        </Item>
      )),
    );

    expect(
      screen.getByRole<HTMLButtonElement>("button", { name: "Remove Bridge Ledger" }).disabled,
    ).toBe(true);
  });

  it("leaves the delete trigger of an item that states no disabled enabled", async () => {
    await drawn(composed());

    expect(
      screen.getByRole<HTMLButtonElement>("button", { name: "Remove Bridge Ledger" }).disabled,
    ).toBe(false);
  });
});
