import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#avatar/avatar.specimen.tsx";
import { recipe, SIZE } from "#avatar/recipe.ts";

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
        names: ["Avatar.Root", "Avatar.Group"],
        parts: ["root", "image", "fallback", "group"],
      }),
    ).toStrictEqual([]);
  });

  it("sets className to avatar", () => {
    expect(recipe.className).toBe("avatar");
  });

  it("declares effect palette shape size and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["effect", "palette", "shape", "size", "variant"]);
  });

  it("defaults to a subtle circle at the middle size", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ shape: "circle", size: "md", variant: "subtle" });
  });

  it("declares 2xs and the six control sizes on the size axis", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["2xl", "2xs", "lg", "md", "sm", "xl", "xs"]);
  });

  it("sizes a 2xs box at the middle tag height with the smallest text style", () => {
    expect(recipe.variants?.["size"]?.["2xs"]).toStrictEqual({
      fallback: { textStyle: "2xs" },
      root: { [SIZE]: "calc({sizes.tag.md} * var(--density, 1))" },
    });
  });

  it("clips the image to the root's corners and nothing to the root", () => {
    expect([
      recipe.base?.["image"]?.["borderRadius"],
      recipe.base?.["root"]?.["overflow"],
    ]).toStrictEqual(["inherit", undefined]);
  });

  it("declares four flat looks on the variant axis", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["outline", "solid", "subtle", "surface"]);
  });

  it("sizes the box from the control scale and the initials from the label style", () => {
    expect(recipe.variants?.["size"]?.["md"]).toStrictEqual({
      fallback: { textStyle: "label.md" },
      root: { [SIZE]: "calc({sizes.control.md} * var(--density, 1))" },
    });
  });

  it("overlaps each avatar in a group by a quarter of its side", () => {
    expect(recipe.base?.["group"]).toMatchObject({
      "& > .avatar__root + .avatar__root": { marginInlineStart: `calc(var(${SIZE}) / -4)` },
    });
  });

  it("rings each avatar in a group with an outline in the panel's ground", () => {
    expect(recipe.base?.["group"]).toMatchObject({
      "& > .avatar__root": {
        outlineColor: "bg.panel",
        outlineStyle: "solid",
        outlineWidth: "indicator",
      },
    });
  });

  it("hides the image when the machine sets hidden", () => {
    expect(recipe.base?.["image"]).toMatchObject({ "&[hidden]": { display: "none" } });
  });

  it("hides the fallback when the machine sets hidden", () => {
    expect(recipe.base?.["fallback"]).toMatchObject({ "&[hidden]": { display: "none" } });
  });

  it("covers the box with the image", () => {
    expect(recipe.base?.["image"]).toMatchObject({ objectFit: "cover" });
  });

  it("outlines the root in CanvasText in forced colors mode", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      _highContrast: { outlineColor: "CanvasText", outlineStyle: "solid" },
    });
  });
});
