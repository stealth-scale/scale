import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotClass, slotElement } from "@stealthscale/testing-theme";

import { CloseTrigger } from "#drawer/close-trigger.tsx";
import { opened } from "#drawer/drawer.fixtures.tsx";

describe("CloseTrigger", () => {
  it("renders a button", async () => {
    const { container } = await drawn(opened(<CloseTrigger aria-label="Close" />));

    expect(slotElement(container, "drawer", "closeTrigger").tagName).toBe("BUTTON");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(opened(<CloseTrigger aria-label="Close" />));

    expect(slotElement(container, "drawer", "closeTrigger").className).toContain(
      slotClass("drawer", "closeTrigger"),
    );
  });

  it("takes its name from aria-label", async () => {
    await drawn(opened(<CloseTrigger aria-label="Close the filters" />));

    expect(screen.getByRole("button", { name: "Close the filters" })).toBeDefined();
  });

  it("closes the drawer on a press", async () => {
    const told = vi.fn<(details: { readonly open: boolean }) => void>();

    await drawn(opened(<CloseTrigger aria-label="Close" />, { onOpenChange: told }));
    await pressed(screen.getByRole("button", { name: "Close" }));

    expect(told).toHaveBeenLastCalledWith({ open: false });
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(opened(<CloseTrigger aria-label="Close" as="a" />));

    expect(slotElement(container, "drawer", "closeTrigger").tagName).toBe("A");
  });
});
