import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#sample/recipe.ts";

describe("recipe", () => {
  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Sample"] })).toStrictEqual([]);
  });

  it("uses the class name sample", () => {
    expect(recipe.className).toBe("sample");
  });

  it("renders the caption slot before the body slot", () => {
    expect(recipe.slots).toStrictEqual(["root", "caption", "body"]);
  });

  it("declares three variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["place", "span", "variant"]);
  });

  it("defaults to the plain look at the start of the cell", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ place: "start", variant: "plain" });
  });

  it("offers four places", () => {
    expect(valuesOf(recipe, "place")).toStrictEqual(["center", "end", "start", "stretch"]);
  });

  it("sets the body to the full cell width at every place", () => {
    expect(recipe.variants?.place).toMatchObject({
      center: { body: { inlineSize: "full" } },
      end: { body: { inlineSize: "full" } },
      start: { body: { inlineSize: "full" } },
      stretch: { body: { inlineSize: "full" } },
    });
  });

  it("sets no fill edge or padding in the plain look", () => {
    expect(recipe.variants?.variant?.plain).toStrictEqual({
      body: { background: "transparent", borderWidth: "0", padding: "0" },
    });
  });

  it("fills the body with bg.inverted in the inverted look", () => {
    expect(recipe.variants?.variant?.inverted).toMatchObject({
      body: { background: "bg.inverted" },
    });
  });

  it("sets the inherited ink to fg.inverted in the inverted look", () => {
    expect(recipe.variants?.variant?.inverted).toMatchObject({ body: { color: "fg.inverted" } });
  });

  it.each(["outline", "plain", "subtle", "surface"] as const)(
    "sets no text colour in the %s look",
    (look) => {
      expect(JSON.stringify(recipe.variants?.variant?.[look])).not.toContain("color");
    },
  );

  it("offers five looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual([
      "inverted",
      "outline",
      "plain",
      "subtle",
      "surface",
    ]);
  });

  it("spans every board column at span full", () => {
    expect(recipe.variants?.span?.full).toStrictEqual({ root: { gridColumn: "1 / -1" } });
  });

  it("matches the Sample JSX tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Sample$/u]);
  });
});
