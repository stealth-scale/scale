import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { scenesOf } from "#scenes/scenes.ts";

/**
 * A recipe offering a look, a size and a switch, which is all the generator reads of one.
 */
const RECIPE = {
  variants: {
    loud: { true: {} },
    size: { lg: {}, md: {}, sm: {} },
    variant: { plain: {}, solid: {} },
  },
};

/**
 * Draws the props it is handed, so a case reads what the generator passed.
 */
function draw(props: Record<string, unknown>): string {
  return JSON.stringify(props);
}

describe("scenesOf", () => {
  it("builds a scene for every axis the recipe offers", () => {
    expect(scenesOf(RECIPE, { draw, namespace: "probe" }).map((one) => one.title)).toStrictEqual([
      "probe.loud.title",
      "probe.size.title",
      "probe.variant.title",
    ]);
  });

  it("states the axis each scene draws, so a check reads it rather than the file", () => {
    expect(scenesOf(RECIPE, { draw, namespace: "probe" }).map((one) => one.axes)).toStrictEqual([
      ["loud"],
      ["size"],
      ["variant"],
    ]);
  });

  it("builds no scene for an axis the page states a reason to skip", () => {
    const scenes = scenesOf(RECIPE, { draw, namespace: "probe", skip: { loud: "drawn nowhere" } });

    expect(scenes.map((one) => one.title)).toStrictEqual([
      "probe.size.title",
      "probe.variant.title",
    ]);
  });

  it("draws the axes the page orders first, and the rest after them", () => {
    const scenes = scenesOf(RECIPE, { draw, namespace: "probe", order: ["variant", "size"] });

    expect(scenes.map((one) => one.axes?.[0])).toStrictEqual(["variant", "size", "loud"]);
  });

  it("builds no scene of its own for an axis another scene crosses", () => {
    const scenes = scenesOf(RECIPE, {
      axes: { size: { across: "variant" } },
      draw,
      namespace: "probe",
    });

    expect(scenes.map((one) => one.title)).toStrictEqual(["probe.loud.title", "probe.size.title"]);
  });

  it("keeps a crossed axis's own scene where the page states something for it", () => {
    const scenes = scenesOf(RECIPE, {
      axes: { size: { across: "variant" }, variant: { across: "size" } },
      draw,
      namespace: "probe",
    });

    expect(scenes.map((one) => one.title)).toContain("probe.variant.title");
  });

  it("states the crossed axis beside the one a scene turns", () => {
    const scenes = scenesOf(RECIPE, {
      axes: { size: { across: "variant" } },
      draw,
      namespace: "probe",
    });

    expect(scenes.find((one) => one.title.includes("size"))?.axes).toStrictEqual([
      "size",
      "variant",
    ]);
  });

  it("looks the words up under the page's namespace and the axis", () => {
    const [first] = scenesOf(RECIPE, { draw, namespace: "card" });

    expect(first?.about).toBe("card.loud.about");
  });

  it("turns a boolean axis through both answers rather than the one key it states", async () => {
    const [scene] = scenesOf(RECIPE, { draw, namespace: "probe" });
    const Turned = scene?.draw ?? ((): null => null);
    const { container } = await drawn(<Turned />);

    expect(container.textContent).toContain('"loud":false');
    expect(container.textContent).toContain('"loud":true');
  });

  it("hands the drawing the value of the axis it turns", async () => {
    const [scene] = scenesOf(RECIPE, { draw, namespace: "probe", order: ["variant"] });
    const Turned = scene?.draw ?? ((): null => null);
    const { container } = await drawn(<Turned />);

    expect(container.textContent).toContain('"variant":"solid"');
  });

  it("holds the props an axis states fixed while it turns", async () => {
    const [scene] = scenesOf(RECIPE, {
      axes: { variant: { with: { size: "lg" } } },
      draw,
      namespace: "probe",
      order: ["variant"],
    });
    const Turned = scene?.draw ?? ((): null => null);
    const { container } = await drawn(<Turned />);

    expect(container.textContent).toContain('"size":"lg"');
  });

  it("draws an axis through the drawing that axis states rather than the page's", async () => {
    const [scene] = scenesOf(RECIPE, {
      axes: { variant: { draw: (): string => "its own" } },
      draw,
      namespace: "probe",
      order: ["variant"],
    });
    const Turned = scene?.draw ?? ((): null => null);
    const { container } = await drawn(<Turned />);

    expect(container.textContent).toContain("its own");
  });

  it("runs the cells of an axis down the page where it states a column", async () => {
    const [scene] = scenesOf(RECIPE, {
      axes: { variant: { direction: "column" } },
      draw,
      namespace: "probe",
      order: ["variant"],
    });
    const Turned = scene?.draw ?? ((): null => null);
    const { container } = await drawn(<Turned />);

    expect(container.querySelector("[data-recipe=grid]")?.className).toContain("1");
  });

  it("hands the drawing a value of each axis where one crosses the other", async () => {
    const [scene] = scenesOf(RECIPE, {
      axes: { variant: { across: "size" } },
      draw,
      namespace: "probe",
      order: ["variant"],
    });
    const Turned = scene?.draw ?? ((): null => null);
    const { container } = await drawn(<Turned />);

    expect(container.textContent).toContain('"variant":"solid"');
    expect(container.textContent).toContain('"size":"sm"');
  });

  it("carries the source a reader copies where the page states a sample", () => {
    const [scene] = scenesOf(RECIPE, {
      draw,
      namespace: "probe",
      order: ["variant"],
      sample: { children: "Publish", name: "Button" },
    });

    expect(scene?.source).toBe('<Button variant="plain">\n  Publish\n</Button>');
  });

  it("builds nothing for a recipe that offers no axes", () => {
    expect(scenesOf({}, { draw, namespace: "probe" })).toStrictEqual([]);
  });
});
