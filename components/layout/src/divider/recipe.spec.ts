import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";
import { divider } from "@stealthscale/theme/authoring";

import page from "#divider/divider.specimen.tsx";
import { LABELLED, recipe } from "#divider/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Divider"] })).toStrictEqual([]);
  });

  it("sets className to divider", () => {
    expect(recipe.className).toBe("divider");
  });

  it("declares the labelPlacement and orientation axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["labelPlacement", "orientation"]);
  });

  it("declares two orientations on the orientation axis", () => {
    expect(valuesOf(recipe, "orientation")).toStrictEqual(["horizontal", "vertical"]);
  });

  it("declares three places in reading order on the labelPlacement axis", () => {
    expect(Object.keys(recipe.variants?.["labelPlacement"] ?? {})).toStrictEqual([
      "start",
      "center",
      "end",
    ]);
  });

  it("defaults to a horizontal divider with a centred label", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      labelPlacement: "center",
      orientation: "horizontal",
    });
  });

  it("reads the hairline border width at each orientation", () => {
    expect(recipe.variants?.["orientation"]).toMatchObject({
      horizontal: { borderBlockEndWidth: "hairline", borderColor: "border" },
      vertical: { borderColor: "border", borderInlineEndWidth: "hairline" },
    });
  });

  it("selects a labelled divider by data-labelled", () => {
    expect(LABELLED).toBe("&[data-labelled]");
  });

  it("lays a labelled horizontal divider out as a row of two hairlines around the label", () => {
    const line = {
      borderBlockEndWidth: "hairline",
      borderColor: "border",
      content: '""',
      flex: "1",
    };

    expect(recipe.variants?.["orientation"]?.["horizontal"]?.[LABELLED]).toMatchObject({
      _after: line,
      _before: line,
      alignItems: "center",
      borderBlockEndWidth: "0",
      display: "flex",
    });
  });

  it("writes the label in the muted small body text", () => {
    expect(recipe.variants?.["orientation"]?.["horizontal"]?.[LABELLED]).toMatchObject({
      color: "fg.muted",
      textStyle: "body.sm",
    });
  });

  it("sets no label rule on a vertical divider", () => {
    expect(recipe.variants?.["orientation"]?.["vertical"]).toStrictEqual(divider("vertical"));
  });

  it.each([
    { placement: "start", want: { _before: { display: "none" }, textAlign: "start" } },
    { placement: "center", want: { textAlign: "center" } },
    { placement: "end", want: { _after: { display: "none" }, textAlign: "end" } },
  ] as const)("places a label at $placement between its lines", ({ placement, want }) => {
    expect(recipe.variants?.["labelPlacement"]?.[placement]).toStrictEqual({ [LABELLED]: want });
  });

  it("matches the Divider JSX tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Divider$/u]);
  });
});
