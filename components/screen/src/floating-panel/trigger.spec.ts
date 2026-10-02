import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, panel } from "#floating-panel/floating-panel.fixtures.tsx";

/**
 * Returns the trigger.
 */
function trigger(): HTMLElement {
  return screen.getByRole("button", { name: "Notes" });
}

describe("Trigger", () => {
  it("renders a button with the trigger class", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "floating-panel", "trigger").tagName).toBe("BUTTON");
  });

  it("sets aria-expanded to false while the panel is closed", async () => {
    await drawn(composed());

    expect(trigger().getAttribute("aria-expanded")).toBe("false");
  });

  it("sets aria-expanded to true while the panel is open", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(trigger().getAttribute("aria-expanded")).toBe("true");
  });

  it("sets aria-haspopup to dialog", async () => {
    await drawn(composed());

    expect(trigger().getAttribute("aria-haspopup")).toBe("dialog");
  });

  it("points aria-controls at the panel", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(trigger().getAttribute("aria-controls")).toBe(panel().id);
  });

  it("closes an open panel on a press", async () => {
    await drawn(composed({ defaultOpen: true }));
    await pressed(trigger());

    expect(trigger().getAttribute("aria-expanded")).toBe("false");
  });
});
