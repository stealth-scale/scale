import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { coded, composed } from "#code-block/code-block.fixtures.tsx";
import { Control } from "#code-block/control.ts";
import { recipe } from "#code-block/recipe.ts";

describe("Control", () => {
  it("conforms as a div inside the panel it needs above it", () => {
    expect(
      violations(Control, {
        as: true,
        children: true,
        element: "DIV",
        subject: (container) => slotElement(container, "code-block", "control"),
        wrapper: coded,
      }),
    ).toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(coded(<Control />, props)).container, {
        slot: "control",
      }),
    ).toStrictEqual([]);
  });

  it("holds whatever control a page puts there", () => {
    const { container } = render(composed());

    expect(slotElement(container, "code-block", "control")).toContain(
      screen.getByRole("button", { name: "Copy the code" }),
    );
  });
});
