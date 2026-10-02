import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { day, inlined, OCTOBER_14 } from "#date-picker/date-picker.fixtures.tsx";

/**
 * Returns the element of a tag whose `data-value` is the given value inside a render.
 *
 * @param container - The render's container.
 * @param tag - The element's tag: `td` for a cell, `div` for its trigger.
 * @param value - The cell's value, such as `10` for October in the month view.
 * @returns The element, or nothing without one.
 */
function valued(container: HTMLElement, tag: string, value: string): HTMLElement | null {
  return container.querySelector<HTMLElement>(`${tag}[data-value="${value}"]`);
}

describe("cells", () => {
  it("renders a day's cell with its date", async () => {
    await drawn(inlined());

    expect(day("Wednesday, October 14, 2026").closest("td")?.dataset["value"]).toBe("2026-10-14");
  });

  it("renders a month's cell in the gridcell role", async () => {
    const { container } = await drawn(inlined());

    expect(valued(container, "td", "10")?.getAttribute("role")).toBe("gridcell");
  });

  it("renders a year's cell in the gridcell role", async () => {
    const { container } = await drawn(inlined());

    expect(valued(container, "td", "2026")?.getAttribute("role")).toBe("gridcell");
  });

  it("names a selected day's trigger by its date alone", async () => {
    await drawn(inlined({ defaultValue: [OCTOBER_14] }));

    expect(day("Wednesday, October 14, 2026").getAttribute("aria-label")).toBe(
      "Wednesday, October 14, 2026",
    );
  });

  it("names a month's trigger by the month in its year", async () => {
    const { container } = await drawn(inlined());

    expect(valued(container, "div", "10")?.getAttribute("aria-label")).toBe("October 2026");
  });

  it("names a year's trigger by the year", async () => {
    const { container } = await drawn(inlined());

    expect(valued(container, "div", "2026")?.getAttribute("aria-label")).toBe("2026");
  });
});
