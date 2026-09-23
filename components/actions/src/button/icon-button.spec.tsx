import { render } from "@testing-library/react";
import { describe, expect, expectTypeOf, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { IconButton, type IconButtonProps } from "#button/icon-button.ts";
import { recipe } from "#button/recipe.ts";

const NAMED = { "aria-label": "Close" };

describe("IconButton", () => {
  it("returns no conformance violation for its BUTTON root", () => {
    expect(
      violations(IconButton, { as: true, children: true, element: "BUTTON", props: NAMED }),
    ).toStrictEqual([]);
  });

  it("returns no accessibility violation for an aria-hidden icon under an aria-label", async () => {
    await expect(
      accessibilityViolations(IconButton, {
        props: { ...NAMED, children: <svg aria-hidden="true" /> },
      }),
    ).resolves.toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props) => render(<IconButton {...NAMED} {...props} />).container, {
        defaults: { shape: "square" },
      }),
    ).toStrictEqual([]);
  });

  it("applies the square shape class when no shape is passed", () => {
    const { container } = render(<IconButton {...NAMED} />);

    expect(recipeClasses(container, "button")).toContain(variantClass("button", "shape", "square"));
  });

  it("requires aria-label or aria-labelledby in its props type", () => {
    expectTypeOf<{ "aria-label": string }>().toExtend<IconButtonProps>();
    expectTypeOf<{ "aria-labelledby": string }>().toExtend<IconButtonProps>();
    expectTypeOf<{ children: string }>().not.toExtend<IconButtonProps>();
    expect(IconButton).toBeDefined();
  });
});
