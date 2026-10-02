import { describe, expect, it } from "vitest";

import { DEFICIENCIES, distance, distanceFor, simulated, written } from "#vision.ts";

const RED = "#ff0000";
const GREEN = "#00ff00";

describe("vision", () => {
  it("lists the three dichromacies in the order a report shows them", () => {
    expect(DEFICIENCIES).toStrictEqual(["protanopia", "deuteranopia", "tritanopia"]);
  });

  it.each(DEFICIENCIES)("keeps white white under %s", (deficiency) => {
    const seen = simulated("#ffffff", deficiency);

    expect(seen?.red).toBeCloseTo(1, 2);
    expect(seen?.green).toBeCloseTo(1, 2);
    expect(seen?.blue).toBeCloseTo(1, 2);
  });

  it("lowers the red channel and raises the green channel for a red under protanopia", () => {
    const seen = simulated(RED, "protanopia");

    expect(seen?.red).toBeCloseTo(0.152, 3);
    expect(seen?.green).toBeCloseTo(0.115, 3);
  });

  it("returns undefined for a color it cannot read", () => {
    expect(simulated("nope", "deuteranopia")).toBeUndefined();
  });

  it("returns a linear color as an rgb() string", () => {
    expect(written({ blue: 0, green: 0, red: 1 })).toBe("rgb(255 0 0)");
    expect(written({ blue: 0.5, green: 0.2159, red: 0 })).toBe("rgb(0 128 188)");
  });

  it("clamps a channel outside the display's range when writing it", () => {
    expect(written({ blue: 1.5, green: -0.2, red: 1 })).toBe("rgb(255 0 255)");
  });

  it("returns 0 for a color measured against itself", () => {
    expect(distance(RED, RED)).toBe(0);
  });

  it("returns 1 between black and white", () => {
    expect(distance("#000000", "#ffffff")).toBeCloseTo(1, 3);
  });

  it("returns NaN when either color cannot be read", () => {
    expect(distance("nope", RED)).toBeNaN();
    expect(distance(RED, "nope")).toBeNaN();
  });

  it("returns less than half the typical distance between a red and a green under deuteranopia", () => {
    expect(distanceFor(RED, GREEN, "deuteranopia")).toBeLessThan(distance(RED, GREEN) / 2);
  });

  it("returns more than 0.5 between a blue and a yellow under deuteranopia", () => {
    expect(distanceFor("#0000ff", "#ffff00", "deuteranopia")).toBeGreaterThan(0.5);
  });

  it("returns NaN under a dichromacy when either color cannot be read", () => {
    expect(distanceFor("nope", RED, "tritanopia")).toBeNaN();
    expect(distanceFor(RED, "nope", "tritanopia")).toBeNaN();
  });
});
