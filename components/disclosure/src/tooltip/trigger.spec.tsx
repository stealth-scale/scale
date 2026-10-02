import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, hinted } from "#tooltip/tooltip.fixtures.tsx";
import { Trigger } from "#tooltip/trigger.tsx";

describe("Trigger", () => {
  it("renders a button", () => {
    const { container } = render(hinted(<Trigger>Save</Trigger>));

    expect(slotElement(container, "tooltip", "trigger").tagName).toBe("BUTTON");
  });

  it("sets aria-describedby to the content's id", async () => {
    render(composed({ defaultOpen: true }));
    await settled();

    expect(screen.getByRole("button").getAttribute("aria-describedby")).toBe(
      screen.getByRole("tooltip").id,
    );
  });

  it("calls a caller's onFocus beside the machine's handler", async () => {
    const heard = vi.fn<() => void>();

    render(hinted(<Trigger onFocus={heard}>Save</Trigger>));
    fireEvent.focus(screen.getByRole("button"));
    await settled();

    expect(heard).toHaveBeenCalledOnce();
  });

  it("renders the element as names", () => {
    const { container } = render(hinted(<Trigger as="a">Read on</Trigger>));

    expect(slotElement(container, "tooltip", "trigger").tagName).toBe("A");
  });
});
