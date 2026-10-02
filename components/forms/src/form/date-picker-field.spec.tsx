import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type Presentation, type Schema } from "@stealthscale/provider-form";
import { drawn, pressed, settled } from "@stealthscale/testing-react";

import { day, entered, hiddenOf, opened } from "#date-picker/date-picker.fixtures.tsx";
import { generated, GLYPHS, written } from "#form/form.fixtures.tsx";
import { WIDTH } from "#form/recipe.ts";

const BOOKING: Schema = {
  properties: { start: { format: "date", title: "Start date", type: "string" } },
  type: "object",
};

const PICKING: Presentation<Record<string, unknown>> = {
  fields: { start: { control: "date-picker" } },
  id: "profile",
};

const BLURRED = { start: { validators: { onBlur: (): string => "Start on a weekday" } } };

/**
 * Returns the date's box.
 */
function box(): HTMLInputElement {
  return screen.getByRole<HTMLInputElement>("textbox", { name: "Start date" });
}

/**
 * Submits the form.
 */
async function submitted(): Promise<void> {
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  await settled();
}

describe("DatePickerField", () => {
  it("renders a date box named by the field's label", async () => {
    await drawn(generated(BOOKING, { presentation: PICKING }));

    expect(box()).toBeDefined();
  });

  it("renders the trigger with the form's calendar glyph", async () => {
    await drawn(generated(BOOKING, { glyphs: GLYPHS, presentation: PICKING }));

    expect(
      screen
        .getByRole("button", { name: /^Choose a date/u })
        .querySelector("[data-glyph=calendar]"),
    ).not.toBeNull();
  });

  it("renders no trigger where neither the field nor the form gives glyphs", async () => {
    await drawn(generated(BOOKING, { presentation: PICKING }));

    expect(screen.queryByRole("button", { name: /^Choose a date/u })).toBeNull();
  });

  it("renders the trigger with the field's own glyphs over the form's", async () => {
    await drawn(
      written(
        "start",
        { start: "" },
        (field) => (
          <field.DatePicker
            glyphs={{
              calendar: <svg data-glyph="month" />,
              next: <svg data-glyph="later" />,
              previous: <svg data-glyph="earlier" />,
            }}
          />
        ),
        GLYPHS,
      ),
    );

    expect(document.querySelector("[data-glyph=month]")).not.toBeNull();
  });

  it("writes the date the form starts from into the hidden input", async () => {
    const { container } = await drawn(
      generated(BOOKING, { presentation: PICKING, values: { start: "2026-10-14" } }),
    );

    expect(hiddenOf(container).value).toBe("2026-10-14");
  });

  it("writes a typed date into the form's values", async () => {
    const submit = vi.fn<(values: Readonly<Record<string, unknown>>) => void>();

    await drawn(generated(BOOKING, { onSubmit: submit, presentation: PICKING }));
    await entered(box(), "10/14/2026");
    await submitted();

    expect(submit.mock.lastCall?.[0]).toStrictEqual({ start: "2026-10-14" });
  });

  it("writes a day picked from the calendar into the form's values", async () => {
    const submit = vi.fn<(values: Readonly<Record<string, unknown>>) => void>();

    await drawn(
      generated(BOOKING, {
        glyphs: GLYPHS,
        onSubmit: submit,
        presentation: PICKING,
        values: { start: "2026-10-14" },
      }),
    );
    await opened();
    await pressed(day("Tuesday, October 20, 2026"));
    await submitted();

    expect(submit.mock.lastCall?.[0]).toStrictEqual({ start: "2026-10-20" });
  });

  it("makes the box short by default", async () => {
    const { container } = await drawn(generated(BOOKING, { presentation: PICKING }));

    expect(container.querySelector(`[${WIDTH}]`)?.getAttribute(WIDTH)).toBe("short");
  });

  it("runs the field's blur validators once focus leaves the box", async () => {
    await drawn(generated(BOOKING, { fieldOptions: BLURRED, presentation: PICKING }));
    fireEvent.blur(box(), { relatedTarget: screen.getByRole("button", { name: "Submit" }) });
    await settled();

    expect(screen.getByText("Start on a weekday")).toBeDefined();
  });

  it("runs no blur validator while focus moves from the box to the trigger", async () => {
    await drawn(
      generated(BOOKING, { fieldOptions: BLURRED, glyphs: GLYPHS, presentation: PICKING }),
    );
    fireEvent.blur(box(), {
      relatedTarget: screen.getByRole("button", { name: /^Choose a date/u }),
    });
    await settled();

    expect(screen.queryByText("Start on a weekday")).toBeNull();
  });
});
