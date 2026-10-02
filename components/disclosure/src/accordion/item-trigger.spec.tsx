import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { composed, itemed, toggled } from "#accordion/accordion.fixtures.tsx";
import { ItemTrigger } from "#accordion/item-trigger.tsx";
import { recipe } from "#accordion/recipe.ts";
import { type RootProps } from "#accordion/root.tsx";

/**
 * Focuses the trigger named by the title passed and presses a key on it.
 *
 * @param name - The trigger's title.
 * @param key - The key to press.
 * @returns A promise that settles after the machine's update.
 */
async function keyed(name: string, key: string): Promise<void> {
  const trigger = screen.getByRole("button", { name });

  act(() => {
    trigger.focus();
  });
  await settled();
  fireEvent.keyDown(trigger, { key });
  await settled();
}

/**
 * Returns the title of the element that has focus.
 *
 * @returns The text of the focused element.
 */
function focused(): null | string | undefined {
  return document.activeElement?.textContent;
}

describe("ItemTrigger", () => {
  it("renders a button", async () => {
    const { container } = await drawn(itemed(<ItemTrigger>Delivery</ItemTrigger>));

    expect(slotElement(container, "accordion", "itemTrigger").tagName).toBe("BUTTON");
  });

  it("applies the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(composed(props))).container,
        { slot: "itemTrigger" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("sets aria-controls to the ID of its content", async () => {
    const { container } = await drawn(composed());

    expect(screen.getByRole("button", { name: "Delivery" }).getAttribute("aria-controls")).toBe(
      slotElement(container, "accordion", "itemContent").id,
    );
  });

  it("builds an aria-controls without a space from a value with one", async () => {
    await drawn(composed());

    expect(
      screen.getByRole("button", { name: "Returns policy" }).getAttribute("aria-controls"),
    ).not.toContain(" ");
  });

  it("sets aria-expanded true on the open item's trigger", async () => {
    await drawn(composed({ defaultValue: ["delivery"] }));

    expect(screen.getByRole("button", { name: "Delivery" }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });

  it("moves focus to the next trigger on ArrowDown", async () => {
    await drawn(composed());
    await keyed("Delivery", "ArrowDown");

    expect(focused()).toBe("Returns policyv");
  });

  it("moves focus to the previous trigger on ArrowUp", async () => {
    await drawn(composed());
    await keyed("Abroad", "ArrowUp");

    expect(focused()).toBe("Returns policyv");
  });

  it("moves focus to the last trigger on End", async () => {
    await drawn(composed());
    await keyed("Delivery", "End");

    expect(focused()).toBe("Abroadv");
  });

  it("moves focus to the first trigger on Home", async () => {
    await drawn(composed());
    await keyed("Abroad", "Home");

    expect(focused()).toBe("Deliveryv");
  });

  it("skips a disabled trigger on ArrowDown", async () => {
    await drawn(composed({}, "returns policy"));
    await keyed("Delivery", "ArrowDown");

    expect(focused()).toBe("Abroadv");
  });

  it("calls a caller's onClick beside the machine's handler", async () => {
    const heard = vi.fn<() => void>();

    await drawn(itemed(<ItemTrigger onClick={heard}>Delivery</ItemTrigger>));
    await toggled(screen.getByRole("button", { name: "Delivery" }));

    expect(heard).toHaveBeenCalledOnce();
  });
});
