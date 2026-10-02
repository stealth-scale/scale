/**
 * Renders the caption of a block quotation, which names the source.
 *
 * @remarks
 *   The element is `figcaption`, which labels the `figure` root. The caption reads the `caption`
 *   text style in the muted ink.
 */

import { type ComponentProps } from "react";

import { withContext } from "#blockquote/context.ts";

/**
 * Renders a `figcaption` element with the caption slot's classes.
 */
export const Caption = withContext("figcaption", "caption");

/**
 * Describes the props of Blockquote.Caption: the props of a `figcaption` element.
 */
export type CaptionProps = ComponentProps<typeof Caption>;
