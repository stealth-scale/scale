import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { clipped, composed, pressed } from "#clipboard/clipboard.fixtures.tsx";
import { Control } from "#clipboard/control.tsx";
import { recipe } from "#clipboard/recipe.ts";

describe("Control", () => {
  it("returns no conformance violation for its DIV slot inside a root", () => {
    expect(
      violations(Control, {
        as: true,
        children: true,
        element: "DIV",
        subject: (container) => slotElement(container, "clipboard", "control"),
        wrapper: clipped,
      }),
    ).toStrictEqual([]);
  });

  it("emits a control-slot class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props) => render(composed(props)).container, { slot: "control" }),
    ).toStrictEqual([]);
  });

  it("sets data-copied on the row once the trigger is clicked", async () => {
    const { container } = render(composed());
    await pressed(screen.getByRole("button"));

    expect(slotElement(container, "clipboard", "control").dataset["copied"]).toBe("");
  });
});
