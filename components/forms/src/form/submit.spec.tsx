import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type Schema, translateFrom } from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";

import { generated, written } from "#form/form.fixtures.tsx";
import { Submit } from "#form/submit.tsx";

const NOTE: Schema = { properties: { note: { type: "string" } }, type: "object" };

/**
 * Leaves a promise pending, by never calling its resolver.
 */
function unresolved(): void {}

/**
 * Returns a submit handler whose promise never settles, so the form submits until the case ends.
 */
function pending(): ReturnType<typeof vi.fn<() => Promise<void>>> {
  return vi.fn<() => Promise<void>>(() => new Promise<void>(unresolved));
}

describe("Submit", () => {
  it("reads Submit without children", async () => {
    await drawn(generated(NOTE));

    expect(screen.getByRole("button", { name: "Submit" }).getAttribute("type")).toBe("submit");
  });

  it("reads the catalogue's words for the submit action", async () => {
    await drawn(
      generated(NOTE, { translate: translateFrom({ "profile.actions.submit": "Save" }) }),
    );

    expect(screen.getByRole("button", { name: "Save" })).toBeDefined();
  });

  it("renders the words given as children", async () => {
    await drawn(written("note", {}, () => <Submit>Send</Submit>));

    expect(screen.getByRole("button", { name: "Send" })).toBeDefined();
  });

  it("marks the button disabled for assistive technology while the form submits", async () => {
    await drawn(generated(NOTE, { onSubmit: pending() }));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await settled();

    expect(screen.getByRole("button", { name: "Submit" }).getAttribute("aria-disabled")).toBe(
      "true",
    );
  });

  it("refuses a second press while the form submits", async () => {
    const submit = pending();

    await drawn(generated(NOTE, { onSubmit: submit }));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await settled();
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await settled();

    expect(submit).toHaveBeenCalledOnce();
  });

  it("calls the caller's click handler", async () => {
    const clicked = vi.fn<() => void>();

    await drawn(written("note", {}, () => <Submit onClick={clicked}>Send</Submit>));
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    await settled();

    expect(clicked).toHaveBeenCalledOnce();
  });
});
