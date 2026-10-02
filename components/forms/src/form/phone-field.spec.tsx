import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  createEngine,
  type Presentation,
  type Schema,
  translateFrom,
} from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";

import { generated, GLYPHS, written } from "#form/form.fixtures.tsx";
import { phone } from "#form/formats.ts";
import { WIDTH } from "#form/recipe.ts";
import { opened } from "#select/select.fixtures.tsx";

const CONTACT: Schema = {
  properties: { phone: { format: "phone", title: "Phone", type: "string" } },
  type: "object",
};

const ENGINE = createEngine({ formats: [phone] });

const DUTCH: Presentation<Record<string, unknown>> = {
  fields: { phone: { options: { countries: ["NL", "BE"], country: "NL" } } },
  id: "profile",
};

/**
 * Returns the number's box.
 */
function box(): HTMLInputElement {
  return screen.getByRole<HTMLInputElement>("textbox", { name: "Phone" });
}

/**
 * Types a number into the box and submits the form.
 */
async function submittedWith(number: string): Promise<void> {
  fireEvent.change(box(), { target: { value: number } });
  await settled();
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  await settled();
}

describe("PhoneField", () => {
  it("renders a phone box named by the field's label", async () => {
    await drawn(generated(CONTACT, { engine: ENGINE }));

    expect(box().type).toBe("tel");
  });

  it("writes a number typed in the presentation's country in E.164", async () => {
    const submit = vi.fn<(values: Readonly<Record<string, unknown>>) => void>();

    await drawn(generated(CONTACT, { engine: ENGINE, onSubmit: submit, presentation: DUTCH }));
    await submittedWith("0612345678");

    expect(submit.mock.lastCall?.[0]).toStrictEqual({ phone: "+31612345678" });
  });

  it("refuses a number the phone format does not accept", async () => {
    await drawn(
      generated(CONTACT, {
        engine: ENGINE,
        presentation: DUTCH,
        translate: translateFrom({ "errors.format": "Enter a whole phone number" }),
      }),
    );
    await submittedWith("06123");

    expect(screen.getByText("Enter a whole phone number")).toBeDefined();
  });

  it("offers the countries the presentation lists", async () => {
    await drawn(generated(CONTACT, { engine: ENGINE, presentation: DUTCH }));
    await opened();

    expect(screen.getAllByRole("option").map((option) => option.textContent)).toStrictEqual([
      "Netherlands+31",
      "Belgium+32",
    ]);
  });

  it("names the country picker in the catalogue's words", async () => {
    await drawn(
      generated(CONTACT, {
        engine: ENGINE,
        translate: translateFrom({ "profile.actions.countryCode": "Landcode" }),
      }),
    );

    expect(screen.getByRole("combobox", { name: "Landcode" })).toBeDefined();
  });

  it("shows the form's select glyphs on the country picker", async () => {
    await drawn(generated(CONTACT, { engine: ENGINE, glyphs: GLYPHS }));

    expect(document.querySelector("[data-glyph=indicator]")).not.toBeNull();
  });

  it("shows the field's own glyphs over the form's", async () => {
    await drawn(
      written(
        "phone",
        { phone: "" },
        (field) => (
          <field.Phone
            glyphs={{ indicator: <svg data-glyph="down" />, selected: <svg data-glyph="tick" /> }}
          />
        ),
        GLYPHS,
      ),
    );

    expect(document.querySelector("[data-glyph=down]")).not.toBeNull();
  });

  it("renders an empty box in a form written by hand without a value", async () => {
    await drawn(written("phone", {}, (field) => <field.Phone />));

    expect(box().value).toBe("");
  });

  it("runs no blur validator while focus moves from the box to the country picker", async () => {
    await drawn(
      generated(CONTACT, {
        engine: ENGINE,
        fieldOptions: { phone: { validators: { onBlur: () => "We call on weekdays" } } },
      }),
    );
    fireEvent.blur(box(), {
      relatedTarget: screen.getByRole("combobox", { name: "Country code" }),
    });
    await settled();

    expect(screen.queryByText("We call on weekdays")).toBeNull();
  });

  it("makes the box medium by default", async () => {
    const { container } = await drawn(generated(CONTACT, { engine: ENGINE }));

    expect(container.querySelector(`[${WIDTH}]`)?.getAttribute(WIDTH)).toBe("medium");
  });

  it("runs the field's blur validators once focus leaves the box", async () => {
    await drawn(
      generated(CONTACT, {
        engine: ENGINE,
        fieldOptions: { phone: { validators: { onBlur: () => "We call on weekdays" } } },
      }),
    );
    fireEvent.blur(box(), { relatedTarget: screen.getByRole("button", { name: "Submit" }) });
    await settled();

    expect(screen.getByText("We call on weekdays")).toBeDefined();
  });
});
