/**
 * Renders the media square of an attachment: the file type's icon, a spinner, or a thumbnail.
 *
 * @remarks
 *   The square crops an `img` to fill it. Give an `img` `alt=""` beside a title with the file's
 *   name, so a screen reader reads the name once.
 */

import { type ComponentProps } from "react";

import { withContext } from "#attachment/context.ts";

/**
 * Renders the media square's `div`.
 */
export const Media = withContext("div", "media");

/**
 * Describes the props of `Media`.
 */
export type MediaProps = ComponentProps<typeof Media>;
