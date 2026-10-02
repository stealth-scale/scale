import { describe, expect, it } from "vitest";

import { walked } from "#walk.ts";

describe("walked", () => {
  it("lists every string with the property and the category it is written under", () => {
    expect(
      walked({ base: { color: "fg", display: "flex" }, className: "x" }).strings,
    ).toStrictEqual([
      { category: "colors", path: "base.color", property: "color", value: "fg" },
      { category: undefined, path: "base.display", property: "display", value: "flex" },
    ]);
  });

  it("keeps the property across a breakpoint and a condition", () => {
    const { strings } = walked({
      base: { _hover: { gap: { base: "gap.sm", md: "gap.md" } } },
      className: "x",
    });

    expect(strings.map(({ property }) => property)).toStrictEqual(["gap", "gap"]);
    expect(strings.map(({ category }) => category)).toStrictEqual(["spacing", "spacing"]);
  });

  it("lists every condition with its path", () => {
    expect(
      walked({ base: { _hover: { _focusVisible: { color: "fg" } } }, className: "x" }).conditions,
    ).toStrictEqual([
      { condition: "_hover", path: "base._hover" },
      { condition: "_focusVisible", path: "base._hover._focusVisible" },
    ]);
  });

  it("lists the strings under the variants and under a compound variant's css", () => {
    const { strings } = walked({
      className: "x",
      compoundVariants: [{ css: { color: "fg" }, variant: "solid" }],
      variants: { variant: { solid: { background: "bg" } } },
    });

    expect(strings.map(({ path }) => path)).toStrictEqual([
      "compoundVariants.0.css.color",
      "variants.variant.solid.background",
    ]);
  });

  it("reads a slot's styles under the slot", () => {
    const { strings } = walked({ base: { content: { color: "fg" } }, className: "x" });

    expect(strings).toStrictEqual([
      { category: "colors", path: "base.content.color", property: "color", value: "fg" },
    ]);
  });

  it("lists no string for a value that is neither a string nor an object", () => {
    expect(walked({ base: { flexGrow: 1 }, className: "x" }).strings).toStrictEqual([]);
  });
});
