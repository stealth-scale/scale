import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type Schema, translateFrom } from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";

import { generated, GLYPHS, written } from "#form/form.fixtures.tsx";
import { WIDTH } from "#form/recipe.ts";

const ACCOUNT: Schema = {
  properties: { password: { format: "password", minLength: 8, type: "string" } },
  required: ["password"],
  type: "object",
};

const WEAK = { password: { validators: { onBlur: (): string => "Choose a stronger password" } } };

/**
 * Returns the password box, which the field's label names with the required mark after it.
 */
function box(): HTMLInputElement {
  return screen.getByLabelText<HTMLInputElement>(/^Password/u);
}

describe("PasswordField", () => {
  it("renders a password box", async () => {
    await drawn(generated(ACCOUNT));

    expect(box().type).toBe("password");
  });

  it("renders an empty box in a form written by hand without a value", async () => {
    await drawn(written("password", {}, (field) => <field.Password />));

    expect(box().value).toBe("");
  });

  it("shows the value the form starts from", async () => {
    await drawn(generated(ACCOUNT, { values: { password: "correct horse" } }));

    expect(box().value).toBe("correct horse");
  });

  it("writes the typed password into the form's values", async () => {
    const submit = vi.fn<(values: Readonly<Record<string, unknown>>) => void>();

    await drawn(generated(ACCOUNT, { onSubmit: submit }));
    fireEvent.change(box(), { target: { value: "correct horse" } });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await settled();

    expect(submit.mock.lastCall?.[0]).toStrictEqual({ password: "correct horse" });
  });

  it("renders the button with the form's glyph for a hidden password", async () => {
    await drawn(generated(ACCOUNT, { glyphs: GLYPHS }));

    expect(
      screen.getByRole("button", { name: "Show password" }).querySelector("[data-glyph=show]"),
    ).not.toBeNull();
  });

  it("shows the password once the button is pressed", async () => {
    await drawn(generated(ACCOUNT, { glyphs: GLYPHS }));
    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    await settled();

    expect(box().type).toBe("text");
  });

  it("renders the glyph for a shown password once the button is pressed", async () => {
    await drawn(generated(ACCOUNT, { glyphs: GLYPHS }));
    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    await settled();

    expect(
      screen.getByRole("button", { name: "Hide password" }).querySelector("[data-glyph=hide]"),
    ).not.toBeNull();
  });

  it("renders no button where neither the field nor the form gives glyphs", async () => {
    await drawn(generated(ACCOUNT));

    expect(screen.queryByRole("button", { name: "Show password" })).toBeNull();
  });

  it("renders the button with the field's own glyphs over the form's", async () => {
    await drawn(
      written(
        "password",
        { password: "" },
        (field) => (
          <field.Password
            glyphs={{ hide: <svg data-glyph="shut" />, show: <svg data-glyph="open" /> }}
          />
        ),
        GLYPHS,
      ),
    );

    expect(
      screen.getByRole("button", { name: "Show password" }).querySelector("[data-glyph=open]"),
    ).not.toBeNull();
  });

  it("names the button in the catalogue's words", async () => {
    await drawn(
      generated(ACCOUNT, {
        glyphs: GLYPHS,
        translate: translateFrom({ "profile.actions.showPassword": "Reveal the password" }),
      }),
    );

    expect(screen.getByRole("button", { name: "Reveal the password" })).toBeDefined();
  });

  it("fills the box as the current password where the presentation states no purpose", async () => {
    await drawn(generated(ACCOUNT));

    expect(box().getAttribute("autocomplete")).toBe("current-password");
  });

  it("fills the box for the purpose the presentation states", async () => {
    await drawn(
      generated(ACCOUNT, {
        presentation: { fields: { password: { autocomplete: "new-password" } }, id: "profile" },
      }),
    );

    expect(box().getAttribute("autocomplete")).toBe("new-password");
  });

  it("fills the box as the current password for a purpose of another kind of field", async () => {
    await drawn(
      generated(ACCOUNT, {
        presentation: { fields: { password: { autocomplete: "email" } }, id: "profile" },
      }),
    );

    expect(box().getAttribute("autocomplete")).toBe("current-password");
  });

  it("runs the field's blur validators once focus leaves the box", async () => {
    await drawn(generated(ACCOUNT, { fieldOptions: WEAK, glyphs: GLYPHS }));
    fireEvent.blur(box(), { relatedTarget: null });
    await settled();

    expect(screen.getByText("Choose a stronger password")).toBeDefined();
  });

  it("runs no blur validator while focus moves from the box to its button", async () => {
    await drawn(generated(ACCOUNT, { fieldOptions: WEAK, glyphs: GLYPHS }));
    fireEvent.blur(box(), {
      relatedTarget: screen.getByRole("button", { name: "Show password" }),
    });
    await settled();

    expect(screen.queryByText("Choose a stronger password")).toBeNull();
  });

  it("takes the width the presentation states", async () => {
    const { container } = await drawn(
      generated(ACCOUNT, {
        presentation: { fields: { password: { width: "medium" } }, id: "profile" },
      }),
    );

    expect(container.querySelector(`[${WIDTH}]`)?.getAttribute(WIDTH)).toBe("medium");
  });

  it("floats the label in a form whose labels float", async () => {
    const { container } = await drawn(generated(ACCOUNT, { orientation: "floating" }));

    expect(container.querySelector(".field__root")?.className).toContain("field__root--floating");
  });
});
