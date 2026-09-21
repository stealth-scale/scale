import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#clipboard/recipe.ts";

describe("recipe", () => {
  it("styles Clipboard from tokens a theme can override", () => {
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

  it("lays the root out as a column aligned at the start", () => {
    expect(recipe.base?.["root"]).toStrictEqual({
      alignItems: "start",
      display: "flex",
      flexDirection: "column",
    });
  });

  it("sets alignSelf to stretch on the control slot", () => {
    expect(recipe.base?.["control"]).toMatchObject({ alignSelf: "stretch" });
  });

  it("leaves the trigger slot without base styles", () => {
    expect(recipe.base?.["trigger"]).toBeUndefined();
  });

  it("matches the Clipboard tag and its dotted parts", () => {
    expect(recipe.jsx).toStrictEqual([/^Clipboard(\.\w+)?$/u]);
  });
});
