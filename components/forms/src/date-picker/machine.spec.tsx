import { parseZonedDateTime } from "@internationalized/date";
import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { Content } from "#date-picker/content.tsx";
import {
  framed,
  inlined,
  OCTOBER_14,
  opened,
  picked,
  trigger,
  views,
} from "#date-picker/date-picker.fixtures.tsx";
import { idsOf, splitDatePickerProps } from "#date-picker/machine.ts";
import { Positioner } from "#date-picker/positioner.tsx";
import { Root } from "#date-picker/root.tsx";
import { Trigger } from "#date-picker/trigger.tsx";

/**
 * Waits for the machine to watch for a press outside the panel, which it starts one task after
 * the panel opens.
 *
 * @returns A promise that resolves once the machine watches.
 */
async function watched(): Promise<void> {
  await act(
    () =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, 20);
      }),
  );
}

/**
 * Presses an element outside the panel and waits for the machine to close it.
 *
 * @param element - The element pressed.
 * @returns A promise that resolves once the panel has closed.
 */
async function pressedOutside(element: Element): Promise<void> {
  fireEvent.pointerDown(element, { button: 0, pointerType: "mouse" });
  await framed();
  await settled();
}

describe("machine", () => {
  it("builds every ID from the machine's ID", () => {
    const ids = idsOf("trip");

    expect([
      ids.content,
      ids.hiddenInput(1),
      ids.input(1),
      ids.label(0),
      ids.trigger,
    ]).toStrictEqual([
      "datepicker:trip:content",
      "datepicker:trip:hidden-input:1",
      "datepicker:trip:input:1",
      "datepicker:trip:label:0",
      "datepicker:trip:trigger",
    ]);
  });

  it("joins a table's view and React ID with a hyphen", () => {
    expect(idsOf("trip").table("day _r_1_")).toBe("datepicker:trip:table:day-_r_1_");
  });

  it("keeps a table ID the caller states", () => {
    expect(idsOf("trip", { table: (uid) => `grid ${uid}` }).table("day")).toBe("grid day");
  });

  it("gives the first input the ID of the field's control", () => {
    expect(idsOf("trip", undefined, "field-control").input(0)).toBe("field-control");
  });

  it("keeps the second input's own ID inside a field", () => {
    expect(idsOf("trip", undefined, "field-control").input(1)).toBe("datepicker:trip:input:1");
  });

  it("keeps an ID the caller states", () => {
    const ids = idsOf("trip", {
      content: "panel",
      input: (index) => `input-${index}`,
      label: (index) => `label-${index}`,
      trigger: "button",
    });

    expect([ids.content, ids.input(0), ids.label(0), ids.trigger]).toStrictEqual([
      "panel",
      "input-0",
      "label-0",
      "button",
    ]);
  });

  it("splits the machine's options from the element's props", () => {
    expect(splitDatePickerProps({ locale: "de-DE", title: "Trip" })).toStrictEqual([
      { locale: "de-DE" },
      { title: "Trip" },
    ]);
  });

  it("drops translations from the options", () => {
    const [options] = splitDatePickerProps({ locale: "de-DE", translations: {} });

    expect(options).toStrictEqual({ locale: "de-DE" });
  });

  it("formats a zoned value in its own zone", async () => {
    await drawn(
      picked({ defaultValue: [parseZonedDateTime("2026-10-14T23:30[America/New_York]")] }),
    );

    expect(screen.getByRole<HTMLInputElement>("textbox").value).toBe("10/14/2026");
  });

  it("reads the focused value the caller keeps", async () => {
    await drawn(inlined({ focusedValue: OCTOBER_14 }));

    expect(screen.getByRole("grid", { name: "October 2026" })).toBeDefined();
  });

  it("opens the panel under the control's start", async () => {
    await drawn(picked());
    await opened();

    expect(trigger().dataset["placement"]).toBe("bottom-start");
  });

  it("closes the panel on a press outside", async () => {
    await drawn(picked());
    await opened();
    await watched();
    await pressedOutside(document.body);

    expect(trigger().getAttribute("aria-expanded")).toBe("false");
  });

  it("returns focus to the trigger after a press on nothing focusable outside", async () => {
    await drawn(picked());
    await opened();
    await watched();
    await pressedOutside(document.body);

    expect(document.activeElement).toBe(trigger());
  });

  it("leaves focus on a control pressed outside", async () => {
    await drawn(
      <>
        {picked()}
        <input aria-label="Name" />
      </>,
    );
    await opened();
    await watched();

    const other = screen.getByRole("textbox", { name: "Name" });

    act(() => {
      other.focus();
    });
    await pressedOutside(other);

    expect(document.activeElement).toBe(other);
  });

  it("finds the trigger by the ID the caller states", async () => {
    await drawn(picked({ ids: { trigger: "appointment-trigger" } }));
    await opened();
    await watched();
    await pressedOutside(document.body);

    expect(document.activeElement?.id).toBe("appointment-trigger");
  });

  it("closes the panel on Escape and returns focus to the trigger", async () => {
    await drawn(picked());
    await opened();
    await watched();
    fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
    await framed();
    await settled();

    expect(document.activeElement).toBe(trigger());
  });

  it("closes a panel without a control on a press outside", async () => {
    await drawn(
      <Root defaultFocusedValue={OCTOBER_14}>
        <Trigger />
        <Positioner>
          <Content>{views()}</Content>
        </Positioner>
      </Root>,
    );
    await opened();
    await watched();
    await pressedOutside(document.body);

    expect(trigger().getAttribute("aria-expanded")).toBe("false");
  });

  it("keeps an inline panel open on a press outside", async () => {
    await drawn(inlined());
    await watched();
    await pressedOutside(document.body);

    expect(screen.getByRole("grid", { name: "October 2026" })).toBeDefined();
  });
});
