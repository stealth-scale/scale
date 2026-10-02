import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type Schema, translateFrom } from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";

import { generated, GLYPHS, written } from "#form/form.fixtures.tsx";
import { WIDTH } from "#form/recipe.ts";
import { focused } from "#number-input/number-input.fixtures.tsx";

const ORDER: Schema = {
  properties: {
    price: { type: "number" },
    seats: { maximum: 50, minimum: 1, title: "Seats", type: "integer" },
  },
  required: ["seats"],
  type: "object",
};

const WORDS = translateFrom({
  "errors.required": "Enter the seats",
  "profile.fields.seats.placeholder": "How many",
});

/**
 * Returns the seats' input.
 */
function seats(): HTMLElement {
  return screen.getByRole("spinbutton", { name: "Seats" });
}

/**
 * Types text into the seats' input the way a person does.
 */
async function typed(text: string): Promise<void> {
  await focused(seats());
  fireEvent.input(seats(), { target: { value: text } });
  await settled();
}

/**
 * Submits the form.
 */
async function submitted(): Promise<void> {
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  await settled();
}

describe("NumberField", () => {
  it("makes the input short by default", async () => {
    const { container } = await drawn(generated(ORDER));

    expect(container.querySelector(`[${WIDTH}]`)?.getAttribute(WIDTH)).toBe("short");
  });

  it("takes the width the presentation states over its own", async () => {
    const { container } = await drawn(
      generated(ORDER, {
        presentation: {
          fields: { price: { width: "full" }, seats: { width: "full" } },
          id: "profile",
        },
      }),
    );

    expect(container.querySelector(`[${WIDTH}]`)?.getAttribute(WIDTH)).toBe("full");
  });

  it("renders a spin button bounded by the schema's minimum and maximum", async () => {
    await drawn(generated(ORDER));

    expect([
      seats().getAttribute("aria-valuemin"),
      seats().getAttribute("aria-valuemax"),
    ]).toStrictEqual(["1", "50"]);
  });

  it("shows the value the form starts from", async () => {
    await drawn(generated(ORDER, { values: { seats: 4 } }));

    expect(seats()).toHaveProperty("value", "4");
  });

  it("writes the number a person types into the form's values", async () => {
    const submit = vi.fn<(values: Readonly<Record<string, unknown>>) => void>();

    await drawn(generated(ORDER, { onSubmit: submit, values: { seats: 4 } }));
    await typed("12");
    await submitted();

    expect(submit.mock.lastCall?.[0]).toMatchObject({ seats: 12 });
  });

  it("leaves an emptied input without a value, which the schema refuses", async () => {
    await drawn(generated(ORDER, { translate: WORDS, values: { seats: 4 } }));
    await typed("");
    await submitted();

    expect(screen.getByText("Enter the seats")).toBeDefined();
  });

  it("keeps the text a person types while it reads as no number", async () => {
    await drawn(generated(ORDER, { values: { seats: 4 } }));
    await typed("-");

    expect(seats()).toHaveProperty("value", "-");
  });

  it("shows a value the form sets from outside the input", async () => {
    await drawn(
      generated(ORDER, {
        setting: { label: "Seven", path: "seats", value: 7 },
        values: { seats: 4 },
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Seven" }));
    await settled();

    expect(seats()).toHaveProperty("value", "7");
  });

  it("renders steppers with the form's glyphs", async () => {
    await drawn(generated(ORDER, { glyphs: GLYPHS, values: { seats: 4 } }));

    expect(
      screen
        .getAllByRole("button", { name: "Increase" })
        .map((button) => button.querySelector("[data-glyph=increment]") !== null),
    ).toStrictEqual([true, true]);
  });

  it("renders no steppers where neither the field nor the form gives glyphs", async () => {
    await drawn(generated(ORDER, { values: { seats: 4 } }));

    expect(screen.queryByRole("button", { name: "Decrease" })).toBeNull();
  });

  it("renders the steppers with the field's own glyphs over the form's", async () => {
    await drawn(
      written(
        "seats",
        { seats: 2 },
        (field) => (
          <field.Number
            glyphs={{ decrement: <svg data-glyph="minus" />, increment: <svg data-glyph="plus" /> }}
          />
        ),
        GLYPHS,
      ),
    );

    expect(
      screen.getByRole("button", { name: "Decrease" }).querySelector("[data-glyph=minus]"),
    ).not.toBeNull();
  });

  it("formats the number as the presentation's options state", async () => {
    await drawn(
      generated(ORDER, {
        presentation: {
          fields: { price: { options: { currency: "EUR", style: "currency" } } },
          id: "profile",
        },
        values: { price: 12, seats: 4 },
      }),
    );

    expect(screen.getByRole("spinbutton", { name: "Price" })).toHaveProperty("value", "€12.00");
  });

  it("formats the number as the field's props state over the presentation's", async () => {
    await drawn(
      written("price", { price: 3 }, (field) => (
        <field.Number formatOptions={{ minimumFractionDigits: 2 }} step={0.5} />
      )),
    );

    expect(screen.getByRole("spinbutton", { name: "Price" })).toHaveProperty("value", "3.00");
  });

  it("writes the purpose and the placeholder the form gives on the input", async () => {
    await drawn(
      generated(ORDER, {
        presentation: { fields: { seats: { autocomplete: "off" } }, id: "profile" },
        translate: WORDS,
      }),
    );

    expect([
      seats().getAttribute("autocomplete"),
      seats().getAttribute("placeholder"),
    ]).toStrictEqual(["off", "How many"]);
  });

  it("runs the field's blur validators once focus leaves the input", async () => {
    await drawn(
      generated(ORDER, {
        fieldOptions: { seats: { validators: { onBlur: () => "Ask sales for more" } } },
        values: { seats: 4 },
      }),
    );
    fireEvent.blur(seats());
    await settled();

    expect(screen.getByText("Ask sales for more")).toBeDefined();
  });
});
