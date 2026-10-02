import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type Schema, translateFrom } from "@stealthscale/provider-form";
import { drawn, pressed, settled } from "@stealthscale/testing-react";

import { framed, input, keyed, left, typed } from "#combobox/combobox.fixtures.tsx";
import { boundValue, generated, GLYPHS, written } from "#form/form.fixtures.tsx";

const COUNTRIES = ["at", "be", "ch", "de", "dk", "es", "fi", "fr", "ie", "it", "nl", "pl"];

const SHIPPING: Schema = {
  properties: { country: { enum: COUNTRIES, title: "Country", type: "string" } },
  required: ["country"],
  type: "object",
};

const WORDS = translateFrom({
  "profile.fields.country.options.fi": "Finland",
  "profile.fields.country.options.ie": "Ireland",
  "profile.fields.country.options.nl": "Netherlands",
  "profile.fields.country.options.pl": "Poland",
});

/**
 * Opens the list with the trigger.
 */
async function opened(): Promise<void> {
  await pressed(screen.getByRole("button", { name: "Show the choices" }));
  await settled();
  await framed();
}

/**
 * Returns the words of every row the list shows.
 */
function rows(): ReadonlyArray<null | string> {
  return screen.getAllByRole("option").map((option) => option.textContent);
}

describe("ComboboxField", () => {
  it("renders a combobox named by the field's label", async () => {
    await drawn(generated(SHIPPING));

    expect(screen.getByRole("combobox", { name: "Country" })).toBeDefined();
  });

  it("lists a row per choice once the list opens", async () => {
    await drawn(generated(SHIPPING, { glyphs: GLYPHS }));
    await opened();

    expect(rows()).toHaveLength(12);
  });

  it("narrows the list to the choices whose words contain the typed text", async () => {
    await drawn(generated(SHIPPING, { translate: WORDS }));
    await typed("LAND");

    expect(rows()).toStrictEqual(["Finland", "Ireland", "Netherlands", "Poland"]);
  });

  it("shows the words for no match where no choice contains the text", async () => {
    await drawn(generated(SHIPPING, { translate: WORDS }));
    await typed("Atlantis");

    expect(rows()).toStrictEqual(["No match"]);
  });

  it("writes the choice a person makes into the form's values", async () => {
    const submit = vi.fn<(values: Readonly<Record<string, unknown>>) => void>();

    await drawn(generated(SHIPPING, { onSubmit: submit, translate: WORDS }));
    await typed("Pol");
    await pressed(screen.getByRole("option", { name: "Poland" }));
    await settled();
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await settled();

    expect(submit.mock.lastCall?.[0]).toStrictEqual({ country: "pl" });
  });

  it("clears the value once a person empties the text", async () => {
    await drawn(
      written("size", { size: "small" }, (field) => (
        <>
          <field.Combobox options={["small", "large"]} />
          {boundValue()}
        </>
      )),
    );
    await typed("");
    await left();

    expect(screen.getByRole("status").textContent).toBe("");
  });

  it("shows the words of the value the form starts from", async () => {
    await drawn(generated(SHIPPING, { translate: WORDS, values: { country: "nl" } }));

    expect(input().value).toBe("Netherlands");
  });

  it("shows the form's select glyphs on the trigger and the rows", async () => {
    await drawn(generated(SHIPPING, { glyphs: GLYPHS, values: { country: "nl" } }));
    await opened();

    expect([
      document.querySelectorAll("[data-glyph=indicator]").length,
      document.querySelectorAll("[data-glyph=selected]").length,
    ]).toStrictEqual([1, 12]);
  });

  it("renders no trigger where neither the field nor the form gives glyphs", async () => {
    await drawn(generated(SHIPPING));

    expect(screen.queryByRole("button", { name: "Show the choices" })).toBeNull();
  });

  it("shows the field's own glyphs over the form's", async () => {
    await drawn(
      written(
        "size",
        { size: "" },
        (field) => (
          <field.Combobox
            glyphs={{ indicator: <svg data-glyph="down" />, selected: <svg data-glyph="tick" /> }}
            options={["small", "large"]}
          />
        ),
        GLYPHS,
      ),
    );

    expect(document.querySelector("[data-glyph=down]")).not.toBeNull();
  });

  it("lists no choice in a form written by hand without options", async () => {
    await drawn(written("size", { size: "" }, (field) => <field.Combobox />));
    await typed("s");

    expect(rows()).toStrictEqual(["No match"]);
  });

  it("runs the field's blur validators once the list closes", async () => {
    await drawn(
      generated(SHIPPING, {
        fieldOptions: { country: { validators: { onBlur: () => "We ship within the EU" } } },
        translate: WORDS,
      }),
    );
    await typed("Pol");
    await keyed("Escape");

    expect(screen.getByText("We ship within the EU")).toBeDefined();
  });

  it("floats the label in a form whose labels float", async () => {
    const { container } = await drawn(generated(SHIPPING, { orientation: "floating" }));

    expect(container.querySelector(".field__root")?.className).toContain("field__root--floating");
  });
});
