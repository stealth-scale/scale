/**
 * The devices a scene can be shown in: a phone, and one at each width the theme's breakpoints
 * start at, each with the height a window that wide is given.
 *
 * @remarks
 *   The widths are the theme's breakpoints, read from the viewport, and a phone below them all,
 *   because the theme's first breakpoint starts at 640 pixels and everything under it is one
 *   range. The heights are what a device of each width commonly shows: a phone standing, a tablet
 *   standing, then landscape from the width a tablet turns at. A scene that says it fills a
 *   viewport is given the height; every other scene takes its own.
 */

import { type Size } from "@stealthscale/provider-viewport";

/**
 * Describes one device: its name, and the window it shows.
 */
export interface Device {
  /**
   * The height of the window, in pixels.
   */
  readonly height: number;

  /**
   * The name a switcher lists it under and a frame is keyed by: `phone`, or a breakpoint's.
   */
  readonly name: string;

  /**
   * The width of the window, in pixels.
   */
  readonly width: number;
}

/**
 * A phone, which no breakpoint names: the smallest measure, at the engine's root size.
 */
export const PHONE: Size = { min: 320, name: "phone" };

/**
 * The height each device is given, keyed by the name of its width, until an application states
 * its own through `Placing.heights`.
 */
export const HEIGHTS: Readonly<Record<string, number>> = {
  "2xl": 864,
  lg: 768,
  md: 1024,
  phone: 568,
  sm: 960,
  xl: 800,
};

/**
 * The height a device whose width names no height is given, which is a tablet's standing.
 */
const HEIGHT = 1024;

/**
 * Lists every width a scene can be shown at, narrowest first: the phone, then the theme's.
 *
 * @param sizes - The theme's breakpoints, as the viewport lists them.
 * @returns The phone, then each breakpoint's size.
 */
export function widthsOf(sizes: readonly Size[]): readonly Size[] {
  return [PHONE, ...sizes];
}

/**
 * Returns the device a scene is shown in for the width the viewport states, or nothing where the
 * window decides or where no size starts at that width.
 *
 * @param width - The width in force, in pixels, or nothing for the window.
 * @param sizes - The theme's breakpoints, as the viewport lists them.
 * @param heights - The height per width name, or nothing for the catalogue's own.
 * @returns The device, or undefined.
 */
export function deviceOf(
  width: number | undefined,
  sizes: readonly Size[],
  heights: Readonly<Record<string, number>> = HEIGHTS,
): Device | undefined {
  const size = widthsOf(sizes).find((one) => one.min === width);

  if (size === undefined) return undefined;

  return { height: heights[size.name] ?? HEIGHT, name: size.name, width: size.min };
}
