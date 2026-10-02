import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";
import { PALETTES } from "@stealthscale/theme/authoring";

import page from "#link/link.specimen.tsx";
import { recipe } from "#link/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Link"] })).toStrictEqual([]);
  });

  it("sets className to link", () => {
    expect(recipe.className).toBe("link");
  });

  it("declares the inherit palette and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["inherit", "palette", "variant"]);
  });

  it("inherits the color in the visited state when inherit is true", () => {
    expect(recipe.variants?.["inherit"]?.["true"]).toStrictEqual({
      _visited: { color: "inherit" },
      color: "inherit",
    });
  });

  it("declares every semantic palette on the palette axis", () => {
    expect(valuesOf(recipe, "palette")).toStrictEqual([...PALETTES].toSorted());
  });

  it("reads the fg role of the palette in the visited state", () => {
    expect(recipe.variants?.["palette"]?.["error"]).toStrictEqual({
      _visited: { color: "colorPalette.fg" },
      color: "colorPalette.fg",
      colorPalette: "error",
    });
  });

  it("lists every palette in staticCss", () => {
    expect(recipe.staticCss).toStrictEqual([{ palette: [...PALETTES] }]);
  });

  it("defaults to the underline variant", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ variant: "underline" });
  });

  it("declares plain and underline on the variant axis", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["plain", "underline"]);
  });

  it("reads fg.link in the base", () => {
    expect(recipe.base).toMatchObject({ color: "fg.link" });
  });

  it("underlines on hover in the base", () => {
    expect(recipe.base?.["_hover"]).toMatchObject({ textDecoration: "underline" });
  });

  it("restates the hover underline in the plain variant", () => {
    expect(recipe.variants?.["variant"]?.["plain"]).toStrictEqual({
      _hover: { textDecoration: "underline" },
      textDecoration: "none",
    });
  });

  it("matches the Link tag only", () => {
    const [pattern] = recipe.jsx ?? [];

    expect(pattern).toStrictEqual(/^Link$/u);
    expect(pattern instanceof RegExp && pattern.test("BreadcrumbLink")).toBe(false);
  });
});
