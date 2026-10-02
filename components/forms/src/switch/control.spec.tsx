import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Control } from "#switch/control.tsx";
import { composed, pressed, thrown } from "#switch/switch.fixtures.tsx";

describe("Control", () => {
  it("renders a span", () => {
    const { container } = render(thrown(<Control />));

    expect(slotElement(container, "switch", "control").tagName).toBe("SPAN");
  });

  it("hides the track from assistive technology", () => {
    const { container } = render(thrown(<Control />));

    expect(slotElement(container, "switch", "control").getAttribute("aria-hidden")).toBe("true");
  });

  it("sets data-state to checked after a press", async () => {
    const { container } = render(composed());
    await pressed(screen.getByRole("switch"));

    expect(slotElement(container, "switch", "control").dataset["state"]).toBe("checked");
  });

  it("sets data-invalid on an invalid switch", () => {
    const { container } = render(composed({ invalid: true }));

    expect(slotElement(container, "switch", "control").dataset["invalid"]).toBe("");
  });
});
