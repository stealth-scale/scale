import { describe, expect, it } from "vitest";

import { dateFormatter, numberFormatter } from "#chart/format.ts";

const NOTHING: unknown = undefined;

describe("format", () => {
  it("writes a number in the locale", () => {
    expect(numberFormatter("en-US")(1234.5)).toBe("1,234.5");
  });

  it("writes a number with the options it is given", () => {
    expect(numberFormatter("en-US", { currency: "EUR", style: "currency" })(240)).toBe("€240.00");
  });

  it("returns a string a number format cannot read as it is", () => {
    expect(numberFormatter("en-US")("Mon")).toBe("Mon");
  });

  it("returns an empty string for a value that is neither a number nor a string", () => {
    expect(numberFormatter("en-US")(null)).toBe("");
  });

  it("writes a pair of numbers as a range in the locale", () => {
    expect(numberFormatter("de-DE")([1200, 3400])).toBe("1.200–3.400");
  });

  it("writes a pair of amounts as a range with the options it is given", () => {
    expect(numberFormatter("en-US", { currency: "EUR", style: "currency" })([3, 5])).toBe(
      "€3.00 – €5.00",
    );
  });

  it("returns an empty string for an array that is not a pair of numbers", () => {
    expect(numberFormatter("en-US")([1, "2"])).toBe("");
  });

  it("returns the same result from a formatter built twice", () => {
    expect(numberFormatter("de-DE")(1234.5)).toBe(numberFormatter("de-DE")(1234.5));
  });

  it.each([
    { label: "a date string", value: "2026-09-28T00:00:00Z" },
    { label: "a timestamp", value: Date.UTC(2026, 8, 28) },
    { label: "a Date", value: new Date(Date.UTC(2026, 8, 28)) },
  ])("writes $label in the locale", ({ value }) => {
    expect(dateFormatter("en-US", { day: "numeric", month: "short", timeZone: "UTC" })(value)).toBe(
      "Sep 28",
    );
  });

  it("returns a string that is no date as it is", () => {
    expect(dateFormatter("en-US")("Q3")).toBe("Q3");
  });

  it("returns an empty string for a value a date cannot read", () => {
    expect(dateFormatter("en-US")(NOTHING)).toBe("");
  });
});
