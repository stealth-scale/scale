import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#tabs/recipe.ts";
import { type RootProps } from "#tabs/root.tsx";
import { composed, tabbed } from "#tabs/tabs.fixtures.tsx";
import { Trigger } from "#tabs/trigger.tsx";

describe("Trigger", () => {
  it("renders a button", async () => {
    const { container } = await drawn(tabbed(<Trigger value="first">First</Trigger>));

    expect(slotElement(container, "tabs", "trigger").tagName).toBe("BUTTON");
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

  it("sets aria-selected on the selected tab alone", async () => {
    await drawn(composed());

    expect(screen.getByRole("tab", { name: "First" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tab", { name: "Second" }).getAttribute("aria-selected")).toBe("false");
  });

  it("sets aria-controls", async () => {
    await drawn(composed());

    expect(screen.getByRole("tab", { name: "First" }).getAttribute("aria-controls")).toBeTruthy();
  });

  it("puts the selected tab alone in the tab order", async () => {
    await drawn(composed());

    expect(screen.getByRole("tab", { name: "First" }).getAttribute("tabindex")).toBe("0");
    expect(screen.getByRole("tab", { name: "Second" }).getAttribute("tabindex")).toBe("-1");
  });

  it("sets disabled", async () => {
    await drawn(composed());

    expect(screen.getByRole("tab", { name: "Third" }).hasAttribute("disabled")).toBe(true);
  });

  it("calls a caller's onClick beside the machine's handler", async () => {
    const heard = vi.fn<() => void>();

    await drawn(
      tabbed(
        <Trigger onClick={heard} value="first">
          First
        </Trigger>,
      ),
    );
    fireEvent.click(screen.getByRole("tab", { name: "First" }));
    await settled();

    expect(heard).toHaveBeenCalledOnce();
  });
});
