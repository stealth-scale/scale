import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotClass, slotElement } from "@stealthscale/testing-theme";

import { CloseTrigger } from "#popover/close-trigger.tsx";
import { opened } from "#popover/popover.fixtures.tsx";

describe("CloseTrigger", () => {
  it("renders a button", async () => {
    const { container } = await drawn(opened(<CloseTrigger />));

    expect(slotElement(container, "popover", "closeTrigger").tagName).toBe("BUTTON");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(opened(<CloseTrigger />));

    expect(slotElement(container, "popover", "closeTrigger").className).toContain(
      slotClass("popover", "closeTrigger"),
    );
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(opened(<CloseTrigger as="a" />));

    expect(slotElement(container, "popover", "closeTrigger").tagName).toBe("A");
  });
});
