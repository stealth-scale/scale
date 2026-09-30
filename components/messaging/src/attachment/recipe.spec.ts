import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#attachment/attachment.specimen.tsx";
import { recipe } from "#attachment/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, { names: ["Attachment.Root"], parts: [...recipe.slots] }),
    ).toStrictEqual([]);
  });

  it("sets className to attachment", () => {
    expect(recipe.className).toBe("attachment");
  });

  it("declares orientation and size axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["orientation", "size"]);
  });

  it("defaults to a horizontal attachment at the middle size", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ orientation: "horizontal", size: "md" });
  });

  it("declares xs to md on the size axis", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["md", "sm", "xs"]);
  });

  it("dashes the edge of an idle attachment", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      "&[data-state=idle]": { borderStyle: "dashed" },
    });
  });

  it("inks a failed attachment's edge media and description in the error palette", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      "&[data-state=error]": {
        "& .attachment__description, & .attachment__media": { color: "fg.error" },
        borderColor: "border.error",
      },
    });
  });

  it("keeps the title on one line", () => {
    expect(recipe.base?.["title"]).toMatchObject({
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    });
  });

  it("stacks rows and wraps tiles in a group", () => {
    expect([
      recipe.variants?.["orientation"]?.["horizontal"]?.["group"],
      recipe.variants?.["orientation"]?.["vertical"]?.["group"],
    ]).toStrictEqual([{ flexDirection: "column" }, { flexDirection: "row", flexWrap: "wrap" }]);
  });

  it("places a tile's actions over the media's corner", () => {
    expect(recipe.variants?.["orientation"]?.["vertical"]?.["actions"]).toMatchObject({
      position: "absolute",
    });
  });

  it("stretches a tile's media across the tile over every size", () => {
    const [tiled] = recipe.compoundVariants ?? [];

    expect([tiled?.className, tiled?.css]).toStrictEqual([
      "attachment__media--tiled",
      { media: { inlineSize: "full" } },
    ]);
  });

  it("matches the Attachment parts", () => {
    expect(recipe.jsx).toStrictEqual([/^Attachment\.\w+$/u]);
  });
});
