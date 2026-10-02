import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed } from "#fieldset/fieldset.fixtures.tsx";
import { recipe } from "#fieldset/recipe.ts";
import { Root, type RootProps } from "#fieldset/root.tsx";

describe("Root", () => {
  it("conforms as a fieldset", () => {
    expect(violations(Root, { as: true, children: true, element: "FIELDSET" })).toStrictEqual([]);
  });

  it("returns no accessibility violation for a group with a legend and a field", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("takes its accessible name from the legend", () => {
    render(composed());

    expect(screen.getByRole("group", { name: "Delivery" })).toBeDefined();
  });

  it("disables every control inside through the element's disabled attribute", () => {
    const { container } = render(composed({ disabled: true }));

    expect(slotElement(container, "fieldset", "root").hasAttribute("disabled")).toBe(true);
    expect(screen.getByRole("textbox").hasAttribute("disabled")).toBe(true);
  });

  it("sets data-invalid and aria-invalid while the group is invalid", () => {
    const { container } = render(composed({ invalid: true }));
    const root = slotElement(container, "fieldset", "root");

    expect(root.dataset["invalid"]).toBe("true");
    expect(root.getAttribute("aria-invalid")).toBe("true");
  });

  it("lists the helper text and the error text in aria-describedby", () => {
    const { container } = render(composed({ id: "delivery" }));

    expect(slotElement(container, "fieldset", "root").getAttribute("aria-describedby")).toBe(
      "delivery-helper delivery-error",
    );
  });
});
