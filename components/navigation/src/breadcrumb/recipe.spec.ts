import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#breadcrumb/breadcrumb.specimen.tsx";
import { recipe } from "#breadcrumb/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Breadcrumb"] })).toStrictEqual([]);
  });

  it("sets className to breadcrumb", () => {
    expect(recipe.className).toBe("breadcrumb");
  });

  it("declares seven slots", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "currentLink",
      "ellipsis",
      "item",
      "link",
      "list",
      "root",
      "separator",
    ]);
  });

  it("reads fg.muted on the ellipsis", () => {
    expect(recipe.base?.["ellipsis"]).toMatchObject({ color: "fg.muted" });
  });

  it("declares the size and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size", "variant"]);
  });

  it("defaults to the md size in the plain variant", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "plain" });
  });

  it("declares five sizes from xs to xl", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm", "xl", "xs"]);
  });

  it("sets the text style on the root and the gap on the list at each size", () => {
    expect(recipe.variants?.["size"]?.["md"]).toStrictEqual({
      list: { gap: "calc({spacing.gap.md} * var(--density, 1))" },
      root: { textStyle: "body.md" },
    });
  });

  it("reads fg.muted on the links and fg on the current link", () => {
    expect(recipe.variants?.["variant"]?.["plain"]).toMatchObject({
      currentLink: { color: "fg" },
      link: { color: "fg.muted" },
    });
  });

  it("rotates the separator by 180 degrees in a right-to-left document", () => {
    expect(recipe.base?.["separator"]).toMatchObject({ _rtl: { rotate: "180deg" } });
  });

  it("matches the Breadcrumb tag and its parts", () => {
    expect(recipe.jsx).toStrictEqual([/^Breadcrumb(\.\w+)?$/u]);
  });
});
