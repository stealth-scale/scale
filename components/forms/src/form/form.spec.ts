import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type Schema } from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";
import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { generated, GLYPHS, scopeReading, written } from "#form/form.fixtures.tsx";

const NOTE: Schema = { properties: { note: { type: "string" } }, type: "object" };

describe("Form", () => {
  it("renders a form element without the browser's own validation", async () => {
    const { container } = await drawn(generated(NOTE));

    expect(container.querySelector("form")?.noValidate).toBe(true);
  });

  it("submits the form through the library on a submit event", async () => {
    const submit = vi.fn<(values: Readonly<Record<string, unknown>>) => void>();
    const { container } = await drawn(
      generated(NOTE, { onSubmit: submit, values: { note: "Hi" } }),
    );

    fireEvent.submit(container.querySelector("form") ?? document.body);
    await settled();

    expect(submit.mock.lastCall?.[0]).toStrictEqual({ note: "Hi" });
  });

  it("prevents the browser's own submit", async () => {
    const { container } = await drawn(generated(NOTE));
    const proceeded = fireEvent.submit(container.querySelector("form") ?? document.body);

    await settled();

    expect(proceeded).toBe(false);
  });

  it("resets every field to the form's defaults on a reset event", async () => {
    const { container } = await drawn(generated(NOTE, { values: { note: "Hi" } }));

    fireEvent.change(screen.getByRole("textbox", { name: "Note" }), { target: { value: "Bye" } });
    await settled();
    fireEvent.reset(container.querySelector("form") ?? document.body);
    await settled();

    expect(screen.getByRole<HTMLInputElement>("textbox", { name: "Note" }).value).toBe("Hi");
  });

  it("prevents the browser's own reset", async () => {
    const { container } = await drawn(generated(NOTE));
    const proceeded = fireEvent.reset(container.querySelector("form") ?? document.body);

    await settled();

    expect(proceeded).toBe(false);
  });

  it("applies the size it states to the form", async () => {
    const { container } = await drawn(generated(NOTE, { size: "lg" }));

    expect(slotClasses(container, "form", "root")).toContain(
      variantClass(slotClass("form", "root"), "size", "lg"),
    );
  });

  it("applies the size it states to every field", async () => {
    const { container } = await drawn(generated(NOTE, { size: "sm" }));

    expect(slotClasses(container, "field", "root")).toContain(
      variantClass(slotClass("field", "root"), "size", "sm"),
    );
  });

  it("gives its fields the glyphs it states", async () => {
    await drawn(written("note", {}, () => scopeReading(), GLYPHS));

    expect(screen.getByRole("status").textContent).toBe("2 none 8");
  });

  it("gives its fields no glyph where it states none", async () => {
    await drawn(written("note", {}, () => scopeReading()));

    expect(screen.getByRole("status").textContent).toBe("2 none 0");
  });
});
