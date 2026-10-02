import { type ReactElement } from "react";

import { parseDate, startOfMonth, today } from "@internationalized/date";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";

import { hiddenOf, inlined, views } from "#date-picker/date-picker.fixtures.tsx";
import { type PresetValue } from "#date-picker/machine.ts";
import { PresetTrigger } from "#date-picker/preset-trigger.tsx";

/**
 * Dates of the preset the cases press: October 5 to October 9, 2026.
 */
const WEEK = [parseDate("2026-10-05"), parseDate("2026-10-09")];

/**
 * Renders an inline range picker with one preset trigger above its views.
 *
 * @param value - The range or the dates the preset sets.
 * @returns The date picker.
 */
function preset(value: PresetValue): ReactElement {
  return inlined(
    { selectionMode: "range" },
    <>
      <PresetTrigger value={value}>Chosen week</PresetTrigger>
      {views()}
    </>,
  );
}

/**
 * Returns the dates the hidden inputs of a range submit.
 *
 * @param container - The render's container.
 * @returns The start and the end in ISO 8601.
 */
function submitted(container: HTMLElement): string[] {
  return [hiddenOf(container).value, hiddenOf(container, 1).value];
}

describe("PresetTrigger", () => {
  it("renders a button named by its words", async () => {
    await drawn(preset(WEEK));

    expect(screen.getByRole("button", { name: "Chosen week" }).tagName).toBe("BUTTON");
  });

  it("leaves out the machine's aria-label", async () => {
    await drawn(preset(WEEK));

    expect(screen.getByRole("button", { name: "Chosen week" }).hasAttribute("aria-label")).toBe(
      false,
    );
  });

  it("sets its dates on a press", async () => {
    const { container } = await drawn(preset(WEEK));

    await pressed(screen.getByRole("button", { name: "Chosen week" }));
    await settled();

    expect(submitted(container)).toStrictEqual(["2026-10-05", "2026-10-09"]);
  });

  it("sets thisMonth to the first of the month through today", async () => {
    const { container } = await drawn(preset("thisMonth"));
    const now = today("UTC");

    await pressed(screen.getByRole("button", { name: "Chosen week" }));
    await settled();

    expect(submitted(container)).toStrictEqual([startOfMonth(now).toString(), now.toString()]);
  });
});
