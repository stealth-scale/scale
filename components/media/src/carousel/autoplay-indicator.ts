/**
 * Renders the glyph of the rotation control's next action: pause while the carousel rotates, play
 * while it does not.
 *
 * @remarks
 *   The caller passes both glyphs. The glyph follows the reader's choice, as the control's name
 *   does, so a pause under the pointer does not swap it.
 */

import { type ReactNode } from "react";

import { useCarousel } from "#carousel/machine.ts";

/**
 * Describes the props of the glyph: one node per action.
 */
export interface AutoplayIndicatorProps {
  /**
   * Glyph shown while the carousel rotates, the action a press takes.
   */
  readonly pause: ReactNode;

  /**
   * Glyph shown while the carousel does not rotate.
   */
  readonly play: ReactNode;
}

/**
 * Renders the glyph of the rotation control's next action.
 *
 * @param props - The glyph of each action.
 * @returns The glyph for the rotation's state.
 */
export function AutoplayIndicator({ pause, play }: AutoplayIndicatorProps): ReactNode {
  const { rotation } = useCarousel();

  return rotation.wanted ? pause : play;
}
