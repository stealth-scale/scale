import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#marquee/marquee.specimen.tsx";
import { CLASS, recipe, SPACING } from "#marquee/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, { names: ["Marquee.Root"], parts: [...recipe.slots] }),
    ).toStrictEqual([]);
  });

  it("sets className to marquee", () => {
    expect(recipe.className).toBe(CLASS);
  });

  it("declares six slots", () => {
    expect(recipe.slots).toStrictEqual([
      "root",
      "viewport",
      "content",
      "item",
      "edge",
      "pauseTrigger",
    ]);
  });

  it("declares the gap axis alone", () => {
    expect(axesOf(recipe)).toStrictEqual(["gap"]);
  });

  it("offers the gap scale from xs to xl", () => {
    expect(valuesOf(recipe, "gap")).toStrictEqual(["lg", "md", "sm", "xl", "xs"]);
  });

  it("writes each gap as the spacing the machine reads", () => {
    expect(recipe.variants?.gap?.["lg"]).toStrictEqual({
      root: { [SPACING]: "{spacing.gap.lg}" },
    });
  });

  it("moves a copy across with marquee-x and down with marquee-y", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      "&[data-orientation=vertical]": { animationStyle: "marquee-y" },
      animationStyle: "marquee-x",
    });
  });

  it("times each copy from the machine's variables in both orientations", () => {
    const timed = {
      animationDelay: "var(--marquee-delay)",
      animationDuration: "var(--marquee-duration)",
      animationIterationCount: "var(--marquee-loop-count)",
    };

    expect(recipe.base?.["content"]).toMatchObject({
      _motionSafe: timed,
      "&[data-orientation=vertical]": { _motionSafe: timed },
    });
  });

  it("pauses the motion of every copy while the root is paused", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      [`.${CLASS}__root[data-paused] > .${CLASS}__viewport > &`]: {
        animationPlayState: "paused",
      },
    });
  });

  it("fades a fifth of the strip at each side an edge names", () => {
    expect(recipe.base?.["viewport"]).toMatchObject({
      [`.${CLASS}__root:has(> .${CLASS}__edge[data-side=end]) > &`]: {
        "--marquee-fade-end": "calc({sizes.full} / 5)",
      },
      [`.${CLASS}__root:has(> .${CLASS}__edge[data-side=top]) > &`]: {
        "--marquee-fade-top": "calc({sizes.full} / 5)",
      },
    });
  });

  it("masks the strip in the reading direction under rtl", () => {
    expect(recipe.base?.["viewport"]).toMatchObject({
      "&[data-orientation=horizontal]": {
        _rtl: {
          maskImage:
            "linear-gradient(to left, transparent, #000 var(--marquee-fade-start, 0px), #000 calc(100% - var(--marquee-fade-end, 0px)), transparent)",
        },
      },
    });
  });

  it("places the pause control at the end of a strip that moves across", () => {
    expect(recipe.base?.["pauseTrigger"]).toMatchObject({
      [`.${CLASS}__root[data-orientation=horizontal] > &`]: {
        insetInlineEnd: "{spacing.gap.xs}",
        top: "50%",
      },
      position: "absolute",
    });
  });

  it("hides the pause control under reduced motion", () => {
    expect(recipe.base?.["pauseTrigger"]).toMatchObject({ _motionReduce: { display: "none" } });
  });

  it("makes a root with a pause control at least as tall as the control", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      [`&:has(> .${CLASS}__pauseTrigger)`]: { minBlockSize: "{sizes.control.xs}" },
    });
  });
});
