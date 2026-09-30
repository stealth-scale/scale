import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { boundViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import * as FieldParts from "#field/index.ts";
import { NAME, selected } from "#native-select/native-select.fixtures.tsx";
import { recipe } from "#native-select/recipe.ts";
import { type RootProps } from "#native-select/root.tsx";

describe("Root", () => {
  it("renders a DIV for the root slot", () => {
    const { container } = render(selected());

    expect(slotElement(container, "native-select", "root").tagName).toBe("DIV");
  });

  it("returns no accessibility violation for a named select", async () => {
    await expect(accessibilityViolations(() => selected())).resolves.toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(selected(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("takes the size of the field around it", () => {
    const { container } = render(<FieldParts.Root size="lg">{selected()}</FieldParts.Root>);

    expect(slotElement(container, "native-select", "field").className).toContain(
      variantClass("native-select__field", "size", "lg"),
    );
  });

  it("keeps its own size over the field's", () => {
    const { container } = render(
      <FieldParts.Root size="lg">{selected({ size: "xs" })}</FieldParts.Root>,
    );

    expect(slotElement(container, "native-select", "field").className).toContain(
      variantClass("native-select__field", "size", "xs"),
    );
  });

  it("names the select by aria-label alone", () => {
    const { getByRole } = render(selected());

    expect(getByRole("combobox", { name: NAME }).tagName).toBe("SELECT");
  });
});
