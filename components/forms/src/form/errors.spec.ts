import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Schema, translateFrom } from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";
import { slotClass } from "@stealthscale/testing-theme";

import { generated, GLYPHS } from "#form/form.fixtures.tsx";

const EMPTY: Schema = {
  maxProperties: 0,
  properties: { note: { type: "string" } },
  type: "object",
};

const WORDS = translateFrom({ "errors.maxProperties": "Leave the note out" });

/**
 * Returns the region the form's own errors are read from.
 */
function region(container: HTMLElement): HTMLElement | null {
  return container.querySelector<HTMLElement>(`.${slotClass("form", "errors")}`);
}

/**
 * Submits the form.
 */
async function submitted(): Promise<void> {
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  await settled();
}

describe("Errors", () => {
  it("renders an empty alert region from the first render", async () => {
    const { container } = await drawn(generated(EMPTY));

    expect([region(container)?.getAttribute("role"), region(container)?.textContent]).toStrictEqual(
      ["alert", ""],
    );
  });

  it("gives the region the id the form's identifier derives", async () => {
    const { container } = await drawn(generated(EMPTY));

    expect(region(container)?.id).toBe(`${container.querySelector("form")?.id ?? ""}-errors`);
  });

  it("shows the form's own errors after a refused submit", async () => {
    const { container } = await drawn(
      generated(EMPTY, { translate: WORDS, values: { note: "x" } }),
    );

    await submitted();

    expect(region(container)?.textContent).toBe("Leave the note out");
  });

  it("moves focus to the region when no field has the error", async () => {
    const { container } = await drawn(
      generated(EMPTY, { translate: WORDS, values: { note: "x" } }),
    );

    await submitted();

    expect(document.activeElement).toBe(region(container));
  });

  it("starts the alert with the form's error glyph", async () => {
    const { container } = await drawn(
      generated(EMPTY, { glyphs: GLYPHS, translate: WORDS, values: { note: "x" } }),
    );

    await submitted();

    expect(region(container)?.querySelector("[data-glyph=error]")).not.toBeNull();
  });

  it("renders no glyph where the form gives none", async () => {
    const { container } = await drawn(
      generated(EMPTY, { translate: WORDS, values: { note: "x" } }),
    );

    await submitted();

    expect(region(container)?.querySelector("svg")).toBeNull();
  });
});
