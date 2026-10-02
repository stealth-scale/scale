import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type Presentation, type Schema, translateFrom } from "@stealthscale/provider-form";
import { drawn, pressed, settled } from "@stealthscale/testing-react";
import { slotClass } from "@stealthscale/testing-theme";

import { generated, GLYPHS, written } from "#form/form.fixtures.tsx";

const ORDER: Schema = {
  properties: {
    extras: {
      items: { enum: ["support", "audit", "sso"], type: "string" },
      title: "Extras",
      type: "array",
    },
  },
  type: "object",
};

const CARDS: Presentation<Record<string, unknown>> = {
  fields: { extras: { control: "cards" } },
  id: "profile",
  of: ["extras"],
};

const WORDS = translateFrom({
  "profile.fields.extras.descriptions.sso": "Sign in through your identity provider",
  "profile.fields.extras.options.sso": "Single sign-on",
});

const BLURRED = { extras: { validators: { onBlur: (): string => "Audit needs support" } } };

/**
 * Returns the card of the name given.
 */
function card(name: RegExp): HTMLInputElement {
  return screen.getByRole<HTMLInputElement>("checkbox", { name });
}

/**
 * Submits the form.
 */
async function submitted(): Promise<void> {
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  await settled();
}

describe("CheckboxCardsField", () => {
  it("names the set by the field's label", async () => {
    await drawn(generated(ORDER, { presentation: CARDS }));

    expect(screen.getByRole("group", { name: "Extras" }).tagName).toBe("FIELDSET");
  });

  it("renders a card per choice the items list", async () => {
    await drawn(generated(ORDER, { presentation: CARDS }));

    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  });

  it("reads a card's words from the catalogue", async () => {
    await drawn(generated(ORDER, { presentation: CARDS, translate: WORDS }));

    expect(card(/^Single sign-on/u)).toBeDefined();
  });

  it("shows the words the catalogue gives under a card", async () => {
    const { container } = await drawn(generated(ORDER, { presentation: CARDS, translate: WORDS }));

    expect(
      [...container.querySelectorAll(`.${slotClass("checkbox-card", "description")}`)].map(
        (element) => element.textContent,
      ),
    ).toStrictEqual(["Sign in through your identity provider"]);
  });

  it("checks the cards of the values the form starts from", async () => {
    await drawn(generated(ORDER, { presentation: CARDS, values: { extras: ["audit"] } }));

    expect(
      screen.getAllByRole<HTMLInputElement>("checkbox").map((each) => each.checked),
    ).toStrictEqual([false, true, false]);
  });

  it("writes the picked values in the order a person picked them", async () => {
    const submit = vi.fn<(values: Readonly<Record<string, unknown>>) => void>();

    await drawn(generated(ORDER, { onSubmit: submit, presentation: CARDS }));
    await pressed(card(/^sso/u));
    await pressed(card(/^support/u));
    await submitted();

    expect(submit.mock.lastCall?.[0]).toStrictEqual({ extras: ["sso", "support"] });
  });

  it("removes a value a person unpicks", async () => {
    const submit = vi.fn<(values: Readonly<Record<string, unknown>>) => void>();

    await drawn(
      generated(ORDER, {
        onSubmit: submit,
        presentation: CARDS,
        values: { extras: ["support", "audit"] },
      }),
    );
    await pressed(card(/^support/u));
    await submitted();

    expect(submit.mock.lastCall?.[0]).toStrictEqual({ extras: ["audit"] });
  });

  it("shows the form's checkbox glyph in each card", async () => {
    await drawn(generated(ORDER, { glyphs: GLYPHS, presentation: CARDS }));

    expect(document.querySelectorAll("[data-glyph=checkbox]")).toHaveLength(3);
  });

  it("renders no glyph where the form gives none", async () => {
    await drawn(generated(ORDER, { presentation: CARDS }));

    expect(document.querySelector(`.${slotClass("checkbox-card", "indicator")}`)).toBeNull();
  });

  it("renders the choices the caller states over the schema's", async () => {
    await drawn(
      written("tags", { tags: [] }, (field) => <field.CheckboxCards options={["red", "blue"]} />),
    );

    expect(screen.getAllByRole("checkbox").map((each) => each.getAttribute("value"))).toStrictEqual(
      ["red", "blue"],
    );
  });

  it("checks no card in a form written by hand without a value", async () => {
    await drawn(written("tags", {}, (field) => <field.CheckboxCards options={["red", "blue"]} />));

    expect(
      screen.getAllByRole<HTMLInputElement>("checkbox").map((each) => each.checked),
    ).toStrictEqual([false, false]);
  });

  it("renders no card in a form written by hand without options", async () => {
    await drawn(written("tags", { tags: [] }, (field) => <field.CheckboxCards />));

    expect(screen.queryByRole("checkbox")).toBeNull();
  });

  it("runs the field's blur validators once focus leaves the set", async () => {
    await drawn(generated(ORDER, { fieldOptions: BLURRED, presentation: CARDS }));
    fireEvent.blur(card(/^audit/u), {
      relatedTarget: screen.getByRole("button", { name: "Submit" }),
    });
    await settled();

    expect(screen.getByText("Audit needs support")).toBeDefined();
  });

  it("runs no blur validator while focus moves between the cards", async () => {
    await drawn(generated(ORDER, { fieldOptions: BLURRED, presentation: CARDS }));
    fireEvent.blur(card(/^audit/u), { relatedTarget: card(/^sso/u) });
    await settled();

    expect(screen.queryByText("Audit needs support")).toBeNull();
  });
});
