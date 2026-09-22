import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations } from "@stealthscale/testing-theme";

import page from "#command/command.specimen.tsx";
import { recipe } from "#command/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("reports no violation across the shared recipe checks", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Command"],
        parts: ["root", "control", "indicator", "input", "list", "empty", "shortcut"],
      }),
    ).toStrictEqual([]);
  });

  it("sets className to command", () => {
    expect(recipe.className).toBe("command");
  });

  it("declares its seven slots in the order the palette renders them", () => {
    expect(recipe.slots).toStrictEqual([
      "root",
      "control",
      "indicator",
      "input",
      "list",
      "empty",
      "shortcut",
    ]);
  });

  it("declares size as its only variant", () => {
    expect(axesOf(recipe)).toStrictEqual(["size"]);
  });

  it("defaults size to md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("clears the border and the outline on the input slot", () => {
    expect(recipe.base?.["input"]).toMatchObject({ borderStyle: "none", outline: "none" });
  });

  it("sets overflowY to auto on the list slot", () => {
    expect(recipe.base?.["list"]).toMatchObject({ overflowY: "auto" });
  });

  it("leaves overflowY unset on the root slot", () => {
    expect(recipe.base?.["root"]).not.toHaveProperty("overflowY");
  });

  it("matches Command and its dotted parts with its jsx pattern", () => {
    expect(recipe.jsx).toStrictEqual([/^Command(\.\w+)?$/u]);
  });
});
