import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed, grouped } from "#fieldset/fieldset.fixtures.tsx";
import { Legend } from "#fieldset/legend.tsx";
import { recipe } from "#fieldset/recipe.ts";
import { type RootProps } from "#fieldset/root.tsx";

describe("Legend", () => {
  it("renders a legend inside the root", () => {
    const { container } = render(grouped(<Legend>Delivery</Legend>));

    expect(slotElement(container, "fieldset", "legend").tagName).toBe("LEGEND");
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "legend",
      }),
    ).toStrictEqual([]);
  });

  it("gives the group its accessible name", () => {
    render(composed());

    expect(screen.getByRole("group", { name: "Delivery" })).toBeDefined();
  });

  it("carries the group's label identifier", () => {
    const { container } = render(composed({ id: "delivery" }));

    expect(slotElement(container, "fieldset", "legend").getAttribute("id")).toBe("delivery-label");
  });
});
