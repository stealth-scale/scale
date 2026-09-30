/**
 * Renders the row at the foot of a card that contains the progress text and the step's buttons.
 *
 * @remarks
 *   The row wraps, puts the buttons at its end and a progress text inside it at its start. The
 *   machine has no part for the row, so it takes no machine props.
 */

import { type ComponentProps } from "react";

import { withContext } from "#tour/context.ts";

/**
 * Renders the `div` with the tour's control class.
 */
export const Control = withContext("div", "control");

/**
 * Describes the props of the control: the props of a `div`.
 */
export type ControlProps = ComponentProps<typeof Control>;
