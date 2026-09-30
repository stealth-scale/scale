import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { barred, framed, redrawn, region } from "#action-bar/action-bar.fixtures.tsx";
import { recipe } from "#action-bar/recipe.ts";
import { type RootProps } from "#action-bar/root.tsx";

describe("Root", () => {
  it("returns no accessibility violation while open", async () => {
    await expect(accessibilityViolations(() => barred())).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: Partial<RootProps>) => (await drawn(barred(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("renders a div", async () => {
    const { container } = await drawn(barred());

    expect(slotElement(container, "action-bar", "root").tagName).toBe("DIV");
  });

  it("renders no bar before it first opens", async () => {
    await drawn(barred({ open: false }));

    expect(screen.queryByRole("toolbar")).toBeNull();
  });

  it("renders the bar while open", async () => {
    await drawn(barred());

    expect(
      screen.getByRole("toolbar", { name: "Actions for the selected invoices" }),
    ).toBeDefined();
  });

  it("announces Actions available as the bar opens", async () => {
    await drawn(barred());
    await framed();

    expect(region()?.textContent).toBe("Actions available");
  });

  it("announces the words passed as announcement", async () => {
    await drawn(barred({ announcement: "3 invoices selected, actions available" }));
    await framed();

    expect(region()?.textContent).toBe("3 invoices selected, actions available");
  });

  it("announces nothing while closed", async () => {
    await drawn(barred({ announcement: "Bar is open", open: false }));
    await framed();

    expect(region()?.textContent ?? "").not.toBe("Bar is open");
  });

  it("renders no bar once it closes", async () => {
    const { rerender } = await drawn(barred());

    await redrawn(rerender, barred({ open: false }));
    await framed();

    expect(screen.queryByRole("toolbar")).toBeNull();
  });

  it("calls onExitComplete once the bar leaves", async () => {
    const left = vi.fn<() => void>();
    const { rerender } = await drawn(barred({ onExitComplete: left }));

    await redrawn(rerender, barred({ onExitComplete: left, open: false }));
    await framed();

    expect(left).toHaveBeenCalledExactlyOnceWith();
  });
});
