/**
 * Provides a group of segments to the segments inside it: its index and its own name.
 */

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Describes the group a segment belongs to.
 */
export interface Group {
  /**
   * Index of the group: 0 for a single date and the start of a range, 1 for the end.
   */
  readonly index: number;

  /**
   * The group's own `aria-label`, such as "Check-in", which each segment's name repeats.
   */
  readonly label?: string | undefined;
}

/**
 * Provides the group to its segments, and reads it back.
 *
 * @remarks
 *   `useGroup` throws for a segment rendered outside `DateInput.SegmentGroup`.
 */
export const [GroupProvider, useGroup] = createRequiredContext<Group>("DateInput.SegmentGroup");
