import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#blockquote/blockquote.specimen.tsx";
import { recipe } from "#blockquote/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("writes no value a theme cannot move", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Blockquote.Root", "Blockquote.Content", "Blockquote.Caption", "Blockquote.Icon"],
        parts: ["root", "content", "caption", "icon"],
      }),
    ).toStrictEqual([]);
  });

  it("names its class blockquote", () => {
    expect(recipe.className).toBe("blockquote");
  });

  it("styles the root and the content and the caption and the icon", () => {
    expect(recipe.slots).toStrictEqual(["root", "content", "caption", "icon"]);
  });

  it("offers the five axes a quotation takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["justify", "motion", "size", "status", "variant"]);
  });

  it("draws a middle subtle quotation on its leading edge when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ justify: "start", size: "md", variant: "subtle" });
  });

  it("offers the glass look beside three looks of a rule", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["glass", "plain", "solid", "subtle"]);
  });

  it("offers the five body sizes", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm", "xl", "xs"]);
  });

  it("offers the four statuses", () => {
    expect(valuesOf(recipe, "status")).toStrictEqual(["error", "info", "success", "warning"]);
  });

  it("offers the two motions a quotation enters with", () => {
    expect(valuesOf(recipe, "motion")).toStrictEqual(["reveal", "rise"]);
  });

  it("sizes nothing on the icon slot because the icon's own recipe sizes it", () => {
    const styled = Object.values(recipe.variants?.size ?? {});

    expect.hasAssertions();

    for (const value of styled) {
      expect(value).not.toHaveProperty("icon");
    }
  });

  it("tracks the namespace and every tag whose name opens with Blockquote", () => {
    expect(recipe.jsx).toStrictEqual([/^Blockquote(\.\w+)?$/u]);
  });
});
