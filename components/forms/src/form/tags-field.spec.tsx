import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type Presentation, type Schema, translateFrom } from "@stealthscale/provider-form";
import { drawn, pressed, settled } from "@stealthscale/testing-react";

import { generated, GLYPHS, written } from "#form/form.fixtures.tsx";
import { framed, tags } from "#tags-input/tags-input.fixtures.tsx";

const PROFILE: Schema = {
  properties: { skills: { items: { type: "string" }, title: "Skills", type: "array" } },
  type: "object",
};

const NAMED: Presentation<Record<string, unknown>> = { id: "profile", of: ["skills"] };

/**
 * Returns the box a person types a tag into.
 */
function box(): HTMLInputElement {
  return screen.getByRole<HTMLInputElement>("textbox", { name: "Skills" });
}

/**
 * Types a tag and presses Enter, which turns the text into a tag.
 */
async function tagged(text: string): Promise<void> {
  act(() => {
    box().focus();
  });
  await settled();
  fireEvent.input(box(), { target: { value: text } });
  await settled();
  fireEvent.keyDown(box(), { key: "Enter" });
  await settled();
  await framed();
}

/**
 * Submits the form.
 */
async function submitted(): Promise<void> {
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  await settled();
}

describe("TagsField", () => {
  it("renders a box named by the field's label", async () => {
    await drawn(generated(PROFILE, { presentation: NAMED }));

    expect(box()).toBeDefined();
  });

  it("shows no tag in a form written by hand without a value", async () => {
    const { container } = await drawn(written("skills", {}, (field) => <field.Tags />));

    expect(tags(container)).toStrictEqual([]);
  });

  it("runs no blur validator while focus moves from the box to a tag's button", async () => {
    await drawn(
      generated(PROFILE, {
        fieldOptions: { skills: { validators: { onBlur: () => "Add one skill at least" } } },
        glyphs: GLYPHS,
        presentation: NAMED,
        values: { skills: ["React"] },
      }),
    );
    fireEvent.blur(box(), { relatedTarget: screen.getByRole("button", { name: "Remove React" }) });
    await settled();

    expect(screen.queryByText("Add one skill at least")).toBeNull();
  });

  it("shows the tags the form starts from", async () => {
    const { container } = await drawn(
      generated(PROFILE, { presentation: NAMED, values: { skills: ["React", "Go"] } }),
    );

    expect(tags(container)).toStrictEqual(["React", "Go"]);
  });

  it("writes a tag typed and entered into the form's values", async () => {
    const submit = vi.fn<(values: Readonly<Record<string, unknown>>) => void>();

    await drawn(generated(PROFILE, { onSubmit: submit, presentation: NAMED }));
    await tagged("Rust");
    await submitted();

    expect(submit.mock.lastCall?.[0]).toStrictEqual({ skills: ["Rust"] });
  });

  it("renders a button per tag with the form's remove glyph", async () => {
    await drawn(
      generated(PROFILE, { glyphs: GLYPHS, presentation: NAMED, values: { skills: ["React"] } }),
    );

    expect(
      screen.getByRole("button", { name: "Remove React" }).querySelector("[data-glyph=remove]"),
    ).not.toBeNull();
  });

  it("renders no button where neither the field nor the form gives the remove glyph", async () => {
    await drawn(generated(PROFILE, { presentation: NAMED, values: { skills: ["React"] } }));

    expect(screen.queryByRole("button", { name: "Remove React" })).toBeNull();
  });

  it("names the button in the catalogue's words", async () => {
    await drawn(
      generated(PROFILE, {
        glyphs: GLYPHS,
        presentation: NAMED,
        translate: translateFrom({ "profile.actions.removeTag": "Delete {{value}}" }),
        values: { skills: ["React"] },
      }),
    );

    expect(screen.getByRole("button", { name: "Delete React" })).toBeDefined();
  });

  it("removes a tag once its button is pressed", async () => {
    const submit = vi.fn<(values: Readonly<Record<string, unknown>>) => void>();

    await drawn(
      generated(PROFILE, {
        glyphs: GLYPHS,
        onSubmit: submit,
        presentation: NAMED,
        values: { skills: ["React", "Go"] },
      }),
    );
    await pressed(screen.getByRole("button", { name: "Remove React" }));
    await settled();
    await submitted();

    expect(submit.mock.lastCall?.[0]).toStrictEqual({ skills: ["Go"] });
  });

  it("renders the button with the field's own remove glyph over the form's", async () => {
    await drawn(
      written(
        "skills",
        { skills: ["React"] },
        (field) => <field.Tags remove={<svg data-glyph="cross" />} />,
        GLYPHS,
      ),
    );

    expect(document.querySelector("[data-glyph=cross]")).not.toBeNull();
  });

  it("runs the field's blur validators once focus leaves the box", async () => {
    await drawn(
      generated(PROFILE, {
        fieldOptions: { skills: { validators: { onBlur: () => "Add one skill at least" } } },
        presentation: NAMED,
      }),
    );
    fireEvent.blur(box(), { relatedTarget: screen.getByRole("button", { name: "Submit" }) });
    await settled();

    expect(screen.getByText("Add one skill at least")).toBeDefined();
  });
});
