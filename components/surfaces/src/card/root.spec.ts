import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed } from "#card/card.fixtures.tsx";
import { recipe } from "#card/recipe.ts";
import { Root, type RootProps } from "#card/root.ts";

describe("Root", () => {
  it("conforms as an article that accepts as and children", () => {
    expect(violations(Root, { as: true, children: true, element: "ARTICLE" })).toStrictEqual([]);
  });

  it("returns no accessibility violation with every part inside", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the root slot class for every variant value", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("exposes an article named by the title aria-labelledby points at", () => {
    render(composed());

    expect(screen.getByRole("article", { name: "Invoice 4821" })).toBeDefined();
  });

  it("renders the element passed as as", () => {
    const { container } = render(composed({ as: "div" }));

    expect(slotElement(container, "card", "root").tagName).toBe("DIV");
  });

  it("sets aria-disabled when disabled is true", () => {
    const { container } = render(composed({ disabled: true }));

    expect(slotElement(container, "card", "root").getAttribute("aria-disabled")).toBe("true");
  });

  it("keeps the aria-disabled value the caller passes", () => {
    const { container } = render(composed({ "aria-disabled": false, disabled: true }));

    expect(slotElement(container, "card", "root").getAttribute("aria-disabled")).toBe("false");
  });

  it("sets no aria-disabled when disabled is absent", () => {
    const { container } = render(composed());

    expect(slotElement(container, "card", "root").hasAttribute("aria-disabled")).toBe(false);
  });
});
