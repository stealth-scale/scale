/**
 * Provides whether a label renders in the bar, so the track is named by it only while it exists.
 *
 * @remarks
 *   The machine gives the track the value as its `aria-label` and writes no `aria-labelledby`. A
 *   reference to a label that is not rendered is an invalid ID reference, so the label reports
 *   itself when it mounts and the track points at it from then on.
 */

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Describes the label's state as the root provides it.
 */
export interface Labelling {
  /**
   * ID of the label element.
   */
  readonly id: string;

  /**
   * Whether a label is rendered in the bar.
   */
  readonly labelled: boolean;

  /**
   * Records that a label mounted or unmounted.
   */
  readonly setLabelled: (labelled: boolean) => void;
}

/**
 * Context through which the root provides the label's state to the label and the track.
 *
 * @remarks
 *   `useLabelling` throws when no `Progress.Root` is mounted above the calling part.
 */
export const [LabellingProvider, useLabelling] = createRequiredContext<Labelling>("Progress");
