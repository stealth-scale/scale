import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotClass } from "@stealthscale/testing-theme";

import { ItemInput } from "#tags-input/item-input.tsx";
import { ItemPreview } from "#tags-input/item-preview.tsx";
import { ItemText } from "#tags-input/item-text.tsx";
import { Item } from "#tags-input/item.tsx";
import { ACCOUNTS, around, composed, framed, tags } from "#tags-input/tags-input.fixtures.tsx";

/**
 * Starts editing the first tag with a double press, whose first press highlights the tag, and
 * waits for the machine's next frame.
 *
 * @returns A promise that resolves after the frame.
 */
async function editing(): Promise<void> {
  const tag = screen.getByText("Bridge Ledger");

  fireEvent.pointerDown(tag);
  await settled();
  fireEvent.doubleClick(tag);
  await settled();
  await framed();
}

/**
 * Returns the item input of the first tag, found by its default name.
 */
function editor(): HTMLInputElement {
  return screen.getByRole<HTMLInputElement>("textbox", { name: "Edit Bridge Ledger" });
}

/**
 * Types text into the item input and presses a key in it.
 *
 * @param text - The whole text of the item input.
 * @param key - The key to press after typing.
 * @returns A promise that resolves after the machine's next frame.
 */
async function saved(text: string, key: string): Promise<void> {
  fireEvent.input(editor(), { target: { value: text } });
  await settled();
  fireEvent.keyDown(editor(), { key });
  await settled();
  await framed();
}

describe("ItemInput", () => {
  it("shows the input named after its tag while the tag is edited", async () => {
    await drawn(composed({ editable: true }));
    await editing();

    expect(editor().hidden).toBe(false);
  });

  it("starts the input with the tag's text", async () => {
    await drawn(composed({ editable: true }));
    await editing();

    expect(editor().value).toBe("Bridge Ledger");
  });

  it("takes its name from label", async () => {
    await drawn(
      around(
        (value, index) => (
          <Item index={index} value={value}>
            <ItemPreview>
              <ItemText />
            </ItemPreview>
            <ItemInput label={`Rename ${value}`} />
          </Item>
        ),
        { editable: true },
      ),
    );
    await editing();

    expect(screen.getByRole("textbox", { name: "Rename Bridge Ledger" })).toBeDefined();
  });

  it("saves the edited tag on Enter", async () => {
    const { container } = await drawn(composed({ editable: true }));

    await editing();
    await saved("Bridge Ledger Ltd", "Enter");

    expect(tags(container)).toStrictEqual(["Bridge Ledger Ltd", "Halden & Co"]);
  });

  it("restores the tag on Escape", async () => {
    const { container } = await drawn(composed({ editable: true }));

    await editing();
    await saved("Bridge", "Escape");

    expect(tags(container)).toStrictEqual(ACCOUNTS);
  });

  it("removes a tag saved empty", async () => {
    const { container } = await drawn(composed({ editable: true }));

    await editing();
    await saved("", "Enter");

    expect(tags(container)).toStrictEqual(["Halden & Co"]);
  });

  it("is read-only in a read-only tags input", async () => {
    const { container } = await drawn(composed({ editable: true, readOnly: true }));

    expect(
      container.querySelector<HTMLInputElement>(`.${slotClass("tags-input", "itemInput")}`)
        ?.readOnly,
    ).toBe(true);
  });
});
