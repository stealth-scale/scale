import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { alerted, composed } from "#alert/alert.fixtures.tsx";
import { Aside } from "#alert/aside.ts";
import { recipe } from "#alert/recipe.ts";
import { type RootProps } from "#alert/root.tsx";

describe("Aside", () => {
  it("renders a div", () => {
    const { container } = render(alerted(<Aside>Retry</Aside>));

    expect(slotElement(container, "alert", "aside").tagName).toBe("DIV");
  });

  it("applies the class of every variant value set on the root", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "aside",
      }),
    ).toStrictEqual([]);
  });

  it("renders a child button with the name the caller passes", () => {
    render(composed());

    expect(screen.getByRole("button", { name: "Retry the payment" })).toBeDefined();
  });
});
