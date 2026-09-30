/**
 * Renders a bar as a bullet graph: the zones of the value axis across its row, the measure, and
 * the tick of its target.
 *
 * @remarks
 *   Recharts passes the bar's rectangle, which its entrance grows, and the row's `background`,
 *   which spans the whole value axis. The shape reads the axis' ends from the background through
 *   the inverse scale, resolves the zones between them, and places the zones and the tick with the
 *   scale, so they keep their places while the measure grows. With zones the measure is 42% of the
 *   bar's thickness, centred, and the zones fill the whole thickness. The part of the axis no zone
 *   covers takes the track's fill. The tick is 2px wide and 76% of the thickness, in the ink with a
 *   halo in the panel's color, and a target past either end of the axis is placed at that end. A
 *   row whose target is not a finite number renders no tick.
 */

import { type ReactElement } from "react";

import {
  Rectangle,
  useXAxisInverseScale,
  useXAxisScale,
  useYAxisInverseScale,
  useYAxisScale,
} from "recharts";

import { omitUndefined } from "@stealthscale/hooks";

import { targetOf } from "#cartesian/bullet-text.ts";
import { TARGET, TRACK } from "#chart/recipe.ts";
import { type GaugeBand, gaugeBands, type GaugeZone, tintOf } from "#gauge-chart/bands.ts";

/**
 * Share of a bar's thickness the measure takes while zones fill its row.
 */
const MEASURE = 0.42;

/**
 * Share of a bar's thickness the target's tick takes.
 */
const TICK = 0.76;

/**
 * Width of the target's tick, in pixels.
 */
const TICK_WIDTH = 2;

/**
 * Describes a rectangle in pixels.
 */
interface Box {
  /**
   * Height in pixels.
   */
  readonly height: number;

  /**
   * Width in pixels.
   */
  readonly width: number;

  /**
   * Left edge in pixels.
   */
  readonly x: number;

  /**
   * Top edge in pixels.
   */
  readonly y: number;
}

/**
 * Describes a rectangle recharts passes, with any side left out.
 */
type Loose = { readonly [Side in keyof Box]?: number | undefined };

/**
 * Describes a run along the value axis in pixels: where it starts and how long it is.
 */
interface Run {
  /**
   * Length of the run in pixels.
   */
  readonly length: number;

  /**
   * Pixel the run starts at, its lowest coordinate.
   */
  readonly start: number;
}

/**
 * Describes the props recharts passes a bar's shape, and the bullet's own.
 */
export interface BulletShapeProps {
  /**
   * Rectangle of the whole value axis in the bar's row, which recharts passes.
   */
  readonly background?: Loose | undefined;

  /**
   * Direction the value axis runs in: across for bars on their side, up for upright bars.
   */
  readonly direction: "horizontal" | "vertical";

  /**
   * Color of the measure, which recharts passes from the bar's `fill`.
   */
  readonly fill?: string | undefined;

  /**
   * Height of the bar's rectangle, which recharts passes.
   */
  readonly height?: number | undefined;

  /**
   * Opacity of the bar's series, which recharts passes from the bar's `opacity`.
   */
  readonly opacity?: number | string | undefined;

  /**
   * Row the bar reads, which recharts passes.
   */
  readonly payload?: unknown;

  /**
   * Corners of the measure, which recharts passes from the bar's `radius`.
   */
  readonly radius?: [number, number, number, number] | number | undefined;

  /**
   * Field of the row the target reads.
   */
  readonly target?: string | undefined;

  /**
   * Width of the bar's rectangle, which recharts passes.
   */
  readonly width?: number | undefined;

  /**
   * Left edge of the bar's rectangle, which recharts passes.
   */
  readonly x?: number | undefined;

  /**
   * Top edge of the bar's rectangle, which recharts passes.
   */
  readonly y?: number | undefined;

  /**
   * Zones of the value axis.
   */
  readonly zones: readonly GaugeZone[];
}

/**
 * Returns a box with 0 for each side recharts leaves out.
 */
function boxOf(box: Loose | undefined): Box {
  return { height: box?.height ?? 0, width: box?.width ?? 0, x: box?.x ?? 0, y: box?.y ?? 0 };
}

/**
 * Returns the rectangle of a run along the value axis across the bar's thickness.
 *
 * @param across - Whether the value axis runs across, for bars on their side.
 * @param run - The run along the value axis.
 * @param bar - The bar's rectangle, whose thickness the run takes.
 * @param share - The share of the thickness the rectangle takes, centred.
 */
function rectOf(across: boolean, run: Run, bar: Box, share: number): Box {
  const thickness = across ? bar.height : bar.width;
  const inset = (thickness * (1 - share)) / 2;

  return across
    ? { height: thickness * share, width: run.length, x: run.start, y: bar.y + inset }
    : { height: run.length, width: thickness * share, x: bar.x + inset, y: run.start };
}

/**
 * Returns the run between two pixels along the value axis.
 */
function runOf(from: number, to: number): Run {
  return { length: Math.abs(to - from), start: Math.min(from, to) };
}

/**
 * Returns the values at the value axis' two ends, the lower first, read from the row's background
 * through the inverse scale, or none without either.
 */
function endsOf(
  across: boolean,
  background: Box,
  inverse: ((pixel: number) => unknown) | undefined,
): [number, number] | undefined {
  if (inverse === undefined) return undefined;

  const low = across ? background.x : background.y + background.height;
  const high = across ? background.x + background.width : background.y;

  return [Number(inverse(low)), Number(inverse(high))];
}

/**
 * Returns the rectangle of the target's tick, centred on the target's pixel.
 */
function tickOf(across: boolean, bar: Box, place: number): Box {
  return rectOf(across, { length: TICK_WIDTH, start: place - TICK_WIDTH / 2 }, bar, TICK);
}

/**
 * Renders the zones, the measure and the tick of one bar, or the measure alone outside a chart's
 * value axis.
 *
 * @param props - The props recharts passes a bar's shape, the direction, the target and the zones.
 */
export function BulletShape(props: BulletShapeProps): ReactElement {
  const across = props.direction === "horizontal";
  const scales = { x: useXAxisScale(), y: useYAxisScale() };
  const inverses = { x: useXAxisInverseScale(), y: useYAxisInverseScale() };
  const scale = across ? scales.x : scales.y;
  const bar = boxOf(props);
  const ends = endsOf(across, boxOf(props.background), across ? inverses.x : inverses.y);
  const bands: GaugeBand[] =
    ends === undefined || props.zones.length === 0 ? [] : gaugeBands(props.zones, ...ends);
  const target = targetOf(props.payload, props.target);
  const run: Run = across
    ? { length: bar.width, start: bar.x }
    : { length: bar.height, start: bar.y };

  /**
   * Returns the pixel of a value along the value axis.
   */
  const along = (value: number): number => Number(scale?.(value));

  return (
    <g opacity={props.opacity}>
      {bands.map((band) => (
        <rect
          className={band.uncovered ? TRACK : undefined}
          fill={band.uncovered ? undefined : tintOf(band)}
          key={`${String(band.from)}-${String(band.to)}`}
          {...rectOf(across, runOf(along(band.from), along(band.to)), bar, 1)}
        />
      ))}
      <Rectangle
        {...(bands.length === 0 ? bar : rectOf(across, run, bar, MEASURE))}
        {...omitUndefined({ fill: props.fill, radius: props.radius })}
      />
      {target === undefined || ends === undefined ? null : (
        <rect
          className={TARGET}
          {...tickOf(across, bar, along(Math.min(Math.max(target, ends[0]), ends[1])))}
        />
      )}
    </g>
  );
}
