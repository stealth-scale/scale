import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { GAP, recipe } from "#toolbar/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Toolbar"],
        parts: ["root", "start", "center", "end", "action", "folded", "separator", "search"],
      }),
    ).toStrictEqual([]);
  });

  it("names its class toolbar", () => {
    expect(recipe.className).toBe("toolbar");
  });

  it("styles the eight parts a toolbar draws", () => {
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

  it("folds a control by the priority the control states", () => {
    expect(recipe.base?.["action"]?.["&[data-priority=tertiary]"]).toStrictEqual({
      "[data-narrow] &": { display: "none" },
    });
  });

  it("offers the three axes a toolbar takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["radius", "size", "variant"]);
  });

  it("draws a plain row at the middle size when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ radius: "l2", size: "md", variant: "plain" });
  });

  it("offers the three ways a row is set against what holds it", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["outline", "plain", "surface"]);
  });

  it("insets a row with an edge by its own gap and leaves a plain row flush", () => {
    expect(recipe.variants?.["variant"]?.["outline"]?.["root"]).toMatchObject({
      padding: `var(${GAP})`,
    });
    expect(recipe.variants?.["variant"]?.["surface"]?.["root"]).toMatchObject({
      padding: `var(${GAP})`,
    });
    expect(recipe.variants?.["variant"]?.["plain"]?.["root"]).not.toHaveProperty("padding");
  });

  it("states the gap two steps below the size as one property every band reads", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["root"]).toStrictEqual({
      [GAP]: "{spacing.gap.xs}",
    });
    expect(recipe.variants?.["size"]?.["lg"]?.["root"]).toStrictEqual({
      [GAP]: "{spacing.gap.sm}",
    });
    expect(recipe.base?.["start"]).toMatchObject({ gap: `var(${GAP})` });
  });

  it("cuts a long centre short rather than wrapping the row", () => {
    expect(recipe.base?.["center"]).toMatchObject({
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    });
  });

  it("pushes the end band to the end whatever the centre holds", () => {
    expect(recipe.base?.["end"]).toMatchObject({ marginInlineStart: "auto" });
  });

  it("lays an opened search over the row rather than beside it", () => {
    expect(recipe.base?.["search"]?.["&[data-opened]"]).toMatchObject({
      inset: "0",
      position: "absolute",
    });
  });

  it("stretches the rule to the row's height", () => {
    expect(recipe.base?.["separator"]).toMatchObject({ alignSelf: "stretch" });
  });

  it("names neither a group of controls nor a rule as parts of its own", () => {
    expect(recipe.slots).not.toContain("group");
  });

  it("tracks every tag under the Toolbar namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^Toolbar(\.\w+)?$/u]);
  });
});
