/**
 * Renders a video through the video recipe, with the rules a clip that starts by itself follows.
 *
 * @remarks
 *   `autoPlay` starts the clip only while the reader does not ask for reduced motion. A clip with
 *   `autoPlay` shows the browser's controls unless the caller sets `controls={false}`, because
 *   moving content that starts by itself needs a way to pause it (WCAG 2.2.2), and a clip that did
 *   not start needs a way to start it. A clip that starts by itself is muted and plays inline,
 *   because browsers start only a muted clip unasked, and a phone plays an inline one in the page.
 */

import { type ComponentProps, type ReactElement } from "react";

import { useReducedMotion } from "#reduced-motion.ts";
import { withContext } from "#video/context.ts";

/**
 * Renders a `video` element with the classes of the video recipe.
 */
const Drawn = withContext("video");

/**
 * Describes the props of Video: the recipe's variants and the props of a `video` element.
 */
export type VideoProps = ComponentProps<typeof Drawn>;

/**
 * Renders the video, starting it by itself only while the reader allows motion.
 *
 * @param props - The recipe's variants and the props of a `video` element.
 * @returns The `video` element.
 */
export function Video({
  autoPlay = false,
  controls,
  muted = false,
  playsInline,
  ...rest
}: VideoProps): ReactElement {
  const reduced = useReducedMotion();
  const plays = autoPlay && !reduced;

  return (
    <Drawn
      {...rest}
      autoPlay={plays}
      controls={controls ?? autoPlay}
      muted={plays || muted}
      playsInline={playsInline ?? plays}
    />
  );
}
