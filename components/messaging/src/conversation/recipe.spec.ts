import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, recipeViolations } from "@stealthscale/testing-theme";

import page from "#conversation/conversation.specimen.tsx";
import { recipe } from "#conversation/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, { names: ["Conversation.Root"], parts: [...recipe.slots] }),
    ).toStrictEqual([]);
  });

  it("sets className to conversation", () => {
    expect(recipe.className).toBe("conversation");
  });

  it("declares the six slots", () => {
    expect(recipe.slots).toStrictEqual([
      "root",
      "viewport",
      "content",
      "jumpTrigger",
      "typing",
      "dots",
    ]);
  });

  it("declares no axis", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("stacks the turns in a column", () => {
    expect(recipe.base?.["content"]).toMatchObject({ display: "flex", flexDirection: "column" });
  });

  it("contains the viewport's overscroll", () => {
    expect(recipe.base?.["viewport"]).toStrictEqual({ overscrollBehavior: "contain" });
  });

  it("places the jump trigger at the middle of the bottom edge", () => {
    expect(recipe.base?.["jumpTrigger"]).toMatchObject({
      left: "50%",
      position: "absolute",
      translate: "-50% 0",
    });
  });

  it("pulses the dots one after another", () => {
    expect(recipe.base?.["dots"]?.["& > span"]).toMatchObject({
      _motionSafe: {
        "&:nth-child(2)": { animationDelay: "{durations.moderate}" },
        "&:nth-child(3)": { animationDelay: "{durations.slower}" },
      },
      animationStyle: "pulse",
    });
  });

  it("fills the dots with CanvasText under forced colors", () => {
    expect(recipe.base?.["dots"]?.["& > span"]).toMatchObject({
      _highContrast: { background: "CanvasText", forcedColorAdjust: "none" },
    });
  });

  it("matches the Conversation parts", () => {
    expect(recipe.jsx).toStrictEqual([/^Conversation\.\w+$/u]);
  });
});
