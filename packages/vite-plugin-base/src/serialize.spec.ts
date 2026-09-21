/**
 * Covers what `literal` and `quoted` write, and what `literal` refuses.
 */

import { describe, expect, it } from "vitest";

import { literal, quoted } from "#serialize.ts";

/**
 * The line separator and the paragraph separator, which JSON writes bare.
 */
const SEPARATED = `a${String.fromCodePoint(0x2028)}b${String.fromCodePoint(0x2029)}c`;

/**
 * The same, as a string literal writes it: each separator as a unicode escape.
 */
const ESCAPED = `"a${String.raw`\u`}2028b${String.raw`\u`}2029c"`;

describe("quoted", () => {
  it("writes a string with its quotes escaped", () => {
    expect(quoted('say "hi"')).toBe(String.raw`"say \"hi\""`);
  });

  it("escapes the line and paragraph separators JSON leaves bare", () => {
    const written = quoted(SEPARATED);

    expect(written).toBe(ESCAPED);
    expect(JSON.parse(written)).toBe(SEPARATED);
  });
});

describe("literal", () => {
  it("writes a string with its quotes escaped", () => {
    expect(literal('say "hi"')).toBe(String.raw`"say \"hi\""`);
  });

  it("writes a string and a key with the separators escaped", () => {
    expect(literal({ [SEPARATED]: SEPARATED })).toBe(`{${ESCAPED}: ${ESCAPED}}`);
  });

  it("writes a number and a boolean as they are", () => {
    expect(literal(1.5)).toBe("1.5");
    expect(literal(true)).toBe("true");
  });

  it("writes null by name", () => {
    expect(literal(null)).toBe("null");
  });

  it("writes a regular expression with its flags", () => {
    expect(literal(/Button$/u)).toBe("/Button$/u");
  });

  it("writes an array with each item in order and undefined by name", () => {
    expect(literal([1, "a", undefined])).toBe('[1, "a", undefined]');
  });

  it("writes a plain object with each key quoted", () => {
    expect(literal({ base: { gap: "3" }, name: "x" })).toBe('{"base": {"gap": "3"}, "name": "x"}');
  });

  it("leaves out a key whose value is undefined", () => {
    expect(literal({ a: 1, b: undefined })).toBe('{"a": 1}');
  });

  it("writes an object with no prototype", () => {
    expect(literal(Object.assign(Object.create(null), { a: 1 }))).toBe('{"a": 1}');
  });

  it("throws for a function and names where it sat", () => {
    expect(() => literal({ presets: [{ transform: (): number => 1 }] })).toThrow(
      "value.presets[0].transform is of kind function and cannot be written as source",
    );
  });

  it("throws for an instance of a class by its class name", () => {
    expect(() => literal(new Date(0), "theme")).toThrow("theme is of kind Date");
  });

  it("throws for an instance whose prototype declares no constructor", () => {
    const bare: object = Object.create(null) as object;
    const made: object = Object.create(bare) as object;

    expect(() => literal(made)).toThrow("value is of kind object");
  });

  it("throws for a number that is not finite", () => {
    expect(() => literal(Number.NaN)).toThrow("value is of kind number");
  });

  it("throws for a symbol and a bigint", () => {
    expect(() => literal(Symbol("s"))).toThrow("value is of kind symbol");
    expect(() => literal(1n)).toThrow("value is of kind bigint");
  });
});
