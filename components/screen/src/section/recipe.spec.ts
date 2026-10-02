import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe, ROOM } from "#section/recipe.ts";
import page from "#section/section.specimen.tsx";

/**
 * Returns the compound entry whose class name ends with the slot and the name given.
 *
 * @param name - The slot and the compound's name, such as `root--aside`.
 * @returns The entry, or undefined when no entry matches.
 */
function compound(name: string): NonNullable<typeof recipe.compoundVariants>[number] | undefined {
  return recipe.compoundVariants?.find((each) => (each.className ?? "").endsWith(name));
}

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
        parts: ["root", "header", "title", "description", "actions", "action", "body", "footer"],
      }),
    ).toStrictEqual([]);
  });

  it("sets className to section", () => {
    expect(recipe.className).toBe("section");
  });

  it("declares eight slots", () => {
    expect(recipe.slots).toStrictEqual([
      "root",
      "header",
      "title",
      "description",
      "actions",
      "action",
      "body",
      "footer",
    ]);
  });

  it("folds a secondary action to its icon on a narrow section", () => {
    expect(recipe.base?.["action"]?.["&[data-priority=secondary]"]).toMatchObject({
      "&[data-narrow]": { aspectRatio: "square" },
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

  it("sets the room of a card to the inset of its size", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["root"]).toMatchObject({
      [ROOM]: "calc({spacing.inset.md} * var(--density, 1))",
    });
  });

  it("separates the bands by the gap two sizes larger", () => {
    expect(recipe.base?.["root"]).toMatchObject({ gap: "var(--section-bands)" });
    expect(recipe.variants?.["size"]?.["md"]?.["root"]).toMatchObject({
      "--section-bands": "calc({spacing.gap.xl} * var(--density, 1))",
    });
    expect(recipe.variants?.["size"]?.["sm"]?.["root"]).toMatchObject({
      "--section-bands": "calc({spacing.gap.lg} * var(--density, 1))",
    });
  });

  it("separates a section from the one before by the gap three sizes larger", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["root"]).toMatchObject({
      "--section-apart": "calc({spacing.gap.2xl} * var(--density, 1))",
    });
    expect(recipe.variants?.["variant"]?.["surface"]?.["root"]).toMatchObject({
      ".section__root + &": { marginBlockStart: "var(--section-apart)" },
    });
  });

  it("keeps the band gap under the header of a card", () => {
    expect(compound("header--raised")?.css?.["header"]).toMatchObject({
      paddingBlockEnd: "var(--section-bands)",
    });
  });

  it("rules the footer of a card at its top edge only", () => {
    const footer = compound("footer--raised")?.css?.["footer"];

    expect(footer).toMatchObject({ borderBlockStartWidth: "hairline" });
    expect(footer).not.toHaveProperty("borderBlockEndWidth");
  });

  it("rules the top edge of a bleeding body that follows the header", () => {
    expect(compound("body--raised")?.css?.["body"]?.["&[data-bleed]"]).toMatchObject({
      borderBlockStartWidth: "hairline",
      padding: "0",
    });
  });

  it("overlaps the footer by one hairline under a bleeding body", () => {
    expect(compound("body--raised")?.css?.["body"]?.["&[data-bleed]"]).toMatchObject({
      "&:has(+ .section__footer)": { marginBlockEnd: "calc({borderWidths.hairline} * -1)" },
    });
  });

  it("raises the body of an annotated card", () => {
    expect(compound("body--beside")?.css?.["body"]).toMatchObject({ background: "bg.panel" });
  });

  it("leaves the root of an annotated card on the page", () => {
    expect(compound("root--beside")?.css?.["root"]).toMatchObject({
      background: "none",
      borderWidth: "0",
      boxShadow: "none",
    });
  });

  it("sets the title and the description one size smaller", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["title"]).toStrictEqual({
      textStyle: "heading.sm",
    });
    expect(recipe.variants?.["size"]?.["md"]?.["description"]).toStrictEqual({
      marginBlockStart: "{spacing.0.5}",
      textStyle: "body.sm",
    });
  });

  it("sets the description in fg.subtle a little further under a large title", () => {
    expect(recipe.base?.["description"]).toMatchObject({ color: "fg.subtle" });
    expect(recipe.variants?.["size"]?.["lg"]?.["description"]).toMatchObject({
      marginBlockStart: "{spacing.1}",
    });
  });

  it("parts the actions from the title by the md inset and by the sm inset when narrow", () => {
    expect(recipe.base?.["actions"]).toMatchObject({
      ".section__root[data-narrow] > .section__header > &": {
        paddingInlineStart: "calc({spacing.inset.sm} * var(--density, 1))",
      },
      paddingInlineStart: "calc({spacing.inset.md} * var(--density, 1))",
    });
  });

  it("clips a card so a bleeding body keeps its corners", () => {
    expect(recipe.variants?.["variant"]?.["surface"]?.["root"]).toMatchObject({ overflow: "clip" });
  });

  it("stops one gap under the sticky bars and bands when scrolled to", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      scrollMarginBlockStart:
        "calc(var(--app-shell-sticky-top, 0px) + var(--page-sticky-top, 0px) + {spacing.gap.lg})",
    });
  });

  it("rules only a plain section that follows another plain section", () => {
    expect(recipe.variants?.["variant"]?.["plain"]?.["root"]).toStrictEqual({
      ".section__root + &": { marginBlockStart: "var(--section-apart)" },
      "& + &": {
        borderBlockStartWidth: "hairline",
        borderColor: "border",
        paddingBlockStart: "var(--section-apart)",
      },
    });
  });

  it("folds the annotated header back over the body on a narrow block", () => {
    expect(compound("root--aside")?.css?.["root"]?.["&[data-narrow]"]).toMatchObject({
      gridTemplateAreas: '"header" "body" "footer"',
    });
  });

  it("gives the free height of a tall annotated header to the footer row", () => {
    expect(compound("root--aside")?.css?.["root"]).toMatchObject({
      gridTemplateRows: "auto 1fr",
    });
  });

  it("matches every Section tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Section(\.\w+)?$/u]);
  });
});
