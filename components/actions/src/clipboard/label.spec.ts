import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { clipped, composed, pressed } from "#clipboard/clipboard.fixtures.tsx";
import { Label } from "#clipboard/label.tsx";
import { recipe } from "#clipboard/recipe.ts";

describe("Label", () => {
  it("returns no conformance violation for its LABEL slot inside a root", () => {
    expect(
      violations(Label, {
        as: true,
        children: true,
        element: "LABEL",
        subject: (container) => slotElement(container, "clipboard", "label"),
        wrapper: clipped,
      }),
    ).toStrictEqual([]);
  });

  it("returns no accessibility violation for a composed clipboard", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("emits a label-slot class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props) => render(composed(props)).container, { slot: "label" }),
    ).toStrictEqual([]);
  });

  it("points the label at the input", () => {
    render(composed());

    expect(screen.getByLabelText("Link to the payout").tagName).toBe("INPUT");
  });

  it("sets data-copied on the label once the trigger is clicked", async () => {
    const { container } = render(composed());
    await pressed(screen.getByRole("button"));

    expect(slotElement(container, "clipboard", "label").dataset["copied"]).toBe("");
  });
});
