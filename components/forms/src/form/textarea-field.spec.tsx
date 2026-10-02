import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type Presentation, type Schema } from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";

import { generated, written } from "#form/form.fixtures.tsx";
import { WIDTH } from "#form/recipe.ts";

const NOTE: Schema = { properties: { note: { title: "Note", type: "string" } }, type: "object" };

const LONG: Presentation<Record<string, unknown>> = {
  fields: { note: { control: "textarea", options: { maxRows: 9, rows: 6 } } },
  id: "profile",
};

/**
 * Returns the textarea.
 */
function note(): HTMLTextAreaElement {
  return screen.getByRole<HTMLTextAreaElement>("textbox", { name: "Note" });
}

describe("TextareaField", () => {
  it("renders a textarea for a string that names the textarea", async () => {
    await drawn(generated(NOTE, { presentation: LONG }));

    expect(note().tagName).toBe("TEXTAREA");
  });

  it("writes what a person types into the form's values", async () => {
    const submit = vi.fn<(values: Readonly<Record<string, unknown>>) => void>();

    await drawn(generated(NOTE, { onSubmit: submit, presentation: LONG }));
    fireEvent.change(note(), { target: { value: "Leave it at the door" } });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await settled();

    expect(submit.mock.lastCall?.[0]).toStrictEqual({ note: "Leave it at the door" });
  });

  it("shows the rows the presentation's options state", async () => {
    await drawn(generated(NOTE, { presentation: LONG }));

    expect(note().getAttribute("rows")).toBe("6");
  });

  it("shows the rows the field's props state over the presentation's", async () => {
    await drawn(written("note", { note: "" }, (field) => <field.Textarea maxRows={4} rows={2} />));

    expect(note().getAttribute("rows")).toBe("2");
  });

  it("takes the width the field states", async () => {
    const { container } = await drawn(
      written("note", { note: "" }, (field) => <field.Textarea width="medium" />),
    );

    expect(container.querySelector(`[${WIDTH}]`)?.getAttribute(WIDTH)).toBe("medium");
  });

  it("renders an empty textarea for a field without a value", async () => {
    await drawn(written("note", {}, (field) => <field.Textarea />));

    expect(note().value).toBe("");
  });

  it("runs the field's blur validators once focus leaves the textarea", async () => {
    await drawn(
      generated(NOTE, {
        fieldOptions: { note: { validators: { onBlur: () => "Keep it short" } } },
        presentation: LONG,
      }),
    );
    fireEvent.blur(note());
    await settled();

    expect(screen.getByText("Keep it short")).toBeDefined();
  });
});
