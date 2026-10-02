import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type Schema, translateFrom } from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";

import { generated, GLYPHS, written } from "#form/form.fixtures.tsx";
import { WIDTH } from "#form/recipe.ts";

const PROFILE: Schema = {
  properties: {
    email: { format: "email", type: "string" },
    name: { minLength: 2, title: "Full name", type: "string" },
    website: { format: "url", type: "string" },
  },
  required: ["name"],
  type: "object",
};

const WORDS = translateFrom({
  "errors.minLength": "Too short",
  "profile.fields.email.placeholder": "name@example.com",
});

/**
 * Types a name into the name box and submits the form.
 */
async function submittedAs(name: string): Promise<void> {
  fireEvent.change(screen.getByRole("textbox", { name: "Full name" }), { target: { value: name } });
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  await settled();
}

describe("TextField", () => {
  it("takes the column's width by default", async () => {
    const { container } = await drawn(generated(PROFILE));

    expect(container.querySelector(`[${WIDTH}]`)).toBeNull();
  });

  it("takes the width the presentation states", async () => {
    const { container } = await drawn(
      generated(PROFILE, {
        presentation: { fields: { email: { width: "medium" } }, id: "profile" },
      }),
    );

    expect(container.querySelector(`[${WIDTH}]`)?.getAttribute(WIDTH)).toBe("medium");
  });

  it("renders a text box named by the schema's title", async () => {
    await drawn(generated(PROFILE));

    expect(screen.getByRole("textbox", { name: "Full name" })).toHaveProperty("type", "text");
  });

  it("renders an email box for a property of the email format", async () => {
    await drawn(generated(PROFILE));

    expect(screen.getByRole("textbox", { name: "Email" })).toHaveProperty("type", "email");
  });

  it("renders a URL box for a property of the url format", async () => {
    await drawn(generated(PROFILE));

    expect(screen.getByRole("textbox", { name: "Website" })).toHaveProperty("type", "url");
  });

  it("renders the type the caller states over the schema's format", async () => {
    await drawn(written("secret", { secret: "" }, (field) => <field.Text type="password" />));

    expect(screen.getByLabelText("Secret")).toHaveProperty("type", "password");
  });

  it("renders an empty box for a field without a value", async () => {
    await drawn(written("note", {}, (field) => <field.Text />));

    expect(screen.getByRole("textbox", { name: "Note" })).toHaveProperty("value", "");
  });

  it("writes what a person types into the form's values", async () => {
    const submitted = vi.fn<(values: Readonly<Record<string, unknown>>) => void>();

    await drawn(generated(PROFILE, { onSubmit: submitted }));
    await submittedAs("Ada Lovelace");

    expect(submitted.mock.lastCall?.[0]).toMatchObject({ name: "Ada Lovelace" });
  });

  it("shows the schema's error after a refused submit", async () => {
    await drawn(generated(PROFILE, { translate: WORDS }));
    await submittedAs("A");

    expect(screen.getByText("Too short").getAttribute("role")).toBe("alert");
  });

  it("starts the error with the form's error glyph", async () => {
    await drawn(generated(PROFILE, { glyphs: GLYPHS, translate: WORDS }));
    await submittedAs("A");

    expect(screen.getByText("Too short").querySelector("[data-glyph=error]")).not.toBeNull();
  });

  it("writes the purpose the presentation states on the box", async () => {
    await drawn(
      generated(PROFILE, {
        presentation: { fields: { email: { autocomplete: "email" } }, id: "profile" },
      }),
    );

    expect(screen.getByRole("textbox", { name: "Email" }).getAttribute("autocomplete")).toBe(
      "email",
    );
  });

  it("writes the placeholder the catalogue gives on the box", async () => {
    await drawn(generated(PROFILE, { translate: WORDS }));

    expect(screen.getByRole("textbox", { name: "Email" }).getAttribute("placeholder")).toBe(
      "name@example.com",
    );
  });

  it("runs the field's blur validators once focus leaves the box", async () => {
    await drawn(
      generated(PROFILE, {
        fieldOptions: {
          name: {
            validators: { onBlur: ({ value }) => (value === "" ? "Enter your name" : undefined) },
          },
        },
      }),
    );
    fireEvent.blur(screen.getByRole("textbox", { name: "Full name" }));
    await settled();

    expect(screen.getByText("Enter your name")).toBeDefined();
  });
});
