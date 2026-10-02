/**
 * Renders a cartesian preset's marks: a line, an area, a bar or a band per series, in the series'
 * color and opacity.
 *
 * @remarks
 *   A line or an area's edge is 2px wide and has no dots. The point the tooltip is at takes a dot
 *   of radius 5 with the plot's edge around it. An area another area overlaps fills with a gradient
 *   from 0.3 opacity at the top to 0 at the axis, so both show through, and a stacked area fills
 *   flat at 0.85, because stacked bands never overlap. An unstacked bar rounds its end by 4px,
 *   while a stacked bar keeps square ends, because only the top segment of a stack ends it. A band
 *   fills the area between its two fields at 0.2 with no edge, because its width is what a reader
 *   reads. A series on the end axis reads the axis with the ID `end`. A bar whose series reads a
 *   target, or any bar of a chart with zones, renders as a bullet graph through `BulletShape`.
 *   Marks animate in only when `animate` is set, and recharts turns the animation off under reduced
 *   motion.
 */

import { type ReactElement } from "react";

import { Area, Bar, Line } from "recharts";

import { BulletShape } from "#cartesian/bullet.tsx";
import { type CoreSeries, type Mark, type RangeBand, type Shape } from "#cartesian/types.ts";
import { type ChartApi, type Series } from "#chart/use-chart.ts";
import { type GaugeZone } from "#gauge-chart/bands.ts";

/**
 * Maps a curve to recharts' interpolation. A step is flat from each point to the next.
 */
const CURVES: Record<Shape["curve"], "linear" | "monotone" | "stepAfter"> = {
  linear: "linear",
  monotone: "monotone",
  step: "stepAfter",
};

/**
 * Dash pattern of a dashed series: 6px dashes, 4px apart.
 */
const DASH = "6 4";

/**
 * Identifier of the stack every stacked series joins.
 */
const STACK = "stack";

/**
 * ID of the value axis at the plot's end edge, which a series on the end axis reads.
 */
export const END = "end";

/**
 * Opacity of an overlapping area's gradient at the top of the plot.
 */
const TOP = 0.3;

/**
 * Opacity of an overlapping area's gradient at the bottom of the plot.
 */
const BOTTOM = 0;

/**
 * Fill opacity of a stacked area.
 */
const STACKED = 0.85;

/**
 * Fill opacity of a band.
 */
const BAND = 0.2;

/**
 * Width of a line and of an area's edge, in pixels.
 */
export const STROKE = 2;

/**
 * Radius of the rounded end of an unstacked bar, in pixels.
 */
const RADIUS = 4;

/**
 * Dot recharts renders at the point the tooltip is at, with a radius of 5px.
 */
export const ACTIVE = { r: 5 };

/**
 * Describes what a preset's marks are built from.
 */
export interface MarksOptions {
  /**
   * Whether the marks animate in.
   */
  readonly animate: boolean;

  /**
   * Chart whose resolved series the marks render.
   */
  readonly chart: ChartApi;

  /**
   * Prefix of the IDs of the gradients the areas fill with, unique to the chart.
   */
  readonly gradient: string;

  /**
   * Series the preset declared, which state the dashed lines, the marks, the axes and the bands.
   */
  readonly series: readonly CoreSeries[];

  /**
   * Shape the preset fixes.
   */
  readonly shape: Shape;

  /**
   * Keys of the series in the order their marks render, the bottom of a stack first. The series'
   * order unless stated.
   */
  readonly stackOrder?: readonly string[] | undefined;

  /**
   * Zones of the value axis, which a bar renders behind its measure. None unless stated.
   */
  readonly zones?: readonly GaugeZone[] | undefined;
}

/**
 * Zones of a chart without any.
 */
const NO_ZONES: readonly GaugeZone[] = [];

/**
 * Returns the mark a series renders as: its own, else the shape's, and a line in a mixed shape.
 */
function drawnAs(shape: Shape, declared: CoreSeries | undefined): Mark {
  return declared?.mark ?? (shape.mark === "mixed" ? "line" : shape.mark);
}

/**
 * Returns whether a mark is an area another area overlaps, which fills with a gradient.
 */
function overlapping(shape: Shape, mark: Mark): boolean {
  return mark === "area" && shape.stack === "none";
}

/**
 * Returns the ID of the gradient the series at an index fills with.
 */
function gradientOf(gradient: string, index: number): string {
  return `${gradient}-${String(index)}`;
}

/**
 * Returns the radius of each corner of a bar: the end of an unstacked bar rounded, and none for a
 * stacked bar.
 *
 * @remarks
 *   The corners are in recharts' order: top left, top right, bottom right, bottom left. An upright
 *   bar ends at its top and a bar on its side at its end.
 */
function radiusOf(shape: Shape): [number, number, number, number] | 0 {
  if (shape.stack !== "none") return 0;

  return shape.direction === "horizontal" ? [0, RADIUS, RADIUS, 0] : [RADIUS, RADIUS, 0, 0];
}

/**
 * Describes the props every mark of a series takes.
 */
interface Common {
  /**
   * Field of each row the mark reads.
   */
  readonly dataKey: string;

  /**
   * Whether the legend hides the series.
   */
  readonly hide: boolean;

  /**
   * Whether the mark animates in, which recharts turns off under reduced motion.
   */
  readonly isAnimationActive: "auto" | false;

  /**
   * CSS value of the series' opacity.
   */
  readonly opacity: string;

