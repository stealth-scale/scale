import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type Schema, translateFrom } from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";

import { focused, keyed, segment, typed } from "#date-input/date-input.fixtures.tsx";
import { generated } from "#form/form.fixtures.tsx";
import { WIDTH } from "#form/recipe.ts";

const BIRTH: Schema = {
  properties: { born: { format: "date", title: "Birth date", type: "string" } },
  required: ["born"],
  type: "object",
};

/**
 * Returns the hidden input the date submits through.
 */
function hidden(container: HTMLElement): HTMLInputElement | null {
  return container.querySelector<HTMLInputElement>("input[name=born]");
}

/**
 * Clears one segment of the birth date, a digit per Backspace.
 */
async function erased(part: string, digits: number): Promise<void> {
  const name = `${part}, Birth date`;

  await focused(segment(name));
  await removed(name, digits);
}

/**
 * Presses Backspace on a segment as many times as given.
 */
async function removed(name: string, presses: number): Promise<void> {
  if (presses === 0) return;

  await keyed(segment(name), "Backspace");
  await removed(name, presses - 1);
}

/**
 * Submits the form.
 */
async function submitted(): Promise<void> {
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  await settled();
}

describe("DateField", () => {
  it("names a segment per part of the date after the field's label", async () => {
    await drawn(generated(BIRTH));

    expect(
      ["month", "day", "year"].map((part) => segment(`${part}, Birth date`).getAttribute("role")),
    ).toStrictEqual(["spinbutton", "spinbutton", "spinbutton"]);
  });

  it("makes the input short by default", async () => {
    const { container } = await drawn(generated(BIRTH));

    expect(container.querySelector(`[${WIDTH}]`)?.getAttribute(WIDTH)).toBe("short");
  });

  it("shows the date the form starts from", async () => {
    const { container } = await drawn(generated(BIRTH, { values: { born: "1990-04-12" } }));

    expect(hidden(container)?.value).toBe("1990-04-12");
  });

  it("shows no date for a value that names no date of the calendar", async () => {
    const { container } = await drawn(generated(BIRTH, { values: { born: "1990-02-30" } }));

    expect(hidden(container)?.value).toBe("");
  });

  it("writes the date a person types into the form's values", async () => {
    const submit = vi.fn<(values: Readonly<Record<string, unknown>>) => void>();

    await drawn(generated(BIRTH, { onSubmit: submit }));
    await focused(segment("month, Birth date"));
    await typed("04121990");
    await submitted();

    expect(submit.mock.lastCall?.[0]).toStrictEqual({ born: "1990-04-12" });
  });

  it("shows the required error for a cleared date", async () => {
    await drawn(
      generated(BIRTH, {
        translate: translateFrom({ "errors.required": "Enter the date" }),
        values: { born: "1990-04-12" },
      }),
    );
    await erased("month", 2);
    await erased("day", 2);
    await erased("year", 4);
    await submitted();

    expect(screen.getByText("Enter the date")).toBeDefined();
  });

  it("runs the field's blur validators once focus leaves the segments", async () => {
    await drawn(
      generated(BIRTH, {
        fieldOptions: { born: { validators: { onBlur: () => "Use the date on the passport" } } },
      }),
    );
    fireEvent.blur(segment("year, Birth date"), {
      relatedTarget: screen.getByRole("button", { name: "Submit" }),
    });
    await settled();

    expect(screen.getByText("Use the date on the passport")).toBeDefined();
  });

  it("runs no blur validator while focus moves between the segments", async () => {
    await drawn(
      generated(BIRTH, {
        fieldOptions: { born: { validators: { onBlur: () => "Use the date on the passport" } } },
      }),
    );
    fireEvent.blur(segment("month, Birth date"), { relatedTarget: segment("day, Birth date") });
    await settled();

    expect(screen.queryByText("Use the date on the passport")).toBeNull();
  });
});
