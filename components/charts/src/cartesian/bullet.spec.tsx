import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BarChart } from "#bar-chart/bar-chart.tsx";
import { BulletShape } from "#cartesian/bullet.tsx";
import { laidOut } from "#cartesian/cartesian.fixtures.ts";
import { type BarSeries } from "#cartesian/types.ts";
import { type GaugeZone } from "#gauge-chart/bands.ts";
import { HorizontalBarChart } from "#horizontal-bar-chart/horizontal-bar-chart.tsx";

/**
 * Describes one team's attainment against its plan.
 */
interface Team {
  readonly done: number;
  readonly plan?: number;
  readonly team: string;
}

/**
 * Lists two teams' attainment in percent of their plans.
 */
const TEAMS: Team[] = [
  { done: 92, plan: 100, team: "Atlas" },
  { done: 64, plan: 150, team: "Borealis" },
];

/**
 * Lists the series of the teams' attainment, with its target.
 */
const DONE: readonly BarSeries[] = [{ key: "done", label: "Done", target: "plan" }];

/**
 * Lists three zones of attainment: poor, fair and good.
 */
const ZONES: readonly GaugeZone[] = [
  { color: "error", label: "Poor", upTo: 60 },
  { color: "warning", label: "Fair", upTo: 90 },
  { color: "success", label: "Good", upTo: 110 },
];

/**
 * Describes a rectangle a bar renders, read from its attributes.
 */
