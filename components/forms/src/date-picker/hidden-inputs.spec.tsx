import { type ReactElement } from "react";

import { parseDate } from "@internationalized/date";
import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import {
  entered,
  hiddenOf,
  inlined,
  OCTOBER_14,
  picked,
  trigger,
} from "#date-picker/date-picker.fixtures.tsx";
import { Input } from "#date-picker/input.tsx";
import { type RootProps } from "#date-picker/root.tsx";
import { Trigger } from "#date-picker/trigger.tsx";

/**
 * Two dates of a stay: October 2 to October 5, 2026.
 */
const STAY = [parseDate("2026-10-02"), parseDate("2026-10-05")];

/**
 * Two days picked from one calendar: October 14 and October 20, 2026.
 */
const DAYS = [OCTOBER_14, parseDate("2026-10-20")];

/**
 * Returns the form around a render.
 *
 * @param container - The render's container.
 * @returns The form element, or nothing without one.
 */
function formOf(container: HTMLElement): HTMLFormElement | undefined {
  return container.querySelector("form") ?? undefined;
}

/**
 * Renders a floating range picker with a check-in and a check-out input.
 *
 * @param props - The props of the root.
 * @returns The date picker.
 */
function stayed(props: RootProps = {}): ReactElement {
  return picked(
    { selectionMode: "range", ...props },
    {
      control: (
        <>
          <Input aria-label="Check-in" />
          <Input aria-label="Check-out" index={1} />
          <Trigger />
        </>
      ),
    },
  );
}

describe("HiddenInputs", () => {
  it("submits the date in ISO 8601 under the root's name", async () => {
    const { container } = await drawn(
      <form>{picked({ defaultValue: [OCTOBER_14], name: "appointment" })}</form>,
    );

    expect(new FormData(formOf(container)).get("appointment")).toBe("2026-10-14");
  });

  it("submits a range under indexed names", async () => {
    const { container } = await drawn(<form>{stayed({ defaultValue: STAY, name: "stay" })}</form>);

    expect([...new FormData(formOf(container)).entries()]).toStrictEqual([
      ["stay[0]", "2026-10-02"],
      ["stay[1]", "2026-10-05"],
    ]);
  });

  it("submits each of multiple dates under the root's name", async () => {
    const { container } = await drawn(
      <form>{inlined({ defaultValue: DAYS, name: "days", selectionMode: "multiple" })}</form>,
    );

    expect([...new FormData(formOf(container)).entries()]).toStrictEqual([
      ["days", "2026-10-14"],
      ["days", "2026-10-20"],
    ]);
  });

  it("renders one input for multiple dates while none is set", async () => {
    const { container } = await drawn(inlined({ selectionMode: "multiple" }));

    expect(container.querySelectorAll('input[aria-hidden="true"]')).toHaveLength(1);
  });

  it("submits nothing without a name", async () => {
    const { container } = await drawn(<form>{picked({ defaultValue: [OCTOBER_14] })}</form>);

    expect([...new FormData(formOf(container)).entries()]).toStrictEqual([]);
  });

  it("refuses an empty date while required", async () => {
    const { container } = await drawn(picked({ required: true }));

    expect(hiddenOf(container).checkValidity()).toBe(false);
  });

  it("requires the end of a range while required", async () => {
    const { container } = await drawn(stayed({ required: true }));

    expect(hiddenOf(container, 1).required).toBe(true);
  });

  it("requires only the first of multiple dates while required", async () => {
    const { container } = await drawn(
      inlined({ defaultValue: DAYS, required: true, selectionMode: "multiple" }),
    );

    expect(hiddenOf(container, 1).required).toBe(false);
  });

  it("is read-only in a read-only picker", async () => {
    const { container } = await drawn(picked({ readOnly: true }));

    expect(hiddenOf(container).readOnly).toBe(true);
  });

  it("is disabled in a disabled picker", async () => {
    const { container } = await drawn(picked({ disabled: true }));

    expect(hiddenOf(container).disabled).toBe(true);
  });

  it("leaves the tab order", async () => {
    const { container } = await drawn(picked());

    expect(hiddenOf(container).tabIndex).toBe(-1);
  });

  it("keeps the machine's date when a script writes the input", async () => {
    const { container } = await drawn(picked({ defaultValue: [OCTOBER_14] }));
    const input = hiddenOf(container);

    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(
      input,
      "1999-01-01",
    );
    fireEvent(input, new InputEvent("input", { bubbles: true }));
    await settled();

    expect(input.value).toBe("2026-10-14");
  });

  it("moves focus to the text input of its date when it takes focus", async () => {
    const { container } = await drawn(stayed());

    act(() => {
      hiddenOf(container, 1).focus();
    });
    await settled();

    expect(document.activeElement).toBe(
      screen.getByRole("textbox", { name: "Appointment Check-out" }),
    );
  });

  it("moves focus to the first text input when its date has none", async () => {
    const { container } = await drawn(picked({ selectionMode: "range" }));

    act(() => {
      hiddenOf(container, 1).focus();
    });
    await settled();

    expect(document.activeElement).toBe(screen.getByRole("textbox"));
  });

  it("moves focus to the trigger without a text input", async () => {
    const { container } = await drawn(picked({}, { control: <Trigger /> }));

    act(() => {
      hiddenOf(container).focus();
    });

    expect(document.activeElement).toBe(trigger());
  });

  it("restores the first dates when its form resets", async () => {
    const { container } = await drawn(<form>{picked({ defaultValue: [OCTOBER_14] })}</form>);

    await entered(screen.getByRole("textbox"), "10/20/2026");
    act(() => {
      formOf(container)?.reset();
    });
    await settled();

    expect(hiddenOf(container).value).toBe("2026-10-14");
  });
});
