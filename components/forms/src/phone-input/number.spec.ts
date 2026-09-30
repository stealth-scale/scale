import { describe, expect, it } from "vitest";

import { charactersOf, formatOf, movedTo } from "#phone-input/number.ts";

describe("number", () => {
  it("keeps the digits of a text with a leading plus", () => {
    expect(charactersOf(" +44 (20) 7183-8750")).toBe("+442071838750");
  });

  it("drops every character but the digits of a text without a leading plus", () => {
    expect(charactersOf("06-12a34")).toBe("061234");
  });

  it("formats a national number for the picked country", () => {
    expect(formatOf("0612345678", "NL").text).toBe("06 12345678");
  });

  it("formats the same digits for another country in its grouping", () => {
    expect(formatOf("2125550123", "US").text).toBe("(212) 555-0123");
  });

  it("returns the E.164 form as the value of a valid number", () => {
    expect(formatOf("06 12345678", "NL")).toMatchObject({
      valid: true,
      value: "+31612345678",
    });
  });

  it("returns the text as the value of a number that is not valid", () => {
    expect(formatOf("06123", "NL")).toMatchObject({
      text: "06 123",
      valid: false,
      value: "06 123",
    });
  });

  it("returns an empty number as not valid", () => {
    expect(formatOf("", "NL")).toMatchObject({ text: "", valid: false, value: "" });
  });

  it("reads an international number whatever country is picked", () => {
    expect(formatOf("+442071838750", "NL")).toMatchObject({
      country: "GB",
      detected: "GB",
      text: "+44 20 7183 8750",
      value: "+442071838750",
    });
  });

  it("detects no country while the prefix names several", () => {
    expect(formatOf("+1", "NL")).toMatchObject({ country: undefined, detected: undefined });
  });

  it("returns the picked country for a national number", () => {
    expect(formatOf("06 1", "NL").country).toBe("NL");
  });

  it("returns the national digits without the trunk prefix", () => {
    expect(formatOf("0612345678", "NL").national).toBe("612345678");
  });

  it("rewrites a number moved to another country in that country's international form", () => {
    expect(movedTo("06 12345678", "NL", "GB")).toBe("+44 612345678");
  });

  it("returns an empty text for a number without digits moved to another country", () => {
    expect(movedTo("", "NL", "GB")).toBe("");
  });
});
