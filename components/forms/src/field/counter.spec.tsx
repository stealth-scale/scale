import { type ReactElement, useState } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed, fielded } from "#field/field.fixtures.tsx";
import * as Field from "#field/index.ts";
import { recipe } from "#field/recipe.ts";
import { type RootProps } from "#field/root.tsx";

/**
 * Renders a field whose control's value the caller holds, starting at `held`.
 */
function Held({ held }: { readonly held: string }): ReactElement {
  const [value, setValue] = useState(held);

  return (
    <Field.Root maxLength={80}>
      <Field.Control
        aria-label="Notes"
        onChange={(event) => {
          setValue(event.target.value);
        }}
        value={value}
      />
      <Field.Counter />
    </Field.Root>
  );
}

/**
 * Renders a field with a control holding `value` and a counter, at the limit the case sets.
 */
function counted(value: string, props: RootProps = {}): ReactElement {
  return (
    <Field.Root {...props}>
      <Field.Control aria-label="Notes" defaultValue={value} />
      <Field.Counter />
    </Field.Root>
  );
}

describe("Counter", () => {
  it("renders a p inside the root", () => {
    const { container } = render(fielded(<Field.Counter />));

    expect(slotElement(container, "field", "counter").tagName).toBe("P");
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "counter",
      }),
    ).toStrictEqual([]);
  });

  it("renders the length of the value against maxLength", () => {
    render(counted("ada@example.com", { maxLength: 80 }));

    expect(screen.getByText("15 / 80")).toBeDefined();
  });

  it("renders the length alone without maxLength", () => {
    render(counted("ada"));

    expect(screen.getByText("3")).toBeDefined();
  });

  it("updates the count on every change", () => {
    render(counted("", { maxLength: 80 }));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "twelve chars" } });

    expect(screen.getByText("12 / 80")).toBeDefined();
  });

  it("counts the value the caller holds", () => {
    render(<Held held="four" />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "seven!!" } });

    expect(screen.getByText("7 / 80")).toBeDefined();
  });

  it("counts UTF-16 code units", () => {
    render(counted("😀", { maxLength: 80 }));

    expect(screen.getByText("2 / 80")).toBeDefined();
  });

  it("counts a growing Field.Textarea", () => {
    render(
      <Field.Root maxLength={200}>
        <Field.Textarea aria-label="Notes" grows maxRows={6} />
        <Field.Counter />
      </Field.Root>,
    );
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Leave it at the door" } });

    expect(screen.getByText("20 / 200")).toBeDefined();
  });

  it("renders its children in place of the count", () => {
    render(
      <Field.Root maxLength={80}>
        <Field.Control aria-label="Notes" />
        <Field.Counter>Plenty of room</Field.Counter>
      </Field.Root>,
    );

    expect(screen.getByText("Plenty of room")).toBeDefined();
  });

  it("sets no aria-live", () => {
    const { container } = render(counted("ada", { maxLength: 80 }));

    expect(slotElement(container, "field", "counter").hasAttribute("aria-live")).toBe(false);
  });

  it("carries the identifier the control's aria-describedby lists", () => {
    const { container } = render(counted("ada", { id: "notes", maxLength: 80 }));

    expect(slotElement(container, "field", "counter").getAttribute("id")).toBe("notes-counter");
    expect(screen.getByRole("textbox").getAttribute("aria-describedby")).toContain("notes-counter");
  });
});
