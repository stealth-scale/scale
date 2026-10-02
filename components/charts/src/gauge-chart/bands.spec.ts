import { describe, expect, it } from "vitest";

import { gaugeBandAt, gaugeBands, type GaugeZone, tintOf, zonedText } from "#gauge-chart/bands.ts";

/**
 * Lists three zones of a latency in milliseconds, from healthy to critical.
 */
const ZONES: readonly GaugeZone[] = [
  { color: "success", label: "Healthy", upTo: 600 },
  { color: "warning", label: "Watch", upTo: 900 },
  { color: "error", label: "Critical", upTo: 1200 },
];

/**
 * Returns each band's span as its start and its end.
 */
function spansOf(zones: readonly GaugeZone[], max = 1200): number[][] {
  return gaugeBands(zones, 0, max).map((band) => [band.from, band.to]);
}

describe("bands", () => {
  it("returns a band per zone from the minimum in the order of their ends", () => {
    expect(spansOf(ZONES)).toStrictEqual([
      [0, 600],
      [600, 900],
      [900, 1200],
    ]);
  });

  it("sorts zones given in any order", () => {
    expect(
      spansOf([ZONES[2], ZONES[0], ZONES[1]].filter((zone) => zone !== undefined)),
    ).toStrictEqual([
      [0, 600],
      [600, 900],
      [900, 1200],
    ]);
  });

  it("adds the part past the last zone as an uncovered band", () => {
    expect(gaugeBands(ZONES.slice(0, 2), 0, 1200).at(-1)).toStrictEqual({
      from: 900,
      to: 1200,
      uncovered: true,
    });
  });

  it("adds no uncovered band when the last zone ends at the maximum", () => {
    expect(gaugeBands(ZONES, 0, 1200).map((band) => band.uncovered)).toStrictEqual([
      false,
      false,
      false,
    ]);
  });

  it("leaves out a zone that ends at or before the zone before it", () => {
    expect(spansOf([{ upTo: 600 }, { upTo: 400 }, { upTo: 600 }, { upTo: 1200 }])).toStrictEqual([
      [0, 400],
      [400, 600],
      [600, 1200],
    ]);
  });

  it("clamps a zone that ends past the maximum", () => {
    expect(spansOf([{ upTo: 5000 }])).toStrictEqual([[0, 1200]]);
  });

  it("leaves out a zone whose end is NaN", () => {
    expect(spansOf([{ upTo: 900 }, { upTo: Number.NaN }, { upTo: 600 }])).toStrictEqual([
      [0, 600],
      [600, 900],
      [900, 1200],
    ]);
  });

  it("ends a zone that ends at Infinity at the maximum", () => {
    expect(
      gaugeBands([{ upTo: 600 }, { upTo: Number.POSITIVE_INFINITY }], 0, 1200).map((band) => [
        band.to,
        band.uncovered,
      ]),
    ).toStrictEqual([
      [600, false],
      [1200, false],
    ]);
  });

  it("keeps each zone's palette and name", () => {
    expect(gaugeBands(ZONES, 0, 1200)[1]).toStrictEqual({
      color: "warning",
      from: 600,
      label: "Watch",
      to: 900,
      uncovered: false,
    });
  });

  it("returns the band a value is in", () => {
    expect(gaugeBandAt(gaugeBands(ZONES, 0, 1200), 740)?.label).toBe("Watch");
  });

  it("returns the lower band for a value on the boundary between two", () => {
    expect(gaugeBandAt(gaugeBands(ZONES, 0, 1200), 600)?.label).toBe("Healthy");
  });

  it("returns the last band for a value past every band", () => {
    expect(gaugeBandAt(gaugeBands(ZONES, 0, 1200), 9000)?.label).toBe("Critical");
  });

  it("returns no band without bands", () => {
    expect(gaugeBandAt([], 740)).toBeUndefined();
  });

  it("tints a zone with 40% of its palette's chart color over the panel", () => {
    expect(tintOf({ color: "warning" })).toBe(
      "color-mix(in oklab, var(--colors-warning-chart) 40%, var(--colors-bg-panel))",
    );
  });

  it("tints a zone without a palette in the neutral palette", () => {
    expect(tintOf({})).toBe(
      "color-mix(in oklab, var(--colors-neutral-chart) 40%, var(--colors-bg-panel))",
    );
  });

  it("writes the band's name after the value where the name is text", () => {
    expect(zonedText("740", gaugeBandAt(gaugeBands(ZONES, 0, 1200), 740))).toBe("740, Watch");
  });

  it("writes the value alone where the band's name is not text", () => {
    expect(zonedText("740", { from: 0, label: 7, to: 1, uncovered: false })).toBe("740");
  });

  it("writes the value alone without a band", () => {
    expect(zonedText("740")).toBe("740");
  });
});
