import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, handled, opened } from "#popover/popover.fixtures.tsx";
import { Trigger } from "#popover/trigger.tsx";

describe("Trigger", () => {
  it("renders a button", async () => {
    const { container } = await drawn(opened(<Trigger>Filters</Trigger>));

    expect(slotElement(container, "popover", "trigger").tagName).toBe("BUTTON");
  });

  it("sets aria-expanded to the open state", async () => {
    await drawn(composed());

    const control = screen.getByRole("button", { name: /Filters/u });

    expect(control.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(control);
    await settled();

    expect(screen.getByRole("button", { name: /Filters/u }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });

  it("sets aria-controls to the panel's id", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("button", { name: /Filters/u }).getAttribute("aria-controls")).toBe(
      screen.getByRole("dialog").id,
    );
  });

  it("calls a caller's onClick beside the machine's handler", async () => {
    const heard = vi.fn<() => void>();

    await drawn(handled(heard));
    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    await settled();

    expect(heard).toHaveBeenCalledOnce();
  });
});
