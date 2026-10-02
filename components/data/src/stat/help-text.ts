/**
 * Renders the line of help text under the stat's figure, such as a change or a comparison.
 *
 * @remarks
 *   The help text is a `dd`, because a description list may contain only terms and details as its
 *   direct children. A `span` there fails the axe `definition-list` rule.
 */

import { type ComponentProps } from "react";

import { withContext } from "#stat/context.ts";

/**
 * Renders the help text `dd`.
 */
export const HelpText = withContext("dd", "helpText");

/**
 * Describes the props of `HelpText`.
 */
export type HelpTextProps = ComponentProps<typeof HelpText>;
