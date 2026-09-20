import { describe, expect, it } from "vitest";

import {
  definePreset,
  defineRecipe,
  defineSlotRecipe,
  defineTheme,
} from "@stealthscale/theme/authoring";
import foundation from "@stealthscale/theme/theme";

import { foundationTheme, paletteTheme } from "#theme.fixtures.ts";
import {
  colorAt,
  extendedRecipes,
  fontsOf,
  lightnessAt,
  palettesOf,
  publishedRecipes,
  resolved,
} from "#theme.ts";

describe("theme", () => {
  it("reads a color written outright in one mode", () => {
    expect(resolved(paletteTheme(), { value: { _dark: "b", base: "a" } }, "base")).toBe("a");
  });

  it("follows a reference to a step of the theme's own ramp", () => {
    const value = resolved(paletteTheme(), { value: "{colors.primary.500}" }, "base");

    expect(value).toBe("oklch(58.0% 0.1400 262.0)");
  });

  it("follows a reference through a role to a step", () => {
    const theme = paletteTheme({
      solid: {
        DEFAULT: { value: "{colors.primary.700}" },
        hover: { value: { _dark: "{colors.primary.300}", base: "{colors.primary.800}" } },
      },
    });

    expect(resolved(theme, { value: "{colors.primary.solid}" }, "base")).toBe(
      "oklch(37.0% 0.1260 262.0)",
    );
    expect(resolved(theme, { value: "{colors.primary.solid.hover}" }, "_dark")).toBe(
      "oklch(80.0% 0.1092 262.0)",
    );
  });

  it("follows a reference into the base preset when the theme leaves the scale alone", () => {
    const value = resolved(paletteTheme(), { value: "{colors.red.600}" }, "base", {
      base: foundation,
    });

    expect(value).toMatch(/^oklch\(/u);
  });

  it("follows a reference into the base preset's semantic tokens", () => {
    const value = resolved(paletteTheme(), { value: "{colors.bg.panel}" }, "_dark", {
      base: foundation,
    });

    expect(value).toMatch(/^oklch\(/u);
  });

  it("returns undefined where the reference names a step nothing defines", () => {
    expect(resolved(paletteTheme(), { value: "{colors.primary.999}" }, "base")).toBeUndefined();
    expect(resolved(paletteTheme(), { value: "{colors.red.600}" }, "base")).toBeUndefined();
  });

  it("returns undefined where two references name each other", () => {
    const theme = paletteTheme({
      contrast: { value: "{colors.primary.solid}" },
      solid: { value: "{colors.primary.contrast}" },
    });

    expect(resolved(theme, { value: "{colors.primary.solid}" }, "base")).toBeUndefined();
  });

  it("returns undefined where a reference names itself", () => {
    const theme = paletteTheme({ solid: { value: "{colors.primary.solid}" } });

    expect(resolved(theme, { value: "{colors.primary.solid}" }, "base")).toBeUndefined();
  });

  it("returns undefined where the mode was never stated", () => {
    expect(resolved(paletteTheme(), { value: { base: "a" } }, "_dark")).toBeUndefined();
  });

  it("returns undefined where the reference names another category", () => {
    expect(resolved(paletteTheme(), { value: "{radii.l2}" }, "base")).toBeUndefined();
    expect(resolved(paletteTheme(), { value: "{colors}" }, "base")).toBeUndefined();
  });

  it("reads one string in either mode", () => {
    expect(resolved(paletteTheme(), { value: "{colors.primary.500}" }, "_dark")).toBe(
      "oklch(58.0% 0.1400 262.0)",
    );
  });

  it("reads the color a path names through the theme and then the base", () => {
    const theme = paletteTheme();

    expect(colorAt(theme, "primary.solid", "base", {})).toBe("oklch(47.0% 0.1372 262.0)");
    expect(colorAt(theme, "primary.solid.hover", "_dark", {})).toBe("oklch(78.0% 0.1114 262.0)");
    expect(colorAt(theme, "bg", "base", { base: foundation })).toBe("oklch(97.0% 0.0075 262.0)");
    expect(colorAt(theme, "bg", "base", {})).toBeUndefined();
  });

  it("reads a group at its own value", () => {
    const theme = paletteTheme({
      solid: { DEFAULT: { value: "#123456" }, hover: { value: "#0" } },
    });

    expect(colorAt(theme, "primary.solid", "base", {})).toBe("#123456");
    expect(colorAt(theme, "primary.solid.hover", "base", {})).toBe("#0");
  });

  it("reads the lightness of the color a path names", () => {
    const theme = paletteTheme({ solid: { value: "#000000" } });

    expect(lightnessAt(theme, "primary.solid", "base", {})).toBe(0);
    expect(lightnessAt(theme, "primary.contrast", "base", {})).toBeCloseTo(0.97, 2);
  });

  it("reads no lightness where the color cannot be resolved or read", () => {
    const theme = paletteTheme({ solid: { value: "nope" } });

    expect(lightnessAt(theme, "primary.solid", "base", {})).toBeUndefined();
    expect(lightnessAt(theme, "bg", "base", {})).toBeUndefined();
  });

  it("lists every group with a solid fill as a palette", () => {
    expect(palettesOf(paletteTheme())).toStrictEqual(["primary"]);
    expect(palettesOf(foundationTheme())).toHaveLength(19);
    expect(palettesOf(foundationTheme())).not.toContain("bg");
  });

  it("lists no palette for a theme that states no color", () => {
    expect(palettesOf({ ...paletteTheme(), variant: {} })).toStrictEqual([]);
  });

  it("lists the recipe keys a theme's own preset extends", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      recipes: { button: { base: {} } },
      slotRecipes: { dialog: { base: {} } },
    });

    expect(extendedRecipes(theme)).toStrictEqual(["button", "dialog"]);
    expect(extendedRecipes(paletteTheme())).toStrictEqual([]);
  });

  it("lists the font packages a theme names sorted", () => {
    expect(fontsOf({ ...paletteTheme(), fonts: ["@f/mono", "@f/body"] })).toStrictEqual([
      "@f/body",
      "@f/mono",
    ]);
  });

  it("maps every recipe the presets publish to the key it is registered under", () => {
    const actions = definePreset({
      name: "@acme/actions",
      theme: { extend: { recipes: { button: defineRecipe({ className: "button" }) } } },
    });
    const surfaces = definePreset({
      name: "@acme/surfaces",
      theme: {
        extend: { slotRecipes: { card: defineSlotRecipe({ className: "card", slots: ["root"] }) } },
      },
    });

    expect(publishedRecipes(actions, surfaces)).toStrictEqual({
      button: { className: "button" },
      card: { className: "card", slots: ["root"] },
    });
  });

  it("maps nothing for a preset that registers no recipe", () => {
    expect(publishedRecipes(definePreset({ name: "@acme/bare" }))).toStrictEqual({});
  });

  it("leaves out an entry that names no class", () => {
    const theme = defineTheme({
      extends: foundationTheme(),
      name: "abyss",
      recipes: { button: { base: {} } },
    });

    expect(publishedRecipes(theme.preset)).toStrictEqual({});
  });
});
