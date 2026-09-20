import { describe, expect, it } from "vitest";

import { withScratchWorkspace } from "@stealthscale/testing";
import { defineRecipe, defineSlotRecipe, defineTheme } from "@stealthscale/theme/authoring";
import foundation from "@stealthscale/theme/theme";

import {
  compounds,
  extensions,
  listed,
  modes,
  references,
  roles,
  styles,
  variants,
} from "#contract.ts";
import { foundationTheme, paletteTheme } from "#theme.fixtures.ts";

const EXTENSION = "export const extension = { base: {} };\n";

const button = defineRecipe({
  className: "button",
  compoundVariants: [{ css: {}, size: "lg", variant: "solid" }],
  variants: { size: { lg: {}, sm: {} }, variant: { ghost: {}, solid: {} } },
});

const card = defineSlotRecipe({
  base: { root: { display: "flex" } },
  className: "card",
  compoundVariants: [{ css: { root: { gap: "gap.lg" } }, name: "hero", size: "lg" }],
  slots: ["root", "title", "footer"],
  variants: {
    size: {
      lg: { root: { gap: "gap.lg" }, title: { textStyle: "heading.lg" } },
      md: { root: { gap: "gap.md" } },
    },
  },
});

describe("contract", () => {
  it("passes the foundation on every check", () => {
    const theme = foundationTheme();

    expect(roles(theme)).toStrictEqual([]);
    expect(modes(theme)).toStrictEqual([]);
    expect(references(theme, {})).toStrictEqual([]);
    expect(extensions(theme, [])).toStrictEqual([]);
    expect(styles(theme)).toStrictEqual([]);
  });

  it("reports a role a palette leaves out", () => {
    const theme = paletteTheme({ focusRing: undefined, solid: { DEFAULT: { value: "x" } } });

    expect(roles(theme)).toStrictEqual([
      "audited primary.solid.hover is not stated",
      "audited primary.focusRing is not stated",
    ]);
  });

  it("reports a member a family leaves out", () => {
    const theme = {
      ...paletteTheme(),
      variant: { semanticTokens: { colors: { fg: { DEFAULT: { value: "x" } } } } },
    };

    expect(roles(theme)).toHaveLength(9);
    expect(roles(theme)[0]).toBe("audited fg.muted is not stated");
  });

  it("reports a kind the code family leaves out", () => {
    const theme = {
      ...paletteTheme(),
      variant: { semanticTokens: { colors: { code: { keyword: { value: "x" } } } } },
    };

    expect(roles(theme)).toHaveLength(9);
    expect(roles(theme)[0]).toBe("audited code.string is not stated");
  });

  it("reports a color stated in one mode and not the other", () => {
    expect(modes(paletteTheme({ solid: { value: { base: "x" } } }))).toStrictEqual([
      "audited primary.solid is not stated in _dark",
    ]);
  });

  it("passes a color stated once and a reference", () => {
    expect(modes(paletteTheme({ solid: { value: "x" } }))).toStrictEqual([]);
  });

  it("reports a color whose value states no mode at all", () => {
    expect(modes(paletteTheme({ solid: { value: {} } }))).toStrictEqual([
      "audited primary.solid states no mode",
    ]);
    expect(modes(paletteTheme({ solid: { value: { _osDark: "x", light: "y" } } }))).toStrictEqual([
      "audited primary.solid states no mode",
    ]);
  });

  it("reports a reference that points at a step nothing defines", () => {
    const theme = paletteTheme({ solid: { value: { _dark: "x", base: "{colors.primary.999}" } } });

    expect(references(theme, {})).toStrictEqual([
      "audited primary.solid in base names {colors.primary.999}, which nothing defines",
    ]);
  });

  it("resolves a reference through the base preset", () => {
    const theme = paletteTheme({ solid: { value: "{colors.red.600}" } });

    expect(references(theme, {})).toHaveLength(2);
    expect(references(theme, { base: foundation })).toStrictEqual([]);
  });

  it("reports an extension naming a key no package publishes", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      recipes: { buton: { base: {} } },
    });

    expect(extensions(theme, ["button"])).toStrictEqual([
      "abyss extends buton, which no package publishes",
    ]);
    expect(extensions(theme)).toStrictEqual([]);
  });

  it("reports an extension naming a key the component owns", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      slotRecipes: { dialog: { base: {} } },
    });
    const extension = theme.preset.theme?.extend?.slotRecipes?.["dialog"];

    Object.assign(extension ?? {}, { className: "dialog", slots: ["content"] });

    expect(extensions(theme, ["dialog"])).toStrictEqual([
      "abyss extends dialog with className, which the component owns",
      "abyss extends dialog with slots, which the component owns",
    ]);
  });

  it("passes a compound for a selection the recipe declares", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      recipes: {
        button: { compoundVariants: [{ css: {}, size: "lg", variant: "solid" }] },
        dialog: { compoundVariants: [{ css: {}, open: true }] },
        input: { base: {} },
      },
    });

    expect(compounds(theme, { button, input: { className: "input" } })).toStrictEqual([]);
  });

  it("reports a compound for a selection the recipe does not declare", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      recipes: { button: { compoundVariants: [{ css: {}, size: "sm", variant: "solid" }] } },
    });

    expect(compounds(theme, { button })).toStrictEqual([
      "abyss extends button with a compound for size_sm__variant_solid, which the recipe does not declare",
    ]);
  });

  it("reports a compound matched on a value a class name cannot carry", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      recipes: { button: { base: {} } },
    });
    const extend = theme.preset.theme?.extend?.recipes?.["button"];
    const recipe = { ...button, compoundVariants: [null] };

    Object.assign(extend ?? {}, { compoundVariants: [{ css: {}, size: { color: "fg" } }] });

    expect(compounds(theme, { button: recipe })).toStrictEqual([
      "abyss extends button with a compound matched on a value a class name cannot carry",
    ]);
  });

  it("passes over a theme's compound that is not an object", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      recipes: { button: { base: {} } },
    });
    const extend = theme.preset.theme?.extend?.recipes?.["button"];

    Object.assign(extend ?? {}, { compoundVariants: [null] });

    expect(compounds(theme, { button })).toStrictEqual([]);
  });

  it("reports rather than throws when the recipe's own compound carries such a value", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      recipes: { button: { compoundVariants: [{ css: {}, size: "lg" }] } },
    });
    const recipe = { ...button, compoundVariants: [{ css: {}, size: { bad: true } }] };

    expect(compounds(theme, { button: recipe })).toStrictEqual([
      "abyss extends button with a compound for size_lg, which the recipe does not declare",
    ]);
  });

  it("passes an extension on a value the recipe offers and a part its value styles", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      recipes: { button: { variants: { size: { lg: { letterSpacing: "wide" } } } } },
      slotRecipes: { card: { variants: { size: { lg: { title: { letterSpacing: "wide" } } } } } },
    });

    expect(variants(theme, { button, card })).toStrictEqual([]);
  });

  it("reports an extension on an axis the recipe does not offer", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      recipes: { button: { variants: { tone: { loud: { letterSpacing: "wide" } } } } },
    });

    expect(variants(theme, { button })).toStrictEqual([
      "abyss extends button on tone, which the recipe does not offer",
    ]);
  });

  it("reports an extension on a value the axis does not offer", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      recipes: { button: { variants: { size: { xl: { letterSpacing: "wide" } } } } },
    });

    expect(variants(theme, { button })).toStrictEqual([
      "abyss extends button size xl, which the axis does not offer",
    ]);
  });

  it("reports an extension on a part the recipe's value does not style", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      slotRecipes: { card: { variants: { size: { md: { title: { letterSpacing: "wide" } } } } } },
    });

    expect(variants(theme, { card })).toStrictEqual([
      "abyss extends card size md on title, which the recipe's value does not style",
    ]);
  });

  it("passes over an extension whose variants are not an object and a key the map lacks", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      recipes: { button: { base: {} }, input: { base: {} } },
    });
    const extend = theme.preset.theme?.extend?.recipes?.["button"];

    Object.assign(extend ?? {}, { variants: { size: "odd" } });

    expect(variants(theme, { button })).toStrictEqual([]);
  });

  it("reports a compound styling a part the recipe's compound does not", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      slotRecipes: {
        card: { compoundVariants: [{ css: { footer: { gap: "gap.lg" } }, size: "lg" }] },
      },
    });

    expect(compounds(theme, { card })).toStrictEqual([
      "abyss extends card with a compound for size_lg on footer, which the recipe's compound does not style",
    ]);
  });

  it("passes over a compound without css on a slot recipe", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      slotRecipes: { card: { base: {} } },
    });
    const extend = theme.preset.theme?.extend?.slotRecipes?.["card"];

    Object.assign(extend ?? {}, { compoundVariants: [{ size: "lg" }] });

    expect(compounds(theme, { card })).toStrictEqual([]);
  });

  it("reports an extension file the theme does not list", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      recipes: { button: { base: {} } },
    });
    const found = withScratchWorkspace(
      { "src/recipes/button.ts": EXTENSION, "src/slot-recipes/dialog.ts": EXTENSION },
      (workspace) => listed(theme, workspace.path("src")),
    );

    expect(found).toStrictEqual(["abyss does not list slot-recipes/dialog.ts"]);
  });

  it("reports a source directory that is absent", () => {
    expect(listed(paletteTheme(), "/nowhere")).toStrictEqual([
      "audited has no source directory at /nowhere",
    ]);
  });

  it("reports a style that states nothing and a text style without a size", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      layerStyles: { card: { value: {} } },
      name: "abyss",
      textStyles: { hero: { value: { fontWeight: "bold" } } },
    });

    expect(styles(theme)).toStrictEqual([
      "abyss layerStyles.card states nothing",
      "abyss textStyles.hero states no fontSize",
    ]);
  });
});
