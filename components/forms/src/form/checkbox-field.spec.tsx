import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type Schema, translateFrom } from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";

import { generated, GLYPHS, written } from "#form/form.fixtures.tsx";

const CONSENT: Schema = {
  properties: {
    news: { description: "Once a month", title: "Send me news", type: "boolean" },
    terms: { const: true, title: "I accept the terms", type: "boolean" },
  },
  required: ["terms"],
  type: "object",
};

const WORDS = translateFrom({ "errors.const": "Accept the terms to go on" });

/**
 * Returns the checkbox of the label given.
 */
function box(name: string): HTMLInputElement {
  return screen.getByRole<HTMLInputElement>("checkbox", { name });
}

/**
 * Presses the checkbox of the label given.
 */
async function ticked(name: string): Promise<void> {
  fireEvent.click(box(name));
  await settled();
}

/**
 * Submits the form.
 */
async function submitted(): Promise<void> {
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  await settled();
}

describe("CheckboxField", () => {
  it("renders a checkbox named by its label", async () => {
    await drawn(generated(CONSENT));

    expect(box("Send me news").checked).toBe(false);
  });

  it("writes a press into the form's values", async () => {
    const submit = vi.fn<(values: Readonly<Record<string, unknown>>) => void>();

    await drawn(generated(CONSENT, { onSubmit: submit, values: { terms: true } }));
    await ticked("Send me news");
    await submitted();

    expect(submit.mock.lastCall?.[0]).toMatchObject({ news: true, terms: true });
  });

  it("shows the schema's error under the box after a refused submit", async () => {
    await drawn(generated(CONSENT, { translate: WORDS }));
    await submitted();

    expect(screen.getByText("Accept the terms to go on").getAttribute("role")).toBe("alert");
  });

  it("marks the input required where the schema requires the property", async () => {
    await drawn(generated(CONSENT));

    expect(box("I accept the terms").required).toBe(true);
  });

  it("describes the box by its help text", async () => {
    await drawn(generated(CONSENT));

    expect(box("Send me news").getAttribute("aria-describedby")).toContain(
      screen.getByText("Once a month").id,
    );
  });

  it("shows the form's glyph inside the box", async () => {
    const { container } = await drawn(generated(CONSENT, { glyphs: GLYPHS }));

    expect(container.querySelectorAll("[data-glyph=checkbox]")).toHaveLength(2);
  });

  it("shows the field's own glyph over the form's", async () => {
    const { container } = await drawn(
      written(
        "news",
        { news: false },
        (field) => <field.Checkbox indicator={<svg data-glyph="tick" />} />,
        GLYPHS,
      ),
    );

    expect(container.querySelector("[data-glyph=tick]")).not.toBeNull();
  });

  it("renders no indicator where neither the field nor the form gives a glyph", async () => {
    const { container } = await drawn(generated(CONSENT));

    expect(container.querySelector("[data-scope=checkbox][data-part=indicator]")).toBeNull();
  });

  it("runs the field's blur validators once focus leaves the box", async () => {
    await drawn(
      generated(CONSENT, {
        fieldOptions: { news: { validators: { onBlur: () => "Pick one on purpose" } } },
      }),
    );
    fireEvent.blur(box("Send me news"));
    await settled();

    expect(screen.getByText("Pick one on purpose")).toBeDefined();
  });
});