  /**
   * Stack the mark joins, for a stacked shape.
   */
  readonly stackId?: string;

  /**
   * ID of the value axis the mark reads, for a series on the end axis.
   */
  readonly yAxisId?: string;
}

/**
 * Returns the props every mark of a series takes: its field, its hiding, its animation, its
 * opacity, its stack and its value axis.
 */
function commonOf(options: MarksOptions, series: Series, declared: CoreSeries | undefined): Common {
  return {
    dataKey: series.key,
    hide: series.hidden,
    isAnimationActive: options.animate ? "auto" : false,
    opacity: series.opacity,
    ...(options.shape.stack === "none" ? {} : { stackId: STACK }),
    ...(declared?.axis === "end" ? { yAxisId: END } : {}),
  };
}

/**
 * Returns the band of a series: the area between its two fields, filled without an edge.
 *
 * @remarks
 *   Recharts fills the space between the two values an area's field returns. The band takes its
 *   key as its name, which the tooltip finds the series by.
 */
function bandOf(
  options: MarksOptions,
  series: Series,
  declared: CoreSeries,
  band: Pick<RangeBand, "high" | "low">,
): ReactElement {
  const { high, low } = band;

  return (
    <Area
      {...commonOf(options, series, declared)}
      activeDot={false}
      dataKey={(row: Readonly<Record<string, unknown>>) => [row[low], row[high]]}
      fill={series.color}
      fillOpacity={BAND}
      key={series.key}
      name={series.key}
      stroke="none"
      type={CURVES[options.shape.curve]}
    />
  );
}

/**
 * Returns the bar of a series, which renders as a bullet graph while it reads a target or the chart
 * states zones.
 */
function barOf(
  options: MarksOptions,
  series: Series,
  declared: CoreSeries | undefined,
): ReactElement {
  const { shape, zones = NO_ZONES } = options;
  const bullet =
    declared?.target === undefined && zones.length === 0
      ? {}
      : {
          shape: (
            <BulletShape direction={shape.direction} target={declared?.target} zones={zones} />
          ),
        };

  return (
    <Bar
      {...commonOf(options, series, declared)}
      {...bullet}
      fill={series.color}
      key={series.key}
      radius={radiusOf(shape)}
    />
  );
}

/**
 * Returns the mark of one series.
 *
 * @param options - The animation, the chart, the gradients, the declared series and the shape.
 * @param series - The series as the chart resolved it.
 * @param index - The series' position, which names its gradient.
 */
function markOf(options: MarksOptions, series: Series, index: number): ReactElement {
  const { gradient, shape } = options;
  const declared = options.series[index];

  if (declared?.band !== undefined) return bandOf(options, series, declared, declared.band);

  const mark = drawnAs(shape, declared);

  if (mark === "bar") return barOf(options, series, declared);

  const lined = {
    ...commonOf(options, series, declared),
    activeDot: ACTIVE,
    ...((declared?.dashed ?? declared?.previousOf !== undefined) ? { strokeDasharray: DASH } : {}),
    stroke: series.color,
    strokeWidth: STROKE,
    type: CURVES[shape.curve],
  };

  if (overlapping(shape, mark)) {
    const fill = `url(#${gradientOf(gradient, index)})`;

    return <Area {...lined} fill={fill} fillOpacity={1} key={series.key} />;
  }

  if (mark === "area") {
    return <Area {...lined} fill={series.color} fillOpacity={STACKED} key={series.key} />;
  }

  return <Line {...lined} dot={false} key={series.key} />;
}

/**
 * Returns a mark per series, in the order `stackOrder` states, else in the order of the series.
 *
 * @remarks
 *   A stack piles its marks in the order they render, so `stackOrder` changes the stack and leaves
 *   each series' color and its place in the legend alone.
 * @param options - The animation, the chart, the gradients, the declared series, the shape and the
 *   stack's order.
 */
export function marksOf(options: MarksOptions): ReactElement[] {
  const marks = options.chart.series.map((series, index) => markOf(options, series, index));

  return options.stackOrder?.flatMap((key) => marks.filter((mark) => mark.key === key)) ?? marks;
}

/**
 * Returns a gradient that runs down its box from a color at 0.3 opacity to transparent, which an
 * area's `fill` finds by its ID.
 *
 * @param id - The gradient's ID, unique to the chart.
 * @param color - The CSS value of the color.
 */
export function fadeOf(id: string, color: string): ReactElement {
  return (
    <linearGradient id={id} key={id} x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor={color} stopOpacity={TOP} />
      <stop offset="1" stopColor={color} stopOpacity={BOTTOM} />
    </linearGradient>
  );
}

/**
 * Returns the gradient every overlapping area fills with, or nothing without one.
 *
 * @remarks
 *   Each gradient runs down the area's box from the series' color at 0.3 opacity to transparent at
 *   the bottom. The gradients go in the chart's `defs`, where an area's `fill` finds them by ID.
 * @param options - The chart, the prefix of the gradients' IDs, the declared series and the shape.
 */
export function fillsOf({
  chart,
  gradient,
  series,
  shape,
}: Pick<MarksOptions, "chart" | "gradient" | "series" | "shape">): null | ReactElement {
  const fills = chart.series.flatMap((each, index) => {
    const declared = series[index];

    return declared?.band === undefined && overlapping(shape, drawnAs(shape, declared))
      ? [fadeOf(gradientOf(gradient, index), each.color)]
      : [];
  });

  return fills.length === 0 ? null : <defs>{fills}</defs>;
}
