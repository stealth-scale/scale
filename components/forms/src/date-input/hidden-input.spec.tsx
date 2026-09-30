import { parseDate } from "@internationalized/date";
import { act, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import {
  dated,
  focused,
  hiddenOf,
  keyed,
  segment,
  stay,
  typed,
} from "#date-input/date-input.fixtures.tsx";

/**
 * Returns the form around a render.
 *
 * @param container - The render's container.
 * @returns The form element, or nothing without one.
 */
function formOf(container: HTMLElement): HTMLFormElement | undefined {
  return container.querySelector("form") ?? undefined;
}

describe("HiddenInput", () => {
  it("submits the date in ISO 8601 under the root's name", async () => {
    const { container } = await drawn(
      <form>{dated({ defaultValue: [parseDate("2026-09-26")], name: "appointment" })}</form>,
    );

    expect(new FormData(formOf(container)).get("appointment")).toBe("2026-09-26");
  });

  it("submits a range with one date under indexed names", async () => {
    const { container } = await drawn(
      <form>{stay({ defaultValue: [parseDate("2026-10-02")], name: "stay" })}</form>,
    );

    expect([...new FormData(formOf(container)).entries()]).toStrictEqual([
      ["stay[0]", "2026-10-02"],
      ["stay[1]", ""],
    ]);
  });

  it("submits nothing without a name", async () => {
    const { container } = await drawn(
      <form>{dated({ defaultValue: [parseDate("2026-09-26")] })}</form>,
    );

    expect([...new FormData(formOf(container)).entries()]).toStrictEqual([]);
  });

  it("submits nothing while a segment of the date is empty", async () => {
    const { container } = await drawn(dated({ defaultValue: [parseDate("2026-09-26")] }));

    await focused(segment("day, Appointment"));
    await keyed(segment("day, Appointment"), "Backspace");
    await keyed(segment("day, Appointment"), "Backspace");

    expect(hiddenOf(container).value).toBe("");
  });

  it("refuses an empty date while required", async () => {
    const { container } = await drawn(dated({ required: true }));

    expect(hiddenOf(container).checkValidity()).toBe(false);
  });

  it("leaves the tab order", async () => {
    const { container } = await drawn(dated());

    expect(hiddenOf(container).tabIndex).toBe(-1);
  });

  it("keeps the machine's date when a script writes the input", async () => {
    const { container } = await drawn(dated({ defaultValue: [parseDate("2026-09-26")] }));
    const input = hiddenOf(container);

    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(
      input,
      "1999-01-01",
    );
    fireEvent(input, new InputEvent("input", { bubbles: true }));
    await settled();

    expect(input.value).toBe("2026-09-26");
  });

  it("moves focus to the first segment of its group when it takes focus", async () => {
    const { container } = await drawn(stay());

    act(() => {
      hiddenOf(container, 1).focus();
    });
    await settled();

    expect(document.activeElement).toBe(segment("month, Check-out, Stay"));
  });

  it("restores the first dates when its form resets", async () => {
    const { container } = await drawn(
      <form>{dated({ defaultValue: [parseDate("2026-09-26")] })}</form>,
    );

    await focused(segment("year, Appointment"));
    await typed("2027");
    act(() => {
      formOf(container)?.reset();
    });
    await settled();

    expect(hiddenOf(container).value).toBe("2026-09-26");
  });
});
