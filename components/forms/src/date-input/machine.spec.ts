import { parseZonedDateTime } from "@internationalized/date";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { dated, focused, segment, typed } from "#date-input/date-input.fixtures.tsx";
import { idsOf, splitDateInputProps } from "#date-input/machine.ts";

/**
 * Kick-off at 09:30 in New York, which is 13:30 in UTC.
 */
const KICK_OFF = parseZonedDateTime("2026-10-14T09:30[America/New_York]");

describe("machine", () => {
  it("builds every ID from the machine's ID", () => {
    const ids = idsOf("visit");

    expect([ids.hiddenInput(1), ids.label(0), ids.segmentGroup(1)]).toStrictEqual([
      "date-input:visit:hidden-input:1",
      "date-input:visit:label:0",
      "date-input:visit:segment-group:1",
    ]);
  });

  it("gives the first hidden input the ID of the field's control", () => {
    expect(idsOf("visit", undefined, "field-control").hiddenInput(0)).toBe("field-control");
  });

  it("keeps the second hidden input's own ID inside a field", () => {
    expect(idsOf("visit", undefined, "field-control").hiddenInput(1)).toBe(
      "date-input:visit:hidden-input:1",
    );
  });

  it("keeps an ID the caller states", () => {
    const ids = idsOf("visit", {
      hiddenInput: (index) => `input-${index}`,
      label: (index) => `label-${index}`,
      segmentGroup: (index) => `group-${index}`,
    });

    expect([ids.hiddenInput(0), ids.label(0), ids.segmentGroup(0)]).toStrictEqual([
      "input-0",
      "label-0",
      "group-0",
    ]);
  });

  it("splits the machine's options from the element's props", () => {
    expect(splitDateInputProps({ locale: "de-DE", title: "Visit" })).toStrictEqual([
      { locale: "de-DE" },
      { title: "Visit" },
    ]);
  });

  it("drops the options the root does not offer", () => {
    const [options] = splitDateInputProps({
      allSegments: {},
      format: () => "",
      locale: "de-DE",
      translations: {},
    });

    expect(options).toStrictEqual({ locale: "de-DE" });
  });

  it("shows the hour of a zoned value in the value's zone", async () => {
    await drawn(dated({ defaultValue: [KICK_OFF], granularity: "minute" }));

    expect(segment("hour, Appointment").textContent).toBe("09");
  });

  it("announces nothing through a live region of its own", async () => {
    await drawn(dated());
    await focused(segment("month, Appointment"));
    await typed("9");

    expect(document.querySelector("[data-live-announcer]")).toBeNull();
  });
});
