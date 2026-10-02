import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, pressed } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#steps/recipe.ts";
import { type RootProps } from "#steps/root.tsx";
import { composed } from "#steps/steps.fixtures.tsx";

describe("Root", () => {
  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(() => composed({ defaultStep: 1 })),
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
    const root = slotElement(container, "steps", "root");

    expect([root.tagName, root.hasAttribute("role")]).toStrictEqual(["DIV", false]);
  });

  it("writes the share of completed steps as --percent", async () => {
    const { container } = await drawn(composed({ count: 4, defaultStep: 1 }));

    expect(slotElement(container, "steps", "root").style.getPropertyValue("--percent")).toBe("25%");
  });

  it("starts on the first step by default", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "Current: Account" })).toBeTruthy();
  });

  it("starts on the step defaultStep names", async () => {
    await drawn(composed({ defaultStep: 2 }));

    expect(screen.getByRole("button", { name: "Current: Confirm" })).toBeTruthy();
  });

  it("keeps a controlled step on a press of the next trigger", async () => {
    await drawn(composed({ step: 0 }));
    await pressed(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByRole("button", { name: "Current: Account" })).toBeTruthy();
  });

  it("calls onStepChange with the new step", async () => {
    const told = vi.fn<(details: { readonly step: number }) => void>();

    await drawn(composed({ onStepChange: told }));
    await pressed(screen.getByRole("button", { name: "Next" }));

    expect(told).toHaveBeenLastCalledWith({ step: 1 });
  });

  it("calls onStepComplete once the last step is done", async () => {
    const told = vi.fn<() => void>();

    await drawn(composed({ defaultStep: 2, onStepComplete: told }));
    await pressed(screen.getByRole("button", { name: "Next" }));

    expect(told).toHaveBeenCalledExactlyOnceWith();
  });
});
