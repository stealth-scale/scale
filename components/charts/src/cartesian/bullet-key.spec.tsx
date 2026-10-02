import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BulletKey, type BulletKeyProps } from "#cartesian/bullet-key.tsx";
import { charted } from "#chart/chart.fixtures.tsx";
import { type GaugeZone } from "#gauge-chart/bands.ts";

/**
 * Lists three zones, the last without a name, given out of order.
 */
const ZONES: readonly GaugeZone[] = [
  { color: "success", label: "Good", upTo: 110 },
  { color: "error", label: "Poor", upTo: 60 },
  { color: "neutral", upTo: 90 },
];

/**
 * Renders the key in a chart's root and returns its entries.
 */
function itemsOf(props: BulletKeyProps): Element[] {
  const { container } = render(charted({ children: <BulletKey {...props} /> }));

  return [...container.querySelectorAll("li")];
}

describe("BulletKey", () => {
  it("names the target then each named zone from the lowest", () => {
    expect(itemsOf({ targeted: true, zones: ZONES }).map((item) => item.textContent)).toStrictEqual(
      ["Target", "Poor", "Good"],
    );
  });

  it("names the target with the word it is given", () => {
    expect(itemsOf({ targeted: true, targetLabel: "Plan", zones: [] })[0]?.textContent).toBe(
      "Plan",
    );
  });

  it("leaves the target out while no series reads one", () => {
    expect(
      itemsOf({ targeted: false, zones: ZONES }).map((item) => item.textContent),
    ).toStrictEqual(["Poor", "Good"]);
  });

  it("renders the target's glyph with the tick's class", () => {
    expect(
      itemsOf({ targeted: true, zones: [] })[0]?.querySelector("rect")?.getAttribute("class"),
    ).toBe("chart-target");
  });

  it("fills each zone's glyph with the zone's tint", () => {
    expect(
      itemsOf({ targeted: false, zones: ZONES })[0]?.querySelector("rect")?.getAttribute("fill"),
    ).toBe("color-mix(in oklab, var(--colors-error-chart) 40%, var(--colors-bg-panel))");
  });
});
