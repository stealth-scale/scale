/**
 * Renders the line under a file's name: its size and type, the progress, or the reason it failed.
 *
 * @remarks
 *   The line is in the error ink while the attachment's state is `error`.
 */

import { type ComponentProps } from "react";

import { withContext } from "#attachment/context.ts";

/**
 * Renders the description's `span`.
 */
export const Description = withContext("span", "description");

/**
 * Describes the props of `Description`.
 */
export type DescriptionProps = ComponentProps<typeof Description>;
