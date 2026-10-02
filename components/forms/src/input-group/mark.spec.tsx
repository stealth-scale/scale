import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed, grouped } from "#input-group/input-group.fixtures.tsx";
import { Mark } from "#input-group/mark.ts";
import { recipe } from "#input-group/recipe.ts";
import { type RootProps } from "#input-group/root.tsx";

describe("Mark", () => {
  it("renders a span inside the root", () => {
    const { container } = render(grouped(<Mark>kg</Mark>));

    expect(slotElement(container, "input-group", "mark").tagName).toBe("SPAN");
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "mark",
      }),
    ).toStrictEqual([]);
  });

  it("passes aria-hidden through to the element", () => {
    const { container } = render(grouped(<Mark aria-hidden>€</Mark>));

    expect(slotElement(container, "input-group", "mark").getAttribute("aria-hidden")).toBe("true");
  });
});
