import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { clipped, composed, pressed } from "#clipboard/clipboard.fixtures.tsx";
import { Label } from "#clipboard/label.tsx";
import { recipe } from "#clipboard/recipe.ts";

describe("Label", () => {
  it("conforms as a label inside the root it needs above it", () => {
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

  it("breaks no accessibility rule beside the field it names", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(composed(props)).container, { slot: "label" }),
    ).toStrictEqual([]);
  });

  it("names the field", () => {
    render(composed());

    expect(screen.getByLabelText("Link to the payout").tagName).toBe("INPUT");
  });

  it("carries the copied state after a press", async () => {
    const { container } = render(composed());
    await pressed(screen.getByRole("button"));

    expect(slotElement(container, "clipboard", "label").dataset["copied"]).toBe("");
  });
});
