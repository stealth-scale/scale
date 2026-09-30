import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, settled } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#tabs/recipe.ts";
import { type RootProps } from "#tabs/root.tsx";
import { composed } from "#tabs/tabs.fixtures.tsx";

describe("Root", () => {
  it("returns no accessibility violation", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
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

  it("sets no role", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "tabs", "root").hasAttribute("role")).toBe(false);
  });

  it("selects the defaultValue tab", async () => {
    await drawn(composed());

    expect(screen.getByRole("tab", { name: "First" }).getAttribute("aria-selected")).toBe("true");
  });

  it("selects a tab on a press", async () => {
    await drawn(composed());
    fireEvent.click(screen.getByRole("tab", { name: "Second" }));
    await settled();

    expect(screen.getByRole("tab", { name: "Second" }).getAttribute("aria-selected")).toBe("true");
  });

  it("calls onValueChange with the new value", async () => {
    const told = vi.fn<(details: { readonly value: null | string }) => void>();

    await drawn(composed({ onValueChange: told }));
    fireEvent.click(screen.getByRole("tab", { name: "Second" }));
    await settled();

    expect(told).toHaveBeenLastCalledWith(expect.objectContaining({ value: "second" }));
  });

  it("keeps a controlled value on a press", async () => {
    await drawn(composed({ value: "second" }));
    fireEvent.click(screen.getByRole("tab", { name: "First" }));
    await settled();

    expect(screen.getByRole("tab", { name: "Second" }).getAttribute("aria-selected")).toBe("true");
  });

  it("deselects the selected tab on a press under deselectable", async () => {
    await drawn(composed({ deselectable: true }));
    fireEvent.click(screen.getByRole("tab", { name: "First" }));
    await settled();

    expect(screen.getByRole("tab", { name: "First" }).getAttribute("aria-selected")).toBe("false");
  });

  it("ignores a press on a disabled tab", async () => {
    await drawn(composed());
    fireEvent.click(screen.getByRole("tab", { name: "Third" }));
    await settled();

    expect(screen.getByRole("tab", { name: "Third" }).getAttribute("aria-selected")).toBe("false");
  });

  it("sets data-orientation", async () => {
    const { container } = await drawn(composed({ orientation: "vertical" }));

    expect(slotElement(container, "tabs", "root").dataset["orientation"]).toBe("vertical");
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(composed({ as: "section" }));

    expect(slotElement(container, "tabs", "root").tagName).toBe("SECTION");
  });
});
