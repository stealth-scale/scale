import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Schema, translateFrom } from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";
import { slotClass } from "@stealthscale/testing-theme";

import { generated, GLYPHS } from "#form/form.fixtures.tsx";

const CONSENT: Schema = {
  properties: {
    news: { type: "boolean" },
    terms: { const: true, description: "Read them first", type: "boolean" },
  },
  type: "object",
};

const WORDS = translateFrom({ "errors.const": "Accept the terms" });

/**
 * Submits the form.
 */
async function submitted(): Promise<void> {
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  await settled();
}

describe("Texts", () => {
  it("renders the help text while the field is valid", async () => {
    await drawn(generated(CONSENT));

    expect(screen.getByText("Read them first")).toBeDefined();
  });

  it("renders the error in place of the help text", async () => {
    await drawn(generated(CONSENT, { translate: WORDS }));
    await submitted();

    expect([
      screen.queryByText("Read them first"),
      screen.getByText("Accept the terms").getAttribute("role"),
    ]).toStrictEqual([null, "alert"]);
  });

  it("starts the error with the form's error glyph", async () => {
    await drawn(generated(CONSENT, { glyphs: GLYPHS, translate: WORDS }));
    await submitted();

    expect(screen.getByText("Accept the terms").querySelector("[data-glyph=error]")).not.toBeNull();
  });

  it("renders no text under a field that has neither", async () => {
    const { container } = await drawn(generated(CONSENT));

    expect(container.querySelectorAll(`.${slotClass("field", "helperText")}`)).toHaveLength(1);
  });
});
