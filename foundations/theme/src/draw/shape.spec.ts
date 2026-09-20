import { describe, expect, it } from "vitest";

import { ASPECT_RATIOS, CORNERS, radii, shape, strokes } from "#draw/shape.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("shape", () => {
  it("draws three corners", () => {
    expect(Object.keys(radii("1rem"))).toStrictEqual(["l1", "l2", "l3"]);
  });

  it("gives the outermost corner the radius it was asked for", () => {
    expect(tokenAt(radii("1rem"), "l3")).toBe("1rem");
  });

  it("keeps a nested corner concentric by taking a share of the outermost", () => {
    expect(tokenAt(radii("1rem"), "l1")).toBe("calc(1rem * 0.5)");
    expect(tokenAt(radii("1rem"), "l2")).toBe("calc(1rem * 0.75)");
  });

  it("draws the corners from whatever unit the theme stated", () => {
    expect(tokenAt(radii("2px"), "l1")).toBe("calc(2px * 0.5)");
  });

  it("lists the corners from the tightest to the fully round and the shapes from the squarest", () => {
    expect(CORNERS).toStrictEqual(["l1", "l2", "l3", "full"]);
    expect(ASPECT_RATIOS[0]).toBe("square");
    expect(ASPECT_RATIOS.at(-1)).toBe("ultrawide");
  });

  it("draws a corner the theme takes off the ladder outright and keeps the others concentric", () => {
    expect(tokenAt(radii("1rem", { l1: "0" }), "l1")).toBe("0");
    expect(tokenAt(radii("1rem", { l1: "0" }), "l2")).toBe("calc(1rem * 0.75)");
    expect(tokenAt(radii("1rem", { l3: "2rem" }), "l3")).toBe("2rem");
  });

  it("draws the four widths as references into the scale when nothing is stated", () => {
    expect(strokes()).toStrictEqual({
      control: { value: "{borderWidths.sm}" },
      hairline: { value: "{borderWidths.sm}" },
      indicator: { value: "{borderWidths.md}" },
      ring: { value: "{borderWidths.md}" },
    });
  });

  it("draws the ring at the width and the offset the theme states", () => {
    expect(tokenAt(strokes({ ring: { width: "3px" } }), "ring")).toBe("3px");
    expect(tokenAt(shape({ ring: { offset: "4px" } }).spacing, "ring")).toBe("4px");
    expect(tokenAt(shape().spacing, "ring")).toBe("{spacing.0.5}");
  });

  it("draws a width outright where a theme states one and leaves the others", () => {
    expect(tokenAt(strokes({ control: "2px" }), "control")).toBe("2px");
    expect(tokenAt(strokes({ control: "2px" }), "hairline")).toBe("{borderWidths.sm}");
    expect(tokenAt(strokes({ hairline: "0.5px", indicator: "3px" }), "indicator")).toBe("3px");
  });

  it("draws the corners and the widths and the ring's room from one statement", () => {
    expect(shape({ corner: "1rem", indicator: "3px" })).toStrictEqual({
      borderWidths: strokes({ indicator: "3px" }),
      radii: radii("1rem"),
      spacing: { ring: { value: "{spacing.0.5}" } },
    });
  });

  it("draws the foundation's shape when nothing is stated", () => {
    expect(shape()).toStrictEqual({
      borderWidths: strokes(),
      radii: radii("0.625rem"),
      spacing: { ring: { value: "{spacing.0.5}" } },
    });
  });
});
