import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { GAP, recipe } from "#toolbar/recipe.ts";
import page from "#toolbar/toolbar.specimen.tsx";

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
        names: ["Toolbar"],
        parts: ["root", "start", "center", "end", "action", "folded", "separator", "search"],
      }),
    ).toStrictEqual([]);
  });

  it("sets className to toolbar", () => {
    expect(recipe.className).toBe("toolbar");
  });

  it("declares eight slots", () => {
    expect(recipe.slots).toStrictEqual([
      "root",
      "start",
      "center",
      "end",
      "action",
      "folded",
      "separator",
      "search",
    ]);
  });

  it("folds an action by its priority", () => {
    expect(recipe.base?.["action"]?.["&[data-priority=tertiary]"]).toStrictEqual({
      "[data-narrow] &": { display: "none" },
    });
  });

  it("declares three axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["radius", "size", "variant"]);
  });

  it("defaults to a plain row at md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ radius: "l2", size: "md", variant: "plain" });
  });

  it("declares three looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["outline", "plain", "surface"]);
  });

  it("pads an outlined or surface row by its gap alone", () => {
    expect(recipe.variants?.["variant"]?.["outline"]?.["root"]).toMatchObject({
      padding: `var(${GAP})`,
    });
    expect(recipe.variants?.["variant"]?.["surface"]?.["root"]).toMatchObject({
      padding: `var(${GAP})`,
    });
    expect(recipe.variants?.["variant"]?.["plain"]?.["root"]).not.toHaveProperty("padding");
  });

  it("sets the gap two sizes smaller as one property every band reads", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["root"]).toStrictEqual({
      [GAP]: "{spacing.gap.xs}",
    });
    expect(recipe.variants?.["size"]?.["lg"]?.["root"]).toStrictEqual({
      [GAP]: "{spacing.gap.sm}",
    });
    expect(recipe.base?.["start"]).toMatchObject({ gap: `var(${GAP})` });
  });

  it("truncates a long centre", () => {
    expect(recipe.base?.["center"]).toMatchObject({
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    });
  });

  it("pushes the end band to the row's end", () => {
    expect(recipe.base?.["end"]).toMatchObject({ marginInlineStart: "auto" });
  });

  it("lays an opened search over the row", () => {
    expect(recipe.base?.["search"]?.["&[data-opened]"]).toMatchObject({
      inset: "0",
      position: "absolute",
    });
  });

  it("stretches the rule to the row's height", () => {
    expect(recipe.base?.["separator"]).toMatchObject({ alignSelf: "stretch" });
  });

  it("declares no group slot", () => {
    expect(recipe.slots).not.toContain("group");
  });

  it("matches every Toolbar tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Toolbar(\.\w+)?$/u]);
  });
});
