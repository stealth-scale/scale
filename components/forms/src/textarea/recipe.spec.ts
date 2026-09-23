import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe, VALUE } from "#textarea/recipe.ts";
import page from "#textarea/textarea.specimen.tsx";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, { names: ["Textarea"], parts: ["root", "control"] }),
    ).toStrictEqual([]);
  });

  it("uses the class name textarea", () => {
    expect(recipe.className).toBe("textarea");
  });

  it("declares the root and control slots", () => {
    expect(recipe.slots).toStrictEqual(["root", "control"]);
  });

  it("declares five axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["grip", "grows", "size", "status", "variant"]);
  });

  it("defaults to an outline field at size md with a vertical grip", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ grip: "vertical", size: "md", variant: "outline" });
  });

  it("offers three grip values", () => {
    expect(valuesOf(recipe, "grip")).toStrictEqual(["both", "none", "vertical"]);
  });

  it("declares no axis named resize", () => {
    expect(axesOf(recipe)).not.toContain("resize");
  });

  it("renders the copy of the text in the root's grid cell", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      "&::after": { content: `attr(${VALUE}) " "`, visibility: "hidden" },
      display: "grid",
    });
  });

  it("preserves line breaks in the copy", () => {
    expect(recipe.base?.["root"]?.["&::after"]).toMatchObject({ whiteSpace: "pre-wrap" });
  });

  it("places the copy and the control in one cell without padding", () => {
    const copy = recipe.base?.["root"]?.["&::after"];

    expect(copy).toMatchObject({ gridArea: "1 / 1 / 2 / 2", padding: "0" });
    expect(recipe.base?.["control"]).toMatchObject({ gridArea: "1 / 1 / 2 / 2", padding: "0" });
  });

  it("reads the md inset one size smaller on every side", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["root"]).toMatchObject({
      paddingBlock: "calc({spacing.inset.sm} * var(--density, 1))",
      paddingInlineStart:
        "var(--control-inset-start, calc({spacing.inset.sm} * var(--density, 1)))",
    });
  });

  it("sets the smallest inline inset on a flushed field", () => {
    expect(recipe.variants?.["variant"]?.["flushed"]?.["root"]).toMatchObject({
      paddingInlineStart:
        "var(--control-inset-start, calc({spacing.inset.xs} * var(--density, 1)))",
    });
  });

  it("turns off resizing on a growing field", () => {
    expect(recipe.compoundVariants).toStrictEqual([
      {
        className: "textarea__control--measured",
        css: { control: { resize: "none" } },
        grip: ["both", "vertical"],
        grows: true,
      },
    ]);
  });

  it("tracks JSX named Textarea", () => {
    expect(recipe.jsx).toStrictEqual([/^Textarea$/u]);
  });
});
