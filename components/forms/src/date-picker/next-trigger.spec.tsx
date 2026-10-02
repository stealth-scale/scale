import { parseDate } from "@internationalized/date";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";

import { inlined } from "#date-picker/date-picker.fixtures.tsx";
import { DayTable } from "#date-picker/day-table.tsx";
import { NextTrigger } from "#date-picker/next-trigger.tsx";
import { ViewControl } from "#date-picker/view-control.tsx";
import { View } from "#date-picker/view.tsx";

/**
 * Last day the cases that reach the end allow: October 31, 2026.
 */
const MAX = parseDate("2026-10-31");

/**
 * Returns the next trigger of the day view.
 *
 * @returns The element in the `button` role.
 */
function next(): HTMLElement {
  return screen.getByRole("button", { name: "Next month" });
}

describe("NextTrigger", () => {
  it("renders a button named Next month in the day view", async () => {
    await drawn(inlined());

    expect(next().tagName).toBe("BUTTON");
  });

  it("is named Next year in the month view", async () => {
    await drawn(inlined({ defaultView: "month" }));

    expect(screen.getByRole("button", { name: "Next year" })).toBeDefined();
  });

  it("is named Next decade in the year view", async () => {
    await drawn(inlined({ defaultView: "year" }));

    expect(screen.getByRole("button", { name: "Next decade" })).toBeDefined();
  });

  it("is named by label", async () => {
    await drawn(
      inlined(
        {},
        <View>
          <ViewControl>
            <NextTrigger label="Later month">›</NextTrigger>
          </ViewControl>
          <DayTable />
        </View>,
      ),
    );

    expect(screen.getByRole("button", { name: "Later month" })).toBeDefined();
  });

  it("moves the view on a month on a press", async () => {
    await drawn(inlined());
    await pressed(next());
    await settled();

    expect(screen.getByRole("grid", { name: "November 2026" })).toBeDefined();
  });

  it("leaves out aria-disabled before the end max allows", async () => {
    await drawn(inlined());

    expect(next().hasAttribute("aria-disabled")).toBe(false);
  });

  it("reports aria-disabled at the end max allows", async () => {
    await drawn(inlined({ max: MAX }));

    expect(next().getAttribute("aria-disabled")).toBe("true");
  });

  it("keeps its tab stop at the end max allows", async () => {
    await drawn(inlined({ max: MAX }));

    expect(next().hasAttribute("disabled")).toBe(false);
  });

  it("keeps the focused date on a press at the end max allows", async () => {
    await drawn(inlined({ max: MAX }));
    await pressed(next());
    await settled();

    expect(screen.getByRole("button", { name: "Wednesday, October 14, 2026" }).tabIndex).toBe(0);
  });
});
