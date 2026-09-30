/**
 * Renders one part of the fill, such as the photos in a disk's used space or the failed tests of a
 * run.
 *
 * @remarks
 *   A segment is as wide as its value's share of the range from `min` to `max`, and the segments
 *   fill the track from its start in the order they render, in place of `Range`. A segment takes
 *   the theme's series color at its place, the colors a chart gives its series in order, so
 *   neighbouring parts differ in every theme. `color` states a series color or a palette's solid
 *   instead, such as `error` for failed tests. A key beside the bar names each color: the data
 *   package's `ColorSwatch` with `var(--colors-series-1)` for a series color, or its `Status` for a
 *   palette. The value the track reports is the caller's, usually the segments' sum. Segments that
 *   add up to more than the range shrink in proportion and stay inside the track.
 */

import { type ComponentProps, type ReactElement } from "react";

import { clampValue } from "@zag-js/utils";

import { type Palette, type SERIES } from "@stealthscale/theme/authoring";

import { SHARE, TINT } from "#bar.ts";
import { withContext } from "#progress/context.ts";
import { useProgress } from "#progress/machine.ts";

/**
 * Renders the segment `span`.
 */
const Filled = withContext("span", "segment");

/**
 * Describes the color a segment states: one of the theme's series colors or a palette.
 */
export type SegmentColor = `series.${(typeof SERIES)[number]}` | Palette;

/**
 * Describes the props of `Segment`: its value, its color and the props of a `span`.
 *
 * @remarks
 *   The span's props leave out `color`, the style prop, because the segment takes `color` as the
 *   color it fills in.
 */
export interface SegmentProps extends Omit<ComponentProps<typeof Filled>, "color"> {
  /**
   * Color the segment fills in: a series color, or a palette's solid. The series color at the
   * segment's place unless stated.
   */
  readonly color?: SegmentColor | undefined;

  /**
   * Amount the segment stands for, in the units of `min` and `max`.
   */
  readonly value: number;
}

/**
 * Renders the segment at its value's share of the range, in its color.
 *
 * @param props - The value, the color and the props of a `span`.
 * @returns The `span` element.
 */
export function Segment({ color, style, value, ...props }: SegmentProps): ReactElement {
  const { max, min } = useProgress();
  const share = (clampValue(value, 0, max - min) / (max - min)) * 100;
  const sized: Record<string, string> = { [SHARE]: `${String(share)}%` };

  return <Filled {...props} {...{ [TINT]: color }} style={{ ...sized, ...style }} />;
}
