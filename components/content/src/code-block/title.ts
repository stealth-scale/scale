/**
 * Renders the label that identifies the code, such as a file name or a package name.
 *
 * @remarks
 *   The element is a `div` and takes no heading role, because a code block is not a section of the
 *   page that contains it. A label too long for the bar is truncated on a single line.
 */

import { type ComponentProps } from "react";

import { withContext } from "#code-block/context.ts";

/**
 * Labels the code on one line and truncates the label when it overflows.
 */
export const Title = withContext("div", "title");

/**
 * Props accepted by `Title`, which are the props of a styled `div`.
 */
export type TitleProps = ComponentProps<typeof Title>;
