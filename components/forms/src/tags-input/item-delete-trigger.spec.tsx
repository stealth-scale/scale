import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { ItemDeleteTrigger } from "#tags-input/item-delete-trigger.tsx";
import { ItemPreview } from "#tags-input/item-preview.tsx";
import { ItemText } from "#tags-input/item-text.tsx";
import { Item } from "#tags-input/item.tsx";
import { around, composed, field, framed, tags } from "#tags-input/tags-input.fixtures.tsx";

/**
 * Returns the delete trigger of the second tag, found by its default name.
 */
function remover(): HTMLButtonElement {
  return screen.getByRole<HTMLButtonElement>("button", { name: "Remove Halden & Co" });
}

describe("ItemDeleteTrigger", () => {
  it("names the button after its tag", async () => {
    await drawn(composed());

    expect(remover().tagName).toBe("BUTTON");
  });

  it("takes its name from label", async () => {
    await drawn(
      around((value, index) => (
        <Item index={index} value={value}>
          <ItemPreview>
            <ItemText />
            <ItemDeleteTrigger label={`Drop ${value}`} />
          </ItemPreview>
        </Item>
      )),
    );

    expect(screen.getByRole("button", { name: "Drop Halden & Co" })).toBeDefined();
  });

  it("leaves the tab order", async () => {
    await drawn(composed());

    expect(remover().tabIndex).toBe(-1);
  });

  it("removes its tag on a press", async () => {
    const { container } = await drawn(composed());

    fireEvent.click(remover());
    await settled();

    expect(tags(container)).toStrictEqual(["Bridge Ledger"]);
  });

  it("returns focus to the input after a press", async () => {
    await drawn(composed());
    fireEvent.click(remover());
    await settled();
    await framed();

    expect(document.activeElement).toBe(field());
  });

  it("hides itself in a read-only tags input", async () => {
    await drawn(composed({ readOnly: true }));

    expect(screen.queryByRole("button", { name: "Remove Halden & Co" })).toBeNull();
  });

  it("is disabled with the tags input", async () => {
    await drawn(composed({ disabled: true }));

    expect(remover().disabled).toBe(true);
  });
});
