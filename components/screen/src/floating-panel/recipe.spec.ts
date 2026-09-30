import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, recipeViolations } from "@stealthscale/testing-theme";

import page from "#floating-panel/floating-panel.specimen.tsx";
import { CLASS, recipe } from "#floating-panel/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, { names: ["FloatingPanel.Root"], parts: [...recipe.slots] }),
    ).toStrictEqual([]);
  });

  it("sets className to floating-panel", () => {
    expect(recipe.className).toBe(CLASS);
  });

  it("declares thirteen slots", () => {
    expect(recipe.slots).toStrictEqual([
      "root",
      "trigger",
      "positioner",
      "content",
      "header",
      "dragTrigger",
      "title",
      "control",
      "stageTrigger",
      "closeTrigger",
      "scroller",
      "body",
      "resizeTrigger",
    ]);
  });

  it("declares no variant axis", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("stacks the positioner at the banner level plus the machine's stack index", () => {
    expect(recipe.base?.["positioner"]).toStrictEqual({
      zIndex: "calc({zIndex.banner} + var(--z-index, 0))",
    });
  });

  it("sets the panel on bg.panel with a transparent hairline edge", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      background: "bg.panel",
      borderColor: "transparent",
      borderStyle: "solid",
      borderWidth: "hairline",
    });
  });

  it("leaves the panel's children unclipped so a corner takes the pointer beyond the curve", () => {
    expect(recipe.base?.["content"]).not.toHaveProperty("overflow");
  });

  it("rings the panel outside its edge while it has keyboard focus", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      focusRingColor: "colorPalette.focusRing",
      focusVisibleRing: "outside",
    });
  });

  it("sets the drag cursor while the panel can move and the grabbing cursor while it moves", () => {
    expect(recipe.base?.["dragTrigger"]).toMatchObject({
      "&[data-disabled]": { cursor: "auto" },
      [`.${CLASS}__header[data-dragging] > &`]: { cursor: "dragging" },
      cursor: "drag",
    });
  });

  it("sizes the edges and the corners of the resize triggers sizes.2 across", () => {
    expect(recipe.base?.["resizeTrigger"]).toMatchObject({
      "&:is([data-axis=e], [data-axis=w])": { inlineSize: "{sizes.2}" },
      "&:is([data-axis=n], [data-axis=s])": { blockSize: "{sizes.2}" },
      "&:is([data-axis=ne], [data-axis=nw], [data-axis=se], [data-axis=sw])": {
        blockSize: "{sizes.2}",
        inlineSize: "{sizes.2}",
      },
    });
  });

  it("hides a disabled resize trigger", () => {
    expect(recipe.base?.["resizeTrigger"]).toMatchObject({
      "&[data-disabled]": { display: "none" },
    });
  });

  it("ends the body's scroll area clear of the end and bottom resize triggers", () => {
    expect(recipe.base?.["scroller"]).toMatchObject({
      marginBlockEnd: "{sizes.2}",
      marginInlineEnd: "{sizes.2}",
    });
  });

  it("hides the scroll area and a stage trigger the machine hides", () => {
    expect([
      recipe.base?.["scroller"]?.["&[hidden]"],
      recipe.base?.["stageTrigger"]?.["&[hidden]"],
    ]).toStrictEqual([{ display: "none" }, { display: "none" }]);
  });
});
