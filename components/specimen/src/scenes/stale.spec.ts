import { describe, expect, it } from "vitest";

import { stale } from "#scenes/stale.ts";

/**
 * A recipe offering two axes, which is all the check reads of one.
 */
const RECIPE = { variants: { size: { md: {}, sm: {} }, variant: { plain: {}, solid: {} } } };

describe("stale", () => {
  it("accepts a source whose every value its axis still offers", () => {
    const scenes = [{ source: '<Button size="sm" variant="solid" />', title: "looks" }];

    expect(stale(RECIPE, scenes)).toStrictEqual([]);
  });

  it("reports a value the axis no longer offers", () => {
    const scenes = [{ source: '<Button variant="ghost" />', title: "looks" }];

    expect(stale(RECIPE, scenes)).toStrictEqual([
      'looks writes variant="ghost", which the axis does not offer',
    ]);
  });

  it("leaves a prop that is no axis of the recipe alone", () => {
    const scenes = [{ source: '<Button aria-pressed="true" />', title: "pressed" }];

    expect(stale(RECIPE, scenes)).toStrictEqual([]);
  });

  it("reads every attribute of a source rather than the first", () => {
    const scenes = [{ source: '<Button size="lg" variant="ghost" />', title: "looks" }];

    expect(stale(RECIPE, scenes)).toHaveLength(2);
  });

  it("reads every scene a page draws", () => {
    const scenes = [
      { source: '<Button variant="ghost" />', title: "one" },
      { source: '<Button size="lg" />', title: "two" },
    ];

    expect(stale(RECIPE, scenes).map((one) => one.split(" ")[0])).toStrictEqual(["one", "two"]);
  });

  it("accepts a scene that states no source at all", () => {
    expect(stale(RECIPE, [{ title: "drawn" }])).toStrictEqual([]);
  });

  it("accepts a recipe offering no axes", () => {
    expect(stale({}, [{ source: '<Button variant="solid" />', title: "looks" }])).toStrictEqual([]);
  });
});
