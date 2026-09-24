/**
 * Renders the square before the name: a logo, an avatar or an initial.
 *
 * @remarks
 *   The mark repeats what the name says, so it defaults to `aria-hidden`. Label a mark that adds
 *   information the name lacks.
 */

import { type ComponentProps } from "react";

import { withContext } from "#switcher/context.ts";

/**
 * Renders the mark `span` at the switcher's size, hidden from the accessibility tree.
 */
export const Mark = withContext("span", "mark", { defaultProps: { "aria-hidden": true } });

/**
 * Describes the props of `Mark`.
 */
export type MarkProps = ComponentProps<typeof Mark>;
