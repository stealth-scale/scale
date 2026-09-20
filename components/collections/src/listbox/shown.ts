/**
 * Carries what every ready-made row draws, which the root states once for the whole list.
 *
 * @remarks
 *   A row's shape belongs to the list rather than to each row. A list whose rows each decided
 *   whether to draw a box would draw some with one and some without, and the marks would be handed
 *   in again on every row a caller wrote. The root takes them once and every row reads them here.
 *   This package ships no artwork, so the marks are the caller's. A library that drew its own tick
 *   would ship an icon set nobody asked for and would draw the wrong one in a theme that has its
 *   own.
 */

import { type ReactNode } from "react";

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Describes what the list tells its rows about how they are drawn.
 */
export interface Shown {
  /**
   * Whether a box at the start of every row says the set may hold several.
   */
  boxed: boolean;

  /**
   * The mark a chosen row draws, in its box or at its end.
   */
  mark?: ReactNode | undefined;

  /**
   * The mark a box draws while part of the list is on rather than all of it.
   */
  mixedMark?: ReactNode | undefined;
}

/**
 * Hands the row's shape to every ready-made part, and reads it back.
 */
export const [ShownProvider, useShown] = createRequiredContext<Shown>("Listbox");
