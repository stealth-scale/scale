import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe, ROOM } from "#section/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
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

  it("names its class section", () => {
    expect(recipe.className).toBe("section");
  });

  it("styles the nine parts a section draws", () => {
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

  it("folds a control in the header by the priority the control states", () => {
    expect(recipe.base?.["action"]?.["&[data-priority=tertiary]"]).toStrictEqual({
      "[data-narrow] &": { display: "none" },
    });
  });

  it("offers the three axes a section takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["annotated", "size", "variant"]);
  });

  it("draws a plain section at the middle size when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "plain" });
  });

  it("offers the two ways a section is set against the page", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["plain", "surface"]);
  });

  it("places the header as a grid so its parts are written flat", () => {
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

  it("stops the description at the reading measure the theme states", () => {
    expect(recipe.base?.["description"]).toMatchObject({ maxInlineSize: "prose" });
  });

  it("states the room a card keeps as one property every band reads", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["root"]).toMatchObject({
      [ROOM]: "{spacing.inset.md}",
    });
  });

  it("clips a card so a bleeding body keeps its corners", () => {
    expect(recipe.variants?.["variant"]?.["surface"]?.["root"]).toStrictEqual({ overflow: "clip" });
  });

  it("parts one plain section from the one before it and from nothing else", () => {
    expect(recipe.variants?.["variant"]?.["plain"]?.["root"]).toStrictEqual({
      "& + &": {
        borderBlockStartWidth: "sm",
        borderColor: "border",
        marginBlockStart: "gap.2xl",
        paddingBlockStart: "gap.2xl",
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

  it("tracks every tag under the Section namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^Section(\.\w+)?$/u]);
  });
});
