import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { boxed, composed } from "#checkbox/checkbox.fixtures.tsx";
import { Label } from "#checkbox/label.tsx";

describe("Label", () => {
  it("renders a span inside the root", () => {
    const { container } = render(boxed(<Label>Accept the terms</Label>));

    expect(slotElement(container, "checkbox", "label").tagName).toBe("SPAN");
  });

  it("labels the input through aria-labelledby", () => {
    const { container } = render(composed());

    expect(screen.getByRole("checkbox").getAttribute("aria-labelledby")).toBe(
      slotElement(container, "checkbox", "label").id,
    );
  });

  it("sets data-state to checked on a checked box", () => {
    const { container } = render(composed({ defaultChecked: true }));

    expect(slotElement(container, "checkbox", "label").dataset["state"]).toBe("checked");
  });
});
