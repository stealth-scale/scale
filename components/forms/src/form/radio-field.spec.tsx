import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type Schema, translateFrom } from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";
import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { generated, written } from "#form/form.fixtures.tsx";

const CONTACT: Schema = {
  properties: { channel: { enum: ["email", "chat"], title: "Channel", type: "string" } },
  required: ["channel"],
  type: "object",
};

const WORDS = translateFrom({
  "errors.enum": "Pick a channel",
  "profile.fields.channel.options.chat": "Chat message",
});

/**
 * Returns the radio of the name given.
 */
function radio(name: string): HTMLInputElement {
  return screen.getByRole<HTMLInputElement>("radio", { name });
}

/**
 * Submits the form.
 */
async function submitted(): Promise<void> {
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  await settled();
}

describe("RadioField", () => {
  it("renders a radio group named by its label", async () => {
    await drawn(generated(CONTACT));

    expect(screen.getByRole("radiogroup", { name: "Channel" })).toBeDefined();
  });

  it("takes the form's size", async () => {
    const { container } = await drawn(generated(CONTACT, { size: "sm" }));

    expect(slotClasses(container, "field", "root")).toContain(
      variantClass(slotClass("field", "root"), "size", "sm"),
    );
  });

  it("renders a radio per choice the schema lists", async () => {
    await drawn(generated(CONTACT));

    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("reads a choice's words from the catalogue", async () => {
    await drawn(generated(CONTACT, { translate: WORDS }));

    expect(radio("Chat message")).toBeDefined();
  });

  it("checks no radio until a person chooses", async () => {
    await drawn(generated(CONTACT));

    expect(
      screen.getAllByRole<HTMLInputElement>("radio").map((each) => each.checked),
    ).toStrictEqual([false, false]);
  });

  it("checks the radio of the value the form starts from", async () => {
    await drawn(generated(CONTACT, { values: { channel: "chat" } }));

    expect(radio("chat").checked).toBe(true);
  });

  it("writes the choice a person makes into the form's values", async () => {
    const submit = vi.fn<(values: Readonly<Record<string, unknown>>) => void>();

    await drawn(generated(CONTACT, { onSubmit: submit }));
    fireEvent.click(radio("email"));
    await settled();
    await submitted();

    expect(submit.mock.lastCall?.[0]).toStrictEqual({ channel: "email" });
  });

  it("clears the choice on a form reset", async () => {
    const { container } = await drawn(generated(CONTACT));

    fireEvent.click(radio("email"));
    await settled();
    fireEvent.reset(container.querySelector("form") ?? document.body);
    await settled();

    expect(radio("email").checked).toBe(false);
  });

  it("renders no radio in a form written by hand without options", async () => {
    await drawn(written("size", { size: "" }, (field) => <field.Radio />));

    expect(screen.queryByRole("radio")).toBeNull();
  });

  it("shows the schema's error after a refused submit", async () => {
    await drawn(generated(CONTACT, { translate: WORDS }));
    await submitted();

    expect(screen.getByText("Pick a channel").getAttribute("role")).toBe("alert");
  });

  it("renders the choices the caller states over the schema's", async () => {
    await drawn(
      written("size", { size: "" }, (field) => <field.Radio options={["small", "large"]} />),
    );

    expect(screen.getAllByRole("radio").map((each) => each.getAttribute("value"))).toStrictEqual([
      "small",
      "large",
    ]);
  });

  it("runs the field's blur validators once focus leaves the group", async () => {
    await drawn(
      generated(CONTACT, {
        fieldOptions: { channel: { validators: { onBlur: () => "Chat is for teams" } } },
      }),
    );
    fireEvent.blur(radio("email"), {
      relatedTarget: screen.getByRole("button", { name: "Submit" }),
    });
    await settled();

    expect(screen.getByText("Chat is for teams")).toBeDefined();
  });

  it("runs no blur validator while focus moves between the choices", async () => {
    await drawn(
      generated(CONTACT, {
        fieldOptions: { channel: { validators: { onBlur: () => "Chat is for teams" } } },
      }),
    );
    fireEvent.blur(radio("email"), { relatedTarget: radio("chat") });
    await settled();

    expect(screen.queryByText("Chat is for teams")).toBeNull();
  });
});
