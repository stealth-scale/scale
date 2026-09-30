import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { boundMachineViolations } from "@stealthscale/testing-theme";

import { recipe } from "#steps/recipe.ts";
import { type RootProps } from "#steps/root.tsx";
import { composed } from "#steps/steps.fixtures.tsx";

/**
 * Returns the trigger whose accessible name is the one given.
 *
 * @param name - The trigger's name, with the hidden words for its state.
 * @returns The `button` element.
 */
function trigger(name: string): HTMLElement {
  return screen.getByRole("button", { name });
}

describe("Trigger", () => {
  it("renders a button without the machine's tab role", async () => {
    await drawn(composed());

    expect([trigger("Current: Account").tagName, screen.queryByRole("tab")]).toStrictEqual([
      "BUTTON",
      null,
    ]);
  });

  it("drops aria-selected and aria-controls", async () => {
    await drawn(composed());

    const button = trigger("Current: Account");

    expect([
      button.hasAttribute("aria-selected"),
      button.hasAttribute("aria-controls"),
    ]).toStrictEqual([false, false]);
  });

  it("applies the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(composed(props))).container,
        { slot: "trigger" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("moves to its step on a press", async () => {
    await drawn(composed());
    await pressed(trigger("Confirm"));

    expect(trigger("Current: Confirm")).toBeTruthy();
  });

  it("keeps the current step when isStepValid refuses", async () => {
    await drawn(composed({ isStepValid: () => false }));
    await pressed(trigger("Confirm"));

    expect(trigger("Current: Account")).toBeTruthy();
  });

  it("calls onStepInvalid when isStepValid refuses", async () => {
    const told = vi.fn<(details: { readonly step: number }) => void>();

    await drawn(composed({ isStepValid: () => false, onStepInvalid: told }));
    await pressed(trigger("Confirm"));

    expect(told).toHaveBeenCalledWith(expect.objectContaining({ step: 0, targetStep: 2 }));
  });

  it("moves back to a completed step in a linear flow", async () => {
    await drawn(composed({ defaultStep: 2, linear: true }));
    await pressed(trigger("Completed: Account"));

    expect(trigger("Current: Account")).toBeTruthy();
  });

  it("puts a completed step in the tab order of a linear flow", async () => {
    await drawn(composed({ defaultStep: 2, linear: true }));

    expect(trigger("Completed: Account").tabIndex).toBe(0);
  });

  it("disables a later step in a linear flow", async () => {
    await drawn(composed({ linear: true }));

    expect(trigger("Confirm").hasAttribute("disabled")).toBe(true);
  });

  it("keeps the current step of a linear flow enabled", async () => {
    await drawn(composed({ linear: true }));

    expect(trigger("Current: Account").hasAttribute("disabled")).toBe(false);
  });

  it("leaves every step enabled in a free flow", async () => {
    await drawn(composed());

    expect(trigger("Confirm").hasAttribute("disabled")).toBe(false);
  });
});
