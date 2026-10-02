import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { stacked } from "#input-group/input-group.fixtures.tsx";
import { recipe } from "#input-group/recipe.ts";
import { type RootProps } from "#input-group/root.tsx";

describe("Row", () => {
  it("renders a div inside the root", () => {
    const { container } = render(stacked());

    expect(slotElement(container, "input-group", "row").tagName).toBe("DIV");
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(stacked(props)).container, {
        slot: "row",
      }),
    ).toStrictEqual([]);
  });

  it("keeps each field in the row that contains it", () => {
    render(stacked());

    expect(screen.getByRole("textbox", { name: "Security code" }).parentElement).toBe(
      screen.getByRole("textbox", { name: "Expiry" }).parentElement,
    );
  });
});
