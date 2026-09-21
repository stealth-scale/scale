import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { coded, composed } from "#code-block/code-block.fixtures.tsx";
import { Control } from "#code-block/control.ts";
import { recipe } from "#code-block/recipe.ts";

describe("Control", () => {
  it("satisfies the component contract with div as its default element", () => {
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

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props) => render(coded(<Control />, props)).container, {
        slot: "control",
      }),
    ).toStrictEqual([]);
  });

  it("contains the button a caller places inside it", () => {
    const { container } = render(composed());

    expect(slotElement(container, "code-block", "control")).toContain(
      screen.getByRole("button", { name: "Copy the code" }),
    );
  });
});
