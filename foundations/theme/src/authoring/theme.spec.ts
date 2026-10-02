import { describe, expect, it } from "vitest";

import { defineTheme, type Theme } from "#authoring/theme.ts";
import { HUES, PALETTES } from "#contract.ts";
import { type Colors } from "#draw/statement.ts";
import { tokenAt } from "#tokens.fixtures.ts";

const COLORS: Colors = {
  dark: { ink: "#f4f4f5", page: "#18181b" },
  light: { ink: "#18181b", page: "#fafafa" },
  primary: "#2563eb",
};

function root(): Theme {
  return defineTheme({
    colors: COLORS,
    fonts: ["@f/base"],
    name: "fathom",
    tokens: { colors: { gray: { 500: { value: "#808080" } } } },
  });
}

function unnameable(): Theme {
  return defineTheme({
    extends: root(),
    name: "abyss",
    recipes: {
      button: { compoundVariants: [{ css: { fontWeight: "bold" }, size: { color: "fg" } }] },
    },
  });
}

describe("defineTheme", () => {
  it("keeps the name the theme is switched by", () => {
    expect(defineTheme({ colors: COLORS, name: "fathom" }).name).toBe("fathom");
  });

  it("names no font package when the theme names none", () => {
    expect(defineTheme({ colors: COLORS, name: "fathom" }).fonts).toStrictEqual([]);
  });

  it("names the font packages the theme named", () => {
    expect(root().fonts).toStrictEqual(["@f/base"]);
  });

  it("names the preset after the theme", () => {
    expect(root().preset.name).toBe("@stealthscale/theme-fathom");
  });

  it("draws the five families and the eight intents from the colors", () => {
    const colors = root().variant.semanticTokens?.colors ?? {};

    expect(Object.keys(colors).toSorted()).toStrictEqual(
      ["bg", "border", "code", "fg", "series", ...PALETTES].toSorted(),
    );
    expect(tokenAt(colors, "bg.DEFAULT")).toStrictEqual({ _dark: "#18181b", base: "#fafafa" });
    expect(tokenAt(colors, "primary.solid.DEFAULT")).toBeDefined();
  });

  it("draws the hue palettes over the theme's pages when asked", () => {
    const colors = defineTheme({ colors: { ...COLORS, hues: true }, name: "x" }).variant
      .semanticTokens?.colors;

    expect(Object.keys(colors ?? {})).toStrictEqual(expect.arrayContaining([...HUES]));
  });

  it("puts every value under extend", () => {
    const { preset, variant } = root();

    expect(preset.theme?.extend?.semanticTokens).toBe(variant.semanticTokens);
    expect(preset.theme?.extend?.tokens).toBe(variant.tokens);
    expect(preset.theme?.semanticTokens).toBeUndefined();
  });

  it("merges a token stated outright over the one an axis drew", () => {
    const { variant } = defineTheme({
      colors: COLORS,
      name: "x",
      semanticTokens: { colors: { bg: { panel: { value: "#ffffff" } } } },
    });

    expect(tokenAt(variant.semanticTokens?.colors, "bg.panel")).toBe("#ffffff");
    expect(tokenAt(variant.semanticTokens?.colors, "bg.subtle")).toBeDefined();
  });

  it("draws the type scale into the tokens and the size styles into the preset", () => {
    const theme = defineTheme({ colors: COLORS, name: "x", type: { base: 1.125 } });

    expect(tokenAt(theme.variant.tokens?.fontSizes, "md")).toBe("1.1250rem");
    expect(tokenAt(theme.preset.theme?.extend?.textStyles, "md")).toMatchObject({
      fontSize: "md",
    });
    expect(Reflect.get(theme.variant, "textStyles")).toBeUndefined();
  });

  it("draws the metrics and the shape and the depth into the semantic tokens", () => {
    const { semanticTokens } = defineTheme({
      colors: COLORS,
      depth: { hue: 120 },
      metrics: { scale: 2 },
      name: "x",
      shape: { control: "2px", corner: "1rem" },
    }).variant;

    expect(tokenAt(semanticTokens?.sizes, "control.md")).toBe("5.0000rem");
    expect(tokenAt(semanticTokens?.radii, "l3")).toBe("1rem");
    expect(tokenAt(semanticTokens?.borderWidths, "control")).toBe("2px");
    expect(tokenAt(semanticTokens?.shadows, "md")).toContain("120");
  });

  it("draws the tempo into the semantic paces and curves", () => {
    const { semanticTokens } = defineTheme({
      colors: COLORS,
      motion: { enter: "in-out", pace: 0.5 },
      name: "x",
    }).variant;

    expect(tokenAt(semanticTokens?.durations, "press")).toBe("calc({durations.fast} * 0.5)");
    expect(tokenAt(semanticTokens?.easings, "enter")).toBe("{easings.in-out}");
  });

  it("draws the text roles a theme moves beside the sizes", () => {
    const { preset } = defineTheme({
      colors: COLORS,
      name: "x",
      type: { heading: { weight: "bold" }, label: { weight: "semibold" } },
    });

    expect(tokenAt(preset.theme?.extend?.textStyles, "heading.sm")).toMatchObject({
      fontWeight: "bold",
    });
    expect(tokenAt(preset.theme?.extend?.textStyles, "label.md")).toMatchObject({
      fontWeight: "semibold",
    });
  });

  it("keeps the sibling steps a role drew where a theme restates one of them", () => {
    const { preset } = defineTheme({
      colors: COLORS,
      looks: { textStyles: { heading: { sm: { value: { fontWeight: "normal" } } } } },
      name: "x",
      type: { heading: { weight: "black" } },
    });
    const styles = preset.theme?.extend?.textStyles;

    expect(tokenAt(styles, "heading.sm")).toMatchObject({ fontWeight: "normal" });
    expect(tokenAt(styles, "heading.md")).toMatchObject({ fontWeight: "black" });
    expect(tokenAt(styles, "heading.4xl")).toMatchObject({ fontWeight: "black" });
    expect(tokenAt(styles, "heading.sm")).toMatchObject({ fontFamily: "heading" });
  });

  it("draws the faces into the tokens with the heading face following the body face", () => {
    const { tokens } = defineTheme({ colors: COLORS, faces: { body: "Inter" }, name: "x" }).variant;

    expect(tokens?.fonts).toStrictEqual({ body: { value: "Inter" }, heading: { value: "Inter" } });
  });

  it("puts a recipe extension in the preset", () => {
    const theme = defineTheme({
      colors: COLORS,
      name: "fathom",
      recipes: { button: { variants: { variant: { solid: { letterSpacing: "wide" } } } } },
    });

    expect(Object.keys(theme.preset.theme?.extend?.recipes ?? {})).toStrictEqual(["button"]);
  });

  it("puts a slot recipe extension in the preset under its own key", () => {
    const theme = defineTheme({
      colors: COLORS,
      name: "fathom",
      slotRecipes: { dialog: { base: { content: { boxShadow: "lg" } } } },
    });

    expect(Object.keys(theme.preset.theme?.extend?.slotRecipes ?? {})).toStrictEqual(["dialog"]);
  });

  it("leaves recipe extensions out of the variant", () => {
    const theme = defineTheme({
      colors: COLORS,
      name: "fathom",
      recipes: { button: { base: { fontWeight: "bold" } } },
    });

    expect(Reflect.get(theme.variant, "recipes")).toBeUndefined();
  });

  it("puts the looks in the preset", () => {
    const theme = defineTheme({
      colors: COLORS,
      looks: {
        animationStyles: { pop: { value: { animationName: "scale-in" } } },
        layerStyles: { card: { value: { background: "bg.panel" } } },
        textStyles: { md: { value: { fontSize: "1.0625rem" } } },
      },
      name: "folio",
    });

    expect(Object.keys(theme.preset.theme?.extend ?? {})).toStrictEqual([
      "animationStyles",
      "layerStyles",
      "semanticTokens",
      "textStyles",
    ]);
  });

  it("leaves the looks out of the variant", () => {
    const theme = defineTheme({
      colors: COLORS,
      looks: { textStyles: { md: { value: { fontSize: "1.0625rem" } } } },
      name: "folio",
    });

    expect(Reflect.get(theme.variant, "textStyles")).toBeUndefined();
  });

  it("puts a redrawn text style over the one the type scale drew", () => {
    const theme = defineTheme({
      colors: COLORS,
      looks: { textStyles: { md: { value: { fontSize: "1.0625rem" } } } },
      name: "folio",
      type: { base: 1 },
    });

    expect(tokenAt(theme.preset.theme?.extend?.textStyles, "md")).toMatchObject({
      fontSize: "1.0625rem",
      lineHeight: "1.5",
    });
    expect(tokenAt(theme.preset.theme?.extend?.textStyles, "lg")).toMatchObject({
      fontSize: "lg",
    });
  });

  it("puts a hosted face in the preset", () => {
    const theme = defineTheme({
      colors: COLORS,
      fontface: { Acme: [{ src: "url(acme.woff2)" }] },
      name: "fathom",
    });

    expect(theme.preset.globalFontface).toBeDefined();
  });

  it("puts a global style in the preset", () => {
    const theme = defineTheme({
      colors: COLORS,
      globalCss: { body: { letterSpacing: "wide" } },
      name: "fathom",
    });

    expect(theme.preset.globalCss).toBeDefined();
  });

  it("states neither a face nor a global style when the theme states neither", () => {
    const { preset } = defineTheme({ colors: COLORS, name: "fathom" });

    expect(preset.globalFontface).toBeUndefined();
    expect(preset.globalCss).toBeUndefined();
  });

  it("puts a token stated outright in the variant", () => {
    const { variant } = root();

    expect(variant.tokens?.colors?.["gray"]).toStrictEqual({ 500: { value: "#808080" } });
  });

  it("states empty tokens in the variant when the theme states none", () => {
    expect(defineTheme({ colors: COLORS, name: "fathom" }).variant.tokens).toStrictEqual({});
  });

  it("nests the parent's preset under a derived theme", () => {
    const parent = root();

    expect(defineTheme({ extends: parent, name: "abyss" }).preset.presets).toStrictEqual([
      parent.preset,
    ]);
  });

  it("keeps a derived theme's own name", () => {
    expect(defineTheme({ extends: root(), name: "abyss" }).name).toBe("abyss");
  });

  it("names the parent's font packages beside a derived theme's own once each", () => {
    const theme = defineTheme({ extends: root(), fonts: ["@f/base", "@f/own"], name: "abyss" });

    expect(theme.fonts).toStrictEqual(["@f/base", "@f/own"]);
  });

  it("draws nothing for an axis a derived theme leaves out and inherits the parent's", () => {
    const theme = defineTheme({ extends: root(), name: "abyss" });

    expect(theme.preset.theme?.extend?.semanticTokens).toBeUndefined();
    expect(theme.variant.semanticTokens?.colors?.["primary"]).toBeDefined();
    expect(theme.variant.tokens?.colors?.["gray"]).toStrictEqual({ 500: { value: "#808080" } });
  });

  it("merges a derived theme's variant over its parent's key by key", () => {
    const { variant } = defineTheme({
      extends: root(),
      name: "abyss",
      tokens: { colors: { gray: { 500: { value: "#ffffff" } } } },
    });

    expect(variant.tokens?.colors?.["gray"]).toStrictEqual({ 500: { value: "#ffffff" } });
    expect(variant.semanticTokens?.colors?.["primary"]).toBeDefined();
  });

  it("draws the axes a derived theme states over its parent's", () => {
    const { variant } = defineTheme({
      extends: root(),
      name: "abyss",
      shape: { corner: "1rem" },
    });

    expect(variant.semanticTokens?.radii?.["l3"]).toStrictEqual({ value: "1rem" });
    expect(variant.semanticTokens?.colors?.["primary"]).toBeDefined();
  });

  it("returns the axes merged through the lineage", () => {
    const parent = defineTheme({ colors: COLORS, name: "p", shape: { corner: "1rem" } });
    const child = defineTheme({ extends: parent, name: "c", shape: { control: "2px" } });

    expect(parent.axes).toStrictEqual({ colors: COLORS, shape: { corner: "1rem" } });
    expect(child.axes).toStrictEqual({
      colors: COLORS,
      shape: { control: "2px", corner: "1rem" },
    });
  });

  it("keeps the parent's corner when a derived theme restates the control stroke alone", () => {
    const parent = defineTheme({ colors: COLORS, name: "p", shape: { corner: "1rem" } });
    const { preset, variant } = defineTheme({
      extends: parent,
      name: "c",
      shape: { control: "2px" },
    });

    expect(variant.semanticTokens?.radii?.["l3"]).toStrictEqual({ value: "1rem" });
    expect(variant.semanticTokens?.borderWidths?.["control"]).toStrictEqual({ value: "2px" });
    expect(Object.keys(preset.theme?.extend?.semanticTokens ?? {})).toStrictEqual([
      "borderWidths",
      "radii",
      "spacing",
    ]);
  });

  it("scales a derived theme's density over the parent's bases", () => {
    const parent = defineTheme({ colors: COLORS, metrics: { control: 3 }, name: "p" });
    const { variant } = defineTheme({ extends: parent, metrics: { scale: 0.5 }, name: "c" });

    expect(tokenAt(variant.semanticTokens?.sizes, "control.md")).toBe("1.5000rem");
  });

  it("merges a derived theme's page over the parent's ink and draws the colors again", () => {
    const { axes, variant } = defineTheme({
      colors: { light: { page: "#f0f0f0" }, primary: "#dc2626" },
      extends: root(),
      name: "c",
    });

    expect(axes.colors?.light).toStrictEqual({ ink: "#18181b", page: "#f0f0f0" });
    expect(tokenAt(variant.semanticTokens?.colors, "bg.DEFAULT")).toStrictEqual({
      _dark: "#18181b",
      base: "#f0f0f0",
    });
    expect(tokenAt(variant.semanticTokens?.colors, "accent.solid.DEFAULT")).toBe(
      "{colors.primary.solid}",
    );
  });

  it("puts a derived theme's recipe extensions in its own preset", () => {
    const theme = defineTheme({
      extends: root(),
      name: "abyss",
      recipes: { button: { base: { fontWeight: "bold" } } },
    });

    expect(Object.keys(theme.preset.theme?.extend?.recipes ?? {})).toStrictEqual(["button"]);
  });

  it("throws for a compound matched on a value that cannot be part of a class name", () => {
    expect(unnameable).toThrow(
      "button is extended with a compound matched on a value that cannot be part of a class name",
    );
  });

  it("takes a compound whose every value can be part of a class name", () => {
    const theme = defineTheme({
      extends: root(),
      name: "abyss",
      slotRecipes: {
        card: { compoundVariants: [{ css: { root: { fontWeight: "bold" } }, size: "lg" }] },
      },
    });

    expect(Object.keys(theme.preset.theme?.extend?.slotRecipes ?? {})).toStrictEqual(["card"]);
  });
});
