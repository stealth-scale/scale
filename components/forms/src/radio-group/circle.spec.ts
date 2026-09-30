import { describe, expect, it } from "vitest";

import { circle, circleSizes, filled, SIZES } from "#radio-group/circle.ts";

describe("circle", () => {
  it("rounds the circle fully", () => {
    expect(circle()).toMatchObject({ borderRadius: "full" });
  });

  it("leaves out the field's coarse-pointer height", () => {
    expect(circle()).not.toHaveProperty("_touch");
  });

  it("renders the dot of a checked circle in the current color", () => {
    expect(circle()).toMatchObject({ _checked: { _after: { background: "currentColor" } } });
  });

  it("renders the dot in CanvasText under forced colors", () => {
    expect(circle()["_highContrast"]).toStrictEqual({
      _checked: { _after: { background: "CanvasText", forcedColorAdjust: "none" } },
    });
  });

  it("fills a checked circle with the layer style it is given", () => {
    expect(filled("fill.solid")).toStrictEqual({
      _checked: { _after: { scale: "0.4" }, layerStyle: "fill.solid" },
    });
  });

  it("scales the dot by the factor it is given", () => {
    expect(filled("outline.solid", "0.6")).toMatchObject({
      _checked: { _after: { scale: "0.6" } },
    });
  });

  it("sizes the circle on the icon scale at each size it offers", () => {
    expect(Object.keys(circleSizes())).toStrictEqual([...SIZES]);
  });
});
