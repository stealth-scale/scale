import { describe, expect, it } from "vitest";

import { deepMerge, isPlainObject } from "#merge.ts";

interface Roles {
  colors: {
    bg?: string | undefined;

    fg?: string | undefined;
  };
}

describe("deepMerge", () => {
  it("keeps a key only the base states", () => {
    expect(deepMerge({ a: 1, b: 2 }, { b: 3 })).toStrictEqual({ a: 1, b: 3 });
  });

  it("takes a key only the override states", () => {
    expect(deepMerge({ a: 1 }, { a: 1, b: 2 })).toStrictEqual({ a: 1, b: 2 });
  });

  it("merges nested objects key by key", () => {
    const base = { colors: { gray: { 50: "a", 900: "b" }, primary: { 500: "c" } } };
    const override = { colors: { gray: { 900: "z" } } };

    expect(deepMerge(base, override)).toStrictEqual({
      colors: { gray: { 50: "a", 900: "z" }, primary: { 500: "c" } },
    });
  });

  it("replaces an array rather than appending to it", () => {
    expect(deepMerge({ a: [1, 2, 3] }, { a: [9] })).toStrictEqual({ a: [9] });
  });

  it("replaces the value when the two are not both objects", () => {
    expect(deepMerge({ a: { b: 1 } }, { a: "flat" })).toStrictEqual({ a: "flat" });
    expect(deepMerge("base", "override")).toBe("override");
  });

  it("leaves the base it was handed unchanged", () => {
    const base = { a: { b: 1 } };

    deepMerge(base, { a: { b: 2 } });

    expect(base).toStrictEqual({ a: { b: 1 } });
  });

  it("treats null as a value rather than as an object to merge into", () => {
    expect(deepMerge({ a: { b: 1 } }, { a: null })).toStrictEqual({ a: null });
  });

  it("replaces a date rather than merging its keys", () => {
    const override = new Date(0);

    expect(deepMerge({ at: new Date(1) }, { at: override }).at).toBe(override);
  });

  it("replaces a map rather than merging its keys", () => {
    const override = new Map([["a", 1]]);

    expect(deepMerge({ held: new Map() }, { held: override }).held).toBe(override);
  });

  it("merges an object with no prototype", () => {
    const base: Record<string, number> = Object.create(null) as Record<string, number>;
    const override: Record<string, number> = Object.create(null) as Record<string, number>;

    base["a"] = 1;
    override["b"] = 2;

    expect(deepMerge(base, override)).toStrictEqual({ a: 1, b: 2 });
  });

  it("keeps the base value when the override states undefined", () => {
    expect(deepMerge({ held: "base" }, { held: undefined })).toStrictEqual({ held: "base" });
  });

  it("keeps a nested base value under an undefined override", () => {
    const base: Roles = { colors: { bg: "white", fg: "black" } };
    const override: Roles = { colors: { bg: undefined, fg: "grey" } };

    expect(deepMerge(base, override)).toStrictEqual({ colors: { bg: "white", fg: "grey" } });
  });

  it("states nothing for a key that is only ever undefined", () => {
    expect(deepMerge({}, { held: undefined })).toStrictEqual({});
  });

  it("reports a plain object and an object with no prototype as plain", () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject(Object.create(null))).toBe(true);
  });

  it("reports a date and a null as not plain", () => {
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject(null)).toBe(false);
  });
});
