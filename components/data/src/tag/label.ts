/**
 * Renders the tag's label, cut with an ellipsis when the tag is wider than its container.
 *
 * @remarks
 *   The whole label stays in the DOM, so a screen reader announces the full text.
 */

import { type ComponentProps } from "react";

import { withContext } from "#tag/context.ts";

/**
 * Renders the label `span`.
 */
export const Label = withContext("span", "label");

/**
 * Describes the props of `Label`.
 */
export type LabelProps = ComponentProps<typeof Label>;
