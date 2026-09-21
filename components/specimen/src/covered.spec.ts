import { describe, expect, it } from "vitest";

import { uncovered } from "#covered.ts";

/**
 * A recipe offering three axes, which is all the check reads of one.
 */
const RECIPE = { variants: { motion: {}, size: {}, variant: {} } };

describe("uncovered", () => {
  it("accepts a page whose scenes draw every axis", () => {
    const scenes = [{ axes: ["size", "variant"] }, { axes: ["motion"] }];

    expect(uncovered(RECIPE, scenes)).toStrictEqual([]);
  });

  it("reports an axis no scene draws", () => {
    expect(uncovered(RECIPE, [{ axes: ["size", "variant"] }])).toStrictEqual([
      "motion is drawn by no scene and skipped for no reason",
    ]);
  });

  it("accepts an axis the page states a reason for leaving undrawn", () => {
    const scenes = [{ axes: ["size", "variant"] }];
    const skip = { motion: "shown on the page the animation styles are drawn on" };

    expect(uncovered(RECIPE, scenes, { skip })).toStrictEqual([]);
  });

  it("reports a reason naming an axis the recipe does not offer", () => {
    const scenes = [{ axes: ["motion", "size", "variant"] }];

    expect(uncovered(RECIPE, scenes, { skip: { ruled: "removed" } })).toStrictEqual([
      "ruled is skipped, and the recipe offers no such axis",
    ]);
  });

  it("counts an axis as drawn however many of its values one scene turns", () => {
    const scenes = [{ axes: ["motion", "size", "variant"] }];

    expect(uncovered(RECIPE, scenes)).toStrictEqual([]);
  });

  it("reads a scene that states no axes as drawing none", () => {
    expect(uncovered({ variants: { size: {} } }, [{}])).toStrictEqual([
      "size is drawn by no scene and skipped for no reason",
    ]);
  });

  it("accepts a recipe that offers no axes at all", () => {
    expect(uncovered({}, [])).toStrictEqual([]);
  });

  it("reports every axis nobody draws rather than the first", () => {
    expect(uncovered(RECIPE, [])).toHaveLength(3);
  });
});
