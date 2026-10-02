import { describe, expect, it } from "vitest";

import { countriesOf, dialOf } from "#phone-input/countries.ts";

describe("countries", () => {
  it("writes a calling code with its plus", () => {
    expect(dialOf("BE")).toBe("+32");
  });

  it("offers the 245 regions libphonenumber-js has metadata for without a list", () => {
    expect(countriesOf("en")).toHaveLength(245);
  });

  it("sorts every region by its name in the locale", () => {
    expect(
      countriesOf("nl")
        .slice(0, 3)
        .map((country) => country.name),
    ).toStrictEqual(["Afghanistan", "Åland", "Albanië"]);
  });

  it("keeps the order of the caller's list", () => {
    expect(countriesOf("en", ["NL", "BE"]).map((country) => country.code)).toStrictEqual([
      "NL",
      "BE",
    ]);
  });

  it("names a region in the locale", () => {
    expect(countriesOf("de", ["NL"])[0]?.name).toBe("Niederlande");
  });

  it("takes the caller's name for a region over the locale's", () => {
    expect(
      countriesOf("en", ["NL", "GB"], (code) => (code === "GB" ? "Britain" : undefined)),
    ).toStrictEqual([
      { code: "NL", dial: "+31", name: "Netherlands" },
      { code: "GB", dial: "+44", name: "Britain" },
    ]);
  });
});
