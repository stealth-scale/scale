/**
 * Provides a swipe row's state to its parts: how far the actions are revealed, and the moves that
 * change it.
 */

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Describes a swipe row as its parts read it.
 */
export interface SwipeState {
  /**
   * Closes the actions and moves focus to the row, for Escape and a pressed action.
   */
  readonly dismiss: () => void;

  /**
   * Reveals the actions by a width while a finger or a trackpad drags the row, clamped to the
   * actions' width, and returns the width it revealed.
   */
  readonly drag: (revealed: number) => number;

  /**
   * Settles a released swipe open or closed by `settleSwipe`.
   */
  readonly release: (revealed: number) => void;

  /**
   * Width of the actions the row reveals, in pixels.
   */
  readonly revealed: number;

  /**
   * Returns whether the row is laid out right to left, where a revealing swipe moves right.
   */
  readonly rightToLeft: () => boolean;

  /**
   * Receives the actions' element, whose width the row reveals.
   */
  readonly setActions: (node: HTMLElement | null) => void;

  /**
   * Opens the actions, or closes them.
   */
  readonly settle: (open: boolean) => void;
}

/**
 * Provides the row's state to its parts, and reads it back.
 *
 * @remarks
 *   `useSwipe` throws for a part rendered outside `SwipeActions.Root`.
 */
export const [StateProvider, useSwipe] = createRequiredContext<SwipeState>("SwipeActions");
