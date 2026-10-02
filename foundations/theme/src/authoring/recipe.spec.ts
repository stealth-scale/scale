import { describe, expect, expectTypeOf, it } from "vitest";

import {
  compoundClassName,
  compoundSelection,
  defineRecipe,
  defineSlotRecipe,
  defineStyles,
  type RecipeProps,
} from "#authoring/recipe.ts";

const AXES = {
  disabled: { false: {}, true: {} },
  level: { 1: {}, 2: {} },
  size: { lg: {}, md: {} },
  variant: { ghost: {}, solid: {} },
};

function named(compound: object): string | undefined {
  return defineRecipe({
    className: "button",
    compoundVariants: [{ css: {}, ...compound }],
    variants: AXES,
  }).compoundVariants?.[0]?.className;
}

describe("defineRecipe", () => {
  it("returns a recipe without compounds unchanged", () => {
    const recipe = { base: { color: "fg" }, className: "button" };

    expect(defineRecipe(recipe)).toBe(recipe);
  });

  it("names an unnamed compound from its sorted axes", () => {
    expect(named({ size: "lg", variant: "solid" })).toBe(
      "button--compound__size_lg__variant_solid",
    );
  });

  it("joins the values of an array axis with a bar", () => {
    expect(named({ variant: ["ghost", "solid"] })).toBe("button--compound__variant_ghost|solid");
  });

  it("writes a boolean value as a string", () => {
    expect(named({ disabled: true })).toBe("button--compound__disabled_true");
  });

  it("writes a number value as a string", () => {
    expect(named({ level: 2 })).toBe("button--compound__level_2");
  });

  it("adds a className to an unnamed compound", () => {
    const recipe = defineRecipe({
      className: "button",
      compoundVariants: [{ css: { fontWeight: "bold" }, size: "lg" }],
      variants: AXES,
    });

    expect(recipe.compoundVariants).toStrictEqual([
      { className: "button--compound__size_lg", css: { fontWeight: "bold" }, size: "lg" },
    ]);
  });

  it("replaces the name of a named compound with its className", () => {
    const recipe = defineRecipe({
      className: "button",
      compoundVariants: [
        { css: { fontWeight: "bold" }, name: "hero", size: "lg", variant: "solid" },
      ],
      variants: AXES,
    });

    expect(recipe.compoundVariants).toStrictEqual([
      { className: "button--hero", css: { fontWeight: "bold" }, size: "lg", variant: "solid" },
    ]);
  });

  it("names a named slot compound once per slot", () => {
    const recipe = defineSlotRecipe({
      className: "card",
      compoundVariants: [
        {
          css: { root: { fontWeight: "bold" }, title: { letterSpacing: "wide" } },
          name: "hero",
          size: "lg",
        },
      ],
      slots: ["root", "title"],
      variants: { size: { lg: {}, md: {} } },
    });

    expect(recipe.compoundVariants).toStrictEqual([
      { className: "card__root--hero", css: { root: { fontWeight: "bold" } }, size: "lg" },
      { className: "card__title--hero", css: { title: { letterSpacing: "wide" } }, size: "lg" },
    ]);
  });

  it("kebab-cases a camelCase slot in a slot compound's class", () => {
    const recipe = defineSlotRecipe({
      className: "alert",
      compoundVariants: [
        { css: { closeTrigger: { color: "red" } }, name: "contrasted", variant: "solid" },
      ],
      slots: ["root", "closeTrigger"],
      variants: { variant: { solid: {}, subtle: {} } },
    });

    expect(recipe.compoundVariants?.[0]?.className).toBe("alert__close-trigger--contrasted");
  });

  it("throws when a compound matches an axis on an object", () => {
    expect(() => compoundClassName("button", { size: { lg: true } })).toThrow(
      "size is matched on a value of type object, which cannot be part of a class name",
    );
  });

  it("returns the selection of a compound without a class prefix", () => {
    expect(compoundSelection({ css: {}, size: "lg", variant: "solid" })).toBe(
      "size_lg__variant_solid",
    );
    expect(compoundSelection({ css: {}, size: ["lg", "md"] })).toBe("size_lg|md");
  });

  it("returns undefined for a selection that matches an axis on an object", () => {
    expect(compoundSelection({ css: {}, size: { lg: true } })).toBeUndefined();
    expect(compoundSelection({ css: {}, size: ["lg", { md: true }] })).toBeUndefined();
  });

  it("splits a slot compound into one compound per styled slot", () => {
    const recipe = defineSlotRecipe({
      className: "card",
      compoundVariants: [
        { css: { root: { fontWeight: "bold" }, title: { letterSpacing: "wide" } }, size: "lg" },
      ],
      slots: ["root", "title"],
      variants: { size: { lg: {}, md: {} } },
    });

    expect(recipe.compoundVariants).toStrictEqual([
      {
        className: "card__root--compound__size_lg",
        css: { root: { fontWeight: "bold" } },
        size: "lg",
      },
      {
        className: "card__title--compound__size_lg",
        css: { title: { letterSpacing: "wide" } },
        size: "lg",
      },
    ]);
  });

  it("keeps the literal values of each variant", () => {
    const recipe = defineRecipe({
      className: "button",
      variants: { variant: { ghost: {}, solid: {} } },
    });

    expect(Object.keys(recipe.variants?.variant ?? {}).toSorted()).toStrictEqual([
      "ghost",
      "solid",
    ]);

    expectTypeOf<RecipeProps<typeof recipe>["variant"]>().toEqualTypeOf<
      "ghost" | "solid" | undefined
    >();
  });

  it("returns a slot recipe without compounds unchanged", () => {
    const recipe = { className: "dialog", slots: ["content", "title"] };

    expect(defineSlotRecipe(recipe)).toBe(recipe);
  });

  it("keeps the slots of a slot recipe", () => {
    const recipe = defineSlotRecipe({ className: "dialog", slots: ["content", "title"] });

    expect(recipe.slots).toStrictEqual(["content", "title"]);
  });

  it("types the props of a slot recipe from its variants", () => {
    const recipe = defineSlotRecipe({
      className: "dialog",
      slots: ["content"],
      variants: { size: { lg: {}, md: {} } },
    });

    expect(recipe.className).toBe("dialog");

    expectTypeOf<RecipeProps<typeof recipe>["size"]>().toEqualTypeOf<"lg" | "md" | undefined>();
  });

  it("returns a style object unchanged", () => {
    const styles = { color: "fg" };

    expect(defineStyles(styles)).toBe(styles);
  });
});
