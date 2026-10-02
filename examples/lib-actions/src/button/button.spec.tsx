import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import {
  compoundClass,
  recipeClasses,
  recipeElement,
  variantClass,
} from "@stealthscale/testing-theme";

import { Button } from "#button/button.ts";

describe("Button", () => {
  it("conforms as a button element", () => {
    expect(violations(Button, { children: true, element: "BUTTON" })).toStrictEqual([]);
  });

  it("applies the recipe class with the default variant classes", () => {
    const { container } = render(<Button>Go</Button>);

    expect(recipeClasses(container, "button")).toStrictEqual([
      "button",
      variantClass("button", "size", "md"),
      variantClass("button", "variant", "solid"),
    ]);
  });

  it("applies the class of the look passed as variant", () => {
    const { container } = render(<Button variant="ghost">Go</Button>);

    expect(recipeClasses(container, "button")).toContain(
      variantClass("button", "variant", "ghost"),
    );
  });

  it("applies the class of the palette passed as palette", () => {
    const { container } = render(<Button palette="error">Go</Button>);

    expect(recipeClasses(container, "button")).toContain(
      variantClass("button", "palette", "error"),
    );
  });

  it("applies the hero compound class only to a large solid button", () => {
    const hero = render(<Button size="lg">Go</Button>);
    const plain = render(
      <Button size="lg" variant="ghost">
        Go
      </Button>,
    );

    expect(recipeClasses(hero.container, "button")).toContain(compoundClass("button", "hero"));
    expect(recipeClasses(plain.container, "button")).not.toContain(compoundClass("button", "hero"));
  });

  it("renders a BUTTON element bound to the recipe", () => {
    const { container } = render(<Button>Go</Button>);

    expect(recipeElement(container, "button").tagName).toBe("BUTTON");
  });
});
