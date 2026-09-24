import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotElement } from "@stealthscale/testing-theme";

import { CloseTrigger } from "#popover/close-trigger.tsx";
import { opened } from "#popover/popover.fixtures.tsx";

describe("CloseTrigger", () => {
  it("renders a button", () => {
    const { container } = render(opened(<CloseTrigger />));

    expect(slotElement(container, "popover", "closeTrigger").tagName).toBe("BUTTON");
  });

  it("applies its slot class", () => {
    const { container } = render(opened(<CloseTrigger />));

    expect(slotElement(container, "popover", "closeTrigger").className).toContain(
      slotClass("popover", "closeTrigger"),
    );
  });

  it("renders the element as names", () => {
    const { container } = render(opened(<CloseTrigger as="a" />));

    expect(slotElement(container, "popover", "closeTrigger").tagName).toBe("A");
  });
});
