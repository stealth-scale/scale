import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { boxed, composed, pressed } from "#checkbox/checkbox.fixtures.tsx";
import { Control } from "#checkbox/control.tsx";

describe("Control", () => {
  it("renders a div inside the root", () => {
    const { container } = render(boxed(<Control />));

    expect(slotElement(container, "checkbox", "control").tagName).toBe("DIV");
  });

  it("hides the box from assistive technology", () => {
    const { container } = render(boxed(<Control />));

    expect(slotElement(container, "checkbox", "control").getAttribute("aria-hidden")).toBe("true");
  });

  it("sets data-state to checked after a press", async () => {
    const { container } = render(composed());
    await pressed(screen.getByRole("checkbox"));

    expect(slotElement(container, "checkbox", "control").dataset["state"]).toBe("checked");
  });

  it("sets data-state to indeterminate while partly on", () => {
    const { container } = render(composed({ checked: "indeterminate" }));

    expect(slotElement(container, "checkbox", "control").dataset["state"]).toBe("indeterminate");
  });

  it("sets data-invalid while the box is invalid", () => {
    const { container } = render(composed({ invalid: true }));

    expect(slotElement(container, "checkbox", "control").dataset["invalid"]).toBe("");
  });
});
