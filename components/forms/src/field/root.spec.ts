import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed } from "#field/field.fixtures.tsx";
import { recipe } from "#field/recipe.ts";
import { Root, type RootProps } from "#field/root.tsx";

describe("Root", () => {
  it("conforms as a div", () => {
    expect(violations(Root, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("returns no accessibility violation for a field with every part", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("renders a div with no role", () => {
    const { container } = render(composed());

    expect(slotElement(container, "field", "root").hasAttribute("role")).toBe(false);
  });

  it("sets data-invalid while the field is invalid", () => {
    const { container } = render(composed({ invalid: true }));

    expect(slotElement(container, "field", "root").dataset["invalid"]).toBe("true");
  });

  it("gives the control the identifier the caller states", () => {
    render(composed({ id: "email" }));

    expect(screen.getByRole("textbox").getAttribute("id")).toBe("email");
  });

  it("generates an identifier when the caller states none", () => {
    render(composed());

    expect(screen.getByRole("textbox").getAttribute("id")).toBeTruthy();
  });
});
