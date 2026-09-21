import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { alerted, composed } from "#alert/alert.fixtures.tsx";
import { Aside } from "#alert/aside.ts";
import { recipe } from "#alert/recipe.ts";
import { type RootProps } from "#alert/root.tsx";

describe("Aside", () => {
  it("renders a div for the aside slot", () => {
    const { container } = render(alerted(<Aside>Dismiss</Aside>));

    expect(slotElement(container, "alert", "aside").tagName).toBe("DIV");
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "aside",
      }),
    ).toStrictEqual([]);
  });

  it("exposes a button child under the accessible name the caller wrote", () => {
    render(composed());

    expect(screen.getByRole("button", { name: "Dismiss this warning" })).toBeDefined();
  });
});
