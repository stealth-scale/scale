import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations } from "@stealthscale/testing-theme";

import page from "#data-list/data-list.specimen.tsx";
import { GAP, recipe } from "#data-list/recipe.ts";

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
        names: ["DataList.Root"],
        parts: ["root", "item", "itemLabel", "itemValue"],
      }),
    ).toStrictEqual([]);
  });

  it("sets className to data-list", () => {
    expect(recipe.className).toBe("data-list");
  });

  it("declares divided orientation size and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["divided", "orientation", "size", "variant"]);
  });

  it("defaults to a subtle list down the page at the middle size", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      orientation: "vertical",
      size: "md",
      variant: "subtle",
    });
  });

  it("clears the default margins of the list and its values", () => {
    expect([recipe.base?.["root"], recipe.base?.["itemValue"]]).toMatchObject([
      { margin: "0" },
      { margin: "0" },
    ]);
  });

  it("lays a list across the page on two columns with the label column capped at 40%", () => {
    expect(recipe.variants?.["orientation"]?.["horizontal"]).toMatchObject({
      root: { display: "grid", gridTemplateColumns: "fit-content(40%) minmax(0, 1fr)" },
    });
  });

  it("places every item across the page on the root's columns", () => {
    expect(recipe.variants?.["orientation"]?.["horizontal"]).toMatchObject({
      item: { gridColumn: "1 / -1", gridTemplateColumns: "subgrid" },
    });
  });

  it("rules an item that follows another with a hairline padded by the gap", () => {
    expect(recipe.variants?.["divided"]?.["true"]).toStrictEqual({
      item: {
        "& + .data-list__item": {
          borderBlockStartWidth: "hairline",
          borderColor: "border",
          paddingBlockStart: `var(${GAP})`,
        },
      },
    });
  });

  it("sets the item text one size smaller than the list", () => {
    expect(
      (["sm", "md", "lg"] as const).map((size) => recipe.variants?.["size"]?.[size]?.["item"]),
    ).toStrictEqual([{ textStyle: "body.xs" }, { textStyle: "body.sm" }, { textStyle: "body.md" }]);
  });

  it("mutes the label of the subtle variant", () => {
    expect(recipe.variants?.["variant"]?.["subtle"]).toStrictEqual({
      itemLabel: { color: "fg.muted" },
    });
  });
});
