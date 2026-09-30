import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { inlined } from "#date-picker/date-picker.fixtures.tsx";

/**
 * Returns the text of each column header of the day table inside a render.
 *
 * @param container - The render's container.
 * @returns The texts in column order.
 */
function headers(container: HTMLElement): Array<null | string> {
  return [...container.querySelectorAll("thead th")].map((header) => header.textContent);
}

describe("DayHead", () => {
  it("renders a short weekday name per column", async () => {
    const { container } = await drawn(inlined());

    expect(headers(container)).toStrictEqual(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
  });

  it("starts the row on the weekday startOfWeek gives", async () => {
    const { container } = await drawn(inlined({ startOfWeek: 1 }));

    expect(headers(container)[0]).toBe("Mon");
  });

  it("names the weekdays in the root's locale", async () => {
    const { container } = await drawn(inlined({ locale: "de-DE" }));
    const monday = new Intl.DateTimeFormat("de-DE", { timeZone: "UTC", weekday: "short" }).format(
      new Date(Date.UTC(2026, 9, 12)),
    );

    expect(headers(container)[0]).toBe(monday);
  });

  it("renders the week numbers' header first when the root shows week numbers", async () => {
    const { container } = await drawn(inlined({ showWeekNumbers: true }));

    expect(headers(container)[0]).toBe("#");
  });
});
