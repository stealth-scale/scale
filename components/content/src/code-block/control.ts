/**
 * Draws the room at the end of the header for the controls that act on the code.
 */

import { type ComponentProps } from "react";

import { withContext } from "#code-block/context.ts";

/**
 * Draws the room at the size the root states.
 */
export const Control = withContext("div", "control");

/**
 * Describes what the control takes.
 */
export type ControlProps = ComponentProps<typeof Control>;
