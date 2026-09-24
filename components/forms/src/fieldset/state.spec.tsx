import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement, variantClass } from "@stealthscale/testing-theme";

import * as Field from "#field/index.ts";
import { composed, grouped } from "#fieldset/fieldset.fixtures.tsx";
import { useFieldset } from "#fieldset/state.ts";

/**
 * Renders whether the group is disabled, as text.
 *
 * @returns `true` or `false`.
 */
function Reader(): string {
  return String(useFieldset().disabled);
}

describe("state", () => {
  it("reads nothing disabled outside a group", () => {
    render(<Reader />);

    expect(screen.getByText("false")).toBeDefined();
  });

  it("provides the group's disabled state", () => {
    render(grouped(<Reader />, { disabled: true }));

    expect(screen.getByText("true")).toBeDefined();
  });

  it("gives the label of a field inside a disabled group the disabled look", () => {
    const { container } = render(composed({ disabled: true }));

    expect(slotElement(container, "field", "label").dataset["disabled"]).toBe("true");
  });

  it("keeps a field's own disabled state over the group's", () => {
    const { container } = render(
      grouped(
        <Field.Root disabled={false}>
          <Field.Label>Address</Field.Label>
          <Field.Control />
        </Field.Root>,
        { disabled: true },
      ),
    );

    expect(slotElement(container, "field", "label").dataset["disabled"]).toBeUndefined();
  });

  it("gives a field inside the group the group's size", () => {
    render(composed({ size: "sm" }));

    expect([...screen.getByRole("textbox").classList]).toContain(
      variantClass("input", "size", "sm"),
    );
  });

  it("keeps a field's own size over the group's", () => {
    render(
      grouped(
        <Field.Root size="lg">
          <Field.Label>Address</Field.Label>
          <Field.Control />
        </Field.Root>,
        { size: "sm" },
      ),
    );

    expect([...screen.getByRole("textbox").classList]).toContain(
      variantClass("input", "size", "lg"),
    );
  });
});
