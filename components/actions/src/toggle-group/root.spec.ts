import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { recipeElement, variantClass } from "@stealthscale/testing-theme";

import { composed, pressed } from "#toggle-group/toggle-group.fixtures.tsx";

describe("Root", () => {
  it("returns no accessibility violation for a single-select group", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation for a multiple-select group", async () => {
    await expect(
      accessibilityViolations(() => composed({ multiple: true })),
    ).resolves.toStrictEqual([]);
  });

  it("renders a radiogroup when multiple is absent", async () => {
    await drawn(composed());

    expect(screen.getByRole("radiogroup", { name: "Text style" })).toBeDefined();
  });

  it("renders a group when multiple is true", async () => {
    await drawn(composed({ multiple: true }));

    expect(screen.getByRole("group", { name: "Text style" })).toBeDefined();
  });

  it("renders an attached group by default", async () => {
    const { container } = await drawn(composed());

    expect([...recipeElement(container, "group").classList]).toContain(
      variantClass("group", "attached", true),
    );
  });

  it("renders a spaced group when attached is false", async () => {
    const { container } = await drawn(composed({ attached: false }));

    expect([...recipeElement(container, "group").classList]).not.toContain(
      variantClass("group", "attached", true),
    );
  });

  it("stacks the group when orientation is vertical", async () => {
    const { container } = await drawn(composed({ orientation: "vertical" }));

    expect([...recipeElement(container, "group").classList]).toContain(
      variantClass("group", "orientation", "vertical"),
    );
  });

  it("gives every item the size the root passes", async () => {
    const { container } = await drawn(composed({ size: "sm" }));

    expect(
      [...container.querySelectorAll("button")].every((item) =>
        item.classList.contains(variantClass("button", "size", "sm")),
      ),
    ).toBe(true);
  });

  it("calls onValueChange with the values of the items that are on", async () => {
    const heard = vi.fn<(details: { value: string[] }) => void>();

    await drawn(composed({ defaultValue: ["Bold"], multiple: true, onValueChange: heard }));
    await pressed(screen.getByRole("button", { name: "Italic" }));

    expect(heard).toHaveBeenCalledWith({ value: ["Bold", "Italic"] });
  });

  it("turns the item off on a second press when deselectable is absent", async () => {
    await drawn(composed({ defaultValue: ["Bold"] }));
    await pressed(screen.getByRole("radio", { name: "Bold" }));

    expect(screen.getByRole("radio", { name: "Bold" }).getAttribute("aria-checked")).toBe("false");
  });

  it("keeps the item on after a second press when deselectable is false", async () => {
    await drawn(composed({ defaultValue: ["Bold"], deselectable: false }));
    await pressed(screen.getByRole("radio", { name: "Bold" }));

    expect(screen.getByRole("radio", { name: "Bold" }).getAttribute("aria-checked")).toBe("true");
  });
});
