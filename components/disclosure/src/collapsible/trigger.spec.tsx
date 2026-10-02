import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { disclosed, pressed } from "#collapsible/collapsible.fixtures.tsx";
import { Trigger } from "#collapsible/trigger.tsx";

describe("Trigger", () => {
  it("renders a button", () => {
    const { container } = render(disclosed(<Trigger>Details</Trigger>));

    expect(slotElement(container, "collapsible", "trigger").tagName).toBe("BUTTON");
  });

  it("sets aria-expanded", () => {
    render(disclosed(<Trigger>Details</Trigger>));

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
  });

  it("sets aria-controls", () => {
    render(disclosed(<Trigger>Details</Trigger>));

    expect(screen.getByRole("button").getAttribute("aria-controls")).toBeTruthy();
  });

  it("calls a caller's onClick beside the machine's handler", async () => {
    const heard = vi.fn<() => void>();

    render(disclosed(<Trigger onClick={heard}>Details</Trigger>));
    await pressed(screen.getByRole("button"));

    expect(heard).toHaveBeenCalledOnce();
    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
  });
});
