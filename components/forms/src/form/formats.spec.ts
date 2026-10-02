import { describe, expect, it } from "vitest";

import { iban, phone } from "#form/formats.ts";

describe("formats", () => {
  it("names the IBAN format iban", () => {
    expect(iban.name).toBe("iban");
  });

  it.each(["NL91ABNA0417164300", "GB82WEST12345698765432", "DE89370400440532013000"])(
    "accepts the IBAN %s",
    (value) => {
      expect(iban.holds(value)).toBe(true);
    },
  );

  it("accepts an IBAN written in groups of four in lower case", () => {
    expect(iban.holds("nl91 abna 0417 1643 00")).toBe(true);
  });

  it("refuses an IBAN whose check digits do not match", () => {
    expect(iban.holds("NL91ABNA0417164301")).toBe(false);
  });

  it("refuses a value that is not shaped as an IBAN", () => {
    expect(iban.holds("NL91ABNA")).toBe(false);
  });

  it("accepts an empty IBAN", () => {
    expect(iban.holds("")).toBe(true);
  });

  it("names the phone format phone", () => {
    expect(phone.name).toBe("phone");
  });

  it("accepts a phone number in E.164", () => {
    expect(phone.holds("+31612345678")).toBe(true);
  });

  it("refuses a number too short for its country", () => {
    expect(phone.holds("+3161234")).toBe(false);
  });

  it("refuses a national number without its country", () => {
    expect(phone.holds("0612345678")).toBe(false);
  });

  it("accepts an empty phone number", () => {
    expect(phone.holds("")).toBe(true);
  });
});
