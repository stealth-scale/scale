import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { inlined } from "#date-picker/date-picker.fixtures.tsx";
import { DayTable } from "#date-picker/day-table.tsx";
import { RangeText } from "#date-picker/range-text.tsx";
import { View } from "#date-picker/view.tsx";

describe("RangeText", () => {
  it("renders a span with the visible month", async () => {
    const { container } = await drawn(inlined());
    const text = slotElement(container, "date-picker", "rangeText");

    expect([text.tagName, text.textContent]).toStrictEqual(["SPAN", "October 2026"]);
  });

  it("joins two visible months with an en dash", async () => {
    const { container } = await drawn(inlined({ numOfMonths: 2 }));

    expect(slotElement(container, "date-picker", "rangeText").textContent).toBe(
      "October 2026 – November 2026",
    );
  });

  it("renders the visible decade in the year view", async () => {
    const { container } = await drawn(inlined({ defaultView: "year" }));

    expect(slotElement(container, "date-picker", "rangeText").textContent).toBe("2020 – 2029");
  });

  it("renders the caller's text in place of the range", async () => {
    await drawn(
      inlined(
        {},
        <View>
          <RangeText>Autumn</RangeText>
          <DayTable />
        </View>,
      ),
    );

    expect(screen.getByText("Autumn").tagName).toBe("SPAN");
  });
});
