import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#clipboard/clipboard.specimen.tsx";
import { recipe } from "#clipboard/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe no longer offers", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Clipboard"] })).toStrictEqual([]);
  });

  it("sets className to clipboard", () => {
    expect(recipe.className).toBe("clipboard");
  });

  it("declares seven slots", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "control",
      "indicator",
      "input",
      "label",
      "root",
      "trigger",
      "valueText",
    ]);
  });

  it("declares size as its only variant axis", () => {
    expect(axesOf(recipe)).toStrictEqual(["size"]);
  });

  it("defaults size to md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("declares three size values from sm to lg", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("gives the root a smaller gap than the control at the md size", () => {
    expect(recipe.variants?.["size"]?.["md"]).toStrictEqual({
      control: { gap: "calc({spacing.gap.md} * var(--density, 1))" },
      label: { textStyle: "label.md" },
      root: { gap: "calc({spacing.gap.sm} * var(--density, 1))" },
    });
  });

  it("lays out the root as a column aligned at the start", () => {
    expect(recipe.base?.["root"]).toStrictEqual({
      alignItems: "start",
      display: "flex",
      flexDirection: "column",
    });
  });

  it("sets alignSelf to stretch on the control slot", () => {
    expect(recipe.base?.["control"]).toMatchObject({ alignSelf: "stretch" });
  });

  it("declares no base styles for the trigger slot", () => {
    expect(recipe.base?.["trigger"]).toBeUndefined();
  });

  it("matches the Clipboard tag and its dotted parts", () => {
    expect(recipe.jsx).toStrictEqual([/^Clipboard(\.\w+)?$/u]);
  });
});
