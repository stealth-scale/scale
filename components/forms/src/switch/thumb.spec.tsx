import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { composed, pressed, thrown } from "#switch/switch.fixtures.tsx";
import { Thumb } from "#switch/thumb.tsx";

describe("Thumb", () => {
  it("renders a span", () => {
    const { container } = render(thrown(<Thumb />));

    expect(slotElement(container, "switch", "thumb").tagName).toBe("SPAN");
  });

  it("hides the thumb from assistive technology", () => {
    const { container } = render(thrown(<Thumb />));

    expect(slotElement(container, "switch", "thumb").getAttribute("aria-hidden")).toBe("true");
  });

  it("sets data-state to unchecked by default", () => {
    const { container } = render(composed());

    expect(slotElement(container, "switch", "thumb").dataset["state"]).toBe("unchecked");
  });

  it("sets data-state to checked after a press", async () => {
    const { container } = render(composed());
    await pressed(screen.getByRole("switch"));

    expect(slotElement(container, "switch", "thumb").dataset["state"]).toBe("checked");
  });
});
