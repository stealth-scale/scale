import { act, fireEvent, screen } from "@testing-library/react";
import { parseColor } from "@zag-js/color-utils";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { framed, opened, picker, trigger } from "#color-picker/color-picker.fixtures.tsx";
import { colorOf, idsOf, splitColorPickerProps } from "#color-picker/machine.ts";

/**
 * Waits for the machine to watch for a press outside the panel, which it starts one task after
 * the panel opens.
 *
 * @returns A promise that resolves once the machine watches.
 */
async function watched(): Promise<void> {
  await act(
    () =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, 20);
      }),
  );
}

/**
 * Presses an element outside the panel and waits for the machine to close it.
 *
 * @param element - The element pressed.
 * @returns A promise that resolves once the panel has closed.
 */
async function pressedOutside(element: Element): Promise<void> {
  fireEvent.pointerDown(element, { button: 0, pointerType: "mouse" });
  await framed();
  await settled();
}

describe("machine", () => {
  it("parses a color passed as a string", () => {
    expect(colorOf("#2563EB")?.toString("hex")).toBe("#2563EB");
  });

  it("returns a Color unchanged", () => {
    const color = parseColor("#2563EB");

    expect(colorOf(color)).toBe(color);
  });

  it("returns nothing for no color", () => {
    expect(colorOf()).toBeUndefined();
  });

  it("builds every ID from the machine's ID", () => {
    expect(idsOf("brand")).toStrictEqual({
      content: "color-picker:brand:content",
      field: "color-picker:brand:field",
      hiddenInput: "color-picker:brand:hidden-input",
      label: "color-picker:brand:label",
      trigger: "color-picker:brand:trigger",
    });
  });

  it("gives the hidden input the ID of the field's control", () => {
    expect(idsOf("brand", undefined, "field-control").hiddenInput).toBe("field-control");
  });

  it("keeps an ID the caller states", () => {
    expect(idsOf("brand", { trigger: "brand-trigger" }).trigger).toBe("brand-trigger");
  });

  it("splits the machine's options from the element's props", () => {
    expect(splitColorPickerProps({ defaultValue: "#2563EB", title: "Brand" })).toStrictEqual([
      { defaultValue: "#2563EB" },
      { title: "Brand" },
    ]);
  });

  it("opens the panel under the trigger's end", async () => {
    await drawn(picker());
    await opened();

    expect(trigger().dataset["placement"]).toBe("bottom-end");
  });

  it("returns focus to the trigger after a press on nothing focusable outside", async () => {
    await drawn(picker());
    await opened();
    await watched();
    await pressedOutside(document.body);

    expect(document.activeElement).toBe(trigger());
  });

  it("leaves focus on a control pressed outside", async () => {
    await drawn(
      <>
        {picker()}
        <input aria-label="Name" />
      </>,
    );
    await opened();
    await watched();

    const other = screen.getByRole("textbox", { name: "Name" });

    act(() => {
      other.focus();
    });
    await pressedOutside(other);

    expect(document.activeElement).toBe(other);
  });

  it("closes the panel on a press outside", async () => {
    await drawn(picker());
    await opened();
    await watched();
    await pressedOutside(document.body);

    expect(trigger().getAttribute("aria-expanded")).toBe("false");
  });

  it("keeps the panel open when the caller cancels the press outside", async () => {
    await drawn(
      picker({
        onInteractOutside: (event) => {
          event.preventDefault();
        },
      }),
    );
    await opened();
    await watched();
    await pressedOutside(document.body);

    expect(trigger().getAttribute("aria-expanded")).toBe("true");
  });
});
