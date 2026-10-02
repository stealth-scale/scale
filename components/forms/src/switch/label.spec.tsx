import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Label } from "#switch/label.tsx";
import { composed, thrown } from "#switch/switch.fixtures.tsx";

describe("Label", () => {
  it("renders a span", () => {
    const { container } = render(thrown(<Label>Dark mode</Label>));

    expect(slotElement(container, "switch", "label").tagName).toBe("SPAN");
  });

  it("names the input through aria-labelledby", () => {
    const { container } = render(composed());

    expect(screen.getByRole("switch").getAttribute("aria-labelledby")).toBe(
      slotElement(container, "switch", "label").id,
    );
  });

  it("sets data-state to checked on a checked switch", () => {
    const { container } = render(composed({ defaultChecked: true }));

    expect(slotElement(container, "switch", "label").dataset["state"]).toBe("checked");
  });
});
