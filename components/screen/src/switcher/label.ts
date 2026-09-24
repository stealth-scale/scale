/**
 * Renders the column of the name over the detail.
 *
 * @remarks
 *   A workspace has a name and a plan, and a project has a name and an environment, so the label
 *   has two lines. The second line tells two things with the same name apart.
 */

import { type ComponentProps } from "react";

import { withContext } from "#switcher/context.ts";

/**
 * Renders the label `span` at the switcher's size.
 */
export const Label = withContext("span", "label");

/**
 * Describes the props of `Label`.
 */
export type LabelProps = ComponentProps<typeof Label>;
