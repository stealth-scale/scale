import { describe, expect, it } from "vitest";

import { detailsOf, maskerOf } from "#input-mask/mask.ts";

const PHONE = maskerOf({ mask: "(999) 999-9999" });

const AMOUNT = maskerOf({ number: { fraction: 2, locale: "nl-NL" } });

const HEX = {
  h: { pattern: /[\dA-Fa-f]/u, transform: (character: string): string => character.toLowerCase() },
};

describe("mask", () => {
  it.each([
    { input: "1a2", mask: "999", want: "12" },
    { input: "a1b", mask: "aa", want: "ab" },
    { input: "ab", mask: "AA", want: "AB" },
    { input: "a-1", mask: "***", want: "a1" },
    { input: "123", mask: "+4!9 999", want: "+49 123" },
    { input: "123", mask: "#999", want: "#123" },
  ])("masks $input to $want under the pattern $mask", ({ input, mask, want }) => {
    expect(maskerOf({ mask }).engine.masked(input)).toBe(want);
  });

  it("adds the caller's tokens to the library's", () => {
    expect(maskerOf({ mask: "#hhhhhh", tokens: HEX }).engine.masked("1A2B3C")).toBe("#1a2b3c");
  });

  it("replaces a library token the caller restates", () => {
    expect(maskerOf({ mask: "99", tokens: { 9: { pattern: /[0-5]/u } } }).engine.masked("64")).toBe(
      "4",
    );
  });

  it("writes the pattern's next characters at once when eager", () => {
    expect(maskerOf({ eager: true, mask: "99/99" }).engine.masked("12")).toBe("12/");
  });

  it("formats a number mask in its locale", () => {
    expect(AMOUNT.engine.masked("1234567,891")).toBe("1.234.567,89");
  });

  it("reports a value that fills the pattern complete", () => {
    expect(PHONE.complete("(555) 123-4567")).toBe(true);
  });

  it("reports a value short of the pattern incomplete", () => {
    expect(PHONE.complete("(555) 12")).toBe(false);
  });

  it("reports an empty value incomplete", () => {
    expect(PHONE.complete("")).toBe(false);
  });

  it("reports a number incomplete", () => {
    expect(AMOUNT.complete("1.234,50")).toBe(false);
  });

  it("reports a value incomplete without a mask", () => {
    expect(maskerOf({}).complete("text")).toBe(false);
  });

  it("leaves an optional token out of the length a value fills", () => {
    const masker = maskerOf({ mask: "99o", tokens: { o: { optional: true, pattern: /\d/u } } });

    expect(masker.complete("12")).toBe(true);
  });

  it("counts an escaped character in the length a value fills", () => {
    expect(maskerOf({ mask: "+4!9 999" }).complete("+49 123")).toBe(true);
  });

  it.each([
    { value: "12345", want: true },
    { value: "12345-67", want: false },
    { value: "12345-6789", want: true },
  ])("returns $want from complete for $value under a pattern array", ({ value, want }) => {
    expect(maskerOf({ mask: ["99999", "99999-9999"] }).complete(value)).toBe(want);
  });

  it("checks the pattern a function returns for the value", () => {
    const masker = maskerOf({ mask: (value) => (value.startsWith("3") ? "999 999" : "99 99") });

    expect([masker.complete("12 34"), masker.complete("345 678")]).toStrictEqual([true, true]);
  });

  it.each([
    { label: "digit tokens alone", options: { mask: "(999) 999-9999" }, want: "numeric" },
    {
      label: "an array of digit patterns",
      options: { mask: ["99999", "99999-9999"] },
      want: "numeric",
    },
    { label: "a pattern with a letter token", options: { mask: "9999 AA" }, want: undefined },
    { label: "a pattern without tokens", options: { mask: "+!9" }, want: undefined },
    {
      label: "a token the pattern does not read",
      options: { mask: "999", tokens: HEX },
      want: "numeric",
    },
    { label: "a number with a fraction", options: { number: { fraction: 2 } }, want: "decimal" },
    { label: "a whole number", options: { number: {} }, want: "numeric" },
    { label: "no mask", options: {}, want: undefined },
  ])("returns the $want keyboard for $label", ({ options, want }) => {
    expect(maskerOf(options).keyboard).toBe(want);
  });

  it("asks for no keyboard when the caller replaces the digit token", () => {
    expect(
      maskerOf({ mask: "999", tokens: { 9: { pattern: /[\da-f]/u } } }).keyboard,
    ).toBeUndefined();
  });

  it("asks for no keyboard for a function pattern", () => {
    expect(maskerOf({ mask: () => "999" }).keyboard).toBeUndefined();
  });

  it("returns the value with its unmasked characters and completeness", () => {
    expect(detailsOf(PHONE, "(555) 123-4567")).toStrictEqual({
      complete: true,
      unmasked: "5551234567",
      value: "(555) 123-4567",
    });
  });

  it("unmasks a number to a dot decimal separator", () => {
    expect(detailsOf(AMOUNT, "1.234,5").unmasked).toBe("1234.5");
  });
});
