import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, handled, rooted } from "#toggle-tip/toggle-tip.fixtures.tsx";
import { Trigger } from "#toggle-tip/trigger.tsx";

/**
 * Returns the trigger of the composed toggle tip.
 */
function trigger(): HTMLElement {
  return screen.getByRole("button", { name: "About the settlement date" });
}

describe("Trigger", () => {
  it("renders a button", async () => {
    const { container } = await drawn(rooted(<Trigger aria-label="About">i</Trigger>));

    expect(slotElement(container, "toggle-tip", "trigger").tagName).toBe("BUTTON");
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(
      rooted(
        <Trigger aria-label="About" as="span">
          i
        </Trigger>,
      ),
    );

    expect(slotElement(container, "toggle-tip", "trigger").tagName).toBe("SPAN");
  });

  it("sets aria-expanded to true while the note is open", async () => {
    await drawn(composed());
    await pressed(trigger());

    expect(trigger().getAttribute("aria-expanded")).toBe("true");
  });

  it("sets aria-controls to the note's id", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(trigger().getAttribute("aria-controls")).toBe(
      slotElement(container, "toggle-tip", "content").id,
    );
  });

  it("sets no aria-haspopup", async () => {
    await drawn(composed());

    expect(trigger().getAttribute("aria-haspopup")).toBeNull();
  });

  it("calls a caller's onClick beside the machine's handler", async () => {
    const heard = vi.fn<() => void>();

    await drawn(handled(heard));
    await pressed(trigger());

    expect(heard).toHaveBeenCalledOnce();
  });
});
