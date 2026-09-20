import { describe, expect, it } from "vitest";

import {
  controlSizes,
  defineRecipe,
  defineSlotRecipe,
  interactive,
  lookVariants,
  stack,
  statusEmitted,
  statusVariants,
} from "@stealthscale/theme/authoring";

import { recipeViolations } from "#recipe-checks.ts";

const button = defineRecipe({
  base: { ...interactive(), ...stack({ direction: "row", gap: "gap.sm" }) },
  className: "button",
  defaultVariants: { size: "xl", variant: "solid" },
  staticCss: [statusEmitted()],
  variants: {
    size: controlSizes(["xs", "sm", "md", "lg", "xl"]),
    status: statusVariants(),
    variant: lookVariants(["solid", "subtle", "surface", "outline", "ghost", "plain"]),
  },
});

const INK = { color: "fg" };

const SIZES = { sm: { height: "control.sm" }, xl: { height: "control.xl" } };

describe("recipeViolations", () => {
  it("passes a recipe built from the helpers", () => {
    expect(recipeViolations(button)).toStrictEqual([]);
  });

  it("reports a class name that is not kebab case", () => {
    expect(recipeViolations({ base: INK, className: "Button" })).toStrictEqual([
      "recipe.className: Button is not a class name in kebab case",
    ]);
  });

  it("reports a value two axes share", () => {
    const recipe = {
      base: INK,
      className: "button",
      variants: { radius: { lg: { borderRadius: "l2" } }, size: { lg: { height: "control.lg" } } },
    };

    expect(recipeViolations(recipe)).toStrictEqual([
      "recipe.values: button writes button--lg for size lg and for radius lg",
    ]);
  });

  it("passes a value two axes share where each styles a part the other does not", () => {
    const recipe = defineSlotRecipe({
      base: { item: INK, root: { display: "grid" } },
      className: "grid",
      slots: ["root", "item"],
      variants: {
        columns: { "3": { root: { gridTemplateColumns: "repeat(3, minmax(0, 1fr))" } } },
        span: { "3": { item: { gridColumn: "span 3" } } },
      },
    });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });

  it("reads no part off a slot recipe's value that is not an object", () => {
    const recipe = {
      base: { root: INK },
      className: "grid",
      slots: ["root"],
      variants: { columns: { "3": "odd" }, gap: { "3": "odd" } },
    };

    expect(recipeViolations(recipe)).not.toContain(
      "recipe.values: grid writes grid__root--3 for gap 3 and for columns 3",
    );
  });

  it("reports a value two axes share on one part of a slot recipe", () => {
    const recipe = defineSlotRecipe({
      base: { root: { display: "grid" } },
      className: "grid",
      slots: ["root"],
      variants: {
        columns: { "3": { root: { gridTemplateColumns: "repeat(3, minmax(0, 1fr))" } } },
        gap: { "3": { root: { gap: "gap.md" } } },
      },
    });

    expect(recipeViolations(recipe)).toStrictEqual([
      "recipe.values: grid writes grid__root--3 for gap 3 and for columns 3",
    ]);
  });

  it("reports a value that is also the name of a boolean axis", () => {
    const recipe = {
      base: INK,
      className: "button",
      variants: {
        loading: { false: { opacity: "1" }, true: { layerStyle: "disabled" } },
        state: { loading: { layerStyle: "disabled" } },
      },
    };

    expect(recipeViolations(recipe)).toStrictEqual([
      "recipe.values: button writes button--loading for state loading and for loading true",
    ]);
  });

  it("reports a compound without a name", () => {
    const recipe = defineRecipe({
      base: INK,
      className: "button",
      compoundVariants: [{ css: { fontWeight: "bold" }, size: "sm" }],
      variants: { size: SIZES },
    });

    expect(recipeViolations(recipe)).toStrictEqual([
      "recipe.compounds: button declares compound 1 without a name",
    ]);
  });

  it("reports a compound without a class as one without a name", () => {
    const recipe = {
      base: INK,
      className: "button",
      compoundVariants: [{ css: { fontWeight: "bold" }, size: "sm" }],
      variants: { size: SIZES },
    };

    expect(recipeViolations(recipe)).toStrictEqual([
      "recipe.compounds: button declares compound 1 without a name",
    ]);
  });

  it("reads no values off an axis that is not an object", () => {
    expect(
      recipeViolations({ base: INK, className: "button", variants: { size: "odd" } }),
    ).toStrictEqual([]);
  });

  it("reports two compounds under one name and a name that is a variant's class", () => {
    const recipe = defineRecipe({
      base: INK,
      className: "button",
      compoundVariants: [
        { css: { fontWeight: "bold" }, name: "hero", size: "sm" },
        { css: { fontWeight: "bold" }, name: "hero", size: "xl" },
        { css: { fontWeight: "bold" }, name: "xl", size: "sm" },
      ],
      variants: { size: SIZES },
    });

    expect(recipeViolations(recipe)).toStrictEqual([
      "recipe.compounds: button names compound 2 button--hero, as it names another",
      "recipe.compounds: button names compound 3 button--xl, which is the class of a variant",
    ]);
  });

  it("passes a slot recipe whose compound is named per slot", () => {
    const recipe = defineSlotRecipe({
      base: { root: { display: "flex" }, title: { textStyle: "heading.md" } },
      className: "card",
      compoundVariants: [
        {
          css: { root: { gap: "gap.lg" }, title: { fontWeight: "bold" } },
          name: "hero",
          size: "sm",
        },
      ],
      slots: ["root", "title"],
      variants: { size: { sm: { root: { gap: "gap.sm" } }, xl: { root: { gap: "gap.xl" } } } },
    });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });

  it("reports a value that states no styles", () => {
    const recipe = { base: INK, className: "x", variants: { size: { md: INK, none: {} } } };

    expect(recipeViolations(recipe)).toStrictEqual([
      "recipe.empty: x offers size none with no styles, so its class has no rule",
    ]);
  });

  it("passes a base that states no styles", () => {
    expect(recipeViolations({ base: {}, className: "x" })).toStrictEqual([]);
    expect(recipeViolations({ className: "x" })).toStrictEqual([]);
  });

  it("reports a compound that states no styles", () => {
    const recipe = defineRecipe({
      base: INK,
      className: "x",
      compoundVariants: [{ css: {}, name: "hero", size: "sm" }],
      variants: { size: SIZES },
    });

    expect(recipeViolations(recipe)).toStrictEqual([
      "recipe.empty: x declares compound 1 with no styles",
    ]);
  });

  it("reports a slot recipe's value that states no styles on any slot", () => {
    const recipe = defineSlotRecipe({
      base: { root: { display: "flex" }, title: { textStyle: "heading.md" } },
      className: "card",
      slots: ["root", "title"],
      variants: { size: { sm: { root: {} }, xl: { root: { gap: "gap.xl" } } } },
    });

    expect(recipeViolations(recipe)).toStrictEqual([
      "recipe.empty: card offers size sm with no styles, so its class has no rule",
    ]);
  });

  it("passes a slot nothing styles", () => {
    const recipe = defineSlotRecipe({
      base: { root: { display: "flex" } },
      className: "card",
      slots: ["root", "ghost", "title"],
      variants: { size: { md: { title: { textStyle: "heading.md" } } } },
    });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });

  it("counts a slot a compound styles as styled", () => {
    const recipe = defineSlotRecipe({
      base: { root: { display: "flex" } },
      className: "card",
      compoundVariants: [{ css: { title: { fontWeight: "bold" } }, name: "hero", size: "md" }],
      slots: ["root", "title"],
      variants: { size: { md: { root: { gap: "gap.md" } } } },
    });

    expect(recipeViolations(recipe)).toStrictEqual([]);
  });

  it("reports a default naming an axis the recipe does not offer", () => {
    const recipe = { base: INK, className: "x", defaultVariants: { size: "md" } };

    expect(recipeViolations(recipe)).toStrictEqual([
      "recipe.defaults: x defaults size to md, and offers no such axis",
    ]);
  });

  it("reports a default naming a value the axis does not offer", () => {
    const recipe = {
      base: INK,
      className: "x",
      defaultVariants: { loading: true, size: "md" },
      variants: { loading: { true: { layerStyle: "disabled" } }, size: SIZES },
    };

    expect(recipeViolations(recipe)).toStrictEqual([
      "recipe.defaults: x defaults size to md, which the axis does not offer",
    ]);
  });

  it("reads no defaults off a value that is not an object", () => {
    expect(recipeViolations({ base: INK, className: "x", defaultVariants: "md" })).toStrictEqual(
      [],
    );
  });

  it("reports a compound matched on an axis the recipe does not offer", () => {
    const recipe = {
      base: INK,
      className: "x",
      compoundVariants: [{ className: "x--hero", css: { fontWeight: "bold" }, tone: "loud" }],
      variants: { size: SIZES },
    };

    expect(recipeViolations(recipe)).toStrictEqual([
      "recipe.selections: x matches compound 1 on tone, which the recipe does not offer",
    ]);
  });

  it("reports a compound matched on a value the axis does not offer among a list", () => {
    const recipe = {
      base: INK,
      className: "x",
      compoundVariants: [{ className: "x--hero", css: { fontWeight: "bold" }, size: ["sm", "md"] }],
      variants: { size: SIZES },
    };

    expect(recipeViolations(recipe)).toStrictEqual([
      "recipe.selections: x matches compound 1 on size md, which the axis does not offer",
    ]);
  });

  it("passes a recipe whose patterns match every name and every name matches a pattern", () => {
    const recipe = { ...button, jsx: [/Button$/u, "SubmitButton"] };

    expect(
      recipeViolations(recipe, { names: ["Button", "IconButton", "SubmitButton"] }),
    ).toStrictEqual([]);
  });

  it("reports a name no pattern matches and a pattern that matches no name", () => {
    const recipe = { ...button, jsx: [/^List(\.\w+)?$/u, "Menu"] };

    expect(recipeViolations(recipe, { names: ["List.Root", "Button"] })).toStrictEqual([
      "recipe.jsx: button tracks no tag named Button",
      "recipe.jsx: button tracks Menu, which matches no published name",
    ]);
  });

  it("reports a recipe that states no patterns where names are given", () => {
    expect(recipeViolations(button, { names: ["Button"] })).toStrictEqual([
      "recipe.jsx: button states no jsx patterns",
    ]);
    expect(recipeViolations(button, { names: [] })).toStrictEqual([]);
  });

  it.each([
    ["#fff", "writes the color #fff"],
    ["oklch(50% 0.1 200)", "writes the color oklch(50% 0.1 200)"],
    ["{colors.blue.500}", "references {colors.blue.500}"],
    ["blue.500", "names the ramp step blue.500"],
    ["blue.solid", "names the hue blue.solid"],
    ["red", "names the hue red"],
    ["white", "names white, which is not a semantic color token"],
    ["fg.mutd", "names fg.mutd, which is not a semantic color token"],
    ["colorPalette.nope", "reads colorPalette.nope, which is not a role of the palette"],
  ])("reports %s as a color a theme cannot move", (value, fault) => {
    expect(recipeViolations({ base: { color: value }, className: "x" })).toStrictEqual([
      `recipe.colors: x ${fault} at base.color`,
    ]);
  });

  it.each([
    "fg",
    "fg.muted/50",
    "colorPalette.solid.hover",
    "primary.fg",
    "transparent",
    "var(--ink)",
  ])("passes %s as a color", (value) => {
    expect(recipeViolations({ base: { background: value }, className: "x" })).toStrictEqual([]);
  });

  it("reports a palette that is a hue rather than an intent", () => {
    expect(recipeViolations({ base: { colorPalette: "blue" }, className: "x" })).toStrictEqual([
      "recipe.colors: x points colorPalette at blue at base.colorPalette, and a recipe names an intent",
    ]);
    expect(recipeViolations({ base: { colorPalette: "error" }, className: "x" })).toStrictEqual([]);
  });

  it.each([
    ["textStyle", "lable.md", "textStyles"],
    ["layerStyle", "fill.sold", "layerStyles"],
    ["animationStyle", "fade.inn", "animationStyles"],
    ["gap", "gap.smal", "spacing"],
    ["height", "controll.md", "sizes"],
    ["boxShadow", "shadows.nope", "shadows"],
  ])("reports %s set to %s as no %s token", (property, value, category) => {
    expect(recipeViolations({ base: { [property]: value }, className: "x" })).toStrictEqual([
      `recipe.tokens: x names ${value}, which is not a ${category} token at base.${property}`,
    ]);
  });

  it("reports a token function naming a size nothing defines", () => {
    expect(
      recipeViolations({ base: { flexBasis: "token(sizes.nope, nope)" }, className: "x" }),
    ).toStrictEqual([
      "recipe.tokens: x names token(sizes.nope, nope), which is not a sizes token at base.flexBasis",
    ]);
    expect(
      recipeViolations({ base: { flexBasis: "token(sizes.md, md)" }, className: "x" }),
    ).toStrictEqual([]);
  });

  it("reads a token function inside a calculation", () => {
    expect(
      recipeViolations({
        base: { flexBasis: "calc((token(sizes.nope, nope) - 100%) * 999)" },
        className: "x",
      }),
    ).toStrictEqual([
      "recipe.tokens: x names calc((token(sizes.nope, nope) - 100%) * 999), which is not a sizes token at base.flexBasis",
    ]);
  });

  it("passes a value that is not a token on a property that takes a keyword", () => {
    expect(
      recipeViolations({
        base: { boxShadow: "none", height: "auto", width: "100%" },
        className: "x",
      }),
    ).toStrictEqual([]);
  });

  it("reports a condition nothing defines", () => {
    expect(recipeViolations({ base: { _hovr: { color: "fg" } }, className: "x" })).toStrictEqual([
      "recipe.conditions: x nests under _hovr at base._hovr, which is not a condition",
    ]);
  });

  it("reports a length in a unit a theme cannot move", () => {
    expect(recipeViolations({ base: { paddingInline: "4px" }, className: "x" })).toStrictEqual([
      "recipe.lengths: x sets paddingInline to 4px at base.paddingInline, a length in px, rem or pt",
    ]);
  });

  it("passes a length the compiler resolves inside a token call or a fallback", () => {
    expect(
      recipeViolations({ base: { paddingInline: "token(spacing.4, 4px)" }, className: "x" }),
    ).toStrictEqual([]);
    expect(
      recipeViolations({ base: { marginTop: "var(--offset, 4px)" }, className: "x" }),
    ).toStrictEqual([]);
  });

  it("reports a token named by one word that the preset does not define", () => {
    expect(recipeViolations({ base: { borderRadius: "l9" }, className: "x" })).toStrictEqual([
      "recipe.tokens: x names l9, which is not a radii token at base.borderRadius",
    ]);
    expect(recipeViolations({ base: { zIndex: "stiky" }, className: "x" })).toStrictEqual([
      "recipe.tokens: x names stiky, which is not a zIndex token at base.zIndex",
    ]);
  });

  it("passes a token named by one word that the preset defines", () => {
    expect(
      recipeViolations({ base: { borderRadius: "l2", zIndex: "sticky" }, className: "x" }),
    ).toStrictEqual([]);
  });

  it("reads a value under a range breakpoint against the property above it", () => {
    expect(
      recipeViolations({ base: { color: { smDown: "#fff", smToLg: "red.500" } }, className: "x" }),
    ).toStrictEqual([
      "recipe.colors: x writes the color #fff at base.color.smDown",
      "recipe.colors: x names the ramp step red.500 at base.color.smToLg",
    ]);
    expect(recipeViolations({ base: { inset: "calc(1rem + 2%)" }, className: "x" })).toHaveLength(
      1,
    );
  });

  it("passes a length on a property the specification allows one on", () => {
    expect(
      recipeViolations(
        { base: { paddingInline: "4px" }, className: "x" },
        { lengths: ["paddingInline"] },
      ),
    ).toStrictEqual([]);
  });

  it("passes a length in a unit that scales", () => {
    expect(
      recipeViolations({ base: { inset: "0", minHeight: "100dvh", width: "50%" }, className: "x" }),
    ).toStrictEqual([]);
  });

  it("reports a color mode the recipe switches on", () => {
    expect(recipeViolations({ base: { _dark: { color: "fg" } }, className: "x" })).toStrictEqual([
      "recipe.modes: x switches on the color mode at base._dark",
    ]);
  });

  it("reports a slot the anatomy stamps no part for and a part no slot styles", () => {
    const dialog = defineSlotRecipe({
      base: { content: { display: "flex" }, extra: { display: "flex" } },
      className: "dialog",
      slots: ["content", "extra"],
    });

    expect(recipeViolations(dialog, { parts: ["content", "title"] })).toStrictEqual([
      "recipe.slots: dialog styles extra, which the anatomy stamps no part for",
      "recipe.slots: dialog styles no slot for the part title",
    ]);
  });

  it("reports every part when the recipe styles no slot", () => {
    expect(recipeViolations({ base: INK, className: "x" }, { parts: ["root"] })).toStrictEqual([
      "recipe.slots: x styles no slot for the part root",
    ]);
  });

  it("checks the tokens against the preset it is handed", () => {
    expect(
      recipeViolations(
        { base: { color: "fg", textStyle: "label.md" }, className: "x" },
        { preset: { name: "bare" } },
      ),
    ).toStrictEqual([
      "recipe.colors: x names fg, which is not a semantic color token at base.color",
      "recipe.tokens: x names label.md, which is not a textStyles token at base.textStyle",
    ]);
  });

  it("passes over a compound variant that is not an object", () => {
    expect(recipeViolations({ base: INK, className: "x", compoundVariants: [null] })).toStrictEqual(
      [],
    );
  });

  it("passes the tertiary ink as a text color", () => {
    expect(recipeViolations({ base: { color: "fg.subtle" }, className: "x" })).toStrictEqual([]);
  });

  it("leaves out a check skipped with a reason", () => {
    expect(
      recipeViolations(
        { base: { color: "#fff" }, className: "x" },
        { skip: { "recipe.colors": "a reason" } },
      ),
    ).toStrictEqual([]);
  });

  it("reports a skip that gives no reason", () => {
    expect(
      recipeViolations({ base: INK, className: "x" }, { skip: { "recipe.colors": " " } }),
    ).toStrictEqual(["skip of recipe.colors gives no reason"]);
  });

  it("reports a status the compiler emits no rule for", () => {
    expect(
      recipeViolations({ base: INK, className: "x", variants: { status: { error: INK } } }),
    ).toStrictEqual(["recipe.emitted: x offers status, which staticCss does not emit"]);
  });

  it("accepts a status emitted as the whole recipe", () => {
    expect(
      recipeViolations({
        base: INK,
        className: "x",
        staticCss: ["*"],
        variants: { status: { error: INK } },
      }),
    ).toStrictEqual([]);
  });

  it("accepts a status emitted value by value", () => {
    expect(
      recipeViolations({
        base: INK,
        className: "x",
        staticCss: [{ status: ["error"] }],
        variants: { status: { error: INK } },
      }),
    ).toStrictEqual([]);
  });

  it("says nothing about a recipe that offers no status", () => {
    expect(
      recipeViolations({ base: INK, className: "x", variants: { size: SIZES } }),
    ).toStrictEqual([]);
  });
});
