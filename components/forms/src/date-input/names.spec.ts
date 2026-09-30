import { describe, expect, it } from "vitest";

import {
  groupLabelledBy,
  segmentLabelling,
  segmentName,
  submittedName,
} from "#date-input/names.ts";

describe("names", () => {
  it.each([
    { locale: "en-US", type: "year", want: "year" },
    { locale: "de-DE", type: "month", want: "Monat" },
    { locale: "en-US", type: "dayPeriod", want: "AM/PM" },
  ] as const)("returns $want for the $type segment in $locale", ({ locale, type, want }) => {
    expect(segmentName(type, locale)).toBe(want);
  });

  it("returns nothing for a group without a label", () => {
    expect(groupLabelledBy(undefined, "Check-in", "group")).toBeUndefined();
  });

  it("returns the label's ID for a group without an aria-label", () => {
    expect(groupLabelledBy("label", undefined, "group")).toBe("label");
  });

  it("returns the label's ID followed by the group's for a group with an aria-label", () => {
    expect(groupLabelledBy("label", "Check-in", "group")).toBe("label group");
  });

  it("returns the name alone as aria-label without a label", () => {
    expect(segmentLabelling("month", "segment")).toStrictEqual({ "aria-label": "month" });
  });

  it("appends the group's name to aria-label without a label", () => {
    expect(segmentLabelling("month", "segment", undefined, "Check-in")).toStrictEqual({
      "aria-label": "month, Check-in",
    });
  });

  it("points aria-labelledby at the segment then the label", () => {
    expect(segmentLabelling("month", "segment", "label")).toStrictEqual({
      "aria-label": "month,",
      "aria-labelledby": "segment label",
    });
  });

  it("puts the group's name before the label's with a label", () => {
    expect(segmentLabelling("month", "segment", "label", "Check-in")).toStrictEqual({
      "aria-label": "month, Check-in,",
      "aria-labelledby": "segment label",
    });
  });

  it("returns nothing without a name", () => {
    expect(submittedName(undefined, true, 1)).toBeUndefined();
  });

  it("returns the name for a single date", () => {
    expect(submittedName("appointment", false, 0)).toBe("appointment");
  });

  it("indexes the name for a range", () => {
    expect(submittedName("stay", true, 1)).toBe("stay[1]");
  });
});
