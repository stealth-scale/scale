import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Action } from "#section/action.tsx";
import { blocked } from "#section/section.fixtures.tsx";

describe("Action", () => {
  it("renders a button", () => {
    const { container } = render(blocked(<Action>Change plan</Action>));

    expect(slotElement(container, "section", "action").tagName).toBe("BUTTON");
  });

  it("sets type button", () => {
    render(blocked(<Action>Change plan</Action>));

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("defaults data-priority to primary", () => {
    const { container } = render(blocked(<Action>Change plan</Action>));

    expect(slotElement(container, "section", "action").dataset["priority"]).toBe("primary");
  });

  it("sets data-priority to its priority", () => {
    const { container } = render(blocked(<Action priority="tertiary">Archive</Action>));

    expect(slotElement(container, "section", "action").dataset["priority"]).toBe("tertiary");
  });
});
