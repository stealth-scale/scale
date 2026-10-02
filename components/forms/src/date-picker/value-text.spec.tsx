import { type ReactElement } from "react";

import { parseDate } from "@internationalized/date";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { inlined, OCTOBER_14, views } from "#date-picker/date-picker.fixtures.tsx";
import { type RootProps } from "#date-picker/root.tsx";
import { ValueText, type ValueTextProps } from "#date-picker/value-text.tsx";

/**
 * Two days picked from one calendar: October 14 and October 20, 2026.
 */
const DAYS = [OCTOBER_14, parseDate("2026-10-20")];

/**
 * Renders an inline picker of several dates with the value text above its views.
 *
 * @param props - The props of the root.
 * @param text - The props of the value text.
 * @returns The date picker.
 */
function texted(props: RootProps = {}, text: ValueTextProps = {}): ReactElement {
  return inlined(
    { selectionMode: "multiple", ...props },
    <>
      <ValueText placeholder="No days" {...text} />
      {views()}
    </>,
  );
}

describe("ValueText", () => {
  it("renders a span with the placeholder while no date is set", async () => {
    const { container } = await drawn(texted());
    const text = slotElement(container, "date-picker", "valueText");

    expect([text.tagName, text.textContent]).toStrictEqual(["SPAN", "No days"]);
  });

  it("sets data-placeholder-shown while no date is set", async () => {
    const { container } = await drawn(texted());

    expect(slotElement(container, "date-picker", "valueText").dataset["placeholderShown"]).toBe("");
  });

  it("joins the dates with a comma", async () => {
    const { container } = await drawn(texted({ defaultValue: DAYS }));

    expect(slotElement(container, "date-picker", "valueText").textContent).toBe(
      "10/14/2026, 10/20/2026",
    );
  });

  it("joins the dates with separator", async () => {
    const { container } = await drawn(texted({ defaultValue: DAYS }, { separator: " · " }));

    expect(slotElement(container, "date-picker", "valueText").textContent).toBe(
      "10/14/2026 · 10/20/2026",
    );
  });

  it("drops data-placeholder-shown while a date is set", async () => {
    const { container } = await drawn(texted({ defaultValue: DAYS }));

    expect(
      slotElement(container, "date-picker", "valueText").dataset["placeholderShown"],
    ).toBeUndefined();
  });
});
