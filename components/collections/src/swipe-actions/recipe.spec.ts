import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, recipeViolations } from "@stealthscale/testing-theme";

import { recipe, REVEAL } from "#swipe-actions/recipe.ts";
import page from "#swipe-actions/swipe-actions.specimen.tsx";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, {
        names: [
          "SwipeActions.Root",
          "SwipeActions.Content",
          "SwipeActions.Actions",
          "SwipeActions.Action",
        ],
      }),
    ).toStrictEqual([]);
  });

  it("sets className to swipe-actions", () => {
    expect(recipe.className).toBe("swipe-actions");
  });

  it("declares four slots", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual(["action", "actions", "content", "root"]);
  });

  it("declares no axis", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("names the revealed width --swipe-reveal", () => {
    expect(REVEAL).toBe("--swipe-reveal");
  });

  it("moves the content towards the inline start by the revealed width", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      _rtl: { translate: "var(--swipe-reveal) 0" },
      translate: "calc(var(--swipe-reveal) * -1) 0",
    });
  });

  it("clips the actions to the revealed width at the inline end", () => {
    expect(recipe.base?.["actions"]).toMatchObject({
      _rtl: { clipPath: "inset(0 calc(100% - var(--swipe-reveal)) 0 0)" },
      clipPath: "inset(0 0 0 calc(100% - var(--swipe-reveal)))",
      insetInlineEnd: "0",
    });
  });

  it.each(["actions", "content"] as const)(
    "stops the %s moving while the row is dragged",
    (slot) => {
      expect(recipe.base?.[slot]).toMatchObject({
        "[data-dragging] > &": { transitionDuration: "0s" },
      });
    },
  );

  it.each(["actions", "content"] as const)("moves the %s only under motionSafe", (slot) => {
    expect(recipe.base?.[slot]).toMatchObject({ _motionSafe: { transitionDuration: "move" } });
  });

  it("lets a vertical swipe on the content scroll the page", () => {
    expect(recipe.base?.["content"]).toMatchObject({ touchAction: "pan-y" });
  });

  it("squares an action's corners over the button's", () => {
    expect(recipe.base?.["actions"]).toMatchObject({
      "& > .swipe-actions__action": { borderRadius: "none" },
    });
  });

  it("draws an action's focus ring inside it in the contrast ink", () => {
    expect(recipe.base?.["actions"]).toMatchObject({
      "& > .swipe-actions__action": {
        focusRingColor: "colorPalette.contrast",
        focusVisibleRing: "inside",
      },
    });
  });

  it("makes an action at least as tall as the row", () => {
    expect(recipe.base?.["action"]).toMatchObject({ minBlockSize: "full" });
  });

  it("clips the row", () => {
    expect(recipe.base?.["root"]).toMatchObject({ overflow: "clip", position: "relative" });
  });

  it("matches every SwipeActions tag", () => {
    expect(recipe.jsx).toStrictEqual([/^SwipeActions\.\w+$/u]);
  });
});
