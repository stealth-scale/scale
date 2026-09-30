/**
 * Renders a scatter's axes: two numeric axes, each with its title, and the axis that sizes each
 * point.
 *
 * @remarks
 *   Neither axis of a scatter explains itself, so each renders its title in the recipe's label ink:
 *   the x title under the ticks, the y title turned a quarter along the start edge. The x axis is
 *   48px high, so the title has a line of its own below the ticks. Recharts sizes a point by its
 *   area, so the size axis maps a field to square pixels, and a scatter without one gives every
 *   point one area. Recharts does not clip a point to the plot, so both axes are padded at each
 *   end by the largest point's radius, and no point crosses the plot's edge. An axis with named
 *   ends spans its domain's two numbers, else 0 to 1, and names its two ends in place of ticks.
 *   Its ticks are at the padded ends, so the grid renders the plot's two edges alone along it,
 *   and no line runs a radius inside an edge.
 */

import { type ReactElement } from "react";

import {
  type BaseTickContentProps,
  CartesianGrid,
  type CartesianGridProps,
  XAxis,
  type XAxisProps,
  YAxis,
  type YAxisProps,
  ZAxis,
} from "recharts";

import { omitUndefined } from "@stealthscale/hooks";

import { VALUE_CHROME } from "#cartesian/axes.tsx";
import { EndTick } from "#scatter-plot/end-tick.tsx";
import { pairOf, SCORES } from "#scatter-plot/span.ts";

/**
 * Height in pixels of the x axis: the ticks, 8px, and a line for the title.
 */
const TITLED = 48;

/**
 * Describes what recharts passes the grid's writer of its vertical lines: the plot's box.
 */
type VerticalGrid = Parameters<NonNullable<CartesianGridProps["verticalCoordinatesGenerator"]>>[0];

/**
 * Describes what recharts passes the grid's writer of its horizontal lines: the plot's box.
 */
type HorizontalGrid = Parameters<
  NonNullable<CartesianGridProps["horizontalCoordinatesGenerator"]>
>[0];

/**
 * Returns the plot's left and right edges, the vertical grid lines along an x axis with named ends.
 */
function leftRight({ offset }: VerticalGrid): number[] {
  return [offset.left, offset.left + offset.width];
}

/**
 * Returns the plot's top and bottom edges, the horizontal grid lines along a y axis with named
 * ends.
 */
function topBottom({ offset }: HorizontalGrid): number[] {
  return [offset.top, offset.top + offset.height];
}

/**
 * Describes one numeric axis of a scatter.
 */
export interface ScatterAxis {
  /**
   * Domain in recharts' terms. Recharts' rounded domain unless stated.
   */
  readonly domain: YAxisProps["domain"];

  /**
   * Words for the axis' two ends, the low end's first, written in place of its ticks.
   */
  readonly ends?: readonly [string, string] | undefined;

  /**
   * Writes a tick.
   */
  readonly format: (value: number) => string;

  /**
   * Field of each point the axis reads.
   */
  readonly key: string;

  /**
   * Title of the axis, which the tooltip repeats beside the value.
   */
  readonly title: string;
}

/**
 * Describes the axis that sizes each point by a field.
 */
export interface SizeAxis {
  /**
   * Field of each point the size reads.
   */
  readonly key: string;

  /**
   * Smallest and largest area of a point, in square pixels.
   */
  readonly range: readonly [number, number];

  /**
   * Name of the field, which the tooltip writes beside the value.
   */
  readonly title: string;
}

/**
 * Describes what a scatter's axes are built from.
 */
export interface ScatterAxesOptions {
  /**
   * Area of every point in square pixels, for a scatter without a size axis.
   */
  readonly area: number;

  /**
   * Axis that sizes each point, for a bubble chart.
   */
  readonly size?: SizeAxis | undefined;

  /**
   * Horizontal axis.
   */
  readonly x: ScatterAxis;

  /**
   * Vertical axis.
   */
  readonly y: ScatterAxis;
}

/**
 * Returns the props an axis takes for its domain: the caller's domain, or for an axis with named
 * ends the span, a tick at each end and the tick that writes each end's name.
 *
 * @param axis - The domain, the ends' words and the field of the axis.
 * @param side - Which of the scatter's two axes it is.
 */
function domainOf(
  axis: ScatterAxis,
  side: "x" | "y",
): Pick<XAxisProps & YAxisProps, "domain" | "tick" | "ticks"> {
  const { ends } = axis;

  if (ends === undefined) return omitUndefined({ domain: axis.domain });

  const span = pairOf(axis.domain) ?? SCORES;

  return {
    domain: [...span],
    tick: (props: BaseTickContentProps) => (
      <EndTick
        axis={side}
        ends={ends}
        index={props.index}
        x={Number(props.x)}
        y={Number(props.y)}
      />
    ),
    ticks: [...span],
  };
}

/**
 * Returns the grid: a line at each tick and at the plot's edges, or the edges alone along an axis
 * with named ends.
 *
 * @param x - The horizontal axis.
 * @param y - The vertical axis.
 */
export function scatterGridOf(
  x: Pick<ScatterAxis, "ends">,
  y: Pick<ScatterAxis, "ends">,
): ReactElement<CartesianGridProps> {
  return (
    <CartesianGrid
      {...omitUndefined({
        horizontalCoordinatesGenerator: y.ends === undefined ? undefined : topBottom,
        verticalCoordinatesGenerator: x.ends === undefined ? undefined : leftRight,
      })}
    />
  );
}

/**
 * Returns the x axis with its title under the ticks, the y axis with its title along the start
 * edge, and the size axis.
 *
 * @param options - The two axes, and the size of each point.
 */
export function scatterAxesOf({ area, size, x, y }: ScatterAxesOptions): ReactElement[] {
  const radius = Math.ceil(Math.sqrt((size?.range[1] ?? area) / Math.PI));

  return [
    <XAxis
      {...VALUE_CHROME}
      {...domainOf(x, "x")}
      dataKey={x.key}
      height={TITLED}
      key="x"
      label={{ position: "insideBottom", value: x.title }}
      name={x.title}
      padding={{ left: radius, right: radius }}
      tickFormatter={x.format}
      type="number"
    />,
    <YAxis
      {...VALUE_CHROME}
      {...domainOf(y, "y")}
      dataKey={y.key}
      key="y"
      label={{ angle: -90, position: "insideLeft", value: y.title }}
      name={y.title}
      padding={{ bottom: radius, top: radius }}
      tickFormatter={y.format}
      type="number"
      width="auto"
    />,
    size === undefined ? (
      <ZAxis key="size" range={[area, area]} />
    ) : (
      <ZAxis
        dataKey={size.key}
        key="size"
        name={size.title}
        range={[...size.range]}
        type="number"
      />
    ),
  ];
}
