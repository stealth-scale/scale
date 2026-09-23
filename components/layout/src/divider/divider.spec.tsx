import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { PropsProvider } from "#divider/context.ts";
import { Divider } from "#divider/divider.ts";
import { recipe } from "#divider/recipe.ts";

describe("Divider", () => {
  it("passes the component conformance checks as an hr element", () => {
    expect(violations(Divider, { as: true, element: "HR" })).toStrictEqual([]);
  });

  it("returns no accessibility violation", async () => {
    await expect(accessibilityViolations(Divider)).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(recipe, (props) => render(<Divider {...props} />).container),
    ).toStrictEqual([]);
  });

  it("renders an element with the separator role", () => {
    const { getByRole } = render(<Divider />);

    expect(getByRole("separator")).toBeDefined();
  });

  it("sets aria-orientation to horizontal by default", () => {
    const { container } = render(<Divider />);

    expect(recipeElement(container, "divider").getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("sets aria-orientation to vertical when orientation is vertical", () => {
    const { container } = render(<Divider orientation="vertical" />);

    expect(recipeElement(container, "divider").getAttribute("aria-orientation")).toBe("vertical");
  });

  it("sets aria-orientation to vertical when PropsProvider sets orientation", () => {
    const { container } = render(
      <PropsProvider value={{ orientation: "vertical" }}>
        <Divider />
      </PropsProvider>,
    );

    expect(recipeElement(container, "divider").getAttribute("aria-orientation")).toBe("vertical");
  });

  it("keeps the aria-orientation a caller passes", () => {
    const { container } = render(<Divider aria-orientation="vertical" />);

    expect(recipeElement(container, "divider").getAttribute("aria-orientation")).toBe("vertical");
  });
});
