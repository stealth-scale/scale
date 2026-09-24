import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { fielded } from "#field/field.fixtures.tsx";
import { useField } from "#field/state.ts";

/**
 * Renders the field's disabled, invalid, read-only and required states as text.
 *
 * @returns The four states, separated by spaces.
 */
function Reader(): string {
  const { disabled, invalid, readOnly, required } = useField();

  return [disabled, invalid, readOnly, required].map(String).join(" ");
}

describe("state", () => {
  it("provides the root's disabled invalid read-only and required states to a part", () => {
    render(fielded(<Reader />, { disabled: true, invalid: true, readOnly: true, required: true }));

    expect(screen.getByText("true true true true")).toBeDefined();
  });

  it("defaults every state to false", () => {
    render(fielded(<Reader />));

    expect(screen.getByText("false false false false")).toBeDefined();
  });

  it("throws for a part rendered outside a field", () => {
    expect(() => render(<Reader />)).toThrow(/Field/u);
  });
});
