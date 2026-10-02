import { describe, expect, it } from "vitest";

import { defineSlotRecipe } from "@stealthscale/theme/authoring";

import {
  defaultViolations,
  emptyViolations,
  jsxViolations,
  selectionViolations,
  slotStyled,
} from "#reachable.ts";

const INK = { color: "fg" };

const SIZES = { lg: { height: "control.lg" }, md: { height: "control.md" } };

describe("reachable", () => {
  it("reports a value that declares no styles", () => {
    expect(
      emptyViolations({ base: INK, className: "x", variants: { size: { md: INK, none: {} } } }),
    ).toStrictEqual(["x offers size none with no styles, so its class has no rule"]);
  });

  it("reports nothing for a base that declares no styles", () => {
    expect(emptyViolations({ base: {}, className: "x" })).toStrictEqual([]);
    expect(emptyViolations({ className: "x" })).toStrictEqual([]);
  });

  it("reports a compound that declares no styles and skips one that is not an object", () => {
    const recipe = {
      base: INK,
      className: "x",
      compoundVariants: [{ css: {}, name: "hero", size: "lg" }, null],
      variants: { size: SIZES },
    };

    expect(emptyViolations(recipe)).toStrictEqual(["x declares compound 1 with no styles"]);
  });

  it("reads no values off an axis that is not an object", () => {
    expect(emptyViolations({ base: INK, className: "x", variants: { size: "odd" } })).toStrictEqual(
      [],
    );
  });

  it("reports a slot recipe's value that declares no styles on any slot", () => {
    const recipe = defineSlotRecipe({
      base: { root: { display: "flex" }, title: { textStyle: "heading.md" } },
      className: "card",
      slots: ["root", "title"],
      variants: { size: { lg: { root: {} }, md: { root: { gap: "gap.md" } } } },
    });

    expect(emptyViolations(recipe)).toStrictEqual([
      "card offers size lg with no styles, so its class has no rule",
    ]);
  });

  it("reports nothing for a slot no value styles", () => {
    const recipe = defineSlotRecipe({
      base: { root: { display: "flex" } },
      className: "card",
      slots: ["root", "ghost", "title"],
      variants: { size: { md: { title: { textStyle: "heading.md" } } } },
    });

    expect(emptyViolations(recipe)).toStrictEqual([]);
  });

  it("returns true only where an object declares styles on the slot", () => {
    expect(slotStyled({ root: INK }, "root")).toBe(true);
    expect(slotStyled({ root: {} }, "root")).toBe(false);
    expect(slotStyled("odd", "root")).toBe(false);
  });

  it("reports a default naming an axis the recipe does not offer", () => {
    expect(
      defaultViolations({ base: INK, className: "x", defaultVariants: { size: "md" } }),
    ).toStrictEqual(["x defaults size to md, and offers no such axis"]);
  });

  it("reports a default naming a value the axis does not offer", () => {
    const recipe = {
      base: INK,
      className: "x",
      defaultVariants: { loading: true, size: "xl" },
      variants: { loading: { true: { layerStyle: "disabled" } }, size: SIZES },
    };

    expect(defaultViolations(recipe)).toStrictEqual([
      "x defaults size to xl, which the axis does not offer",
    ]);
  });

  it("reads no defaults off a value that is not an object", () => {
    expect(defaultViolations({ base: INK, className: "x", defaultVariants: "md" })).toStrictEqual(
      [],
    );
  });

  it("reports a compound matched on an axis the recipe does not offer", () => {
    const recipe = {
      base: INK,
      className: "x",
      compoundVariants: [{ css: { fontWeight: "bold" }, name: "hero", tone: "loud" }],
      variants: { size: SIZES },
    };

    expect(selectionViolations(recipe)).toStrictEqual([
      "x matches compound 1 on tone, which the recipe does not offer",
    ]);
  });

  it("reports a compound matched on a value the axis does not offer among a list", () => {
    const recipe = {
      base: INK,
      className: "x",
      compoundVariants: [{ css: { fontWeight: "bold" }, name: "hero", size: ["lg", "xl"] }],
      variants: { size: SIZES },
    };

    expect(selectionViolations(recipe)).toStrictEqual([
      "x matches compound 1 on size xl, which the axis does not offer",
    ]);
  });

  it("skips a compound that is not an object when reading selections", () => {
    expect(
      selectionViolations({ base: INK, className: "x", compoundVariants: [null] }),
    ).toStrictEqual([]);
  });

  it("reports nothing when every pattern matches a name and every name matches a pattern", () => {
    const recipe = { base: INK, className: "button", jsx: [/Button$/u, "SubmitButton"] };

    expect(jsxViolations(recipe, ["Button", "IconButton", "SubmitButton"])).toStrictEqual([]);
  });

  it("reports a name no pattern matches and a pattern that matches no name", () => {
    const recipe = { base: INK, className: "button", jsx: [/^List(\.\w+)?$/u, "Menu"] };

    expect(jsxViolations(recipe, ["List.Root", "Button"])).toStrictEqual([
      "button tracks no tag named Button",
      "button tracks Menu, which matches no published name",
    ]);
  });

  it("reports a recipe that declares no jsx patterns when names are given", () => {
    expect(jsxViolations({ base: INK, className: "button" }, ["Button"])).toStrictEqual([
      "button states no jsx patterns",
    ]);
    expect(jsxViolations({ base: INK, className: "button" }, [])).toStrictEqual([]);
  });
});
