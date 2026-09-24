import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe, ROOM } from "#section/recipe.ts";
import page from "#section/section.specimen.tsx";

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
        names: ["Section"],
        parts: [
          "root",
          "header",
          "title",
          "description",
          "actions",
          "action",
          "folded",
          "body",
          "footer",
        ],
      }),
    ).toStrictEqual([]);
  });

  it("sets className to section", () => {
    expect(recipe.className).toBe("section");
  });

  it("declares nine slots", () => {
    expect(recipe.slots).toStrictEqual([
      "root",
      "header",
      "title",
      "description",
      "actions",
      "action",
      "folded",
      "body",
      "footer",
    ]);
  });

  it("folds an action by its priority", () => {
    expect(recipe.base?.["action"]?.["&[data-priority=tertiary]"]).toStrictEqual({
      "[data-narrow] &": { display: "none" },
    });
  });

  it("declares three axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["annotated", "size", "variant"]);
  });

  it("defaults to a plain section at md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "plain" });
  });

  it("declares two looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["plain", "surface"]);
  });

  it("lays the header out as a grid of named areas", () => {
    expect(recipe.base?.["header"]).toMatchObject({
      display: "grid",
      gridTemplateAreas: '"title actions" "description description"',
    });
  });

  it("gives the title the column that shrinks and the actions the one that does not", () => {
    expect(recipe.base?.["header"]).toMatchObject({
      gridTemplateColumns: "minmax(0, 1fr) auto",
    });
    expect(recipe.base?.["actions"]).toMatchObject({ flexWrap: "nowrap" });
  });

  it("stops the description at the reading measure", () => {
    expect(recipe.base?.["description"]).toMatchObject({ maxInlineSize: "prose" });
  });

  it("sets the card's room as one property every band reads", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["root"]).toMatchObject({
      [ROOM]: "{spacing.inset.md}",
    });
  });

  it("separates the bands by the gap two sizes larger", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["root"]).toMatchObject({
      gap: "calc({spacing.gap.xl} * var(--density, 1))",
    });
    expect(recipe.variants?.["size"]?.["sm"]?.["root"]).toMatchObject({
      gap: "calc({spacing.gap.lg} * var(--density, 1))",
    });
  });

  it("sets the title and the description one size smaller", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["title"]).toStrictEqual({
      textStyle: "heading.sm",
    });
    expect(recipe.variants?.["size"]?.["md"]?.["description"]).toStrictEqual({
      textStyle: "body.sm",
    });
    expect(recipe.base?.["description"]).not.toHaveProperty("color");
  });

  it("clips a card so a bleeding body keeps its corners", () => {
    expect(recipe.variants?.["variant"]?.["surface"]?.["root"]).toStrictEqual({ overflow: "clip" });
  });

  it("stops one gap under the shell's sticky bars when scrolled to", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      scrollMarginBlockStart: "calc(var(--app-shell-sticky-top, 0px) + {spacing.gap.lg})",
    });
  });

  it("rules only a plain section that follows another section", () => {
    expect(recipe.variants?.["variant"]?.["plain"]?.["root"]).toStrictEqual({
      "& + &": {
        borderBlockStartWidth: "hairline",
        borderColor: "border",
        marginBlockStart: "calc({spacing.gap.2xl} * var(--density, 1))",
        paddingBlockStart: "calc({spacing.gap.2xl} * var(--density, 1))",
      },
    });
  });

  it("folds the annotated header back over the body on a narrow block", () => {
    const aside = recipe.compoundVariants?.find((each) =>
      (each.className ?? "").endsWith("root--aside"),
    );

    expect(aside?.css?.["root"]?.["&[data-narrow]"]).toMatchObject({
      gridTemplateAreas: '"header" "body" "footer"',
    });
  });

  it("matches every Section tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Section(\.\w+)?$/u]);
  });
});
