/**
 * Renders an `audio` element with the browser's controls.
 *
 * @remarks
 *   The controls are on unless `controls={false}`. WCAG 1.4.2 asks for a way to stop any sound
 *   that plays for longer than 3 seconds, and an `audio` element without controls renders nothing
 *   a reader can press. A caller who turns them off renders controls of its own, which call the
 *   element's `play()` and `pause()` through a ref. `autoPlay` is passed as given: it starts sound,
 *   not motion, and a browser starts sound only after the reader has interacted with the page.
 *   Speech needs a transcript in the page beside the player (WCAG 1.2.1).
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#audio/context.ts";

/**
 * Renders the `audio` element with the recipe's class.
 */
const Drawn = withContext("audio");

/**
 * Describes the props of `Audio`: the props of an `audio` element.
 */
export type AudioProps = ComponentProps<typeof Drawn>;

/**
 * Renders the element with the browser's controls unless the caller turns them off.
 *
 * @param props - The props of an `audio` element.
 * @returns The `audio` element.
 */
export function Audio({ controls = true, ...rest }: AudioProps): ReactElement {
  return <Drawn {...rest} controls={controls} />;
}
