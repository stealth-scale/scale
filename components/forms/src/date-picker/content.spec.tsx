import { parseDate } from "@internationalized/date";
import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import {
  day,
  dayView,
  inlined,
  keyed,
  opened,
  picked,
  trigger,
  views,
} from "#date-picker/date-picker.fixtures.tsx";

describe("Content", () => {
  it("renders a div in the dialog role", async () => {
    await drawn(picked());
    await opened();

    expect(screen.getByRole("dialog").tagName).toBe("DIV");
  });

  it("is named by Choose date followed by the label", async () => {
    await drawn(picked());
    await opened();

    expect(screen.getByRole("dialog", { name: "Choose date Appointment" })).toBeDefined();
  });

  it("is named by Choose date alone without a label", async () => {
    await drawn(picked({}, { label: null }));
    await opened();

    expect(screen.getByRole("dialog", { name: "Choose date" })).toBeDefined();
  });

  it("is named by label followed by the picker's label", async () => {
    await drawn(picked({}, { content: "Pick a day" }));
    await opened();

    expect(screen.getByRole("dialog", { name: "Pick a day Appointment" })).toBeDefined();
  });

  it("leaves out the machine's roledescription", async () => {
    await drawn(picked());
    await opened();

    expect(screen.getByRole("dialog").hasAttribute("aria-roledescription")).toBe(false);
  });

  it("is a group named by the label when inline", async () => {
    await drawn(inlined());

    expect(screen.getByRole("group", { name: "Holiday" })).toBeDefined();
  });

  it("takes no role when inline without a label", async () => {
    const { container } = await drawn(inlined({}, views(), null));

    expect(slotElement(container, "date-picker", "content").hasAttribute("role")).toBe(false);
  });

  it("renders the views in a scroll area", async () => {
    await drawn(picked());
    await opened();

    const body = screen.getByRole("dialog").querySelector(".date-picker__body");

    expect(body?.contains(screen.getByRole("button", { name: "Previous month" }))).toBe(true);
  });

  it("keeps the scroll area's viewport out of the tab order", async () => {
    await drawn(picked());
    await opened();

    const viewport = screen.getByRole("dialog").querySelector(".date-picker__viewport");

    expect(viewport?.getAttribute("tabindex")).toBe("-1");
  });

  it("scrolls a focused day into view while the viewport overflows", async () => {
    await drawn(picked());
    await opened();

    screen
      .getByRole("dialog")
      .querySelector<HTMLElement>(".date-picker__viewport")
      ?.style.setProperty("overflow", "auto");
    vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(400);
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(200);
    const reveal = vi.spyOn(Element.prototype, "scrollIntoView");
    const last = day("Saturday, October 31, 2026");

    act(() => {
      last.focus();
    });
    await settled();

    expect(reveal.mock.contexts.at(-1)).toBe(last);
    expect(reveal.mock.lastCall).toStrictEqual([{ block: "nearest", inline: "nearest" }]);
  });

  it("sets data-inline when inline", async () => {
    const { container } = await drawn(inlined());

    expect(slotElement(container, "date-picker", "content").dataset["inline"]).toBe("");
  });

  it("moves focus to the selected day as it opens", async () => {
    await drawn(picked({ defaultValue: [parseDate("2026-10-20")] }));
    await opened();

    expect(document.activeElement).toBe(day("Tuesday, October 20, 2026"));
  });

  it("moves focus to the focused day as it opens without a date", async () => {
    await drawn(picked());
    await opened();

    expect(document.activeElement).toBe(day("Wednesday, October 14, 2026"));
  });

  it("moves focus to the trigger on Shift+Tab from its first control", async () => {
    await drawn(picked());
    await opened();

    const first = screen.getByRole("button", { name: "Previous month" });

    act(() => {
      first.focus();
    });
    await keyed(first, "Tab", true);

    expect(document.activeElement).toBe(trigger());
  });

  it("moves focus to the control after the trigger on Tab from its last control", async () => {
    await drawn(
      <>
        {picked({}, { panel: dayView() })}
        <button type="button">Next</button>
      </>,
    );
    await opened();
    await keyed(day("Wednesday, October 14, 2026"), "Tab");

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Next" }));
  });

  it("leaves the document once Escape closes it", async () => {
    await drawn(picked());
    await opened();

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    await settled();

    expect(screen.queryByRole("dialog", { hidden: true })).toBeNull();
  });
});
