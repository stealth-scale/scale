import { type ReactElement } from "react";

import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { inlined } from "#date-picker/date-picker.fixtures.tsx";
import { DayTable } from "#date-picker/day-table.tsx";
import { Header, type HeaderProps } from "#date-picker/header.tsx";
import { View } from "#date-picker/view.tsx";

/**
 * Renders an inline picker whose day view has a header with the given props.
 *
 * @param props - The header's names.
 * @returns The date picker.
 */
function headed(props: Partial<HeaderProps> = {}): ReactElement {
  return inlined(
    {},
    <View>
      <Header nextIcon={<span>›</span>} previousIcon={<span>‹</span>} {...props} />
      <DayTable />
    </View>,
  );
}

describe("Header", () => {
  it("orders the previous trigger before the view trigger before the next trigger", async () => {
    const { container } = await drawn(headed());

    expect(
      within(slotElement(container, "date-picker", "viewControl"))
        .getAllByRole("button")
        .map((button) => button.getAttribute("aria-label")),
    ).toStrictEqual(["Previous month", "October 2026, Choose month", "Next month"]);
  });

  it("renders previousIcon inside the previous trigger", async () => {
    await drawn(headed());

    expect(screen.getByRole("button", { name: "Previous month" }).textContent).toBe("‹");
  });

  it("renders nextIcon inside the next trigger", async () => {
    await drawn(headed());

    expect(screen.getByRole("button", { name: "Next month" }).textContent).toBe("›");
  });

  it("renders the range text inside the view trigger", async () => {
    await drawn(headed());

    expect(screen.getByRole("button", { name: "October 2026, Choose month" }).textContent).toBe(
      "October 2026",
    );
  });

  it("names the previous trigger by previousLabel", async () => {
    await drawn(headed({ previousLabel: "Earlier month" }));

    expect(screen.getByRole("button", { name: "Earlier month" })).toBeDefined();
  });

  it("names the next trigger by nextLabel", async () => {
    await drawn(headed({ nextLabel: "Later month" }));

    expect(screen.getByRole("button", { name: "Later month" })).toBeDefined();
  });

  it("names the view trigger by viewLabel after the range text", async () => {
    await drawn(headed({ viewLabel: "Pick a month" }));

    expect(screen.getByRole("button", { name: "October 2026, Pick a month" })).toBeDefined();
  });
});
