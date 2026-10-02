import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type Schema, translateFrom } from "@stealthscale/provider-form";
import { drawn, pressed, settled } from "@stealthscale/testing-react";

import { generated, GLYPHS, written } from "#form/form.fixtures.tsx";
import { WIDTH } from "#form/recipe.ts";
import { framed } from "#select/select.fixtures.tsx";

const ADDRESS: Schema = {
  properties: {
    country: {
      enum: ["nl", "be", "de", "fr", "gb", "us"],
      title: "Country",
      type: "string",
    },
  },
  required: ["country"],
  type: "object",
};

const WORDS = translateFrom({
  "errors.enum": "Choose where we ship",
  "profile.fields.country.options.be": "Belgium",
  "profile.fields.country.placeholder": "Pick a country",
});

/**
 * Returns the select's trigger.
 */
function trigger(): HTMLElement {
  return screen.getByRole("combobox", { name: "Country" });
}

/**
 * Opens the list.
 */
async function opened(): Promise<void> {
  await pressed(trigger());
  await settled();
  await framed();
}

/**
 * Submits the form.
 */
async function submitted(): Promise<void> {
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  await settled();
}

describe("SelectField", () => {
  it("renders a select named by its label", async () => {
    await drawn(generated(ADDRESS));

    expect(trigger().textContent).toBe("Choose");
  });

  it("shows the placeholder the catalogue gives until a person chooses", async () => {
    await drawn(generated(ADDRESS, { translate: WORDS }));

    expect(trigger().textContent).toBe("Pick a country");
  });

  it("shows the value the form starts from", async () => {
    await drawn(generated(ADDRESS, { translate: WORDS, values: { country: "be" } }));

    expect(trigger().textContent).toBe("Belgium");
  });

  it("lists a row per choice the schema lists", async () => {
    await drawn(generated(ADDRESS));
    await opened();

    expect(screen.getAllByRole("option")).toHaveLength(6);
  });

  it("writes the choice a person makes into the form's values", async () => {
    const submit = vi.fn<(values: Readonly<Record<string, unknown>>) => void>();

    await drawn(generated(ADDRESS, { onSubmit: submit, translate: WORDS }));
    await opened();
    await pressed(screen.getByRole("option", { name: "Belgium" }));
    await submitted();

    expect(submit.mock.lastCall?.[0]).toStrictEqual({ country: "be" });
  });

  it("clears the choice on a form reset", async () => {
    const { container } = await drawn(generated(ADDRESS, { translate: WORDS }));

    await opened();
    await pressed(screen.getByRole("option", { name: "Belgium" }));
    fireEvent.reset(container.querySelector("form") ?? document.body);
    await settled();

    expect(trigger().textContent).toBe("Pick a country");
  });

  it("lists no row in a form written by hand without options", async () => {
    await drawn(written("size", { size: "" }, (field) => <field.Select />));
    await pressed(screen.getByRole("combobox", { name: "Size" }));
    await settled();
    await framed();

    expect(screen.queryByRole("option")).toBeNull();
  });

  it("shows the schema's error after a refused submit", async () => {
    await drawn(generated(ADDRESS, { translate: WORDS }));
    await submitted();

    expect(screen.getByText("Choose where we ship").getAttribute("role")).toBe("alert");
  });

  it("shows the form's glyphs on the trigger and the chosen row", async () => {
    await drawn(generated(ADDRESS, { glyphs: GLYPHS, values: { country: "nl" } }));
    await opened();

    expect([
      document.querySelectorAll("[data-glyph=indicator]").length,
      document.querySelectorAll("[data-glyph=selected]").length,
    ]).toStrictEqual([1, 6]);
  });

  it("shows the field's own glyphs over the form's", async () => {
    await drawn(
      written(
        "size",
        { size: "" },
        (field) => (
          <field.Select
            glyphs={{ indicator: <svg data-glyph="down" />, selected: <svg data-glyph="tick" /> }}
            options={["small", "large"]}
          />
        ),
        GLYPHS,
      ),
    );

    expect(document.querySelector("[data-glyph=down]")).not.toBeNull();
  });

  it("takes the width the field states", async () => {
    const { container } = await drawn(
      written("size", { size: "" }, (field) => (
        <field.Select options={["small", "large"]} width="short" />
      )),
    );

    expect(container.querySelector(`[${WIDTH}]`)?.getAttribute(WIDTH)).toBe("short");
  });

  it("renders no marks where neither the field nor the form gives glyphs", async () => {
    await drawn(generated(ADDRESS));

    expect(document.querySelector("[data-scope=select][data-part=indicator]")).toBeNull();
  });

  it("writes the purpose the presentation states on the hidden select", async () => {
    const { container } = await drawn(
      generated(ADDRESS, {
        presentation: { fields: { country: { autocomplete: "country" } }, id: "profile" },
      }),
    );

    expect(container.querySelector("select[name=country]")?.getAttribute("autocomplete")).toBe(
      "country",
    );
  });

  it("runs the field's blur validators once the list closes", async () => {
    await drawn(
      generated(ADDRESS, {
        fieldOptions: { country: { validators: { onBlur: () => "Ships to Europe alone" } } },
      }),
    );
    await opened();
    fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
    await settled();

    expect(screen.getByText("Ships to Europe alone")).toBeDefined();
  });
});
