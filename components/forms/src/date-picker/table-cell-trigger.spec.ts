import { act, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";

import { day, hiddenOf, inlined, keyed } from "#date-picker/date-picker.fixtures.tsx";

/**
 * Moves focus to the trigger of Thursday, October 15, 2026, as the machine does from a script.
 *
 * @returns The trigger.
 */
function focusedDay(): HTMLElement {
  const trigger = day("Thursday, October 15, 2026");

  act(() => {
    trigger.focus();
  });

  return trigger;
}

describe("TableCellTrigger", () => {
  it("sets data-focus-visible on focus after a key", async () => {
    await drawn(inlined());

    fireEvent.keyDown(document.body, { key: "ArrowRight" });

    expect(focusedDay().dataset["focusVisible"]).toBe("");
  });

  it("leaves data-focus-visible off on focus after a pointer press", async () => {
    await drawn(inlined());

    fireEvent.pointerDown(document.body);

    expect(focusedDay().dataset["focusVisible"]).toBeUndefined();
  });

  it("drops data-focus-visible as it loses focus", async () => {
    await drawn(inlined());

    fireEvent.keyDown(document.body, { key: "ArrowRight" });

    const trigger = focusedDay();

    act(() => {
      trigger.blur();
    });

    expect(trigger.dataset["focusVisible"]).toBeUndefined();
  });

  it("renders a div in the button role", async () => {
    await drawn(inlined());

    expect(day("Wednesday, October 14, 2026").tagName).toBe("DIV");
  });

  it("renders the caller's text", async () => {
    await drawn(inlined());

    expect(day("Wednesday, October 14, 2026").textContent).toBe("14");
  });

  it("takes the tab stop on the focused date", async () => {
    await drawn(inlined());

    expect(day("Wednesday, October 14, 2026").tabIndex).toBe(0);
  });

  it("leaves the tab order on another date", async () => {
    await drawn(inlined());

    expect(day("Thursday, October 15, 2026").tabIndex).toBe(-1);
  });

  it("selects its date on a press", async () => {
    const { container } = await drawn(inlined());

    await pressed(day("Tuesday, October 20, 2026"));
    await settled();

    expect(hiddenOf(container).value).toBe("2026-10-20");
  });

  it("selects its date on Space", async () => {
    const { container } = await drawn(inlined());

    fireEvent.keyDown(day("Tuesday, October 20, 2026"), { key: " " });
    await settled();

    expect(hiddenOf(container).value).toBe("2026-10-20");
  });

  it("keeps the page from scrolling on Space", async () => {
    await drawn(inlined());

    const scrolled = fireEvent.keyDown(day("Tuesday, October 20, 2026"), { key: " " });

    await settled();

    expect(scrolled).toBe(false);
  });

  it("ignores a key other than Space", async () => {
    const { container } = await drawn(inlined());

    fireEvent.keyDown(day("Tuesday, October 20, 2026"), { key: "a" });
    await settled();

    expect(hiddenOf(container).value).toBe("");
  });

  it("selects the focused date on Enter through its table", async () => {
    const { container } = await drawn(inlined());

    await keyed(day("Wednesday, October 14, 2026"), "Enter");

    expect(hiddenOf(container).value).toBe("2026-10-14");
  });
});
