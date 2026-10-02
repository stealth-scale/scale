import { describe, expect, it } from "vitest";

import {
  boundOf,
  maskOf,
  numberSettingsOf,
  phoneSettingsOf,
  textareaSettingsOf,
} from "#form/settings.ts";

describe("settings", () => {
  it("reads a currency format", () => {
    expect(numberSettingsOf({ currency: "EUR", style: "currency" })).toStrictEqual({
      formatOptions: { currency: "EUR", style: "currency" },
    });
  });

  it("reads the fraction digits of a number", () => {
    expect(numberSettingsOf({ maximumFractionDigits: 2, minimumFractionDigits: 1 })).toStrictEqual({
      formatOptions: { maximumFractionDigits: 2, minimumFractionDigits: 1 },
    });
  });

  it("reads a unit format", () => {
    expect(numberSettingsOf({ style: "unit", unit: "kilometer" })).toStrictEqual({
      formatOptions: { style: "unit", unit: "kilometer" },
    });
  });

  it("leaves out a format Intl.NumberFormat refuses", () => {
    expect(numberSettingsOf({ style: "currency" })).toStrictEqual({});
  });

  it("leaves out a style Intl.NumberFormat lacks", () => {
    expect(numberSettingsOf({ style: "scientific" })).toStrictEqual({});
  });

  it("leaves out a count of digits that is not a whole number", () => {
    expect(numberSettingsOf({ maximumFractionDigits: 1.5 })).toStrictEqual({});
  });

  it("reads a step above zero", () => {
    expect(numberSettingsOf({ step: 0.5 })).toStrictEqual({ step: 0.5 });
  });

  it.each([0, -1, Number.POSITIVE_INFINITY, "2"])("leaves out the step %s", (step) => {
    expect(numberSettingsOf({ step })).toStrictEqual({});
  });

  it("reads no number setting where the presentation states no options", () => {
    expect(numberSettingsOf()).toStrictEqual({});
  });

  it("reads the lines of a long text", () => {
    expect(textareaSettingsOf({ maxRows: 8, rows: 4 })).toStrictEqual({ maxRows: 8, rows: 4 });
  });

  it("leaves out a count of lines under one", () => {
    expect(textareaSettingsOf({ maxRows: 0, rows: "4" })).toStrictEqual({});
  });

  it("reads a bound the schema states", () => {
    expect(boundOf({ maximum: 50, type: "integer" }, "maximum")).toBe(50);
  });

  it("reads no bound the schema states as another type", () => {
    expect(boundOf({ minimum: "1", type: "integer" }, "minimum")).toBeUndefined();
  });

  it("reads no bound without a schema", () => {
    expect(boundOf(undefined, "minimum")).toBeUndefined();
  });

  it("reads the country and the countries of a phone number", () => {
    expect(phoneSettingsOf({ countries: ["NL", "BE"], country: "NL" })).toStrictEqual({
      countries: ["NL", "BE"],
      defaultCountry: "NL",
    });
  });

  it("leaves out a country the phone metadata does not know", () => {
    expect(phoneSettingsOf({ countries: ["NL", "QQ", 31], country: "QQ" })).toStrictEqual({
      countries: ["NL"],
    });
  });

  it("leaves out a list of countries without a known one", () => {
    expect(phoneSettingsOf({ countries: ["QQ"] })).toStrictEqual({});
  });

  it("reads no phone setting where the presentation states no options", () => {
    expect(phoneSettingsOf()).toStrictEqual({});
  });

  it("reads a masked value's pattern", () => {
    expect(maskOf({ mask: "9999 AA" })).toBe("9999 AA");
  });

  it("reads no pattern of another type", () => {
    expect(maskOf({ mask: ["9999 AA"] })).toBeUndefined();
  });
});
