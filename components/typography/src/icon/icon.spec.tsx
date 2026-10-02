import { render } from "@testing-library/react";
import { StarIcon } from "lucide-react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement, variantClass } from "@stealthscale/testing-theme";

import { Icon } from "#icon/icon.ts";
import { recipe } from "#icon/recipe.ts";

describe("Icon", () => {
  it("passes the component conformance checks as an svg element", () => {
    expect(violations(Icon, { as: true, children: true, element: "SVG" })).toStrictEqual([]);
  });

  it("returns no accessibility violation when hidden", async () => {
    await expect(accessibilityViolations(Icon)).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation when labelled", async () => {
    await expect(
      accessibilityViolations(Icon, { props: { "aria-hidden": false, "aria-label": "Warning" } }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", () => {
    expect(boundViolations(recipe, (props) => render(<Icon {...props} />).container)).toStrictEqual(
      [],
    );
  });

  it("renders the paths passed as children", () => {
    const { container } = render(
      <Icon viewBox="0 0 24 24">
        <path d="M4 12h16" />
      </Icon>,
    );

    expect(recipeElement(container, "icon").querySelector("path")).not.toBeNull();
  });

  it("renders the lucide icon passed as as with the recipe classes", () => {
    const { container } = render(<Icon as={StarIcon} size="lg" />);
    const svg = recipeElement(container, "icon");

    expect(svg.classList).toContain("lucide-star");
    expect(svg.classList).toContain(variantClass("icon", "size", "lg"));
  });

  it("sets aria-hidden to true by default", () => {
    const { container } = render(<Icon />);

    expect(recipeElement(container, "icon").getAttribute("aria-hidden")).toBe("true");
  });

  it("sets aria-hidden to false when the caller labels it", () => {
    const { container } = render(<Icon aria-hidden={false} aria-label="Warning" />);

    expect(recipeElement(container, "icon").getAttribute("aria-hidden")).toBe("false");
  });

  it("sets the img role", () => {
    const { container } = render(<Icon aria-hidden={false} aria-label="Warning" />);

    expect(recipeElement(container, "icon").getAttribute("role")).toBe("img");
  });
});
