import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type Presentation, type Schema, translateFrom } from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";
import { slotClass } from "@stealthscale/testing-theme";

import { generated, written } from "#form/form.fixtures.tsx";

const ACCOUNT: Schema = {
  properties: { plan: { enum: ["starter", "team"], title: "Plan", type: "string" } },
  required: ["plan"],
  type: "object",
};

const CARDS: Presentation<Record<string, unknown>> = {
  fields: { plan: { control: "cards" } },
  id: "profile",
};

const WORDS = translateFrom({
  "profile.fields.plan.descriptions.team": "Up to 50 seats, with shared billing",
  "profile.fields.plan.options.team": "Team",
});

const BLURRED = { plan: { validators: { onBlur: (): string => "Teams need two seats" } } };

/**
 * Returns the card of the name given.
 */
function card(name: RegExp | string): HTMLInputElement {
  return screen.getByRole<HTMLInputElement>("radio", { name });
}

/**
 * Returns the words under each card, in order.
 */
function descriptions(container: HTMLElement): ReadonlyArray<null | string> {
  return [...container.querySelectorAll(`.${slotClass("radio-card", "itemDescription")}`)].map(
    (element) => element.textContent,
  );
}

describe("RadioCardsField", () => {
  it("renders a group named by the field's label", async () => {
    await drawn(generated(ACCOUNT, { presentation: CARDS }));

    expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeDefined();
  });

  it("renders a card per choice the schema lists", async () => {
    await drawn(generated(ACCOUNT, { presentation: CARDS }));

    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("reads a card's words from the catalogue", async () => {
    await drawn(generated(ACCOUNT, { presentation: CARDS, translate: WORDS }));

    expect(card(/^Team/u)).toBeDefined();
  });

  it("shows the words the catalogue gives under a card", async () => {
    const { container } = await drawn(
      generated(ACCOUNT, { presentation: CARDS, translate: WORDS }),
    );

    expect(descriptions(container)).toStrictEqual(["Up to 50 seats, with shared billing"]);
  });

  it("checks the card of the value the form starts from", async () => {
    await drawn(generated(ACCOUNT, { presentation: CARDS, values: { plan: "starter" } }));

    expect(card(/^starter/u).checked).toBe(true);
  });

  it("checks no card until a person chooses", async () => {
    await drawn(generated(ACCOUNT, { presentation: CARDS }));

    expect(
      screen.getAllByRole<HTMLInputElement>("radio").map((each) => each.checked),
    ).toStrictEqual([false, false]);
  });

  it("writes the choice a person makes into the form's values", async () => {
    const submit = vi.fn<(values: Readonly<Record<string, unknown>>) => void>();

    await drawn(generated(ACCOUNT, { onSubmit: submit, presentation: CARDS }));
    fireEvent.click(card(/^starter/u));
    await settled();
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await settled();

    expect(submit.mock.lastCall?.[0]).toStrictEqual({ plan: "starter" });
  });

  it("clears the choice on a form reset", async () => {
    const { container } = await drawn(generated(ACCOUNT, { presentation: CARDS }));

    fireEvent.click(card(/^starter/u));
    await settled();
    fireEvent.reset(container.querySelector("form") ?? document.body);
    await settled();

    expect(card(/^starter/u).checked).toBe(false);
  });

  it("renders the choices the caller states over the schema's", async () => {
    await drawn(
      written("size", { size: "" }, (field) => <field.RadioCards options={["small", "large"]} />),
    );

    expect(screen.getAllByRole("radio").map((each) => each.getAttribute("value"))).toStrictEqual([
      "small",
      "large",
    ]);
  });

  it("renders no card in a form written by hand without options", async () => {
    await drawn(written("size", { size: "" }, (field) => <field.RadioCards />));

    expect(screen.queryByRole("radio")).toBeNull();
  });

  it("runs the field's blur validators once focus leaves the group", async () => {
    await drawn(generated(ACCOUNT, { fieldOptions: BLURRED, presentation: CARDS }));
    fireEvent.blur(card(/^starter/u), {
      relatedTarget: screen.getByRole("button", { name: "Submit" }),
    });
    await settled();

    expect(screen.getByText("Teams need two seats")).toBeDefined();
  });

  it("runs no blur validator while focus moves between the cards", async () => {
    await drawn(generated(ACCOUNT, { fieldOptions: BLURRED, presentation: CARDS }));
    fireEvent.blur(card(/^starter/u), { relatedTarget: card(/^team/u) });
    await settled();

    expect(screen.queryByText("Teams need two seats")).toBeNull();
  });
});
