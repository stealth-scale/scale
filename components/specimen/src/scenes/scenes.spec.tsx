import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { scenesOf } from "#scenes/scenes.ts";

/**
 * Recipe with a variant, a size and a boolean axis.
 */
const RECIPE = {
  variants: {
    loud: { true: {} },
    size: { lg: {}, md: {}, sm: {} },
    variant: { plain: {}, solid: {} },
  },
};

/**
 * Returns the props as JSON, so a case can read what the generator passed.
 */
function draw(props: Record<string, unknown>): string {
  return JSON.stringify(props);
}

describe("scenesOf", () => {
  it("returns one scene per recipe axis", () => {
    expect(scenesOf(RECIPE, { draw, namespace: "probe" }).map((one) => one.title)).toStrictEqual([
      "probe.loud.title",
      "probe.size.title",
      "probe.variant.title",
    ]);
  });

  it("sets axes to the axis each scene renders", () => {
    expect(scenesOf(RECIPE, { draw, namespace: "probe" }).map((one) => one.axes)).toStrictEqual([
      ["loud"],
      ["size"],
      ["variant"],
    ]);
  });

  it("skips an axis listed in skip", () => {
    const scenes = scenesOf(RECIPE, { draw, namespace: "probe", skip: { loud: "drawn nowhere" } });

    expect(scenes.map((one) => one.title)).toStrictEqual([
      "probe.size.title",
      "probe.variant.title",
    ]);
  });

  it("orders the scenes by order and appends the remaining axes", () => {
    const scenes = scenesOf(RECIPE, { draw, namespace: "probe", order: ["variant", "size"] });

    expect(scenes.map((one) => one.axes?.[0])).toStrictEqual(["variant", "size", "loud"]);
  });

  it("returns no separate scene for a crossed axis", () => {
    const scenes = scenesOf(RECIPE, {
      axes: { size: { across: "variant" } },
      draw,
      namespace: "probe",
    });

    expect(scenes.map((one) => one.title)).toStrictEqual(["probe.loud.title", "probe.size.title"]);
  });

  it("returns a separate scene for a crossed axis with its own settings", () => {
    const scenes = scenesOf(RECIPE, {
      axes: { size: { across: "variant" }, variant: { across: "size" } },
      draw,
      namespace: "probe",
    });

    expect(scenes.map((one) => one.title)).toContain("probe.variant.title");
  });

  it("lists the crossed axis after the turned axis in axes", () => {
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

  it("keys the introduction under the namespace and the axis", () => {
    const [first] = scenesOf(RECIPE, { draw, namespace: "card" });

    expect(first?.about).toBe("card.loud.about");
  });

  it("renders a boolean axis with false and true", async () => {
    const [scene] = scenesOf(RECIPE, { draw, namespace: "probe" });
    const Turned = scene?.draw ?? ((): null => null);
    const { container } = await drawn(<Turned />);

    expect(container.textContent).toContain('"loud":false');
    expect(container.textContent).toContain('"loud":true');
  });

  it("passes the axis value to the draw function", async () => {
    const [scene] = scenesOf(RECIPE, { draw, namespace: "probe", order: ["variant"] });
    const Turned = scene?.draw ?? ((): null => null);
    const { container } = await drawn(<Turned />);

    expect(container.textContent).toContain('"variant":"solid"');
  });

  it("passes the with props to every cell", async () => {
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

  it("uses the draw function of the axis over the draw function of the page", async () => {
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

  it("lays the cells out in one column when direction is column", async () => {
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

  it("passes a value of each axis to the draw function of a crossed scene", async () => {
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

  it("writes the source from the sample snippet", () => {
    const [scene] = scenesOf(RECIPE, {
      draw,
      namespace: "probe",
      order: ["variant"],
      sample: { children: "Publish", name: "Button" },
    });

    expect(scene?.source).toBe('<Button variant="plain">\n  Publish\n</Button>');
  });

  it("writes the source from the example module with the props of the first cell", () => {
    const [scene] = scenesOf(RECIPE, {
      draw,
      example: { source: "function A(props: P) {\n  return <B {...props} />;\n}" },
      namespace: "probe",
      order: ["variant"],
    });

    expect(scene?.source).toBe('function A() {\n  return <B variant="plain" />;\n}');
  });

  it("prefers the example of the axis over the sample of the page", () => {
    const [scene] = scenesOf(RECIPE, {
      axes: { variant: { example: { source: "<B {...props} />" } } },
      draw,
      namespace: "probe",
      order: ["variant"],
      sample: { children: "Publish", name: "Button" },
    });

    expect(scene?.source).toBe('<B variant="plain" />');
  });

  it("returns no scene for a recipe without axes", () => {
    expect(scenesOf({}, { draw, namespace: "probe" })).toStrictEqual([]);
  });

  it("sets viewport on every scene when the page sets it", () => {
    const scenes = scenesOf(RECIPE, { draw, namespace: "probe", viewport: true });

    expect(scenes.map((scene) => scene.viewport)).toStrictEqual([true, true, true]);
  });

  it("sets viewport only on the axis that sets it", () => {
    const scenes = scenesOf(RECIPE, {
      axes: { variant: { viewport: true } },
      draw,
      namespace: "probe",
      order: ["variant"],
    });

    expect(scenes.map((scene) => scene.viewport)).toStrictEqual([true, undefined, undefined]);
  });

  it("omits viewport when neither the page nor the axis sets it", () => {
    const [scene] = scenesOf(RECIPE, { draw, namespace: "probe" });

    expect(scene).not.toHaveProperty("viewport");
  });
});
