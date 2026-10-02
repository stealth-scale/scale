import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { framed, inlined } from "#date-picker/date-picker.fixtures.tsx";
import { DayTable } from "#date-picker/day-table.tsx";
import { RangeText } from "#date-picker/range-text.tsx";
import { ViewControl } from "#date-picker/view-control.tsx";
import { ViewTrigger } from "#date-picker/view-trigger.tsx";
import { View } from "#date-picker/view.tsx";

describe("ViewTrigger", () => {
  it("renders a button with the range text", async () => {
    await drawn(inlined());

    expect(screen.getByRole("button", { name: "October 2026, Choose month" }).textContent).toBe(
      "October 2026",
    );
  });

  it("is named by the range text followed by Choose year in the month view", async () => {
    await drawn(inlined({ defaultView: "month" }));

    expect(screen.getByRole("button", { name: "2026, Choose year" })).toBeDefined();
  });

  it("is named by its text alone in the year view", async () => {
    await drawn(inlined({ defaultView: "year" }));

    expect(screen.getByRole("button", { name: "2020 – 2029" })).toBeDefined();
  });

  it("is named by its text alone where maxView leaves no view above", async () => {
    await drawn(inlined({ defaultView: "month", maxView: "month" }));

    expect(screen.getByRole("button", { name: "2026" }).hasAttribute("disabled")).toBe(true);
  });

  it("is disabled in the year view", async () => {
    await drawn(inlined({ defaultView: "year" }));

    expect(screen.getByRole("button", { name: "2020 – 2029" }).hasAttribute("disabled")).toBe(true);
  });

  it("is named by the range text followed by label", async () => {
    await drawn(
      inlined(
        {},
        <View>
          <ViewControl>
            <ViewTrigger label="Pick a month">
              <RangeText />
            </ViewTrigger>
          </ViewControl>
          <DayTable />
        </View>,
      ),
    );

    expect(screen.getByRole("button", { name: "October 2026, Pick a month" })).toBeDefined();
  });

  it("moves the panel up to the month view on a press", async () => {
    await drawn(inlined());
    await pressed(screen.getByRole("button", { name: "October 2026, Choose month" }));
    await framed();

    expect(screen.getByRole("grid", { name: "2026" })).toBeDefined();
  });
});
