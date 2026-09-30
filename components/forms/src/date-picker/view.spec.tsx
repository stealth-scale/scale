import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { framed, inlined } from "#date-picker/date-picker.fixtures.tsx";
import { DayTable } from "#date-picker/day-table.tsx";
import { View } from "#date-picker/view.tsx";

/**
 * Returns whether each view inside a render is hidden, in document order.
 *
 * @param container - The render's container.
 * @returns The day's, the month's and the year's.
 */
function hiddenViews(container: HTMLElement): boolean[] {
  return [...container.querySelectorAll<HTMLElement>(".date-picker__view")].map(
    (view) => view.hidden === true,
  );
}

describe("View", () => {
  it("renders a div", async () => {
    const { container } = await drawn(inlined());

    expect(slotElement(container, "date-picker", "view").tagName).toBe("DIV");
  });

  it("hides every view but the day view at first", async () => {
    const { container } = await drawn(inlined());

    expect(hiddenViews(container)).toStrictEqual([false, true, true]);
  });

  it("defaults to the day view", async () => {
    const { container } = await drawn(
      inlined(
        {},
        <View>
          <DayTable />
        </View>,
      ),
    );

    expect(slotElement(container, "date-picker", "view").dataset["view"]).toBe("day");
  });

  it("shows the month view after a press on the view trigger", async () => {
    const { container } = await drawn(inlined());

    await pressed(screen.getByRole("button", { name: "October 2026, Choose month" }));
    await framed();

    expect(hiddenViews(container)).toStrictEqual([true, false, true]);
  });
});
