import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, pressed } from "@stealthscale/testing-react";

import { provided } from "#color-mode-toggle/color-mode-toggle.fixtures.tsx";

/**
 * Returns the toggle, named "Dark mode" unless a case passes another label.
 */
function toggle(name = "Dark mode"): HTMLElement {
  return screen.getByRole("button", { name });
}

describe("ColorModeToggle", () => {
  it("returns no accessibility violation", async () => {
    await expect(accessibilityViolations(() => provided())).resolves.toStrictEqual([]);
  });

  it("names itself Dark mode unless label is passed", async () => {
    await drawn(provided());

    expect(toggle().tagName).toBe("BUTTON");
  });

  it("takes its name from label", async () => {
    await drawn(provided({ label: "Donker" }));

    expect(toggle("Donker")).toBeDefined();
  });

  it("reports aria-pressed as false while the page is light", async () => {
    await drawn(provided());

    expect(toggle().getAttribute("aria-pressed")).toBe("false");
  });

  it("turns the page dark on a press", async () => {
    await drawn(provided());
    await pressed(toggle());

    expect(toggle().getAttribute("aria-pressed")).toBe("true");
  });

  it("turns the page light again on a second press", async () => {
    await drawn(provided());
    await pressed(toggle());
    await pressed(toggle());

    expect(toggle().getAttribute("aria-pressed")).toBe("false");
  });

  it("writes the chosen mode on the document root", async () => {
    await drawn(provided());
    await pressed(toggle());

    expect(document.documentElement.dataset["colorMode"]).toBe("dark");
  });

  it("shows the dark glyph while the page is dark", async () => {
    await drawn(provided());
    await pressed(toggle());

    expect(screen.getByText("Moon").dataset["hidden"]).toBeUndefined();
  });

  it("calls the caller's onClick before it sets the mode", async () => {
    const clicked = vi.fn<() => void>();

    await drawn(provided({ onClick: clicked }));
    await pressed(toggle());

    expect(clicked).toHaveBeenCalledTimes(1);
  });

  it("keeps the mode when the caller's onClick cancels the press", async () => {
    await drawn(
      provided({
        onClick: (event) => {
          event.preventDefault();
        },
      }),
    );
    await pressed(toggle());

    expect(toggle().getAttribute("aria-pressed")).toBe("false");
  });

  it("renders a ghost neutral square unless the caller sets the look", async () => {
    await drawn(provided());

    expect(
      ["button--ghost", "button--neutral", "button--square"].every((name) =>
        toggle().classList.contains(name),
      ),
    ).toBe(true);
  });
});
