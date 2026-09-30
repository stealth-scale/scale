import { parseDate } from "@internationalized/date";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";

import { inlined } from "#date-picker/date-picker.fixtures.tsx";
import { DayTable } from "#date-picker/day-table.tsx";
import { PrevTrigger } from "#date-picker/prev-trigger.tsx";
import { ViewControl } from "#date-picker/view-control.tsx";
import { View } from "#date-picker/view.tsx";

/**
 * First day the cases that reach the start allow: October 1, 2026.
 */
const MIN = parseDate("2026-10-01");

/**
 * Returns the previous trigger of the day view.
 *
 * @returns The element in the `button` role.
 */
function previous(): HTMLElement {
  return screen.getByRole("button", { name: "Previous month" });
}

describe("PrevTrigger", () => {
  it("renders a button named Previous month in the day view", async () => {
    await drawn(inlined());

    expect(previous().tagName).toBe("BUTTON");
  });

  it("is named Previous year in the month view", async () => {
    await drawn(inlined({ defaultView: "month" }));

    expect(screen.getByRole("button", { name: "Previous year" })).toBeDefined();
  });

  it("is named Previous decade in the year view", async () => {
    await drawn(inlined({ defaultView: "year" }));

    expect(screen.getByRole("button", { name: "Previous decade" })).toBeDefined();
  });

  it("is named by label", async () => {
    await drawn(
      inlined(
        {},
        <View>
          <ViewControl>
            <PrevTrigger label="Earlier month">‹</PrevTrigger>
          </ViewControl>
          <DayTable />
        </View>,
      ),
    );

    expect(screen.getByRole("button", { name: "Earlier month" })).toBeDefined();
  });

  it("moves the view back a month on a press", async () => {
    await drawn(inlined());
    await pressed(previous());
    await settled();

    expect(screen.getByRole("grid", { name: "September 2026" })).toBeDefined();
  });

  it("reports aria-disabled at the start min allows", async () => {
    await drawn(inlined({ min: MIN }));

    expect(previous().getAttribute("aria-disabled")).toBe("true");
  });

  it("keeps its tab stop at the start min allows", async () => {
    await drawn(inlined({ min: MIN }));

    expect(previous().hasAttribute("disabled")).toBe(false);
  });

  it("keeps the focused date on a press at the start min allows", async () => {
    await drawn(inlined({ min: MIN }));
    await pressed(previous());
    await settled();

    expect(screen.getByRole("button", { name: "Wednesday, October 14, 2026" }).tabIndex).toBe(0);
  });
});
