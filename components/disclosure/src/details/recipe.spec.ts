import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations } from "@stealthscale/testing-theme";
import { dense } from "@stealthscale/theme/authoring";

import page from "#details/details.specimen.tsx";
import { OPEN_SUMMARY, OPENED, recipe } from "#details/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Details"] })).toStrictEqual([]);
  });

  it("sets className to details", () => {
    expect(recipe.className).toBe("details");
  });

  it("declares four slots", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual(["content", "indicator", "root", "summary"]);
  });

  it("declares three axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["palette", "size", "variant"]);
  });

  it("defaults to an outlined details at md in neutral", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      palette: "neutral",
      size: "md",
      variant: "outline",
    });
  });

  it("turns the indicator a quarter while open and the other way under rtl", () => {
    expect(recipe.base?.indicator?.[OPEN_SUMMARY]).toStrictEqual({
      _rtl: { rotate: "-90deg" },
      rotate: "90deg",
    });
  });

  it("pads the summary by half a control's height less its tallest line", () => {
    expect(recipe.variants?.["size"]?.["md"]?.summary?.paddingBlock).toBe(
      `calc((${dense("{sizes.control.md}")} - max(1lh, ${dense("{sizes.icon.md}")})) / 2)`,
    );
  });

  it("removes the browser's marker from the summary", () => {
    expect(recipe.base?.summary).toMatchObject({
      "&::-webkit-details-marker": { display: "none" },
      listStyle: "none",
    });
  });

  it("outlines the subtle box in CanvasText under forced colors", () => {
    expect(recipe.variants?.["variant"]?.["subtle"]?.root?.["_highContrast"]).toStrictEqual({
      outlineColor: "CanvasText",
      outlineOffset: "calc({borderWidths.hairline} * -1)",
      outlineStyle: "solid",
      outlineWidth: "hairline",
    });
  });

  it("pads no side of the summary and the content in the plain look", () => {
    expect(recipe.variants?.["variant"]?.["plain"]).toStrictEqual({
      content: { paddingInline: "0" },
      root: { borderWidth: "0" },
      summary: { paddingInline: "0" },
    });
  });

  it("rules the open summary off from the content in the outline look", () => {
    expect(recipe.variants?.["variant"]?.["outline"]?.summary?.[OPENED]).toStrictEqual({
      borderBlockEndColor: "colorPalette.muted",
      borderBlockEndWidth: "hairline",
    });
  });
});
