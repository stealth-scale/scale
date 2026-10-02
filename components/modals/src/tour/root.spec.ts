import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#tour/recipe.ts";
import { type RootProps } from "#tour/root.tsx";
import { elapsed, framed, started, stepped, toured } from "#tour/tour.fixtures.tsx";

describe("Root", () => {
  it("returns no accessibility violation while closed", async () => {
    await expect(accessibilityViolations(() => toured())).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation on a dialog step", async () => {
    await expect(
      accessibilityViolations(() => toured({ begin: "welcome" }), { frame: true }),
    ).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation on a tooltip step", async () => {
    await expect(
      accessibilityViolations(() => toured({ begin: "search" }), { frame: true }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: Omit<RootProps, "tour">) => (await drawn(toured({ root: props }))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("starts closed", async () => {
    await drawn(toured());

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens on start", async () => {
    await started();

    expect(screen.getByRole("dialog", { name: "Welcome" })).toBeDefined();
  });

  it("moves to the step a next action names", async () => {
    await started();
    await stepped("Start");

    expect(screen.getByRole("dialog", { name: "Search" })).toBeDefined();
  });

  it("closes on Escape", async () => {
    await started();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    await elapsed();
    await framed();

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("calls onExitComplete once the card leaves", async () => {
    const left = vi.fn<() => void>();

    await started({ root: { onExitComplete: left } });
    await stepped("End the tour");
    await framed();

    expect(left).toHaveBeenCalledExactlyOnceWith();
  });

  it("renders a div", async () => {
    const { container } = await drawn(toured());

    expect(slotElement(container, "tour", "root").tagName).toBe("DIV");
  });
});
