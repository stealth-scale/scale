import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#card/recipe.ts";

const PARTS = [
  "root",
  "media",
  "header",
  "indicator",
  "title",
  "description",
  "aside",
  "content",
  "footer",
];

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Card.Root", "Card.Header", "Card.Title", "Card.Media"],
        parts: PARTS,
      }),
    ).toStrictEqual([]);
  });

  it("names its class card", () => {
    expect(recipe.className).toBe("card");
  });

  it("styles the nine parts a card draws", () => {
    expect(recipe.slots).toStrictEqual(PARTS);
  });

  it("offers the nine axes a card takes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "divided",
      "interactive",
      "justify",
      "motion",
      "orientation",
      "radius",
      "size",
      "status",
      "variant",
    ]);
  });

  it("draws an elevated card running down the page when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      justify: "end",
      orientation: "vertical",
      radius: "l2",
      size: "md",
      variant: "elevated",
    });
  });

  it("offers the four looks a panel is drawn in", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["elevated", "glass", "outline", "subtle"]);
  });

  it("offers four sizes", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm", "xl"]);
  });

  it("states the root's own inset as a property the media reads back", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["root"]).toMatchObject({
      "--card-inset": "{spacing.inset.md}",
      padding: "inset.md",
    });
    expect(recipe.variants?.["orientation"]?.["vertical"]?.["media"]).toStrictEqual({
      marginBlockStart: "calc(-1 * var(--card-inset))",
      marginInline: "calc(-1 * var(--card-inset))",
    });
  });

  it("bleeds the media to the leading side where the card runs across the page", () => {
    expect(recipe.variants?.["orientation"]?.["horizontal"]?.["media"]).toStrictEqual({
      marginBlock: "calc(-1 * var(--card-inset))",
      marginInlineStart: "calc(-1 * var(--card-inset))",
    });
  });

  it("lays the header out as three columns so a mark spans the title block", () => {
    expect(recipe.base?.["header"]).toMatchObject({
      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
    });
    expect(recipe.base?.["indicator"]).toMatchObject({ gridColumn: "1" });
    expect(recipe.base?.["aside"]).toMatchObject({ gridColumn: "3" });
  });

  it("draws the focus ring from inside an interactive card", () => {
    expect(recipe.variants?.["interactive"]?.["true"]?.["root"]).toMatchObject({
      _focusWithin: { focusVisibleRing: "outside" },
    });
  });

  it("stretches the title's link over the whole interactive card", () => {
    expect(recipe.variants?.["interactive"]?.["true"]?.["title"]).toStrictEqual({
      "& > a::after": { content: '""', inset: "0", position: "absolute" },
    });
    expect(recipe.base?.["root"]).toMatchObject({ position: "relative" });
  });

  it("separates the bands with a rule and the root's own inset", () => {
    expect(recipe.variants?.["divided"]?.["true"]?.["header"]).toMatchObject({
      borderBlockEndWidth: "sm",
      paddingBlockEnd: "var(--card-inset)",
    });
  });

  it("names both compounds under the one slot each styles", () => {
    expect(recipe.compoundVariants?.map((each) => each.className)).toStrictEqual([
      "card__root--toned",
      "card__root--lifted",
    ]);
  });

  it("tracks the card and every part under its namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^Card(\.\w+)?$/u]);
  });
});
