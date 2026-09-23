import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Aside } from "#card/aside.ts";
import { carded, composed } from "#card/card.fixtures.tsx";
import { recipe } from "#card/recipe.ts";
import { type RootProps } from "#card/root.ts";

describe("Aside", () => {
  it("renders a div for the aside slot inside a root", () => {
    const { container } = render(carded(<Aside>More</Aside>));

    expect(slotElement(container, "card", "aside").tagName).toBe("DIV");
  });

  it("applies the aside slot class for every variant value", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "aside",
      }),
    ).toStrictEqual([]);
  });

  it("exposes a button inside it by role and name", () => {
    render(
      carded(
        <Aside>
          <button type="button">More</button>
        </Aside>,
      ),
    );

    expect(screen.getByRole("button", { name: "More" })).toBeDefined();
  });
});
