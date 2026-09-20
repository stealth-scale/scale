import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { clipped, composed, pressed } from "#clipboard/clipboard.fixtures.tsx";
import { Control } from "#clipboard/control.tsx";
import { recipe } from "#clipboard/recipe.ts";

describe("Control", () => {
  it("conforms as a div inside the root it needs above it", () => {
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

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(composed(props)).container, { slot: "control" }),
    ).toStrictEqual([]);
  });

  it("carries the copied state after a press", async () => {
    const { container } = render(composed());
    await pressed(screen.getByRole("button"));

    expect(slotElement(container, "clipboard", "control").dataset["copied"]).toBe("");
  });
});
