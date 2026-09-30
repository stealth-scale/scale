import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { composed, toggled } from "#accordion/accordion.fixtures.tsx";
import { recipe } from "#accordion/recipe.ts";
import { type RootProps } from "#accordion/root.tsx";

/**
 * Returns the trigger named by the title passed.
 *
 * @param name - The trigger's title.
 * @returns The `button` element.
 */
function trigger(name: string): HTMLElement {
  return screen.getByRole("button", { name });
}

describe("Root", () => {
  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(() => composed({ defaultValue: ["delivery"] })),
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

  it("renders a div without a role", async () => {
    const { container } = await drawn(composed());
    const root = slotElement(container, "accordion", "root");

    expect([root.tagName, root.hasAttribute("role")]).toStrictEqual(["DIV", false]);
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(composed({ as: "section" }));

    expect(slotElement(container, "accordion", "root").tagName).toBe("SECTION");
  });

  it("starts with every item closed", async () => {
    await drawn(composed());

    expect(
      screen.getAllByRole("button").map((button) => button.getAttribute("aria-expanded")),
    ).toStrictEqual(["false", "false", "false"]);
  });

  it("opens the items defaultValue names", async () => {
    await drawn(composed({ defaultValue: ["returns policy"] }));

    expect(trigger("Returns policy").getAttribute("aria-expanded")).toBe("true");
  });

  it("opens an item on a press of its trigger", async () => {
    await drawn(composed());
    await toggled(trigger("Delivery"));

    expect(trigger("Delivery").getAttribute("aria-expanded")).toBe("true");
  });

  it("closes the open item when another opens", async () => {
    await drawn(composed({ defaultValue: ["delivery"] }));
    await toggled(trigger("Abroad"));

    expect(trigger("Delivery").getAttribute("aria-expanded")).toBe("false");
  });

  it("keeps the open item open on a second press without collapsible", async () => {
    await drawn(composed({ defaultValue: ["delivery"] }));
    await toggled(trigger("Delivery"));

    expect(trigger("Delivery").getAttribute("aria-expanded")).toBe("true");
  });

  it("closes the open item on a second press with collapsible", async () => {
    await drawn(composed({ collapsible: true, defaultValue: ["delivery"] }));
    await toggled(trigger("Delivery"));

    expect(trigger("Delivery").getAttribute("aria-expanded")).toBe("false");
  });

  it("keeps the open item open when another opens with multiple", async () => {
    await drawn(composed({ defaultValue: ["delivery"], multiple: true }));
    await toggled(trigger("Abroad"));

    expect(trigger("Delivery").getAttribute("aria-expanded")).toBe("true");
  });

  it("calls onValueChange with the open values", async () => {
    const told = vi.fn<(details: { readonly value: string[] }) => void>();

    await drawn(composed({ multiple: true, onValueChange: told }));
    await toggled(trigger("Delivery"));
    await toggled(trigger("Returns policy"));

    expect(told).toHaveBeenLastCalledWith({ value: ["delivery", "returns policy"] });
  });

  it("keeps a controlled value on a press", async () => {
    await drawn(composed({ value: ["delivery"] }));
    await toggled(trigger("Abroad"));

    expect(trigger("Abroad").getAttribute("aria-expanded")).toBe("false");
  });

  it("disables every trigger while disabled", async () => {
    await drawn(composed({ disabled: true }));

    expect(screen.getAllByRole("button").every((button) => button.hasAttribute("disabled"))).toBe(
      true,
    );
  });

  it("generates a distinct id for each root without the prop", async () => {
    const { container } = await drawn(
      <>
        {composed()}
        {composed()}
      </>,
    );
    const ids = [...container.querySelectorAll("[data-scope=accordion][data-part=root]")].map(
      (root) => root.id,
    );

    expect(new Set(ids).size).toBe(2);
  });
});
