/**
 * Renders the glyph of the pause control's next action: pause while the marquee moves, play while
 * the reader has paused it.
 *
 * @remarks
 *   The caller passes both glyphs. The glyph follows the reader's choice, as the control's name
 *   does, so a pause under the pointer does not swap it.
 */

import { type ReactNode } from "react";

import { useMarquee } from "#marquee/machine.ts";

/**
 * Describes the props of the glyph: one node per action.
 */
export interface PauseIndicatorProps {
  /**
   * Glyph shown while the marquee moves by the reader's choice.
   */
  readonly pause: ReactNode;

  /**
   * Glyph shown while the reader has paused the marquee.
   */
  readonly play: ReactNode;
}

/**
 * Renders the glyph of the pause control's next action.
 *
 * @param props - The glyph of each action.
 * @returns The glyph for the reader's choice.
 */
export function PauseIndicator({ pause, play }: PauseIndicatorProps): ReactNode {
  const { pausing } = useMarquee();

  return pausing.chosen ? play : pause;
}