interface Rect {
  readonly className: string;
  readonly fill: string;
  readonly height: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

/**
 * Returns every rectangle inside the first bar, in document order: the zones, the measure's path
 * and the tick.
 */
function partsOf(container: Element): Rect[] {
  const bar = container.querySelector(".recharts-bar-rectangle");

  return [...(bar?.querySelectorAll("rect, path") ?? [])].map((part) => ({
    className: part.getAttribute("class") ?? "",
    fill: part.getAttribute("fill") ?? "",
    height: Number(part.getAttribute("height")),
    width: Number(part.getAttribute("width")),
    x: Number(part.getAttribute("x")),
    y: Number(part.getAttribute("y")),
  }));
}

/**
 * Returns a number rounded to six decimals, which absorbs the float error of pixel arithmetic.
 */
function rounded(value: number | undefined): number {
  return Math.round((value ?? 0) * 1e6) / 1e6;
}

/**
 * Returns the summed width of the zones, which is the length of the value axis.
 */
function axisOf(zones: readonly Rect[]): number {
  return zones.slice(0, 4).reduce((sum, zone) => sum + zone.width, 0);
}

/**
 * Renders the teams' attainment on its side with the zones, the axis from 0 to 120.
 */
function bullets(
  zones: readonly GaugeZone[] = ZONES,
  series: readonly BarSeries[] = DONE,
  data: Team[] = TEAMS,
): Element {
  laidOut();

  return render(
    <HorizontalBarChart
      categoryKey="team"
      data={data}
      label="Attainment"
      series={series}
      valueDomain={[0, 120]}
      zones={zones}
    />,
  ).container;
}

/**
 * Renders the teams' attainment as upright bars with the zones, the axis from 0 to 120.
 */
function upright(): Element {
  laidOut();

  return render(
    <BarChart
      categoryKey="team"
      data={TEAMS}
      label="Attainment"
      series={DONE}
      valueDomain={[0, 120]}
      zones={ZONES}
    />,
  ).container;
}

describe("BulletShape", () => {
  it("renders a zone per band of the axis before the measure and the tick", () => {
    const parts = partsOf(bullets());

    expect(parts.map((part) => part.className)).toStrictEqual([
      "",
      "",
      "",
      "chart-track",
      "recharts-rectangle",
      "chart-target",
    ]);
  });

  it("spans each zone its share of the axis", () => {
    const parts = partsOf(bullets());
    const axis = axisOf(parts);

    expect(parts.slice(0, 4).map((zone) => rounded(zone.width / axis))).toStrictEqual([
      0.5,
      0.25,
      rounded(20 / 120),
      rounded(10 / 120),
    ]);
  });

  it("tints each zone in its palette over the panel", () => {
    const [poor] = partsOf(bullets());

    expect(poor?.fill).toBe(
      "color-mix(in oklab, var(--colors-error-chart) 40%, var(--colors-bg-panel))",
    );
  });

  it("narrows the measure to 42% of the row's thickness in the middle of it", () => {
    const [poor, , , , measure] = partsOf(bullets());
    const row = poor?.height ?? 0;

    expect([measure?.height, measure?.y]).toStrictEqual([row * 0.42, (poor?.y ?? 0) + row * 0.29]);
  });

  it("places the tick 2px wide on the target", () => {
    const parts = partsOf(bullets());
    const [poor, , , , , tick] = parts;

    expect([tick?.width, rounded((tick?.x ?? 0) + 1)]).toStrictEqual([
      2,
      rounded((poor?.x ?? 0) + (axisOf(parts) * 100) / 120),
    ]);
  });

  it("spans the tick 76% of the row's thickness", () => {
    const [poor, , , , , tick] = partsOf(bullets());

    expect(tick?.height).toBeCloseTo((poor?.height ?? 0) * 0.76, 6);
  });

  it("places a target past the axis at its end", () => {
    const container = bullets();
    const second = container.querySelectorAll(".recharts-bar-rectangle")[1];
    const zones = [...(second?.querySelectorAll("rect:not(.chart-target)") ?? [])];
    const end = zones.at(-1);
    const tick = second?.querySelector(".chart-target");

    expect(Number(tick?.getAttribute("x")) + 1).toBeCloseTo(
      Number(end?.getAttribute("x")) + Number(end?.getAttribute("width")),
      6,
    );
  });

  it("renders the measure and the tick alone without zones", () => {
    const [measure, tick] = partsOf(bullets([]));

    expect([measure?.className, tick?.className]).toStrictEqual([
      "recharts-rectangle",
      "chart-target",
    ]);
  });

  it("keeps the measure the bar's whole thickness without zones", () => {
    const [measure] = partsOf(bullets([]));

    laidOut();

    const plain = render(
      <HorizontalBarChart
        categoryKey="team"
        data={TEAMS}
        label="Attainment"
        series={[{ key: "done", label: "Done" }]}
        valueDomain={[0, 120]}
      />,
    ).container.querySelector(".recharts-bar-rectangle path");

    expect(measure?.height).toBe(Number(plain?.getAttribute("height")));
  });

  it("renders no tick for a row without a target", () => {
    laidOut();

    const { container } = render(
      <BarChart
        categoryKey="team"
        data={[{ done: 92, team: "Atlas" }]}
        label="Attainment"
        series={DONE}
        valueDomain={[0, 120]}
        zones={ZONES}
      />,
    );

    expect(container.querySelector(".recharts-bar-rectangle .chart-target")).toBeNull();
  });

  it("stacks the zones up the column of an upright bar", () => {
    const [poor, fair] = partsOf(upright());

    expect([poor?.width === fair?.width, (fair?.y ?? 0) < (poor?.y ?? 0)]).toStrictEqual([
      true,
      true,
    ]);
  });

  it("runs the lowest zone of an upright bar from the bar's base", () => {
    const [poor, , , , measure] = partsOf(upright());

    expect(rounded((poor?.y ?? 0) + (poor?.height ?? 0))).toBe(
      rounded((measure?.y ?? 0) + (measure?.height ?? 0)),
    );
  });

  it("leaves the fill of the track to the recipe", () => {
    const [, , , track] = partsOf(bullets());

    expect(track?.fill).toBe("");
  });

  it("renders the zones of a series without a target", () => {
    const parts = partsOf(bullets(ZONES, [{ key: "done", label: "Done" }]));

    expect(parts.map((part) => part.className)).toStrictEqual([
      "",
      "",
      "",
      "chart-track",
      "recharts-rectangle",
    ]);
  });

  it("places a target below the axis at its start", () => {
    const [poor, , , , , tick] = partsOf(
      bullets(ZONES, DONE, [{ done: 92, plan: -30, team: "Atlas" }]),
    );

    expect(rounded((tick?.x ?? 0) + 1)).toBe(rounded(poor?.x ?? 0));
  });

  it("renders the measure alone outside a chart", () => {
    const { container } = render(
      <svg>
        <BulletShape
          direction="horizontal"
          height={20}
          payload={TEAMS[0]}
          target="plan"
          width={100}
          x={10}
          y={5}
          zones={ZONES}
        />
      </svg>,
    );
    const parts = [...container.querySelectorAll("rect, path")];

    expect(parts.map((part) => part.getAttribute("class"))).toStrictEqual(["recharts-rectangle"]);
  });
});
