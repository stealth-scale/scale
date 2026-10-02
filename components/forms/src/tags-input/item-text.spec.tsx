import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotClass } from "@stealthscale/testing-theme";

import { ItemPreview } from "#tags-input/item-preview.tsx";
import { ItemText } from "#tags-input/item-text.tsx";
import { Item } from "#tags-input/item.tsx";
import { around, composed } from "#tags-input/tags-input.fixtures.tsx";

describe("ItemText", () => {
  it("renders the tag in the tag's label", async () => {
    await drawn(composed());

    expect([...screen.getByText("Halden & Co").classList]).toContain(slotClass("tag", "label"));
  });

  it("renders the children the caller passes in place of the tag", async () => {
    await drawn(
      around((value, index) => (
        <Item index={index} value={value}>
          <ItemPreview>
            <ItemText>{value.toUpperCase()}</ItemText>
          </ItemPreview>
        </Item>
      )),
    );

    expect(screen.getByText("HALDEN & CO")).toBeDefined();
  });
});
