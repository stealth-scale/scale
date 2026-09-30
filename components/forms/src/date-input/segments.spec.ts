import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { dated } from "#date-input/date-input.fixtures.tsx";

/**
 * Returns the types of the segments inside a render, in document order.
 *
 * @param container - The render's container.
 * @returns The value of `data-type` on each segment.
 */
function typesOf(container: HTMLElement): string[] {
  return [...container.querySelectorAll<HTMLElement>(".date-input__segment")].map(
    (element) => element.dataset["type"] ?? "",
  );
}

describe("Segments", () => {
  it("renders the month before the day in en-US", async () => {
    const { container } = await drawn(dated());

    expect(typesOf(container)).toStrictEqual(["month", "literal", "day", "literal", "year"]);
  });

  it("renders the day before the month in de-DE", async () => {
    const { container } = await drawn(dated({ locale: "de-DE" }));

    expect(typesOf(container)).toStrictEqual(["day", "literal", "month", "literal", "year"]);
  });

  it("renders the time after the date at minute granularity", async () => {
    const { container } = await drawn(dated({ granularity: "minute" }));

    expect(typesOf(container).filter((type) => type !== "literal")).toStrictEqual([
      "month",
      "day",
      "year",
      "hour",
      "minute",
      "dayPeriod",
    ]);
  });

  it("renders the segments inside the segment group", async () => {
    const { container } = await drawn(dated());

    expect(slotElement(container, "date-input", "segmentGroup").children).toHaveLength(5);
  });

  it("writes the separators of the locale", async () => {
    await drawn(dated({ locale: "de-DE" }));

    expect(screen.getByRole("group").textContent).toBe("tt.mm.jjjj");
  });
});
