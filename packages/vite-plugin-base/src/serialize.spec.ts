/**
 * Covers the source `quoted` and `literal` write, and the values `literal` refuses.
 */

import { describe, expect, it } from "vitest";

import { literal, quoted } from "#serialize.ts";

/**
 * A string holding the line separator and the paragraph separator, which JSON writes bare.
 */
const SEPARATED = `a${String.fromCodePoint(0x2028)}b${String.fromCodePoint(0x2029)}c`;

/**
 * The same string as a string literal, with each separator written as a unicode escape.
 */
const ESCAPED = `"a${String.raw`\u`}2028b${String.raw`\u`}2029c"`;

describe("quoted", () => {
  it("wraps a string in quotes and escapes the quotes inside it", () => {
    expect(quoted('say "hi"')).toBe(String.raw`"say \"hi\""`);
  });

  it("escapes the line and paragraph separators JSON leaves bare", () => {
    const written = quoted(SEPARATED);

    expect(written).toBe(ESCAPED);
    expect(JSON.parse(written)).toBe(SEPARATED);
  });
});

describe("literal", () => {
  it("puts a string through the same quoting", () => {
    expect(literal('say "hi"')).toBe(String.raw`"say \"hi\""`);
  });

  it("escapes the separators in an object's keys as well as its values", () => {
    expect(literal({ [SEPARATED]: SEPARATED })).toBe(`{${ESCAPED}: ${ESCAPED}}`);
  });

  it("writes a finite number unquoted", () => {
    expect(literal(1.5)).toBe("1.5");
  });

  it("writes a boolean unquoted", () => {
    expect(literal(true)).toBe("true");
  });

  it("writes null as the word null", () => {
    expect(literal(null)).toBe("null");
  });

  it("writes a regular expression with its flags", () => {
    expect(literal(/Button$/u)).toBe("/Button$/u");
  });

  it("writes an array in order with an undefined item kept in place", () => {
    expect(literal([1, "a", undefined])).toBe('[1, "a", undefined]');
  });

  it("quotes the keys of a plain object and descends into a nested one", () => {
    expect(literal({ base: { gap: "3" }, name: "x" })).toBe('{"base": {"gap": "3"}, "name": "x"}');
  });

  it("drops a key whose value is undefined", () => {
    expect(literal({ a: 1, b: undefined })).toBe('{"a": 1}');
  });

  it("treats an object with no prototype as a plain object", () => {
    expect(literal(Object.assign(Object.create(null), { a: 1 }))).toBe('{"a": 1}');
  });

  it("refuses a function by the path it sat at", () => {
    expect(() => literal({ presets: [{ transform: (): number => 1 }] })).toThrow(
      "value.presets[0].transform is of kind function and cannot be written as source",
    );
  });

  it("refuses a class instance by its class name", () => {
    expect(() => literal(new Date(0), "theme")).toThrow("theme is of kind Date");
  });

  it("reports an instance whose prototype declares no constructor as an object", () => {
    const bare: object = Object.create(null) as object;
    const made: object = Object.create(bare) as object;

    expect(() => literal(made)).toThrow("value is of kind object");
  });

  it("refuses a number that is not finite", () => {
    expect(() => literal(Number.NaN)).toThrow("value is of kind number");
  });

  it("refuses a symbol", () => {
    expect(() => literal(Symbol("s"))).toThrow("value is of kind symbol");
  });

  it("refuses a bigint", () => {
    expect(() => literal(1n)).toThrow("value is of kind bigint");
  });
});
