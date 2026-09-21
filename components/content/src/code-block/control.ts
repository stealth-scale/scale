/**
 * Renders the area at the trailing end of the header where controls acting on the code go.
 */

import { type ComponentProps } from "react";

import { withContext } from "#code-block/context.ts";

/**
 * Groups the controls at the trailing end of the header.
 */
export const Control = withContext("div", "control");

/**
 * Props accepted by `Control`, which are the props of a styled `div`.
 */
export type ControlProps = ComponentProps<typeof Control>;
