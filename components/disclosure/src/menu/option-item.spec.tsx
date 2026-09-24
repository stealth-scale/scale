import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { grouped, listed, optioned } from "#menu/menu.fixtures.tsx";
import { OptionItem } from "#menu/option-item.tsx";

describe("OptionItem", () => {
  it("renders a div", async () => {
    const { container } = await drawn(
      listed(
        <OptionItem checked type="checkbox" value="gridlines">
          Gridlines
        </OptionItem>,
      ),
    );

    expect(slotElement(container, "menu", "item").tagName).toBe("DIV");
  });

  it("sets role menuitemcheckbox for type checkbox", async () => {
    await drawn(grouped({ defaultOpen: true }));

    expect(screen.getByRole("menuitemcheckbox", { name: "Gridlines" })).toBeDefined();
  });

  it("sets role menuitemradio for type radio", async () => {
    await drawn(grouped({ defaultOpen: true }));

    expect(screen.getByRole("menuitemradio", { name: "Comfortable" })).toBeDefined();
  });

  it("sets aria-checked to its checked state", async () => {
    await drawn(grouped({ defaultOpen: true }));

    expect(
      screen.getByRole("menuitemradio", { name: "Comfortable" }).getAttribute("aria-checked"),
    ).toBe("true");
    expect(
      screen.getByRole("menuitemradio", { name: "Compact" }).getAttribute("aria-checked"),
    ).toBe("false");
  });

  it("sets data-state checked on a checked row", async () => {
    await drawn(grouped({ defaultOpen: true }));

    expect(screen.getByRole("menuitemradio", { name: "Comfortable" }).dataset["state"]).toBe(
      "checked",
    );
  });

  it("sets data-type to its type", async () => {
    await drawn(grouped({ defaultOpen: true }));

    expect(screen.getByRole("menuitemcheckbox", { name: "Gridlines" }).dataset["type"]).toBe(
      "checkbox",
    );
  });

  it("calls onCheckedChange with false when a checked row is pressed", async () => {
    const told = vi.fn<(checked: boolean) => void>();

    await drawn(optioned(told, { defaultOpen: true }));
    await pressed(screen.getByRole("menuitemcheckbox", { name: "Gridlines" }));

    expect(told).toHaveBeenLastCalledWith(false);
  });

  it("sets aria-disabled when disabled", async () => {
    const { container } = await drawn(
      listed(
        <OptionItem checked disabled type="checkbox" value="gridlines">
          Gridlines
        </OptionItem>,
      ),
    );

    expect(slotElement(container, "menu", "item").getAttribute("aria-disabled")).toBe("true");
  });

  it("sets data-valuetext to its valueText", async () => {
    const { container } = await drawn(
      listed(
        <OptionItem checked type="checkbox" value="gridlines" valueText="Show the grid">
          Gridlines
        </OptionItem>,
      ),
    );

    expect(slotElement(container, "menu", "item").dataset["valuetext"]).toBe("Show the grid");
  });

  it("keeps the menu open with closeOnSelect false", async () => {
    const told = vi.fn<(checked: boolean) => void>();

    await drawn(optioned(told, { defaultOpen: true }));
    await pressed(screen.getByRole("menuitemcheckbox", { name: "Gridlines" }));

    expect(screen.getByRole("menu")).toBeDefined();
  });

  it("sets data-tone to its tone", async () => {
    const { container } = await drawn(
      listed(
        <OptionItem checked tone="critical" type="checkbox" value="purge">
          Purge on save
        </OptionItem>,
      ),
    );

    expect(slotElement(container, "menu", "item").dataset["tone"]).toBe("critical");
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(
      listed(
        <OptionItem as="label" checked type="checkbox" value="gridlines">
          Gridlines
        </OptionItem>,
      ),
    );

    expect(slotElement(container, "menu", "item").tagName).toBe("LABEL");
  });
});
