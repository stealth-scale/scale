/**
 * Renders the group at the end of the header for controls that act on the code.
 */

import { type ComponentProps } from "react";

import { withContext } from "#code-block/context.ts";

/**
 * Renders the control slot.
 */
export const Control = withContext("div", "control");

/**
 * Describes the props of `Control`: the props of the styled `div`.
 */
export type ControlProps = ComponentProps<typeof Control>;
