import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#loader/loader.specimen.tsx";
import { recipe } from "#loader/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Loader", "LoaderOverlay"],
        parts: ["root", "indicator", "content", "label", "overlay"],
      }),
    ).toStrictEqual([]);
  });

  it("sets className to loader", () => {
    expect(recipe.className).toBe("loader");
  });

  it("declares palette and scrim axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["palette", "scrim"]);
  });

  it("defaults to the veil scrim", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ scrim: "veil" });
  });

  it("declares the eight semantic palettes on the palette axis", () => {
    expect(valuesOf(recipe, "palette")).toStrictEqual([
      "accent",
      "error",
      "info",
      "neutral",
      "primary",
      "secondary",
      "success",
      "warning",
    ]);
  });

  it("inks the indicator with the solid role of the palette", () => {
    expect(recipe.variants?.["palette"]?.["error"]).toStrictEqual({
      indicator: { color: "colorPalette.solid", colorPalette: "error" },
    });
  });

  it("declares glass none and veil on the scrim axis", () => {
    expect(valuesOf(recipe, "scrim")).toStrictEqual(["glass", "none", "veil"]);
  });

  it("switches the root to an inline grid when it contains the content slot", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      "&:has(> .loader__content)": { display: "inline-grid", placeItems: "center" },
      display: "inline-flex",
    });
  });

  it("places the content and the indicator in the same grid cell", () => {
    expect(recipe.base?.["content"]).toMatchObject({ gridArea: "1 / 1", visibility: "hidden" });
    expect(recipe.base?.["indicator"]).toMatchObject({ gridArea: "1 / 1" });
  });

  it("hides the label visually", () => {
    expect(recipe.base?.["label"]).toStrictEqual({ srOnly: true });
  });

  it("positions the overlay over its container with the container's corners", () => {
    expect(recipe.base?.["overlay"]).toMatchObject({
      borderRadius: "inherit",
      inset: "0",
      position: "absolute",
    });
  });
});
