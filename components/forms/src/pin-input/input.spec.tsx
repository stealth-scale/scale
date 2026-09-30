import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { Control } from "#pin-input/control.tsx";
import { Input } from "#pin-input/input.tsx";
import { type ValueInvalidDetails } from "#pin-input/machine.ts";
import { box, boxes, composed, focused, framed, typed } from "#pin-input/pin-input.fixtures.tsx";
import { Root } from "#pin-input/root.tsx";

/**
 * Focuses a box, presses one key in it and waits for the machine to move focus.
 *
 * @param place - Place of the box to press the key in.
 * @param key - The key to press.
 * @returns A promise that resolves once focus has moved.
 */
async function keyed(place: number, key: string): Promise<void> {
  await focused(box(place));
  fireEvent.keyDown(box(place), { key });
  await settled();
}

describe("Input", () => {
  it("names each box by its place in the code", async () => {
    await drawn(composed());

    expect(boxes().map((each) => each.getAttribute("aria-label"))).toStrictEqual([
      "Character 1 of 4",
      "Character 2 of 4",
      "Character 3 of 4",
      "Character 4 of 4",
    ]);
  });

  it("takes its name from label", async () => {
    await drawn(
      <Root aria-label="Code" count={1}>
        <Control>
          <Input index={0} label="Digit 1 of 1" />
        </Control>
      </Root>,
    );

    expect(screen.getByRole("textbox", { name: "Digit 1 of 1" })).toBeDefined();
  });

  it("puts only the first empty box in the tab order", async () => {
    await drawn(composed({ defaultValue: ["1"] }));

    expect(boxes().map((each) => each.tabIndex)).toStrictEqual([-1, 0, -1, -1]);
  });

  it("renders a box of type tel for a numeric code", async () => {
    await drawn(composed());

    expect(box(0).type).toBe("tel");
  });

  it("renders a box of type text for an alphanumeric code", async () => {
    await drawn(composed({ type: "alphanumeric" }));

    expect(box(0).type).toBe("text");
  });

  it("renders a box of type password for a masked code", async () => {
    const { container } = await drawn(composed({ mask: true }));

    expect(container.querySelector('input[data-index="0"]')?.getAttribute("type")).toBe("password");
  });

  it("asks for a one-time code when otp is set", async () => {
    await drawn(composed({ otp: true }));

    expect(box(0).autocomplete).toBe("one-time-code");
  });

  it("moves focus to the next box after a character", async () => {
    await drawn(composed());
    await focused(box(0));
    await typed(box(0), "4");
    await settled();

    expect(document.activeElement).toBe(box(1));
  });

  it("fills every box from a pasted code", async () => {
    await drawn(composed());
    await focused(box(0));
    fireEvent.paste(box(0), { clipboardData: { getData: () => "4071" } });
    await framed();

    expect(boxes().map((each) => each.value)).toStrictEqual(["4", "0", "7", "1"]);
  });

  it("calls onValueInvalid with a pasted value the type refuses", async () => {
    const refused = vi.fn<(details: ValueInvalidDetails) => void>();

    await drawn(composed({ onValueInvalid: refused }));
    await focused(box(0));
    fireEvent.paste(box(0), { clipboardData: { getData: () => "40a1" } });
    await settled();

    expect(refused).toHaveBeenCalledWith({ index: 0, value: "40a1" });
  });

  it("clears the box and moves back on Backspace", async () => {
    await drawn(composed({ defaultValue: ["4", "0"] }));
    await keyed(1, "Backspace");

    expect([box(1).value, document.activeElement === box(0)]).toStrictEqual(["", true]);
  });

  it("moves focus back on ArrowLeft", async () => {
    await drawn(composed({ defaultValue: ["4", "0"] }));
    await keyed(1, "ArrowLeft");

    expect(document.activeElement).toBe(box(0));
  });

  it("moves focus to the last filled box on End", async () => {
    await drawn(composed({ defaultValue: ["4", "0", "7"] }));
    await keyed(0, "End");

    expect(document.activeElement).toBe(box(2));
  });

  it("moves focus to the first box on Home", async () => {
    await drawn(composed({ defaultValue: ["4", "0", "7"] }));
    await keyed(2, "Home");

    expect(document.activeElement).toBe(box(0));
  });

  it("disables every box of a disabled code", async () => {
    await drawn(composed({ disabled: true }));

    expect(boxes().every((each) => each.disabled)).toBe(true);
  });
});
