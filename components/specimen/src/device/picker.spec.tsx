import { type ReactElement } from "react";

import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Root } from "#device/parts.ts";
import { Picker, type PickerProps } from "#device/picker.tsx";

const NAMES = ["outline", "solid", "subtle"];

/**
 * Stands in for a caller with nothing to be told.
 */
const IGNORED = vi.fn<(position: number) => void>();

/**
 * Puts a picker where it belongs: under a device's root.
 */
function rooted(props: Partial<PickerProps> = {}): ReactElement {
  return (
    <Root>
      <Picker knob="variant" names={NAMES} onPick={IGNORED} picked={0} {...props} />
    </Root>
  );
}

describe("Picker", () => {
  it("captions the switcher with the axis it turns", async () => {
    const { container } = await drawn(rooted());

    expect(slotElement(container, "device", "picker").textContent).toContain("variant");
  });

  it("names the control after the axis and the value in the frame", async () => {
    const { getByRole } = await drawn(rooted({ picked: 1 }));

    expect(getByRole("button", { name: "variant solid" })).toBeDefined();
  });

  it("lists every value once opened and marks the one in the frame", async () => {
    const { getAllByRole, getByRole } = await drawn(rooted({ picked: 1 }));

    await pressed(getByRole("button", { name: "variant solid" }));

    const rows = getAllByRole("menuitemradio");

    expect(rows.map((row) => row.textContent)).toStrictEqual(["outline", "solid", "subtle"]);
    expect(rows.map((row) => row.getAttribute("aria-checked"))).toStrictEqual([
      "false",
      "true",
      "false",
    ]);
  });

  it("tells the position of the value picked", async () => {
    const onPick = vi.fn<(position: number) => void>();
    const { getByRole } = await drawn(rooted({ onPick }));

    await pressed(getByRole("button", { name: "variant outline" }));
    await pressed(getByRole("menuitemradio", { name: "subtle" }));

    expect(onPick).toHaveBeenCalledWith(2);
  });
});
