import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotClass, slotElement } from "@stealthscale/testing-theme";

import { moving } from "#transfer/transfer.fixtures.tsx";

/**
 * Names the rows one side of the transfer holds.
 */
function rowsOf(side: number): readonly string[] {
  const held = screen.getAllByRole("listbox")[side];

  const words = held?.querySelectorAll(`.${slotClass("listbox", "itemText")}`) ?? [];

  return [...words].map((one) => one.textContent ?? "");
}

/**
 * Presses one row of one side.
 */
async function pick(name: string): Promise<void> {
  await pressed(screen.getByRole("option", { name: new RegExp(name, "u") }));
}

describe("Transfer", () => {
  it("draws every row on the side a reader takes from", async () => {
    await drawn(moving());

    expect(rowsOf(0)).toStrictEqual(["Invoices", "Reports", "Settings"]);
  });

  it("draws nothing on the far side until a row crosses over", async () => {
    await drawn(moving());

    expect(rowsOf(1)).toStrictEqual([]);
  });

  it("says so on the side that holds nothing", async () => {
    await drawn(moving());

    expect(screen.getByText("Nothing here.")).toBeTruthy();
  });

  it("starts with the rows a caller says have already crossed over", async () => {
    await drawn(moving({ defaultValue: ["reports"] }));

    expect(rowsOf(1)).toStrictEqual(["Reports"]);
  });

  it("holds both controls off while nothing on either side is picked", async () => {
    await drawn(moving());

    expect(screen.getAllByRole("button").every((control) => control.hasAttribute("disabled"))).toBe(
      true,
    );
  });

  it("turns on the control that takes rows across once a row is picked", async () => {
    await drawn(moving());
    await pick("Invoices");

    expect(screen.getByRole("button", { name: "Take" }).hasAttribute("disabled")).toBe(false);
  });

  it("moves the picked rows across when that control is pressed", async () => {
    await drawn(moving());
    await pick("Invoices");
    await pressed(screen.getByRole("button", { name: "Take" }));

    expect(rowsOf(1)).toStrictEqual(["Invoices"]);
  });

  it("takes the moved rows off the side they came from", async () => {
    await drawn(moving());
    await pick("Invoices");
    await pressed(screen.getByRole("button", { name: "Take" }));

    expect(rowsOf(0)).toStrictEqual(["Reports", "Settings"]);
  });

  it("clears what was picked on the side a row left", async () => {
    await drawn(moving());
    await pick("Invoices");
    await pressed(screen.getByRole("button", { name: "Take" }));

    expect(screen.getByRole("button", { name: "Give back" }).hasAttribute("disabled")).toBe(true);
  });

  it("sends a row back where the other control is pressed", async () => {
    await drawn(moving({ defaultValue: ["reports"] }));
    await pick("Reports");
    await pressed(screen.getByRole("button", { name: "Give back" }));

    expect(rowsOf(0)).toStrictEqual(["Invoices", "Reports", "Settings"]);
  });

  it("reports the set that has crossed over", async () => {
    const heard = vi.fn<(taken: readonly string[]) => void>();

    await drawn(moving({ onValueChange: heard }));
    await pick("Invoices");
    await pressed(screen.getByRole("button", { name: "Take" }));

    expect(heard).toHaveBeenCalledWith(["invoices"]);
  });

  it("follows the set a caller drives it with rather than one of its own", async () => {
    await drawn(
      moving({ onValueChange: vi.fn<(taken: readonly string[]) => void>(), value: ["settings"] }),
    );
    await pick("Invoices");
    await pressed(screen.getByRole("button", { name: "Take" }));

    expect(rowsOf(1)).toStrictEqual(["Settings"]);
  });

  it("draws a line under a row's name where a caller writes one", async () => {
    await drawn(moving({ description: (place) => `Value ${place.value}` }));

    expect(screen.getByText("Value invoices")).toBeTruthy();
  });

  it("keeps room on each side for every row there is", async () => {
    const { container } = await drawn(moving());
    const side = slotElement(container, "listbox", "content");

    expect(side.style.minBlockSize).toBe("calc(var(--listbox-row) * 3)");
  });
});
