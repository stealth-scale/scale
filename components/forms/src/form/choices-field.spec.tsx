import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type Presentation, type Schema, translateFrom } from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";
import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { generated, GLYPHS, written } from "#form/form.fixtures.tsx";

const ALERTS: Schema = {
  properties: {
    channels: {
      description: "Pick every channel we may use",
      items: { enum: ["email", "chat", "sms"], type: "string" },
      minItems: 1,
      title: "Channels",
      type: "array",
      uniqueItems: true,
    },
  },
  type: "object",
};

const LISTED: Presentation<Record<string, unknown>> = { id: "profile", of: ["channels"] };

const WORDS = translateFrom({
  "errors.minItems": "Pick at least one channel",
  "profile.fields.channels.options.sms": "Text message",
});

/**
 * Presses the checkbox of the label given.
 */
async function ticked(name: string): Promise<void> {
  fireEvent.click(screen.getByRole("checkbox", { name }));
  await settled();
}

/**
 * Submits the form.
 */
async function submitted(): Promise<void> {
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  await settled();
}

describe("ChoicesField", () => {
  it("renders a group named by its label", async () => {
    await drawn(generated(ALERTS, { presentation: LISTED }));

    expect(screen.getByRole("group", { name: "Channels" })).toBeDefined();
  });

  it("takes the form's size", async () => {
    const { container } = await drawn(generated(ALERTS, { presentation: LISTED, size: "sm" }));

    expect(slotClasses(container, "field", "root")).toContain(
      variantClass(slotClass("field", "root"), "size", "sm"),
    );
  });

  it("renders the label in the field's label part", async () => {
    await drawn(generated(ALERTS, { presentation: LISTED }));

    expect(screen.getByText("Channels").className).toContain(slotClass("field", "label"));
  });

  it("leaves every box of a required group without required", async () => {
    await drawn(generated({ ...ALERTS, required: ["channels"] }, { presentation: LISTED }));

    expect(
      screen.getAllByRole<HTMLInputElement>("checkbox").map((each) => each.required),
    ).toStrictEqual([false, false, false]);
  });

  it("renders a checkbox per choice the items list", async () => {
    await drawn(generated(ALERTS, { presentation: LISTED, translate: WORDS }));

    expect(screen.getAllByRole("checkbox").map((each) => each.getAttribute("value"))).toStrictEqual(
      ["email", "chat", "sms"],
    );
  });

  it("reads a choice's words from the catalogue", async () => {
    await drawn(generated(ALERTS, { presentation: LISTED, translate: WORDS }));

    expect(screen.getByRole("checkbox", { name: "Text message" })).toBeDefined();
  });

  it("writes the picked values into the form's values", async () => {
    const submit = vi.fn<(values: Readonly<Record<string, unknown>>) => void>();

    await drawn(generated(ALERTS, { onSubmit: submit, presentation: LISTED }));
    await ticked("sms");
    await ticked("email");
    await submitted();

    expect(submit.mock.lastCall?.[0]).toStrictEqual({ channels: ["sms", "email"] });
  });

  it("shows the schema's error after a refused submit", async () => {
    await drawn(generated(ALERTS, { presentation: LISTED, translate: WORDS }));
    await submitted();

    expect(screen.getByText("Pick at least one channel")).toBeDefined();
  });

  it("shows the help text the schema states", async () => {
    await drawn(generated(ALERTS, { presentation: LISTED }));

    expect(screen.getByText("Pick every channel we may use")).toBeDefined();
  });

  it("shows the form's glyph inside each box", async () => {
    const { container } = await drawn(generated(ALERTS, { glyphs: GLYPHS, presentation: LISTED }));

    expect(container.querySelectorAll("[data-glyph=checkbox]")).toHaveLength(3);
  });

  it("shows the field's own glyph over the form's", async () => {
    const { container } = await drawn(
      written(
        "days",
        { days: [] },
        (field) => <field.Choices indicator={<svg data-glyph="tick" />} options={["mon", "tue"]} />,
        GLYPHS,
      ),
    );

    expect(container.querySelectorAll("[data-glyph=tick]")).toHaveLength(2);
  });

  it("renders no checkbox for an array without items", async () => {
    await drawn(written("days", {}, (field) => <field.Choices />));

    expect(screen.queryByRole("checkbox")).toBeNull();
  });

  it("runs the field's blur validators once focus leaves the group", async () => {
    await drawn(
      generated(ALERTS, {
        fieldOptions: { channels: { validators: { onBlur: () => "Chat needs a team plan" } } },
        presentation: LISTED,
      }),
    );
    fireEvent.blur(screen.getByRole("checkbox", { name: "chat" }), {
      relatedTarget: screen.getByRole("button", { name: "Submit" }),
    });
    await settled();

    expect(screen.getByText("Chat needs a team plan")).toBeDefined();
  });

  it("runs no blur validator while focus moves between the choices", async () => {
    await drawn(
      generated(ALERTS, {
        fieldOptions: { channels: { validators: { onBlur: () => "Chat needs a team plan" } } },
        presentation: LISTED,
      }),
    );
    fireEvent.blur(screen.getByRole("checkbox", { name: "email" }), {
      relatedTarget: screen.getByRole("checkbox", { name: "chat" }),
    });
    await settled();

    expect(screen.queryByText("Chat needs a team plan")).toBeNull();
  });
});
