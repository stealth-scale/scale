import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotClass, slotElement, slotVariantClass } from "@stealthscale/testing-theme";

import { moving } from "#transfer/transfer.fixtures.tsx";

/**
 * Returns the text of each row on one side.
 */
function rowsOf(side: number): readonly string[] {
  const held = screen.getAllByRole("listbox")[side];

  const words = held?.querySelectorAll(`.${slotClass("listbox", "itemText")}`) ?? [];

  return [...words].map((one) => one.textContent ?? "");
}

/**
 * Presses the row whose name matches.
 */
async function pick(name: string): Promise<void> {
  await pressed(screen.getByRole("option", { name: new RegExp(name, "u") }));
}

describe("Transfer", () => {
  it("renders every row on the first side", async () => {
    await drawn(moving());

    expect(rowsOf(0)).toStrictEqual(["Invoices", "Reports", "Settings"]);
  });

  it("renders no row on the second side", async () => {
    await drawn(moving());

    expect(rowsOf(1)).toStrictEqual([]);
  });

  it("renders the empty content on a side with no rows", async () => {
    await drawn(moving());

    expect(screen.getByText("Nothing here.")).toBeTruthy();
  });

  it("renders the rows of defaultValue on the second side", async () => {
    await drawn(moving({ defaultValue: ["reports"] }));

    expect(rowsOf(1)).toStrictEqual(["Reports"]);
  });

  it("disables both controls while no row is checked", async () => {
    await drawn(moving());

    expect(screen.getAllByRole("button").every((control) => control.hasAttribute("disabled"))).toBe(
      true,
    );
  });

  it("enables the take control once a row is checked", async () => {
    await drawn(moving());
    await pick("Invoices");

    expect(screen.getByRole("button", { name: "Take" }).hasAttribute("disabled")).toBe(false);
  });

  it("moves the checked rows to the second side on take", async () => {
    await drawn(moving());
    await pick("Invoices");
    await pressed(screen.getByRole("button", { name: "Take" }));

    expect(rowsOf(1)).toStrictEqual(["Invoices"]);
  });

  it("removes the moved rows from the first side", async () => {
    await drawn(moving());
    await pick("Invoices");
    await pressed(screen.getByRole("button", { name: "Take" }));

    expect(rowsOf(0)).toStrictEqual(["Reports", "Settings"]);
  });

  it("leaves no row checked after a move", async () => {
    await drawn(moving());
    await pick("Invoices");
    await pressed(screen.getByRole("button", { name: "Take" }));

    expect(screen.getByRole("button", { name: "Give back" }).hasAttribute("disabled")).toBe(true);
  });

  it("moves the checked rows back on give back", async () => {
    await drawn(moving({ defaultValue: ["reports"] }));
    await pick("Reports");
    await pressed(screen.getByRole("button", { name: "Give back" }));

    expect(rowsOf(0)).toStrictEqual(["Invoices", "Reports", "Settings"]);
  });

  it("calls onValueChange with the moved values", async () => {
    const heard = vi.fn<(taken: readonly string[]) => void>();

    await drawn(moving({ onValueChange: heard }));
    await pick("Invoices");
    await pressed(screen.getByRole("button", { name: "Take" }));

    expect(heard).toHaveBeenCalledWith(["invoices"]);
  });

  it("renders the rows of value when the caller controls it", async () => {
    await drawn(
      moving({ onValueChange: vi.fn<(taken: readonly string[]) => void>(), value: ["settings"] }),
    );
    await pick("Invoices");
    await pressed(screen.getByRole("button", { name: "Take" }));

    expect(rowsOf(1)).toStrictEqual(["Settings"]);
  });

  it("renders a row's description", async () => {
    await drawn(moving({ description: (place) => `Value ${place.value}` }));

    expect(screen.getByText("Value invoices")).toBeTruthy();
  });

  it("sets --transfer-rows on each side to the number of rows", async () => {
    const { container } = await drawn(moving());
    const side = slotElement(container, "transfer", "side");

    expect(side.style.getPropertyValue("--transfer-rows")).toBe("3");
  });

  it("applies the size class to the root", async () => {
    const { container } = await drawn(moving({ size: "sm" }));

    expect(slotElement(container, "transfer", "root").classList).toContain(
      slotVariantClass("transfer", "root", "size", "sm"),
    );
  });

  it("applies the md size class by default", async () => {
    const { container } = await drawn(moving());

    expect(slotElement(container, "transfer", "root").classList).toContain(
      slotVariantClass("transfer", "root", "size", "md"),
    );
  });

  it("applies the palette class to the root", async () => {
    const { container } = await drawn(moving({ palette: "success" }));

    expect(slotElement(container, "transfer", "root").classList).toContain(
      slotVariantClass("transfer", "root", "palette", "success"),
    );
  });
});
