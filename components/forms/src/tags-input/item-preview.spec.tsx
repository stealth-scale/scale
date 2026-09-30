import { fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotClass, variantClass } from "@stealthscale/testing-theme";

import { ItemPreview } from "#tags-input/item-preview.tsx";
import { ItemText } from "#tags-input/item-text.tsx";
import { Item } from "#tags-input/item.tsx";
import {
  around,
  composed,
  field,
  focused,
  framed,
  keyed,
} from "#tags-input/tags-input.fixtures.tsx";

/**
 * Returns the preview of one tag, found by its value among the tags input's previews.
 */
function preview(value: string): HTMLElement {
  const found = document.querySelector<HTMLElement>(
    `.${slotClass("tags-input", "itemPreview")}[data-value="${value}"]`,
  );

  if (found === null) throw new Error(`No tag reads ${value}.`);

  return found;
}

describe("ItemPreview", () => {
  it("renders the library's tag", async () => {
    await drawn(composed());

    expect([...preview("Bridge Ledger").classList]).toContain(slotClass("tag", "root"));
  });

  it("gives every tag the tags input's size", async () => {
    await drawn(composed({ size: "lg" }));

    expect([...preview("Bridge Ledger").classList]).toContain(
      variantClass(slotClass("tag", "root"), "size", "lg"),
    );
  });

  it("gives every tag the medium size by default", async () => {
    await drawn(composed());

    expect([...preview("Bridge Ledger").classList]).toContain(
      variantClass(slotClass("tag", "root"), "size", "md"),
    );
  });

  it("takes the tag's look from its props", async () => {
    await drawn(
      around((value, index) => (
        <Item index={index} value={value}>
          <ItemPreview palette="primary" variant="solid">
            <ItemText />
          </ItemPreview>
        </Item>
      )),
    );

    expect([...preview("Bridge Ledger").classList]).toContain(
      variantClass(slotClass("tag", "root"), "variant", "solid"),
    );
  });

  it("marks the highlighted tag", async () => {
    await drawn(composed());
    await focused();
    await keyed("Backspace");

    expect(preview("Halden & Co").dataset["highlighted"]).toBe("");
  });

  it("highlights a tag on a press", async () => {
    await drawn(composed());
    fireEvent.pointerDown(preview("Bridge Ledger"));
    await settled();
    await framed();

    expect(preview("Bridge Ledger").dataset["highlighted"]).toBe("");
  });

  it("keeps focus in the input on a press", async () => {
    await drawn(composed());
    fireEvent.pointerDown(preview("Bridge Ledger"));
    await settled();
    await framed();

    expect(document.activeElement).toBe(field());
  });

  it("hides itself while its tag is edited", async () => {
    await drawn(composed({ editable: true }));
    fireEvent.doubleClick(preview("Bridge Ledger"));
    await settled();

    expect(preview("Bridge Ledger").hidden).toBe(true);
  });
});
