import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, settled } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { type ValueChangeDetails } from "#navigation-menu/machine.ts";
import { composed, framed, observed, viewed } from "#navigation-menu/navigation-menu.fixtures.tsx";
import { recipe } from "#navigation-menu/recipe.ts";
import { type RootProps } from "#navigation-menu/root.tsx";

describe("Root", () => {
  it("returns no accessibility violation", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation with a panel open in place", async () => {
    await expect(
      accessibilityViolations(() => composed({ defaultValue: "products" })),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(composed(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("renders a nav", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "navigation-menu", "root").tagName).toBe("NAV");
  });

  it("names the landmark by aria-label", async () => {
    await drawn(composed());

    expect(screen.getByRole("navigation", { name: "Site" })).toBeDefined();
  });

  it("starts with every item closed", async () => {
    await drawn(composed());

    expect(
      screen.getAllByRole("button").map((trigger) => trigger.getAttribute("aria-expanded")),
    ).toStrictEqual(["false", "false"]);
  });

  it("opens the item of defaultValue", async () => {
    await drawn(composed({ defaultValue: "company" }));

    expect(screen.getByRole("button", { name: "Company" }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });

  it("calls onValueChange with the value of the item a press opens", async () => {
    const changed = vi.fn<(details: ValueChangeDetails) => void>();

    await drawn(composed({ onValueChange: changed }));
    fireEvent.click(screen.getByRole("button", { name: "Products" }));
    await settled();

    expect(changed).toHaveBeenLastCalledWith({ value: "products" });
  });

  it("keeps a controlled value on a press", async () => {
    await drawn(composed({ value: "products" }));
    fireEvent.click(screen.getByRole("button", { name: "Products" }));
    await settled();

    expect(screen.getByRole("button", { name: "Products" }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });

  it("writes the open trigger's width as --trigger-width", async () => {
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(80);
    const resized = observed();
    const { container } = await drawn(viewed({ defaultValue: "products" }));

    resized();
    await framed();

    expect(
      slotElement(container, "navigation-menu", "root").style.getPropertyValue("--trigger-width"),
    ).toBe("80px");
  });
});
