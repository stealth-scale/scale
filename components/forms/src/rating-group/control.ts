/**
 * Renders the row of a rating group's items.
 *
 * @remarks
 *   The element is a `div` inside the group. The group itself is the `radiogroup`, so the row adds
 *   no role.
 */

import { type ComponentProps } from "react";

import { withContext } from "#rating-group/context.ts";

/**
 * Renders the `div` with the rating group's control class.
 */
export const Control = withContext("div", "control");

/**
 * Describes the props of the control: the props of a `div`.
 */
export type ControlProps = ComponentProps<typeof Control>;
