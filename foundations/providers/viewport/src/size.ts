/**
 * Reads the widths the design system's breakpoints start at.
 */

import { breakpoints, type BreakpointToken } from "@stealthscale/theme";

/**
 * The root font size the styling engine converts a length against.
 */
const ROOT_FONT_SIZE = 16;

/**
 * Matches the unit a length ends in.
 */
const UNIT = /[a-z]+$/u;

/**
 * The breakpoint every theme starts at, which no theme lists and which has no token.
 */
const BASE = "base";

/**
 * A breakpoint a hook may ask for, which is `base` or one the design system's vocabulary states.
 *
 * @remarks
 *   Typed from the vocabulary rather than as text, so a breakpoint misspelt in a component is
 *   refused where it is written rather than answered with nothing.
 */
export type Breakpoint = BreakpointToken | typeof BASE;

/**
 * Describes one width a subtree can be laid out for, named after the breakpoint that starts there.
 */
export interface Size {
  /**
   * The narrowest width it covers, in pixels.
   */
  min: number;

  /**
   * The name a toolbar lists it under: `sm`, `md`, `lg`.
   */
  name: string;
}

/**
 * The width `base` starts at, which is none.
 */
export const BASE_SIZE: Size = { min: 0, name: BASE };

/**
 * Reads a length the way the styling engine writes one, in pixels.
 *
 * @remarks
 *   The engine keeps its breakpoints in rem, and a theme may state one in px or em. Either way the
 *   root font size is the engine's own sixteen pixels rather than the document's, because the
 *   engine compiled the query against that number and the query is what a browser matches.
 * @param length - The length, such as `30rem` or `480px`, or nothing where a breakpoint states no
 *   start.
 * @returns The width in pixels, and zero for no length.
 */
export function pixelsOf(length: null | string | undefined): number {
  if (length === null || length === undefined) return 0;

  const value = Number(length.replace(UNIT, ""));

  return length.endsWith("em") ? value * ROOT_FONT_SIZE : value;
}

/**
 * The sizes read from the vocabulary, built on first use.
 */
let known: readonly Size[] | undefined;

/**
 * Reads the widths the design system's breakpoints start at.
 *
 * @remarks
 *   Read from the foundation's own statement rather than from a theme, because a breakpoint is
 *   physics. A theme that moved one would move it for every component written against the
 *   foundation, so the foundation states them and a theme leaves them alone. Read as the statement
 *   rather than through `token`, because the token map is 32 kB of values this reads five of, and
 *   a reader of `token` keeps the whole map in the bundle. The list is built once, because the
 *   statement does not change while a page runs and a hook reads it on every render. `base` is
 *   left out. It starts at nothing and is stated nowhere, and every reader here puts it back
 *   itself. What this answers is the widths a page can be previewed at.
 * @returns One size per breakpoint above `base`, narrowest first.
 */
export function sizesOf(): readonly Size[] {
  known ??= Object.entries(breakpoints)
    .map(([name, length]) => ({ min: pixelsOf(length), name }))
    .toSorted((one, other) => one.min - other.min);

  return known;
}

/**
 * Reads the width a breakpoint starts at, for measuring an element rather than the window.
 *
 * @remarks
 *   A component that folds measures itself, so it cannot ask a media query and has to compare its
 *   own width to a number. This answers that number from the scale the breakpoints are stated in,
 *   so a folding component and a page laid out responsively give way at the same widths and
 *   neither carries a length of its own.
 *   It is not a breakpoint condition and must not become one. A screen component beside an open
 *   sidebar is narrow while the window is wide, which is the case a media query cannot see.
 * @param breakpoint - The breakpoint to read, or `base` for no width at all.
 * @returns The width in pixels, and zero for `base`.
 */
export function widthOf(breakpoint: Breakpoint): number {
  return sizesOf().find((size) => size.name === breakpoint)?.min ?? BASE_SIZE.min;
}
