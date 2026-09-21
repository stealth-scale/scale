import { describe, expect, it } from "vitest";

import { camelCased, isToken, leaves, nodeAt, stated } from "#tokens.ts";

const BLOCK = {
  bg: { DEFAULT: { value: "white" }, panel: { value: { _dark: "black", base: "white" } } },
  solid: { value: "blue" },
};

describe("tokens", () => {
  it("returns true for an object with a value property and false for a group or a string", () => {
    expect(isToken({ value: "x" })).toBe(true);
    expect(isToken({ DEFAULT: { value: "x" } })).toBe(false);
    expect(isToken("x")).toBe(false);
  });

  it("lists every token under a block with its dotted path", () => {
    expect(leaves(BLOCK)).toStrictEqual([
      { path: "bg.DEFAULT", value: "white" },
      { path: "bg.panel", value: { _dark: "black", base: "white" } },
      { path: "solid", value: "blue" },
    ]);
  });

  it("returns an empty array when the block is not an object", () => {
    expect(leaves("x")).toStrictEqual([]);
    expect(leaves()).toStrictEqual([]);
  });

  it("resolves a dotted path to its node and returns undefined where the path leaves the block", () => {
    expect(nodeAt(BLOCK, "bg.panel")).toStrictEqual({ value: { _dark: "black", base: "white" } });
    expect(nodeAt(BLOCK, "bg.nope")).toBeUndefined();
    expect(nodeAt(BLOCK, "solid.value.deeper")).toBeUndefined();
  });

  it("returns true for a path that resolves to a token directly or through DEFAULT", () => {
    expect(stated(BLOCK, "solid")).toBe(true);
    expect(stated(BLOCK, "bg")).toBe(true);
    expect(stated(BLOCK, "bg.panel")).toBe(true);
    expect(stated(BLOCK, "bg.nope")).toBe(false);
  });

  it("returns a kebab-case name in camel case", () => {
    expect(camelCased("button-group")).toBe("buttonGroup");
    expect(camelCased("button")).toBe("button");
    expect(camelCased("h-1")).toBe("h1");
  });
});
