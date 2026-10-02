/**
 * Renders the stat's label, the term that names the figure.
 */

import { type ComponentProps } from "react";

import { withContext } from "#stat/context.ts";

/**
 * Renders the label `dt`.
 */
export const Label = withContext("dt", "label");

/**
 * Describes the props of `Label`.
 */
export type LabelProps = ComponentProps<typeof Label>;
