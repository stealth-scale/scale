import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#file-upload/file-upload.specimen.tsx";
import { recipe } from "#file-upload/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["FileUpload.Root"] })).toStrictEqual([]);
  });

  it("uses the class name file-upload", () => {
    expect(recipe.className).toBe("file-upload");
  });

  it("declares the eleven slots", () => {
    expect(recipe.slots).toStrictEqual([
      "root",
      "label",
      "dropzone",
      "itemGroup",
      "item",
      "itemPreview",
      "itemPreviewImage",
      "itemContent",
      "itemName",
      "itemSizeText",
      "itemDeleteTrigger",
    ]);
  });

  it("declares the size and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size", "variant"]);
  });

  it("defaults to an outline dropzone at md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "outline" });
  });

  it("offers sm to lg", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("dashes the dropzone's edge at the indicator width", () => {
    expect(recipe.base?.["dropzone"]).toMatchObject({
      borderStyle: "dashed",
      borderWidth: "indicator",
    });
  });

  it("turns the dropzone's edge solid while files are dragged over it", () => {
    expect(recipe.base?.["dropzone"]).toMatchObject({
      "&[data-dragging]": { borderStyle: "solid" },
    });
  });

  it("fills a dropzone that files are dragged over in every look", () => {
    const dragged = { "&[data-dragging]": { background: "colorPalette.subtle" } };

    expect([
      recipe.variants?.["variant"]?.["outline"]?.["dropzone"],
      recipe.variants?.["variant"]?.["subtle"]?.["dropzone"],
    ]).toMatchObject([dragged, dragged]);
  });

  it("edges the row of a refused file in the error color", () => {
    expect(recipe.base?.["item"]).toMatchObject({
      "&[data-type=rejected]": { borderColor: "border.error" },
    });
  });

  it("hides an empty list", () => {
    expect(recipe.base?.["itemGroup"]).toMatchObject({ "&:empty": { display: "none" } });
  });

  it("tracks JSX named FileUpload parts", () => {
    expect(recipe.jsx).toStrictEqual([/^FileUpload(\.\w+)?$/u]);
  });
});
