/**
 * Sorts the extensions attached to a target by the position each takes against it.
 */

import { type ResolvedExtension } from "@stealthscale/sdk-core";

/**
 * Describes the extensions attached to a target, by position.
 */
export interface Positions {
  /**
   * Extensions that render after the target's content, in order.
   */
  readonly after: readonly ResolvedExtension[];

  /**
   * Extensions that render before the target's content, in order.
   */
  readonly before: readonly ResolvedExtension[];

  /**
   * The extension that renders in place of the target's content: the last `replace` one in order.
   */
  readonly replacing?: ResolvedExtension | undefined;

  /**
   * Extensions that wrap everything else, innermost first.
   */
  readonly wraps: readonly ResolvedExtension[];
}

/**
 * Returns the extensions attached to a target by position.
 *
 * @remarks
 *   The wraps are listed innermost first, so a caller that wraps in list order puts the first wrap
 *   in order outermost.
 * @param attached - The extensions attached to the target that render, in order.
 */
export function positionsOf(attached: readonly ResolvedExtension[]): Positions {
  return {
    after: attached.filter((one) => one.position === "after"),
    before: attached.filter((one) => one.position === "before"),
    replacing: attached.findLast((one) => one.position === "replace"),
    wraps: attached.filter((one) => one.position === "wrap").toReversed(),
  };
}
